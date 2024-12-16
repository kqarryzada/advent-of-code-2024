import {readFileSync} from 'node:fs'

const input = readFileSync('./input.txt', 'utf-8').trimEnd()


let matrix = []

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

/**
 * Represents an entry in the priority queue that is used to find the shortest
 * path. A QueueEntry contains a coordinate and some additional metadata that
 * describes the context of the path that the entry represents.
 */
class QueueEntry {
    constructor(coord, distance, direction) {
        this.coord = coord
        this.distance = distance
        this.direction = direction
    }
}

function parse(input) {
    matrix = input.split('\n').map(line => line.split(""))

    const startingRow = matrix.findIndex(row => row.includes("S"))
    const startingCol = matrix[startingRow].indexOf("S")
    return new Coordinate(startingRow, startingCol)
}

function nextDirections(direction) {
    if (direction === Direction.up || direction === Direction.down) {
        return [direction, Direction.left, Direction.right]
    }

    return [direction, Direction.up, Direction.down]
}

function getNextCoordinate(coord, direction) {
    let nextCoord
    switch (direction) {
        case Direction.up:
            nextCoord = new Coordinate(coord.row - 1, coord.col)
            break
        case Direction.down:
            nextCoord = new Coordinate(coord.row + 1, coord.col)
            break
        case Direction.left:
            nextCoord = new Coordinate(coord.row, coord.col - 1)
            break
        case Direction.right:
            nextCoord = new Coordinate(coord.row, coord.col + 1)
            break
        default:
            throw new Error("Invalid direction: " + direction)
    }

    return nextCoord
}

function traverse(start) {
    let cache = new Map()
    const queue = [new QueueEntry(start, 0, Direction.right)]

    while (queue.length > 0) {
        const currentEntry = queue.shift()
        if (currentEntry.coord.isEnding()) {
            return currentEntry.distance
        }

        for (const dir of nextDirections(currentEntry.direction)) {
            const nextCoord = getNextCoordinate(currentEntry.coord, dir)
            const isVisited = cache.has(nextCoord.toString())

            if (!nextCoord.isWall() && !isVisited) {
                let distance = currentEntry.distance
                distance += (dir === currentEntry.direction) ? 1 : 1001

                const entry = new QueueEntry(nextCoord, distance, dir)
                queue.push(entry)
                cache.set(nextCoord.toString(), distance)
            }
        }

        queue.sort((a, b) => a.distance - b.distance)
    }

    throw new Error("A path to the ending coordinate was not found.")
}

function solve(input) {
    const start = parse(input)
    const path = traverse(start)
    console.log("The lowest possible score for a reindeer is %d.", path)
}

solve(input)
