import {readFileSync} from 'node:fs'

const input = readFileSync("./input.txt", 'utf-8').trimEnd()


let cache = new Map()

function parse(input) {
    const fileLines = input.split("\n")
    const substrings = fileLines[0].split(", ")

    const designs = []
    for (let i = 2; i < fileLines.length; i++) {
        designs.push(fileLines[i]);
    }

    return {substrings, designs}
}


/**
 * Recursively computes the number of ways that the provided substrings can
 * be put together to match the design.
 */
function compute(design, substrings) {
    if (design.length === 0) {
        return 1
    }

    let possibleCount = 0
    for (const substr of substrings.filter(s => design.startsWith(s))) {
        const subDesign = design.substring(substr.length)
        if (cache.has(subDesign)) {
            possibleCount += cache.get(subDesign)
        }
        else {
            const retVal = compute(subDesign, substrings)
            cache.set(subDesign, retVal)
            possibleCount += retVal
        }
    }

    return possibleCount
}

function solve(input) {
    const {substrings, designs} = parse(input)

    let possibleCount = 0
    for (const d of designs) {
        possibleCount += compute(d, substrings)
        cache = new Map()
    }

    console.log("There are %d ways to achieve all of the possible designs.", possibleCount)
}

solve(input)
