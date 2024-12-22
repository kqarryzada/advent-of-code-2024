import {readFileSync} from 'node:fs'

const input = readFileSync("./input.txt", 'utf-8').trimEnd()


let cache = new Set()

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
 * Recursively computes whether the provided design can be arranged with the
 * provided substrings.
 */
function compute(design, substrings) {
    if (design.length === 0) {
        return 1
    }

    for (const substr of substrings.filter(s => design.startsWith(s))) {
        const subDesign = design.substring(substr.length)

        // Check if the remaining part of the design has already been computed.
        if (cache.has(subDesign)) {
            continue
        }

        const numSubstringsInSubDesign = compute(subDesign, substrings)
        if (numSubstringsInSubDesign === 1) {
            return 1
        }
        cache.add(subDesign)
    }

    return 0
}

function solve(input) {
    const {substrings, designs} = parse(input)

    let computable = 0
    for (const d of designs) {
        computable += compute(d, substrings)
        cache = new Set()
    }

    console.log("%d of the desired towel arrangements can be represented.", computable)
}

solve(input)
