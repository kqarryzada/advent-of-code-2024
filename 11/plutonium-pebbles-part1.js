import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


const BLINK_COUNT = 25

function parse(input) {
    const numbers = []

    const initialNumbers = input.split('\n')[0].split(' ');
    for (let i = 0; i < initialNumbers.length; i++) {
        numbers.push(parseInt(initialNumbers[i]));
    }

    return numbers
}

/**
 * Returns the expanded set of stones after a blink occurs.
 */
function blink(numbers) {
    const newList = []

    for (const num of numbers) {
        const stringNum = num.toString()
        if (num === 0) {
            newList.push(1)
        }
        else if (stringNum.length % 2 === 0) {
            const dividingVal = Math.pow(10, stringNum.length / 2);
            newList.push(Math.floor(num / dividingVal))
            newList.push(num % dividingVal)
        }
        else {
            newList.push(num * 2024);
        }
    }

    return newList
}

function solve(input) {
    let numbers = parse(input)
    for (let i = 0; i < BLINK_COUNT; i++) {
        numbers = blink(numbers)
    }

    console.log("The number of stones after %d blinks is %d.", BLINK_COUNT, numbers.length)
}

solve(input)
