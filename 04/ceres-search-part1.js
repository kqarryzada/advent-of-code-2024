import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


let NUM_ROWS = 0
let NUM_COLS = 0
let matrix = []

/**
 * Parses the input file into a matrix of characters.
 */
function parseAndSetGlobals(input) {
    const localMatrix = []

    for (const line of input.split('\n')) {
        const matrixRow = []
        for (const char of line) {
            matrixRow.push(char)
        }

        localMatrix.push(matrixRow)
    }

    NUM_ROWS = localMatrix.length
    NUM_COLS = localMatrix[0].length
    matrix = localMatrix
}

function isOutOfBounds(row, col) {
    return (row < 0 || row >= NUM_ROWS) || (col < 0 || col >= NUM_COLS);
}

function isMatrixValueEqual(row, col, value) {
    if (isOutOfBounds(row, col)) {
        return false
    }

    return matrix[row][col] === value
}

/**
 * Determines whether the provided coordinate is the beginning of an `X-MAS`
 * string in any of the eight directions of a cartesian plane.
 */
function findXMAS(row, col) {
    let count = 0

    // Northwest
    if (isMatrixValueEqual(row - 1, col - 1, "M")
            && isMatrixValueEqual(row - 2, col - 2, "A")
            && isMatrixValueEqual(row - 3, col - 3, "S")) {
        count++
    }

    // North
    if (isMatrixValueEqual(row - 1, col, "M")
            && isMatrixValueEqual(row - 2, col, "A")
            && isMatrixValueEqual(row - 3, col, "S")) {
        count++
    }

    // Northeast
    if (isMatrixValueEqual(row - 1, col + 1, "M")
            && isMatrixValueEqual(row - 2, col + 2, "A")
            && isMatrixValueEqual(row - 3, col + 3, "S")) {
        count++
    }

    // West
    if (isMatrixValueEqual(row, col - 1, "M")
            && isMatrixValueEqual(row, col - 2, "A")
            && isMatrixValueEqual(row, col - 3, "S")) {
        count++
    }

    // East
    if (isMatrixValueEqual(row, col + 1, "M")
            && isMatrixValueEqual(row, col + 2, "A")
            && isMatrixValueEqual(row, col + 3, "S")) {
        count++
    }

    // Southwest
    if (isMatrixValueEqual(row + 1, col - 1, "M")
            && isMatrixValueEqual(row + 2, col - 2, "A")
            && isMatrixValueEqual(row + 3, col - 3, "S")) {
        count++
    }

    // South
    if (isMatrixValueEqual(row + 1, col, "M")
            && isMatrixValueEqual(row + 2, col, "A")
            && isMatrixValueEqual(row + 3, col, "S")) {
        count++
    }

    // Southeast
    if (isMatrixValueEqual(row + 1, col + 1, "M")
            && isMatrixValueEqual(row + 2, col + 2, "A")
            && isMatrixValueEqual(row + 3, col + 3, "S")) {
        count++
    }

    return count
}

function solve(input) {
    parseAndSetGlobals(input)

    let sum = 0
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] === "X") {
                sum += findXMAS(row, col)
            }
        }
    }

    console.log("The 'XMAS' string appears %d times in the matrix.", sum)
}

solve(input)
