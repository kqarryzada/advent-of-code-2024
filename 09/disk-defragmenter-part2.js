import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


/**
 * Represents a section of space on the disk.
 */
class Block {
    // This value signifies that the block is a free space.
    static FREE_BLOCK = -1

    value = 0
    size = 0
    visited = false

    constructor(value, size) {
        this.value = value
        this.size = size
    }

    static createFreeBlock(size) {
        return new Block(this.FREE_BLOCK, size)
    }

    isFile() {
        return this.value !== Block.FREE_BLOCK
    }

    isFreeSpace() {
        return !this.isFile()
    }

    computeChecksum(startingIndex) {
        if (!this.isFile()) {
            return 0
        }

        let checksum = 0
        for (let i = 0; i < this.size; i++) {
            checksum += this.value * (startingIndex + i)
        }

        return checksum
    }
}

/**
 * Parses the input file into an array of block objects. Each block represents
 * a section of space on the disk.
 */
function parse(input) {
    const disk = []

    const fileLine = input.split('\n')[0]
    if (fileLine.length % 2 === 0) {
        throw new Error("Invalid input.")
    }

    for (let i = 0; i < fileLine.length; i += 2) {
        const fileSize = parseInt(fileLine[i])
        const freeSpaceSize = parseInt(fileLine[i + 1])
        const blockID = i / 2

        if (fileSize >= 1) {
            disk.push(new Block(blockID, fileSize))
        }
        if (freeSpaceSize >= 1) {
            disk.push(Block.createFreeBlock(freeSpaceSize))
        }
    }

    return disk
}

function getNextFreeSpace(disk, startingIndex) {
    for (let i = startingIndex + 1; i < disk.length; i++) {
        if (disk[i].isFreeSpace()) {
            return i
        }
    }

    return disk.length + 1
}

/**
 * Iterates through the disk backwards and identifies file blocks. This function
 * tries to find the leftmost empty space where the file block can be moved.
 * Once compaction is compete, a checksum is calculated.
 */
function compact(disk) {
    let nextFreeSpaceIndex = getNextFreeSpace(disk, 0)
    let lastFileIndex = disk.findLastIndex(e => e.isFile())

    while (lastFileIndex !== -1) {
        const fileToBeMoved = disk[lastFileIndex]
        let requiredSize = fileToBeMoved.size

        // Mark the file as visited so that we do not attempt to move it twice.
        if (fileToBeMoved.visited) {
            break
        }
        fileToBeMoved.visited = true

        let freeSpaceIndex = nextFreeSpaceIndex
        while (freeSpaceIndex < lastFileIndex) {
            const freeSpaceBlock = disk[freeSpaceIndex]
            if (freeSpaceBlock.size >= requiredSize) {
                disk[freeSpaceIndex] = fileToBeMoved
                disk[lastFileIndex] = Block.createFreeBlock(requiredSize)

                // If the free space is bigger than the file size, we must
                // signify the remaining free space on the disk.
                const excessSize = freeSpaceBlock.size - requiredSize
                if (excessSize !== 0) {
                    const newBlock = Block.createFreeBlock(excessSize)
                    disk.splice(freeSpaceIndex + 1, 0, newBlock)
                }

                // Break out of the inner loop.
                freeSpaceIndex = disk.length + 1
            }
            else {
                freeSpaceIndex = getNextFreeSpace(disk, freeSpaceIndex)
            }
        }

        // Re-initialize the indexes.
        nextFreeSpaceIndex = getNextFreeSpace(disk, 0)
        lastFileIndex = disk.findLastIndex(e => e.isFile() && !e.visited)
    }
}

function solve(input) {
    const disk = parse(input)
    compact(disk)

    let checksum = 0
    let index = 0
    for (const block of disk) {
        checksum += block.computeChecksum(index)
        index += block.size
    }

    console.log("The checksum for the new compaction algorithm is %d.", checksum)
}

solve(input)
