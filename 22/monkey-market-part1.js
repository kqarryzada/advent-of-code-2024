import {readFileSync} from 'node:fs'

const fileName = "./input.txt"
const input = readFileSync(fileName, 'utf-8').trimEnd()


function parse(input) {
    const fileLines = input.split('\n')
    return fileLines.map(line => parseInt(line))
}

function mixAndPrune(num, secret) {
    // This bitwise AND is equivalent to the modulus of 16777216 (2^24).
    return (num ^ secret) & 0x00FF_FFFF
}

function calculate2000thSecretNumber(origSecret) {
    let secret = origSecret

    // Since the values that are being multiplied and divided are all powers of
    // two, we can instead use the shift operator. For example, 64 is 2^6, so
    // multiplying by 64 is equivalent to left-shifting the number 6 times.
    // JavaScript does not appear to make this optimization on its own.
    for (let i = 0; i < 2000; i++) {
        secret = mixAndPrune(secret << 6, secret)
        secret = mixAndPrune(secret >> 5, secret)
        secret = mixAndPrune(secret << 11, secret)
    }

    return secret
}

function solve(input) {
    const secretNumbers = parse(input)

    let sum = 0
    secretNumbers.forEach(secret => sum += calculate2000thSecretNumber(secret))
    console.log("The sum of all 2000th iterations is %d.", sum)
}

solve(input)
