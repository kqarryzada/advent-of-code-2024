import {readFileSync} from 'node:fs'

const fileName = "./input.txt"
const input = readFileSync(fileName, 'utf-8').trimEnd()


function getPositionMainController(val) {
    switch (val) {
        case "A":
            return {x: 2, y: 0}
        case "0":
            return {x: 1, y: 0}
        case "1":
            return {x: 0, y: 1}
        case "2":
            return {x: 1, y: 1}
        case "3":
            return {x: 2, y: 1}
        case "4":
            return {x: 0, y: 2}
        case "5":
            return {x: 1, y: 2}
        case "6":
            return {x: 2, y: 2}
        case "7":
            return {x: 0, y: 3}
        case "8":
            return {x: 1, y: 3}
        case "9":
            return {x: 2, y: 3}
        default:
            throw new Error("Value not found: " + val)
    }
}

function getPositionDirectionalController(val) {
    switch (val) {
        case "A":
            return {x: 2, y: 1}
        case "<":
            return {x: 0, y: 0}
        case "^":
            return {x: 1, y: 1}
        case "v":
            return {x: 1, y: 0}
        case ">":
            return {x: 2, y: 0}
        default:
            throw new Error("Value not found: " + val)
    }
}

/**
 * Ensures that the provided sequence, starting from the source coordinate,
 * never goes through `(0, 0)`.
 *
 * @returns {boolean}   `true` if the sequence is valid.
 */
function mainSequenceIsSafe(sourceCoord, sequence) {
    let current = {x: sourceCoord.x, y: sourceCoord.y}
    for (let i = 0, len = sequence.length; i < len; i++) {
        switch (sequence[i]) {
            case "^":
                current = {x: current.x, y: current.y + 1}
                break
            case "v":
                current = {x: current.x, y: current.y - 1}
                break
            case "<":
                current = {x: current.x - 1, y: current.y}
                break
            case ">":
                current = {x: current.x + 1, y: current.y}
                break
        }

        if (current.x === 0 && current.y === 0) {
            return false
        }
    }

    return true
}

/**
 * Ensures that the provided sequence, starting from the source coordinate,
 * never goes through `(0, 1)`.
 *
 * @returns {boolean}   `true` if the sequence is valid.
 */
function directionalSequenceSafe(sourceCoord, sequence) {
    let current = {x: sourceCoord.x, y: sourceCoord.y}
    for (let i = 0, len = sequence.length; i < len; i++) {
        switch (sequence[i]) {
            case "^":
                current = {x: current.x, y: current.y + 1}
                break
            case "v":
                current = {x: current.x, y: current.y - 1}
                break
            case "<":
                current = {x: current.x - 1, y: current.y}
                break
            case ">":
                current = {x: current.x + 1, y: current.y}
                break
        }

        if (current.x === 0 && current.y === 1) {
            return false
        }
    }

    return true
}

/**
 * Computes the possible paths from the source to target.
 *
 * Note that this function will only compute efficient directions, and will not
 * calculate every combination. For example, to move "northwest", this function
 * will return paths like "left, left, up, up" and "up, up, left, left". A path
 * like "up, left, up, left" will never be returned because it will always be
 * worse for a robot in an above layer to use. The robot in the very top layer
 * sees no difference between the "inefficient" path and an efficient one, since
 * they will be the same length.
 *
 * @param source               The source coordinate.
 * @param target               The target coordinate.
 * @param validatorCallback    A callback function that can validate a path from
 *                             source to target. The callback function should
 *                             return false if a path is invalid.
 *
 * @returns {Set<any>}  A set of possible paths from the source to the target.
 */
function findPaths(source, target, validatorCallback) {
    const xDiff = target.x - source.x
    const yDiff = target.y - source.y
    const charX = (xDiff > 0) ? ">" : "<"
    const charY = (yDiff > 0) ? "^" : "v"

    let xSequence = ""
    for (let i = 0; i < Math.abs(xDiff); i++) {
        xSequence += charX
    }

    let ySequence = ""
    for (let i = 0; i < Math.abs(yDiff); i++) {
        ySequence += charY
    }

    const seq1 = xSequence + ySequence
    const seq2 = ySequence + xSequence

    // Walk through each path and remove any that would go through an invalid
    // space.
    const sequences = new Set()
    for (const seq of [seq1, seq2]) {
        if (validatorCallback(source, seq)) {
            sequences.add(seq)
        }
    }

    return sequences
}

function convertMainKeypad(targetLine) {
    let possiblePaths = new Set().add("")

    let currentPosition = getPositionMainController("A")
    for (const char of targetLine.split("")) {
        const nextPosition = getPositionMainController(char)
        const paths = findPaths(currentPosition, nextPosition, mainSequenceIsSafe)

        const newPaths = new Set()
        for (const existingPath of possiblePaths) {
            for (const p of paths) {
                newPaths.add(existingPath + p + "A")
            }
        }

        possiblePaths = newPaths
        currentPosition = nextPosition
    }

    return [...possiblePaths]
}

function convertDirectionsIntoDirections(initialDirections) {
    let possiblePaths = new Set().add("")

    let currentPosition = getPositionDirectionalController("A")
    for (const char of initialDirections.split("")) {
        const nextPosition = getPositionDirectionalController(char)
        const paths = findPaths(currentPosition, nextPosition, directionalSequenceSafe)

        const newPaths = new Set()
        for (const existingPath of possiblePaths) {
            for (const p of paths) {
                newPaths.add(existingPath + p + "A")
            }
        }

        possiblePaths = newPaths
        currentPosition = nextPosition
    }

    return [...possiblePaths]
}

/**
 * Extracts the digits from a string and returns them as an integer.
 */
function extractNumericalValue(line) {
    line = line.match(/[0-9]+/g).join('')
    return parseInt(line)
}

function solve(input) {
    let sum = 0

    for (const desiredInstruction of input.split("\n")) {
        // Convert the desired instruction into the first robot's instructions.
        const robot1Instr = convertMainKeypad(desiredInstruction)

        let robot2Instr = []
        for (const instr of robot1Instr) {
            const results = convertDirectionsIntoDirections(instr)
            robot2Instr.push(...results)
        }

        let personInstr = []
        for (const instr of robot2Instr) {
            const results = convertDirectionsIntoDirections(instr)
            personInstr.push(...results)
        }

        const shortestLength = Math.min(...(personInstr.map(e => e.length)))
        const complexity = shortestLength * extractNumericalValue(desiredInstruction)
        sum += complexity
    }

    console.log("The complexity sum is %d.", sum)
}

solve(input)
