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
    let similarityScore = 0
    const {list1, list2} = parse(input)

    for (const listOneValue of list1) {
        let duplicateCount = 0
        for (const listTwoValue of list2) {
            if (listTwoValue === listOneValue) {
                duplicateCount++
            }
            else if (listTwoValue > listOneValue) {
                // The list is sorted, so any larger value indicates that there
                // are no more duplicates in the second list.
                break
            }
        }

        similarityScore += duplicateCount * listOneValue
    }

    console.log('The similarity score is %d.', similarityScore)
}

solve(input)
