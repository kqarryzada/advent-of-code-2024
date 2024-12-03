import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


/**
 * Parses the input string into a list of instructions.
 */
function parse(input) {
    const instructionList = []

    const matches = input.matchAll(/mul\(\d+,\d+\)/g)
    for (const match of matches) {
        instructionList.push(match[0])
    }

    return instructionList
}

/**
 * Computes a multiplication instruction of the form:
 * <pre>
 *   mul(4,9)
 * </pre>
 *
 * @param instruction   A `mul` instruction.
 * @returns {number}    The result of the multiplication.
 */
function compute(instruction) {
    const numbers = instruction.match(/\d+,\d+/g)[0].split(',')
    if (numbers.length !== 2) {
        throw new Error('An invalid instruction was parsed: ' + instruction)
    }

    return parseInt(numbers[0]) * parseInt(numbers[1])
}

function solve(input) {
    let instructionList = []
    for (const line of input.split('\n')) {
        instructionList = instructionList.concat(parse(line))
    }

    let total = 0
    for (const instruction of instructionList) {
        total += compute(instruction)
    }

    console.log('The total sum is %d.', total)
}

solve(input)
