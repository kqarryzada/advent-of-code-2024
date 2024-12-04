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
 * Determines whether the provided coordinate is the center of an MAS cross,
 * e.g.:
 *
 * <pre>
 * M.S
 * .A.
 * M.S
 * </pre>
 */
function isMASCross(row, col) {
    let backslash = false
    let slash = false

    if (isMatrixValueEqual(row - 1, col - 1, "M")
            && isMatrixValueEqual(row + 1, col + 1, "S")) {
        backslash = true
    }

    if (isMatrixValueEqual(row - 1, col - 1, "S")
            && isMatrixValueEqual(row + 1, col + 1, "M")) {
        backslash = true
    }

    if (isMatrixValueEqual(row + 1, col - 1, "M")
            && isMatrixValueEqual(row - 1, col + 1, "S")) {
        slash = true
    }

    if (isMatrixValueEqual(row + 1, col - 1, "S")
            && isMatrixValueEqual(row - 1, col + 1, "M")) {
        slash = true
    }

    return backslash && slash
}

function solve(input) {
    parseAndSetGlobals(input)

    let sum = 0
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] === "A") {
                sum += isMASCross(row, col)
            }
        }
    }

    console.log("There are %d 'MAS' crosses in the matrix.", sum)
}

solve(input)
