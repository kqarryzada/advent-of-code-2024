import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


const FREE_BLOCK = -1

function parse(input) {
    const disk = []

    const fileLine = input.split('\n')[0]
    if (fileLine.length % 2 === 0) {
        throw new Error("Invalid input.")
    }

    for (let i = 0; i < fileLine.length; i += 2) {
        const fileSize = parseInt(fileLine[i])
        const freeSpace = parseInt(fileLine[i + 1])
        const blockID = i / 2

        for (let j = 0; j < fileSize; j++) {
            disk.push(blockID)
        }
        for (let j = 0; j < freeSpace; j++) {
            disk.push(FREE_BLOCK)
        }
    }

    return disk
}

/**
 * Compacts the disk and returns the index of the last file.
 */
function compact(disk) {
    let nextFreeSpaceIndex = disk.indexOf(FREE_BLOCK)
    let lastFileIndex = disk.findLastIndex(e => e !== FREE_BLOCK)

    while (nextFreeSpaceIndex < lastFileIndex) {
        disk[nextFreeSpaceIndex] = disk[lastFileIndex]
        disk[lastFileIndex] = FREE_BLOCK

        // Re-initialize the indexes. This must be done last.
        nextFreeSpaceIndex = disk.indexOf(FREE_BLOCK, nextFreeSpaceIndex)
        lastFileIndex = disk.findLastIndex(e => e !== FREE_BLOCK)
    }

    return lastFileIndex
}

function solve(input) {
    const disk = parse(input)
    const lastFileIndex = compact(disk)

    let checksum = 0
    for (let i = 1; i <= lastFileIndex; i++) {
        checksum += disk[i] * i
    }

    console.log("The compacted filesystem checksum is %d.", checksum)
}

solve(input)
