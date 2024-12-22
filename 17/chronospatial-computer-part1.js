import {readFileSync} from 'node:fs'

const input = readFileSync('./input.txt', 'utf-8').trimEnd()

let A = 0
let B = 0
let C = 0


const OpCode = {
    // A = integer(A / 2^operand)
    ADV: 0,

    // B = B XOR literal(operand)
    BXL: 1,

    // B = 2^operand % 8
    BST: 2,

    // Instr. Pointer = A, A !== 0
    JNZ: 3,

    // B = B XOR C
    BXC: 4,

    // Prints 2&operand % 8
    OUT: 5,

    // B = integer(A / 2^operand)
    BDV: 6,

    // C = integer(A / 2^operand)
    CDV: 7,
}


function parse(input) {
    let instructions = []

    for (const line of input.split('\n')) {
        const components = line.split(" ")

        if (line.length === 0) {
            // Do nothing.
        }
        else if (line.startsWith("Register")) {

            const value = parseInt(components[2])
            switch (components[1]) {
                case "A:":
                    A = value
                    break
                case "B:":
                    B = value
                    break
                case "C:":
                    C = value
                    break
                default:
                    throw new Error("Unexpected input when parsing line: " + line)
            }
        }
        else if (line.startsWith("Program")) {
            instructions = components[1].split(",").map(n => parseInt(n))
        }
        else {
            throw new Error("Unexpected input when parsing line: " + line)
        }
    }

    return instructions
}

function getComboOperand(literalOperand) {
    switch (literalOperand) {
        case 0:
        case 1:
        case 2:
        case 3:
            return literalOperand
        case 4:
            return A
        case 5:
            return B
        case 6:
            return C
        case 7:
            // Do nothing.
            break
        default:
            throw new Error("Unexpected operand: " + literalOperand)
    }
}

function division(comboOperand) {
    let value = A / (Math.pow(2, comboOperand))
    return value & 0xFFFFFFFF
}

function computeInstruction(opCode, literalOperand, comboOperand) {
    switch (opCode) {
        case OpCode.ADV:
            A = division(comboOperand)
            break
        case OpCode.BXL:
            B ^= literalOperand
            break
        case OpCode.BST:
            B = comboOperand % 8
            break
        case OpCode.BXC:
            B ^= C
            break
        case OpCode.BDV:
            B = division(comboOperand)
            break
        case OpCode.CDV:
            C = division(comboOperand)
            break
    }
}

function run(instructions) {
    let output = ""

    for (let i = 0; i < instructions.length; i += 2) {
        const opCode = instructions[i]
        const literalOperand = instructions[i + 1]
        const comboOperand = getComboOperand(literalOperand)

        switch (opCode) {
            case OpCode.JNZ:
                if (A !== 0) {
                    // Pre-subtract two since it will be added in the next
                    // iteration of the loop.
                    i = literalOperand - 2
                }
                break
            case OpCode.OUT:
                output += comboOperand % 8
                output += ","
                break
            default:
                computeInstruction(opCode, literalOperand, comboOperand)
                break
        }

    }

    return output.substring(0, output.length - 1)
}

function solve(input) {
    const instructions = parse(input)
    const output = run(instructions)

    console.log("The output of the program is:")
    console.log()
    console.log(output)
}

solve(input)
