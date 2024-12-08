import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


let NUM_ROWS = 0
let NUM_COLS = 0

class Coordinate {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

function parse(input) {
    const map = new Map()

    const fileLines = input.split('\n')
    for (let i = 0; i < fileLines.length; i++) {
        const line = fileLines[i]
        NUM_COLS = line.length

        for (let j = 0; j < line.length; j++) {
            const char = line[j]

            if (char !== '.') {
                const coordinate = new Coordinate(i, j)
                coordinate.char = char
                const mapValue = map.get(char) ?? []
                mapValue.push(coordinate)
                map.set(char, mapValue)
            }
        }
    }

    NUM_ROWS = fileLines.length
    return map
}

function isOutOfBounds(row, col) {
    return row < 0 || row >= NUM_ROWS || col < 0 || col >= NUM_COLS;
}

/**
 * Finds all the anti-nodes associated with the two coordinates. This includes
 * the provided coordinates themselves, as stated in the problem description.
 *
 * @param coordinate1   The first coordinate.
 * @param coordinate2   The second coordinate.
 * @returns {[Coordinate]}  All anti-nodes present within the bounds of the map.
 */
function findAntiNodes(coordinate1, coordinate2) {
    const coordinateList = []

    const xDistance = coordinate2.x - coordinate1.x
    const yDistance = coordinate2.y - coordinate1.y

    // This will look for values on the left if coordinate1's x value is smaller
    // than coordinate2's, but essentially represents the anti-nodes present on
    // one side of the grid before the other.
    let leftX = coordinate1.x
    let leftY = coordinate1.y
    while (!isOutOfBounds(leftX, leftY)) {
        coordinateList.push(new Coordinate(leftX, leftY))
        leftX -= xDistance
        leftY -= yDistance
    }

    let rightX = coordinate2.x
    let rightY = coordinate2.y
    while (!isOutOfBounds(rightX, rightY)) {
        coordinateList.push(new Coordinate(rightX, rightY))
        rightX += xDistance
        rightY += yDistance
    }

    return coordinateList
}

/**
 * Computes the number of anti-nodes in the input file.
 *
 * @param map   A map containing letters (e.g., "A") and all of the coordinates
 *              where that letter appears in the input file.
 * @returns {number}    The number of anti-nodes in the file for all letters.
 */
function findResonance(map) {
    const antiNodeSet = new Set()
    for (const entry of map) {
        const valueArray = entry[1]

        for (let i = 0; i < valueArray.length; i++) {
            for (let j = i + 1; j < valueArray.length; j++) {
                const coordinate1 = valueArray[i];
                const coordinate2 = valueArray[j];
                const list = findAntiNodes(coordinate1, coordinate2)

                // This annoying workaround (adding strings to the set) must be
                // used because Coordinate objects are not de-duped if they're
                // equivalent.
                list.forEach(coordinate => antiNodeSet.add(coordinate.x + "," + coordinate.y))
            }
        }
    }

    return antiNodeSet.size
}

function solve(input) {
    const map = parse(input)
    console.log("There are %d unique locations that contain an anti-node with resonant harmonics.",
                findResonance(map))
}

solve(input)
