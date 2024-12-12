import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


const BLINK_COUNT = 75
const cache = new Map()

function parse(input) {
    const numbers = []

    const initialNumbers = input.split('\n')[0].split(' ');
    for (let i = 0; i < initialNumbers.length; i++) {
        numbers.push(parseInt(initialNumbers[i]));
    }

    return numbers
}

/**
 * Splits a number into two halves and returns the two values. For example,
 * `1024` would be split into `[10, 24]`.
 */
function splitNumber(num) {
    const dividingVal = Math.pow(10, num.toString().length / 2);
    const firstHalf = Math.floor(num / dividingVal)
    const secondHalf = num % dividingVal

    return [firstHalf, secondHalf]
}

class CacheEntry {
    iterationsToExpand = 0
    size = 0

    constructor(iteration, size) {
        this.iterationsToExpand = iteration
        this.size = size
    }
}

/**
 * Fetches an entry from the cache if the size has already been computed for
 * the provided value and iteration. If the entry has not yet been computed,
 * `-1` will be returned.
 */
function getCachedSize(value, iteration) {
    const iterationsToExpand = BLINK_COUNT - iteration

    const cachedValues = cache[value] ?? []
    for (const cacheEntry of cachedValues) {
        if (cacheEntry.iterationsToExpand === iterationsToExpand) {
            return cacheEntry.size
        }
    }

    return -1
}

function setSizeInCache(value, iteration, size) {
    const iterationsToExpand = BLINK_COUNT - iteration

    const cachedValues = cache[value] ?? []
    cachedValues.push(new CacheEntry(iterationsToExpand, size))
    cache[value] = cachedValues
}

/**
 * Recursively computes the number of resulting stones that will be present
 * after `BLINK_COUNT` blinks.
 */
function sizeOf(value, iteration) {
    if (iteration === BLINK_COUNT) {
        // When reaching the last iteration, only the stone itself is counted
        // since it won't be changed again.
        return 1
    }
    if (value === 0) {
        const cachedSize = getCachedSize(value, iteration)
        if (cachedSize !== -1) {
            return cachedSize
        }

        const size = sizeOf(1, iteration + 1)
        setSizeInCache(value, iteration, size)
        return size
    }

    const stringNum = value.toString()
    if (stringNum.length % 2 === 1) {
        const cachedSize = getCachedSize(value, iteration)
        if (cachedSize !== -1) {
            return cachedSize
        }

        const size = sizeOf(value * 2024, iteration + 1)
        setSizeInCache(value, iteration, size)
        return size
    }

    // Split the number into two and compute the sizes of each half, caching the
    // value if it has not been computed yet.
    const [firstHalf, secondHalf] = splitNumber(value)
    let firstHalfSize = getCachedSize(firstHalf, iteration + 1)
    if (firstHalfSize === -1) {
        firstHalfSize = sizeOf(firstHalf, iteration + 1)
        setSizeInCache(firstHalf, iteration + 1, firstHalfSize)
    }
    let secondHalfSize = getCachedSize(secondHalf, iteration + 1)
    if (secondHalfSize === -1) {
        secondHalfSize = sizeOf(secondHalf, iteration + 1)
        setSizeInCache(secondHalf, iteration + 1, secondHalfSize)
    }

    const size = firstHalfSize + secondHalfSize
    setSizeInCache(value, iteration, size)
    return size
}

function solve(input) {
    let numbers = parse(input)

    let stoneCount = 0
    for (let i = 0; i < numbers.length; i++) {
        stoneCount += sizeOf(numbers[i], 0)
    }

    console.log("The number of stones after %d blinks is %d.", BLINK_COUNT, stoneCount)
}

solve(input)
