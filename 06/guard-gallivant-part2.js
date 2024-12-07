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
    }

    isObstacle() {
        return this.obstacle
    }
}

// Global variables
let startingCoordinate = new Coordinate(0, 0)
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
    return row < 0 || row >= NUM_ROWS || col < 0 || col >= NUM_COLS;
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
                startingCoordinate = coordinate
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

/**
 * Returns the next direction that the guard will take when reaching an
 * obstacle.
 */
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
 * Sets the position and direction in the history map. If the guard ever reaches
 * a position with the same direction that it has before, then this is a
 * guaranteed loop.
 * <br><br>
 *
 * This function breaks the rule of "a function should only do one thing", but
 * this is because both behaviors require accessing the map. It's easiest to
 * determine looping while we're already fetching the mapped value.
 *
 * @param map           A map object of coordinates to an array of
 *                      {@link Direction} fields tracking the guard's traversal.
 * @param coordinate    The key to the map indicating the guard's position.
 * @param direction     The value that should be associated with the key.
 *
 * @returns {boolean}   `true` if the same coordinate and direction already
 *                      exist in the map.
 */
function setHistoryAndCheckLooping(map, coordinate, direction) {
    const mapValue = map.get(coordinate) ?? []
    if (mapValue.includes(direction)) {
        return true
    }

    mapValue.push(direction)
    map.set(coordinate, mapValue)
    return false
}

/**
 * Traverses the matrix. The set of unique positions that the guard occupied
 * are returned by this method as a Set.
 * <br><br>
 *
 * This function will perform checking at every step of the traversal to
 * determine whether the guard is in a loop. If a loop is detected, this
 * function will return `null` to signify this behavior.
 * <br><br>
 *
 * If the global matrix is updated to test a modification to the map, make sure
 * that both the global `matrix` and `guardDirection` variables are reset.
 *
 * @returns {Set<Coordinate>|null}  A Set of all positions that were occupied by
 *                                  the guard, or `null` if a loop was detected.
 */
function traverse() {
    const historyMap = new Map()

    let current = startingCoordinate
    while (current !== null) {
        const isLooping = setHistoryAndCheckLooping(historyMap, current, guardDirection)
        if (isLooping) {
            return null
        }
        current = getNext(current)
    }

    return new Set(historyMap.keys())
}

function solve(input) {
    parse(input)
    const originalGuardDirection = guardDirection

    // Perform an initial traversal to fetch the list of coordinates that should
    // be analyzed. This should not include the starting position.
    let positions = traverse()
    positions.delete(startingCoordinate)

    let loopCount = 0
    for (let coordinate of positions) {
        // Set the coordinate as an obstacle and traverse the path to determine
        // if it causes a loop.
        matrix[coordinate.x][coordinate.y].obstacle = true
        const retVal = traverse()
        if (retVal === null) {
            loopCount++
        }

        // Reset the original values.
        matrix[coordinate.x][coordinate.y].obstacle = false
        guardDirection = originalGuardDirection
    }

    console.log("There are %d possible positions where a new object could cause a loop.", loopCount)
}

solve(input)
