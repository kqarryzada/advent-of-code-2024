import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();

const Direction = {
    up: 'Up',
    down: 'Down',
    left: 'Left',
    right: 'Right'
}

class Coordinate {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.visited = false
    }

    notYetVisited() {
        return !this.visited
    }

    setVisited() {
        this.visited = true
    }

    isObstacle() {
        return this.obstacle
    }
}

// Global variables
let starting = new Coordinate(0, 0)
let guardDirection = Direction.up
let matrix = []
let NUM_ROWS = 0
let NUM_COLS = 0


/**
 * Converts a direction character into a {@link Direction} enum.
 */
function getDirection(direction) {
    switch (direction) {
        case '^':
            return Direction.up
        case '>':
            return Direction.right
        case '<':
            return Direction.left
        case 'v':
            return Direction.down
        default:
            throw new Error("Unknown direction: ${direction}")
    }
}

function isOutOfBounds(row, col) {
    return (row < 0 || row >= NUM_ROWS) || (col < 0 || col >= NUM_COLS);
}

/**
 * Parses the input file, which contains a map of the guard's starting position
 * and some obstacles.
 */
function parse(input) {
    const setupMatrix = []

    const fileLines = input.split('\n')
    for (let i = 0; i < fileLines.length; i++) {
        const line = fileLines[i]
        const row = []

        for (let j = 0; j < line.length; j++) {
            const char = line[j]
            const coordinate = new Coordinate(i, j)
            if (char === '#') {
                coordinate.obstacle = true
            }
            else if (char !== '.') {
                // This is the starting point in the matrix.
                starting = coordinate
                guardDirection = getDirection(char)
            }
            row.push(coordinate)
        }

        setupMatrix.push(row)
    }

    NUM_ROWS = setupMatrix.length
    NUM_COLS = setupMatrix[0].length
    matrix = setupMatrix
}

function rotateDirection(direction) {
    switch (direction) {
        case Direction.up:
            return Direction.right
        case Direction.down:
            return Direction.left
        case Direction.left:
            return Direction.up
        case Direction.right:
            return Direction.down
        default:
            throw new Error("Unknown direction: ${direction}")
    }
}

/**
 * Fetches the next position that the guard will go, based on the provided
 * coordinate and the current direction stored in {@link guardDirection}.
 *
 * @param coordinate    The guard's current position.
 * @returns {*|null}    The next position the guard will go, or `null` if the
 *                      guard exists the matrix on the next step.
 */
function getNext(coordinate) {
    let nextX = coordinate.x
    let nextY = coordinate.y
    switch (guardDirection) {
        case Direction.up:
            nextX--
            break
        case Direction.down:
            nextX++
            break
        case Direction.left:
            nextY--
            break
        case Direction.right:
            nextY++
            break
        default:
            throw new Error("Unknown direction: ${direction}")
    }

    if (isOutOfBounds(nextX, nextY)) {
        return null
    }

    const next = matrix[nextX][nextY]
    if (!next.isObstacle()) {
        return next
    }

    // The next field pointed to an obstacle, so we must rotate by 90 degrees
    // and try again.
    guardDirection = rotateDirection(guardDirection)
    return getNext(coordinate)
}

/**
 * Traverses the graph and returns the number of distinct spaces that the guard
 * occupied.
 */
function traverse() {
    let pathCount = 0
    let current = starting

    while (current !== null) {
        if (current.notYetVisited()) {
            current.setVisited()
            pathCount++
        }

        current = getNext(current)
    }

    return pathCount
}

function solve(input) {
    parse(input)
    console.log("The guard stood at %d distinct positions.", traverse())
}

solve(input)
