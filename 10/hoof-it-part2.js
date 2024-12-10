import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


let NUM_ROWS = 0
let NUM_COLS = 0
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
 * increase by a value of 1) and can reach a `9` in the matrix. The number of
 * paths that satisfy these criteria and can reach any `9` will be returned.
 */
function findTrails(matrix, row, col, prevHeight) {
    if (isOutOfBounds(row, col) || matrix[row][col] - prevHeight !== 1) {
        return 0
    }

    const currentHeight = matrix[row][col]
    if (currentHeight === 9) {
        return 1
    }

    let sum = 0
    sum += findTrails(matrix, row - 1, col, currentHeight)
    sum += findTrails(matrix, row + 1, col, currentHeight)
    sum += findTrails(matrix, row, col - 1, currentHeight)
    sum += findTrails(matrix, row, col + 1, currentHeight)
    return sum
}

function solve(input) {
    let sum = 0
    const matrix = parse(input)
    for (const coordinate of zeroList) {
        sum += findTrails(matrix, coordinate.x, coordinate.y, INITIAL)
    }

    console.log("The sum of all trailhead ratings is %d.", sum)
}

solve(input)
