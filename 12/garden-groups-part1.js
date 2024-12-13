import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


let NUM_ROWS = 0
let NUM_COLS = 0
let matrix = []

class Coordinate {
    x = 0
    y = 0
    letter = 'A'
    visited = false

    constructor(x, y, letter) {
        this.x = x
        this.y = y
        this.letter = letter
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
    const setupMatrix = []

    const fileLines = input.split('\n')
    for (let i = 0; i < fileLines.length; i++) {
        const line = fileLines[i]

        const row = []
        for (let j = 0; j < line.length; j++) {
            const char = line[j]

            row.push(new Coordinate(i, j, char))
        }

        setupMatrix.push(row)
    }

    NUM_ROWS = setupMatrix.length
    NUM_COLS = setupMatrix[0].length
    matrix = setupMatrix
}

/**
 * For a given coordinate, this function computes the number of sides it has
 * that contributes to the perimeter. For example, a coordinate that represents
 * the corner of a shape will return `2`, and a coordinate that is a region of
 * only one letter will return `4`.
 */
function computePartialPerimeter(coordinate) {
    const row = coordinate.x
    const col = coordinate.y

    let perimeter = 0
    if (isOutOfBounds(row - 1, col) || matrix[row - 1][col].letter !== coordinate.letter) {
        perimeter++
    }
    if (isOutOfBounds(row + 1, col) || matrix[row + 1][col].letter !== coordinate.letter) {
        perimeter++
    }
    if (isOutOfBounds(row, col - 1) || matrix[row][col - 1].letter !== coordinate.letter) {
        perimeter++
    }
    if (isOutOfBounds(row, col + 1) || matrix[row][col + 1].letter !== coordinate.letter) {
        perimeter++
    }

    return perimeter
}

/**
 * This function takes the provided list of coordinates (that represent a
 * region) and computes the "price" based on its area and perimeter.
 */
function calculatePrice(regionList) {
    const area = regionList.length

    let perimeter = 0
    for (const region of regionList) {
        perimeter += computePartialPerimeter(region)
    }

    return perimeter * area
}

/**
 * Recursively aggregates a list of coordinates that correspond to a region from
 * the input file.
 * <br><br>
 *
 * If the provided coordinate was already returned as part of another region, or
 * if the letter does not match (indicating it is not part of the desired
 * region), an empty array will be returned.
 */
function computeRegion(row, col, letter) {
    if (isOutOfBounds(row, col)) {
        return []
    }
    if (matrix[row][col].letter !== letter) {
        return []
    }
    if (matrix[row][col].visited) {
        return []
    }

    matrix[row][col].visited = true

    const regions = [matrix[row][col]]
    computeRegion(row - 1, col, letter).forEach(subregion => regions.push(subregion))
    computeRegion(row + 1, col, letter).forEach(subregion => regions.push(subregion))
    computeRegion(row, col - 1, letter).forEach(subregion => regions.push(subregion))
    computeRegion(row, col + 1, letter).forEach(subregion => regions.push(subregion))

    return regions
}

function solve(input) {
    parse(input)

    const regions = []
    for (let i = 0; i < NUM_ROWS; i++) {
        for (let j = 0; j < NUM_COLS; j++) {
            const letter = matrix[i][j].letter
            const region = computeRegion(i, j, letter)
            if (region.length !== 0) {
                regions.push(region)
            }
        }
    }

    let price = 0
    for (const region of regions) {
        price += calculatePrice(region)
    }

    console.log("The total fencing price is %d.", price)
}

solve(input)
