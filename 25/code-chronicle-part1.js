import {readFileSync} from 'node:fs'

const fileName = "./example-input.txt"
const input = readFileSync(fileName, 'utf-8').trimEnd()


function isWithinFileBounds(fileLines, index) {
    return index < fileLines.length
}

function processDiagram(fileLines, fileIndex) {
    const isKey = fileLines[fileIndex].includes("#")

    // Initialize the object as a list of zeros.
    const lockOrKey = []
    fileLines[fileIndex].split("").forEach(() => lockOrKey.push(0))

    let i = fileIndex + 1
    while (isWithinFileBounds(fileLines, i + 1) && fileLines[i + 1].length > 0) {
        const line = fileLines[i]
        for (let j = 0; j < line.length; j++) {
            if (line[j] === '#') {
                lockOrKey[j]++
            }
        }

        i++
    }

    return {isKey, object: lockOrKey}
}

/**
 * Parses the input file into two arrays of key and lock objects. For example:
 *
 * ```
 * keys:  [ [ 0, 5, 3, 4, 3 ], [ 1, 2, 0, 5, 3 ] ]
 * locks: [ [ 5, 0, 2, 1, 3 ], [ 4, 3, 4, 0, 2 ], [ 3, 0, 2, 0, 1 ] ]
 * ```
 */
function parse(input) {
    const keys = []
    const locks = []

    const fileLines = input.split('\n')
    for (let i = 0; i < fileLines.length; i++) {
        const {isKey, object} = processDiagram(fileLines, i)
        const list = (isKey) ? keys : locks
        list.push(object)

        while (isWithinFileBounds(fileLines, i + 1) && fileLines[i].trim().length > 0) {
            i++
        }
    }

    return {keys, locks}
}

function calculatePossibleCombinations(keys, locks) {
    let numPossibilities = 0
    for (const key of keys) {
        for (const lock of locks) {
            let valid = 1
            for (let j = 0; j < lock.length; j++) {
                if (key[j] + lock[j] > 5) {
                    valid = 0
                    break
                }
            }

            numPossibilities += valid
        }
    }

    return numPossibilities
}

function solve(input) {
    let {keys, locks} = parse(input)
    const combinations = calculatePossibleCombinations(keys, locks)
    console.log("There are %d possible matching combinations of keys and locks.", combinations)
}

solve(input)
