import {readFileSync} from 'node:fs'

const fileName = "./input.txt"
const input = readFileSync(fileName, 'utf-8').trimEnd()

function parse(input) {
    const map = new Map()

    const fileLines = input.split('\n')
    fileLines.forEach(line => {
        const values = line.split('-')
        const computer1 = values[0]
        const computer2 = values[1]

        const currValue = map.get(computer1) ?? []
        currValue.push(computer2)
        map.set(computer1, currValue)
    })

    return map
}

/**
 * This function returns the number of valid "trios" of computers. This only
 * considers trios that have a computer which starts with the letter `t`.
 */
function findTrios(map) {
    let trioSet = new Set()
    let addToSet = (array) => trioSet.add(`${array[0]},${array[1]},${array[2]}`)

    for (const [comp1, values] of map) {
        for (const comp2 of values) {

            // Fetch the values associated with computer 2 and check if they are
            // also associated with computer 1.
            const comp2Neighbors = map.get(comp2)
            for (const comp3 of comp2Neighbors) {
                if (!comp1.startsWith("t") && !comp2.startsWith("t") && !comp3.startsWith("t")) {
                    continue
                }

                if (map.get(comp1)?.includes(comp3)) {
                    addToSet([comp1, comp2, comp3].sort())
                }
                else if (map.get(comp3)?.includes(comp1)) {
                    addToSet([comp1, comp2, comp3].sort())
                }
            }
        }
    }

    return trioSet.size
}

function solve(input) {
    const map = parse(input)
    console.log("There are %d computer trios that involve a computer starting with 't'.", findTrios(map))
}

solve(input)
