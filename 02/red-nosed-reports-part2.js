import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


/**
 * Parses the input file into a matrix of integers.
 */
function parse(input) {
    const matrix = []

    for (const line of input.split('\n')) {
        const row = []
        const values = line.split(/\s+/)
        for (const value of values) {
            row.push(parseInt(value))
        }

        matrix.push(row)
    }
    return matrix
}

/**
 * Determines whether a pair of neighboring integers is considered safe.
 *
 * @param a     The first integer.
 * @param b     The second integer.
 * @param ascending  Whether the integers are in ascending order (i.e., that
 *                   a < b).
 * @returns {boolean}   If the pair is considered safe.
 */
function isPairSafe(a, b, ascending) {
    let difference = (ascending) ? b - a : a - b
    return difference > 0 && difference <= 3
}

/**
 * Determines whether a row of integers in the matrix is considered "safe", as
 * defined by the problem.
 *
 * @param row   The list of integer values.
 * @returns {boolean}   If the row is considered safe.
 */
function isRowSafe(row) {
    if (row.length < 2) {
        throw new Error('Invalid input.')
    }

    // Anytime two subsequent values are equivalent, the row is considered
    // unsafe.
    if (row[0] === row[1]) {
        return false
    }

    const ascending = row[0] < row[1]

    let safe = true
    for (let i = 1; i < row.length; i++) {
        safe = isPairSafe(row[i - 1], row[i], ascending)
        if (!safe) {
            break
        }
    }

    return safe
}

/**
 * Determines whether a row of integers in the matrix is considered "safe", as
 * defined by the problem. If an unsafe value is found, this function will
 * re-evaluate the row to determine if removing one of the values will render
 * the row safe. The problem refers to this behavior as "dampening".
 *
 * @param row   The list of integer values.
 * @returns {boolean}   If the row is considered safe.
 */
function isRowSafeDampened(row) {
    if (isRowSafe(row)) {
        return true
    }

    for (let i = 0; i < row.length; i++) {
        const copy = row.slice()
        copy.splice(i, 1)
        if (isRowSafe(copy)) {
            return true
        }
    }
}

function solve(input) {
    const matrix = parse(input)
    let safeCount = 0
    for (const row of matrix) {
        if (isRowSafeDampened(row)) {
            safeCount++
        }
    }

    console.log('The number of safe reports with dampening is %d.', safeCount)
}

solve(input)
