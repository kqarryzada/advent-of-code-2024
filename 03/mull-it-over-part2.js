import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();

// The input file contains multiple lines. This variable stores the 'enabled'
// status between these lines.
let enabled = true

/**
 * Parses the input string into a list of instructions.
 */
function parse(input) {
    const instructionList = []

    for (let i = 0; i < input.length; i++) {
        const char = input.charAt(i)
        if (char !== 'm' && char !== 'd') {
            // This character is invalid, so it should be skipped.
        }
        else if (input.substring(i, i + 4) === 'do()') {
            // If the substring at the current index is "do()", enable processing.
            i += 3
            enabled = true
        }
        else if (input.substring(i, i + 7) === "don't()") {
            // If the substring at the current index is "don't()", disable
            // processing.
            i += 6
            enabled = false
        }
        else if (enabled) {
            const newInstruction = getMulInstruction(input, i)
            if (newInstruction !== "") {
                instructionList.push(newInstruction)
                i += newInstruction.length - 1
            }
        }
    }

    return instructionList
}

/**
 * This function attempts to fetch the `mul` instruction at the provided index
 * in the input string. For example, consider the following string and an index
 * with a value of `2`:
 * <pre>
 *   0&mul(21,3)
 * </pre>
 *
 * The 2nd index points to the letter "m", which is the start of a valid `mul`
 * instruction. For this input, the function will return the string `mul(21,3)`.
 *
 * If the index does not point to a valid multiplication instruction, this
 * function will return an empty string.
 *
 * @param input     A line from the input file.
 * @param i         The index to begin evaluation.
 * @returns {string}   The `mul` instruction, or an empty string if the index
 *                     did not point to a valid instruction.
 */
function getMulInstruction(input, i) {
    if (input.substring(i, i + 4) !== "mul(") {
        return ""
    }
    i += 4

    let closingParenthesisFound = false
    let commaFound = false
    for (let j = i; j < input.length; j++) {
        const char = input.charAt(j)
        if (char >= '0' && char <= '9') {
            continue
        }

        if (char === ',') {
            if (commaFound) {
                // If a comma was already found before, this instruction is
                // invalid.
                return ""
            }
            commaFound = true
        }
        else if (input.charAt(j) === ')') {
            closingParenthesisFound = true
            break
        }
        else {
            // An invalid character was detected.
            return ""
        }
    }

    if (!commaFound || !closingParenthesisFound) {
        return ""
    }
    return input.substring(i, input.indexOf(')', i) + 1)
}

/**
 * Computes a multiplication instruction of the form:
 * <pre>
 *   mul(4,9)
 * </pre>
 *
 * @param instruction   A `mul` instruction string.
 * @returns {number}    The result of the multiplication.
 */
function compute(instruction) {
    const matches = instruction.match(/\d+,\d+/g)
    if (matches === null) {
        throw new Error("An invalid instruction was received: " + instruction)
    }

    const numbers = matches[0].split(',')
    if (numbers.length !== 2) {
        throw new Error("An invalid instruction was parsed: " + instruction)
    }

    return parseInt(numbers[0]) * parseInt(numbers[1])
}

function testValues() {
    const dataProvider = [
        [ "teststring", 0 ],
        [ 'd', 0 ],
        [ "mul(4,9)", 36 ],
        [ "do()_mul(4,2)_don't()_mul(3,3)", 8 ],
        [ "don't()_mul(4,2)_do()_mul(3,3)", 9 ],
        [ "mul(1,3)_don't()_mul(4,2)_do()_mul(3,3)", 12 ],
        [ "mul(1,3)_do()_mul(4,2)_don't()_mul(3,3)", 11 ],
        [ "mul(1,3)_don't()_mul(4,2)_don't()_mul(3,3)", 3 ],
        [ "mul(1,3)_do()_mul(4,2)_do()_mul(3,3)", 20 ],
    ]

    for (const testCase of dataProvider) {
        const [input, expected] = testCase

        // Reset the global variable between test cases.
        enabled = true

        const instructionList = parse(input)
        let actual = 0
        instructionList.forEach(instruction => {
            actual += compute(instruction)
        })

        if (actual !== expected) {
            console.error("For '%s', expected %d but got %d.", input, expected, actual)
        }
        // else {
        //     console.log('Case "%s" passed.', input)
        // }
    }

    // Reset the enabled flag.
    enabled = true
}

function solve(input) {
    testValues()

    let instructionList = []
    for (const line of input.split('\n')) {
        instructionList = instructionList.concat(parse(line))
    }

    let total = 0
    for (const instruction of instructionList) {
        total += compute(instruction)
    }

    console.log("The total sum is %d.", total)
}

solve(input)
