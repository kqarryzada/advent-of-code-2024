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

    isTopSide = false
    isBottomSide = false
    isLeftSide = false
    isRightSide = false

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
 * This function takes the provided list of coordinates (that represent a
 * region) and computes the "price" based on its area and the number of sides it
 * has.
 */
function calculatePrice(regionList) {
    const area = regionList.length

    // Sort the region coordinates by row from left to right.
    regionList.sort((coord1, coord2) => {
        const xDiff = coord1.x - coord2.x
        if (xDiff !== 0) {
            return xDiff
        }
        return coord1.y - coord2.y
    })

    let topSideCount = 0
    for (let i = 0; i < regionList.length; i++) {
        const prevCoord = (i !== 0) ? regionList[i - 1] : null
        const coord = regionList[i]

        const isAboveLetterSame = !isOutOfBounds(coord.x - 1, coord.y)
                && matrix[coord.x - 1][coord.y].letter === coord.letter

        if (!isAboveLetterSame) {
            coord.isTopSide = true
            if (prevCoord === null || prevCoord.y + 1 !== coord.y || !prevCoord.isTopSide) {
                topSideCount++
            }
        }
    }

    let bottomSideCount = 0
    for (let i = 0; i < regionList.length; i++) {
        const prevCoord = (i !== 0) ? regionList[i - 1] : null
        const coord = regionList[i]

        const isBelowLetterSame = !isOutOfBounds(coord.x + 1, coord.y)
            && matrix[coord.x + 1][coord.y].letter === coord.letter

        if (!isBelowLetterSame) {
            coord.isBottomSide = true
            if (prevCoord === null || prevCoord.y + 1 !== coord.y || !prevCoord.isBottomSide) {
                bottomSideCount++
            }
        }
    }

    // Sort the region coordinates by column from top to bottom.
    regionList.sort((prevCoord, coord) => {
        const yDiff = prevCoord.y - coord.y
        if (yDiff !== 0) {
            return yDiff
        }
        return prevCoord.x - coord.x
    })

    let leftSideCount = 0
    for (let i = 0; i < regionList.length; i++) {
        const prevCoord = (i !== 0) ? regionList[i - 1] : null
        const coord = regionList[i]

        const isLetterLeftSame = !isOutOfBounds(coord.x, coord.y - 1)
            && matrix[coord.x][coord.y - 1].letter === coord.letter

        if (!isLetterLeftSame) {
            coord.isLeftSide = true
            if (prevCoord === null || prevCoord.x + 1 !== coord.x || !prevCoord.isLeftSide) {
                leftSideCount++
            }
        }
    }

    let rightSideCount = 0
    for (let i = 0; i < regionList.length; i++) {
        const prevCoord = (i !== 0) ? regionList[i - 1] : null
        const coord = regionList[i]

        const isLetterRightSame = !isOutOfBounds(coord.x, coord.y + 1)
            && matrix[coord.x][coord.y + 1].letter === coord.letter

        if (!isLetterRightSame) {
            coord.isRightSide = true
            if (prevCoord === null || prevCoord.x + 1 !== coord.x || !prevCoord.isRightSide) {
                rightSideCount++
            }
        }
    }

    const totalSides = topSideCount + bottomSideCount + leftSideCount + rightSideCount
    return area * totalSides
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
    if (matrix[row][col].visited) {
        return []
    }
    if (matrix[row][col].letter !== letter) {
        return []
    }

    // The provided coordinate is part of the region.
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

    // Compile the input file into a set of regions.
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

    console.log("The total fencing price with the bulk discount is %d.", price)
}

solve(input)
