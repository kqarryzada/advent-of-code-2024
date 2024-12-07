import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


/**
 * Represents a line from the input file, which contains a number list and a
 * desired value that should be reached.
 */
class Equation {
    constructor(desiredValue, numberList) {
        this.desiredValue = desiredValue
        this.numberList = numberList
    }
}

/**
 * Parses the input file, which contains a list of numbers and a "desired number"
 * that should be reached with some mathematical operation on the number list.
 */
function parse(input) {
    const equations = []

    const fileLines = input.split('\n')
    for (let i = 0; i < fileLines.length; i++) {
        const line = fileLines[i]
        const fields = line.split(':')

        const values = []
        for (const value of fields[1].trim().split(' ')) {
            values.push(parseInt(value))
        }

        equations.push(new Equation(parseInt(fields[0]), values))
    }

    return equations
}

/**
 * This function computes all possible calculations of a number list by applying
 * the `+` and `*` operators. For example, for a number list of `[2, 31]`, this
 * will return an array of the values `[62, 33]`. Operations are always applied
 * in left to right order, so mathematical order of operations rules such as
 * PEMDAS or BODMAS are ignored.
 *
 * @param numberList    The list of numbers to compute.
 * @returns {number[]}  The results of all possible combinations of adding and
 *                      multiplying the provided numbers.
 */
function findCalculation(numberList) {
    if (numberList.length === 2) {
        let value1 = numberList[0] * numberList[1]
        let value2 = numberList[0] + numberList[1]
        return [value1, value2]
    }

    // Compute the result set of the first n-1 elements.
    const reducedList = numberList.slice()
    const lastVal = reducedList.pop()
    const calculatedList = findCalculation(reducedList)

    // Calculate the list that should be returned by applying both operator
    // types to the nth value.
    const resultList = []
    for (const value of calculatedList) {
        const newValue1 = value * lastVal
        const newValue2 = value + lastVal

        resultList.push(newValue1)
        resultList.push(newValue2)
    }
    return resultList
}

function solve(input) {
    const equationList = parse(input)

    let totalFixed = 0
    for (const equation of equationList) {
        const calculation = findCalculation(equation.numberList)
        if (calculation.includes(equation.desiredValue)) {
            totalFixed += equation.desiredValue
        }
    }

    console.log("There are %d equations that can be solved with only + and * operators.", totalFixed)
}

solve(input)
