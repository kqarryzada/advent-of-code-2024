import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


let NUM_ROWS = 0
let NUM_COLS = 0
const EMPTY_SET = new Set()
const INITIAL = -1
const zeroList = []

class Coordinate {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    /**
     * Returns a string representation of this coordinate.
     */
    toString() {
        return `(${this.x}, ${this.y})`
    }
}

function isOutOfBounds(row, col) {
    return row < 0 || row >= NUM_ROWS || col < 0 || col >= NUM_COLS;
}

function parse(input) {
    const matrix = []

    const fileLines = input.split('\n')
    for (let i = 0; i < fileLines.length; i++) {
        const row = []

        const line = fileLines[i]
        for (let j = 0; j < line.length; j++) {
            const value = parseInt(line[j])
            row.push(value)

            if (value === 0) {
                zeroList.push(new Coordinate(i, j))
            }
        }
        matrix.push(row)
    }

    NUM_ROWS = matrix.length
    NUM_COLS = matrix[0].length
    return matrix
}

/**
 * This function searches for all paths that gradually increase (i.e., always
 * increase by a value of 1) and can reach a `9` in the matrix. A set of string
 * coordinates of all the `9` values that are reachable from the provided
 * location will be returned.
 */
function findTrails(matrix, row, col, prevHeight) {
    if (isOutOfBounds(row, col) || matrix[row][col] - prevHeight !== 1) {
        return EMPTY_SET
    }

    const currentHeight = matrix[row][col]
    if (currentHeight === 9) {
        const coordinate = new Coordinate(row, col).toString()
        return new Set().add(coordinate)
    }

    let returnSet = new Set()
    findTrails(matrix, row - 1, col, currentHeight)
        .forEach(trail => returnSet.add(trail.toString()))
    findTrails(matrix, row + 1, col, currentHeight)
        .forEach(trail => returnSet.add(trail.toString()))
    findTrails(matrix, row, col - 1, currentHeight)
        .forEach(trail => returnSet.add(trail.toString()))
    findTrails(matrix, row, col + 1, currentHeight)
        .forEach(trail => returnSet.add(trail.toString()))

    return returnSet
}

function solve(input) {
    let sum = 0
    const matrix = parse(input)
    for (const coordinate of zeroList) {
        sum += findTrails(matrix, coordinate.x, coordinate.y, INITIAL).size
    }

    console.log("The sum of all trailhead scores is %d.", sum)
}

solve(input)
