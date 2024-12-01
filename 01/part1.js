// noinspection DuplicatedCode

import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


/**
 * Parse the input file into two sorted numerical lists.
 *
 * @param input {string}    The input file.
 * @returns {{list1: *[], list2: *[]}}  The two lists from the input file. Each
 *                                      list is sorted in ascending order.
 */
function parse(input) {
    const list1 = []
    const list2 = []

    for (const line of input.split('\n')) {
        const values = line.split(/\s+/)
        if (values.length !== 2) {
            throw new Error('Invalid input: ' + line)
        }

        list1.push(parseInt(values[0]))
        list2.push(parseInt(values[1]))
    }

    list1.sort((a, b) => a - b)
    list2.sort((a, b) => a - b)
    return {list1, list2}
}

function solve(input) {
    let distance = 0
    const {list1, list2} = parse(input)

    for (let i = 0; i < list1.length; i++) {
        distance += Math.abs(list2[i] - list1[i])
    }

    console.log('The total distance is %d.', distance)
}

solve(input)
