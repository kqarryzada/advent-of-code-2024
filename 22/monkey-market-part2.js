import {readFileSync} from 'node:fs'

const fileName = "./input.txt"
const input = readFileSync(fileName, 'utf-8').trimEnd()


const ITERATION_COUNT = 2000

// Contains the sum of all sequences for the traders. Values are only summed to
// this map the first time they are seen.
const aggregateMap = new Map()


function parse(input) {
    const fileLines = input.split('\n')
    return fileLines.map(line => parseInt(line))
}

function mixAndPrune(num, secret) {
    // This bitwise AND is equivalent to the modulus of 16777216 (2^24).
    return (num ^ secret) & 0x00FF_FFFF
}

/**
 * Removes the first number in a comma-separated list. For example, for the
 * sequence `-2,1,3,-1`, this function returns `1,3,-1`.
 */
function pruneFirstNumber(input) {
    const values = input.split(",")
    return values[1] + "," + values[2] + "," + values[3] + ","
}

/**
 * Calculates the first 2000 secret numbers that are generated for a trader.
 * As these values are computed, sequences of the last four price differences
 * are summed into the aggregate map so that they can be analyzed later.
 *
 * @param origSecret    The initial secret value.
 */
function calculate2000thSecretNumber(origSecret) {
    let map = new Map()
    let key = ""
    let secret = origSecret
    let previousPrice = secret % 10

    // Execute the initial steps that do not have a sequence.
    //
    // Since the values that are being multiplied and divided (when computing a
    // secret) are all powers of two, we can instead use the shift operator. For
    // example, 64 is 2^6, so multiplying by 64 is equivalent to left-shifting
    // the number 6 times. JavaScript does not appear to make this optimization
    // on its own.
    for (let i = 0; i < 3; i++) {
        secret = mixAndPrune(secret << 6, secret)
        secret = mixAndPrune(secret >> 5, secret)
        secret = mixAndPrune(secret << 11, secret)
        let price = secret % 10
        key += (price - previousPrice) + ","
        previousPrice = price
    }

    for (let i = 3; i < ITERATION_COUNT; i++) {
        secret = mixAndPrune(secret << 6, secret)
        secret = mixAndPrune(secret >> 5, secret)
        secret = mixAndPrune(secret << 11, secret)
        let price = secret % 10

        const priceDifference = price - previousPrice
        key += priceDifference + ","

        // Update the data for the sequence in the map. If the value has already
        // been seen, then it should not be stored again, as the trader will
        // have already used the previous value.
        if (!map.has(key)) {
            map.set(key, price)
        }

        key = pruneFirstNumber(key)
        previousPrice = price
    }

    // Enter the information from this buyer into the aggregate map.
    for (const [key, value] of map) {
        let aggregateValue = aggregateMap.get(key) ?? 0
        aggregateMap.set(key, aggregateValue + value)
    }
}

function solve(input) {
    const secretNumbers = parse(input)
    for (const secret of secretNumbers) {
        calculate2000thSecretNumber(secret)
    }

    let largestKey = ""
    let largestValue = Number.MIN_SAFE_INTEGER
    for (const [key, value] of aggregateMap) {
        if (value > largestValue) {
            largestKey = key
            largestValue = value
        }
    }

    largestKey = largestKey.substring(0, largestKey.length - 1)
    console.log("The best sequence to give the monkey is %s, which results in %d bananas.", largestKey, largestValue)
}

solve(input)
