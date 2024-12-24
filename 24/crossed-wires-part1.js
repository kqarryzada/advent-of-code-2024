import {readFileSync} from 'node:fs'

const fileName = "./input.txt"
const input = readFileSync(fileName, 'utf-8').trimEnd()


const map = new Map()


function parse(input) {
    const fileLines = input.split('\n')

    fileLines.filter(line => line.includes(":")).forEach(line => {
        const initialValue = line.split(":")
        const key = initialValue[0]
        const value = parseInt(initialValue[1].trim());

        map.set(key, value)
    })

    const operations = new Set()
    fileLines.filter(line => line.includes("->")).forEach(line => operations.add(line))
    return operations
}

function calculateAll(operations) {
    while (operations.size > 0) {
        for (const op of operations) {
            const opValues = op.split(" ")
            const gate1 = map.get(opValues[0])
            const gate2 = map.get(opValues[2])
            if (gate1 === undefined || gate2 === undefined) {
                continue
            }

            const opType = opValues[1]
            const targetGate = opValues[4]

            let result = 0
            switch (opType) {
                case "AND":
                    result = gate1 & gate2
                    break
                case "OR":
                    result = gate2 | gate1
                    break
                case "XOR":
                    result = gate1 ^ gate2
                    break
                default:
                    throw new Error("Unknown operation type: " + opType)
            }

            map.set(targetGate, result)
            operations.delete(op)
        }
    }
}

function solve(input) {
    let operations = parse(input)
    calculateAll(operations)

    let gates = []
    for (const entry of map.keys()) {
        gates.push(entry)
    }

    let value = 0
    gates.sort()
    const list = gates.filter(g => g.startsWith("z"))
    for (let i = list.length - 1; i >= 0; i--) {
        const gate = list[i]
        console.log(gate, map.get(gate))
        value *= 2
        value += map.get(gate)
    }
    console.log("The value of all Z registers converted to decimal is %d.", value)
}

solve(input)
