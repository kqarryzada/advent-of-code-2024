import {readFileSync} from 'node:fs'

const fileName = "./input.txt"
const input = readFileSync(fileName, 'utf-8').trimEnd()


let NUM_ROWS = 0
let NUM_COLS = 0
let matrix = []


const Direction = {
    up: 'Up',
    down: 'Down',
    left: 'Left',
    right: 'Right'
}

class Coordinate {
    x = 0
    y = 0
    value = ""

    constructor(row, col) {
        this.x = row
        this.y = col
        this.value = ""
    }

    isWall() {
        return this.value === "#"
    }

    isExit() {
        return this.x === NUM_ROWS - 1 && this.y === NUM_COLS - 1
    }

    /**
     * Returns a string representation of this coordinate.
     */
    toString() {
        return `(${this.x}, ${this.y})`
    }
}

class QueueEntry {
    constructor(coord, distance, history) {
        this.coord = coord
        this.distance = distance
        this.history = history
    }
}


function isOutOfBounds(row, col) {
    return row < 0 || row >= NUM_ROWS || col < 0 || col >= NUM_COLS;
}

function parse(input, additionalValue) {
    let setupMatrix = []
    const isMainInput = fileName === "./input.txt"

    const matrixLength = (isMainInput) ? 71 : 7
    for (let i = 0; i < matrixLength; i++) {
        let row = []
        for (let j = 0; j < matrixLength; j++) {
            row.push(new Coordinate(i, j))
        }
        setupMatrix.push(row)
    }

    let i = 0
    let threshold = (isMainInput) ? 1024 : 12
    threshold += additionalValue
    for (const line of input.split('\n')) {
        if (i === threshold) {
            break
        }
        i++

        const values = line.split(',').map(char => parseInt(char));
        setupMatrix[values[0]][values[1]].value = "#"
        // console.log(values)
    }

    NUM_ROWS = matrixLength
    NUM_COLS = matrixLength
    matrix = setupMatrix
}

function getNextCoordinate(coord, direction) {
    let x = 0
    let y = 0

    switch (direction) {
        case Direction.up:
            x = coord.x - 1
            y = coord.y
            break
        case Direction.down:
            x = coord.x + 1
            y = coord.y
            break
        case Direction.left:
            x = coord.x
            y = coord.y - 1
            break
        case Direction.right:
            x = coord.x
            y = coord.y + 1
            break
        default:
            throw new Error("Invalid direction: " + direction)
    }

    if (isOutOfBounds(x, y)) {
        return null
    }

    return matrix[x][y]
}

/**
 * Finds the length of the shortest path. If the path is blocked, `Infinity`
 * will be returned instead.
 */
function traverse() {
    let score = Infinity
    let cache = new Map()
    const queue = [new QueueEntry(new Coordinate(0, 0), 0, [])]

    while (queue.length > 0) {
        const currentEntry = queue.shift()
        cache.set(currentEntry.coord, currentEntry.distance)

        if (currentEntry.coord.isExit()) {
            score = currentEntry.distance
            break
        }

        for (const dir of [Direction.right, Direction.down, Direction.left, Direction.up]) {
            const nextCoord = getNextCoordinate(currentEntry.coord, dir)
            if (nextCoord == null || nextCoord.isWall()) {
                continue
            }

            let distance = currentEntry.distance + 1
            if (distance >= cache.get(nextCoord.toString())) {
                // A previously-cached distance is shorter than the current
                // path, so there is no point in analyzing it further.
                continue
            }
            cache.set(nextCoord.toString(), distance)

            let history = currentEntry.history.slice()
            history.push(nextCoord.toString())
            const entry = new QueueEntry(nextCoord, distance, history)
            queue.push(entry)
        }

        // Sort the queue by shortest distance so that it acts as a priority
        // queue.
        queue.sort((a, b) => a.distance - b.distance)
    }

    return score
}

function solve(input) {
    const isMainInput = fileName === "./input.txt"
    let threshold = (isMainInput) ? 1024 : 12
    const fileLines = input.split("\n")

    let i = 0
    for (; i < fileLines.length; i++) {
        parse(input, i)
        const output = traverse(matrix)
        if (output === Infinity) {
            break
        }
    }

    const lastCoord = fileLines[i + threshold - 1]
    console.log(`The last coordinate that will block off all paths is (${lastCoord}).`)
}

solve(input)
