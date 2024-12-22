import {readFileSync} from 'node:fs'

const input = readFileSync('./input.txt', 'utf-8').trimEnd()

let A = BigInt(0)
let B = BigInt(0)
let C = BigInt(0)
let answer = ""

const DEBUG = true


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

function debugLog(...input) {
    if (DEBUG) {
        console.log(input)
    }
}

function parse(input) {
    let instructions = []

    for (const line of input.split('\n')) {
        const components = line.split(" ")

        if (line.startsWith("Register")) {
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
            answer = components[1]
            instructions = components[1].split(",").map(n => parseInt(n))
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
            return BigInt(literalOperand)
        case 4:
            return A
        case 5:
            return B
        case 6:
            return C
        case 7:
        default:
            throw new Error("Unexpected operand: " + literalOperand)
    }
}

function division(comboOperand) {
    const comboInt32 = Number(comboOperand & BigInt(0xFFFF_FFFF))

    // The problem statement states that division must truncate the value to an
    // integer. When it says this, it means that it should not be a floating
    // point number. I misunderstood this to mean that it should be truncated to
    // 32 bits, which was a very painful mistake. In any case, avoiding any
    // manipulations was enough to fix the problem.
    return A / BigInt(Math.pow(2, comboInt32))
}

function computeInstruction(opCode, literalOperand, comboOperand) {
    switch (opCode) {
        case OpCode.ADV:
            A = division(comboOperand)
            break
        case OpCode.BXL:
            B ^= BigInt(literalOperand)
            break
        case OpCode.BST:
            B = comboOperand & 7n
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
                if (A !== 0n) {
                    // Pre-subtract two since it will be added in the next
                    // iteration of the loop.
                    i = literalOperand - 2
                }
                break
            case OpCode.OUT:
                output += comboOperand & 7n
                output += ","
                break
            default:
                computeInstruction(opCode, literalOperand, comboOperand)
                break
        }

    }

    return output.substring(0, output.length - 1)
}

/**
 * Searches for the correct value that should be given to the `A` register so
 * that the program outputs itself. If the value is found, it will be printed
 * to stdout.
 * <br><br>
 *
 * Given the nature of the input program, there is a pattern that can be seen
 * when iterating through all possible values for A. When the value of A is
 * represented in Base 8, it becomes apparent that it is possible to search for
 * a specific output. For example:
 *
 * <pre>
 *   Value of register A, base 8    Program output
 *   4                              0
 *   45                             3,0
 *   452                            3,3,0
 *   4526                           0,3,3,0
 *   45264                          5,0,3,3,0
 * </pre>
 *
 * This function follows this pattern and finds the next digit to add to the `A`
 * register until the input program is generated.
 * <br><br>
 *
 * Note that this function was implemented with recursion after the initial
 * implementations failed to find the answer. Recursion is not needed to solve
 * this, but this solution has been left as-is because cleanup takes time.
 *
 * @param instructions   The program instructions.
 * @param registerValue  An existing value for the register shifted by one in
 *                       Base 8. For example, if `A = 4` is known to output the
 *                       last digit of the output, then 32 ("40" in Base 8) may
 *                       be passed in. When this function is first called, this
 *                       value should be set to 0.
 * @returns {boolean}    `true` if the value was found successfully.
 */
function findRecursively(instructions, registerValue) {
    for (let j = 0n; j < 8n; j++) {
        const value = registerValue + j
        A = value
        B = 0n
        C = 0n

        const output = run(instructions)
        if (output === answer) {
            console.log()
            console.log("The A register should be set to %s so that the program outputs itself.", Number(value))
            console.log(output)
            return true
        }
        if (output.length > answer.length) {
            console.log("The output computed was too long.")
            return false
        }
        if (answer.endsWith(output)) {
            let potentialValue = registerValue + j
            debugLog(Number(potentialValue).toString(8), output)
            potentialValue *= BigInt(8)
            const success = findRecursively(instructions, potentialValue)
            if (success) {
                return true
            }
            else {
                // Otherwise, try the next digit.
            }
        }
    }

    return false
}

function solve(input) {
    const instructions = parse(input)
    const success = findRecursively(instructions, BigInt(0))
    if (!success) {
        console.log("Failed to find the value.")
    }
}

solve(input)
