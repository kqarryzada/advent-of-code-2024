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
    constructor(coord, distance, direction, history) {
        this.coord = coord
        this.distance = distance
        this.direction = direction
        this.history = history
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

/**
 * Traverses through the maze using Dijkstra's algorithm. This method returns
 * the number of unique tiles that are used for the shortest path from start to
 * finish. If there are multiple paths that are equally short, all unique tiles
 * from all paths will be counted.
 *
 * @param start         The starting coordinate.
 * @returns {number}    The number of unique tiles used for all "shortest"
 *                      paths.
 */
function traverse(start) {
    let cache = new Map()
    const queue = [new QueueEntry(start, 0, Direction.right, [start.toString()])]

    let score = Infinity
    let tiles = new Set()

    while (queue.length > 0) {
        const currentEntry = queue.shift()
        cache.set(currentEntry.coord, currentEntry.distance)

        if (currentEntry.distance > score) {
            // Once we have dequeued an entry that has a distance larger than
            // the shortest path to E, all remaining entries must have a
            // distance that are also longer than the shortest path.
            break
        }
        if (currentEntry.coord.isEnding()) {
            score = currentEntry.distance
            currentEntry.history.forEach(tile => tiles.add(tile))
            continue
        }

        for (const dir of nextDirections(currentEntry.direction)) {
            const nextCoord = getNextCoordinate(currentEntry.coord, dir)
            if (nextCoord.isWall()) {
                continue
            }

            let distance = currentEntry.distance
            distance += (dir === currentEntry.direction) ? 1 : 1001

            // If we have visited this coordinate previously and it is the same
            // number of steps as our current path, then we are potentially on
            // an equidistant path that should be analyzed.
            //
            // Subtract 1000 from the current distance. It is possible that the
            // previous attempt required an extra turn that would not be
            // reflected in the cache.
            if (distance - 1000 > cache.get(nextCoord.toString())) {
                continue
            }

            let history = currentEntry.history.slice()
            history.push(nextCoord.toString())

            const entry = new QueueEntry(nextCoord, distance, dir, history)
            queue.push(entry)
            cache.set(nextCoord.toString(), distance)
        }

        // Sort the queue by shortest distance so that it acts as a priority
        // queue.
        queue.sort((a, b) => a.distance - b.distance)
    }

    return tiles.size
}

function solve(input) {
    const start = parse(input)
    const path = traverse(start)
    console.log("There are %d distinct tiles that are used for any one of the shortest routes.", path)
}

solve(input)
