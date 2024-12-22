import {readFileSync} from 'node:fs'

const fileName = "./input.txt"
const input = readFileSync(fileName, 'utf-8').trimEnd()


let matrix = []
let NUM_ROWS = 0
let NUM_COLS = 0

const Direction = {
    up: 'Up',
    down: 'Down',
    left: 'Left',
    right: 'Right'
}

class Coordinate {
    row = 0
    col = 0

    constructor(row, col) {
        this.row = row
        this.col = col
    }

    isEnding() {
        return matrix[this.row][this.col] === "E"
    }

    isWall() {
        return matrix[this.row][this.col] === "#"
    }

    /**
     * Returns a string representation of this coordinate.
     */
    toString() {
        return `(${this.row}, ${this.col})`
    }
}

class QueueEntry {
    constructor(coord, distance, history) {
        this.coord = coord
        this.distance = distance
        this.history = history
    }
}


function parse(input) {
    matrix = input.split('\n').map(line => line.split(""))
    NUM_ROWS = matrix.length
    NUM_COLS = matrix[0].length

    const startingRow = matrix.findIndex(row => row.includes("S"))
    const startingCol = matrix[startingRow].indexOf("S")
    return new Coordinate(startingRow, startingCol)
}

/**
 * Traverses the maze and returns the shortest path from the start to end
 * coordinate.
 */
function traverse(start) {
    let cache = new Map()
    const queue = [new QueueEntry(start, 0, [start])]

    while (queue.length > 0) {
        const currentEntry = queue.shift()
        cache.set(currentEntry.coord, currentEntry.distance)

        if (currentEntry.coord.isEnding()) {
            return currentEntry.history
        }

        for (const dir of [Direction.down, Direction.right, Direction.up, Direction.left]) {
            const nextCoord = getNextCoordinate(currentEntry.coord, dir)
            if (nextCoord === null || nextCoord.isWall()
                    || currentEntry.history.includes(nextCoord)) {
                continue
            }

            // If we have visited this coordinate previously with a shorter path
            // from the start, then there is no need to analyze further.
            let distance = currentEntry.distance + 1
            if (distance > cache.get(nextCoord.toString())) {
                continue
            }

            let history = currentEntry.history.slice()
            history.push(nextCoord)

            const entry = new QueueEntry(nextCoord, distance, history)
            queue.push(entry)
            cache.set(nextCoord.toString(), distance)
        }

        // Sort the queue by shortest distance so that it acts as a priority
        // queue.
        queue.sort((a, b) => a.distance - b.distance)
    }

    throw new Error("Failed to find a path from the start to end coordinates.")
}

function isOutOfBounds(row, col) {
    return (row < 0 || row >= NUM_ROWS) || (col < 0 || col >= NUM_COLS);
}

function getNextCoordinate(coord, direction) {
    let row
    let col

    switch (direction) {
        case Direction.up:
            row = coord.row - 1
            col = coord.col
            break
        case Direction.down:
            row = coord.row + 1
            col = coord.col
            break
        case Direction.left:
            row = coord.row
            col = coord.col - 1
            break
        case Direction.right:
            row = coord.row
            col = coord.col + 1
            break
        default:
            throw new Error("Invalid direction: " + direction)
    }

    return (isOutOfBounds(row, col)) ? null : new Coordinate(row, col)
}

function solve(input) {
    const skipSteps = 2
    const graphDistance = (c1, c2) => Math.abs(c2.row - c1.row) + Math.abs(c2.col - c1.col)

    // This value is set to 1 for the example file instead of 0, since 1 allows
    // for a greater-than-or-equal-to comparison instead of a strict
    // greater-than comparison.
    const difference = (fileName === "./input.txt") ? 100 : 1

    // Compute the default path that is achieved with no cheating.
    const start = parse(input)
    const defaultPath = traverse(start)

    // Compare points on the path to see if there are any available shortcuts.
    let count = 0;
    for (let i = 0; i < defaultPath.length; i++) {
        for (let j = i + 1; j < defaultPath.length; j++) {
            const distBetweenCoords = graphDistance(defaultPath[i], defaultPath[j]);
            const pathLength = j - i
            if (pathLength - distBetweenCoords >= difference
                    && distBetweenCoords <= skipSteps) {
                count++
            }
        }
    }

    console.log(count)
}

solve(input)
