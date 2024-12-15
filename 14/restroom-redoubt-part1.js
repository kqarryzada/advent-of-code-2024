import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


let NUM_ROWS = 103
let NUM_COLS = 101
// let NUM_ROWS = 7
// let NUM_COLS = 11

let ELAPSED_SECONDS = 100

class GuardPosition {
    x = 0
    y = 0

    xVelocity = 0
    yVelocity = 0

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    /**
     * Updates the guard's `x` and `y` coordinates to be its new position after
     * one second, based on its velocity values.
     */
    iterate() {
        this.x = (this.x + this.xVelocity)
        this.y = (this.y + this.yVelocity)

        if (this.x < 0) {
            this.x += NUM_COLS
        }
        else if (this.x >= NUM_COLS) {
            this.x -= NUM_COLS
        }

        if (this.y < 0) {
            this.y += NUM_ROWS
        }
        else if (this.y >= NUM_ROWS) {
            this.y -= NUM_ROWS
        }
    }
}

function parse(input) {
    const guardPositions = []

    const fileLines = input.split('\n')
    for (const line of fileLines) {
        const splitLine = line.split(" ")
        const positionValues = splitLine[0].split("=")[1].split(",")
        const velocityValues = splitLine[1].split("=")[1].split(",")
        const guardPosition =
            new GuardPosition(parseInt(positionValues[0]), parseInt(positionValues[1]))
        guardPosition.xVelocity = parseInt(velocityValues[0])
        guardPosition.yVelocity = parseInt(velocityValues[1])

        guardPositions.push(guardPosition)
    }

    return guardPositions
}

function calculateSafetyFactor(guardPositionList) {
    const middleRow = Math.floor(NUM_ROWS / 2)
    const middleCol = Math.floor(NUM_COLS / 2)

    let quad1 = 0
    let quad2 = 0
    let quad3 = 0
    let quad4 = 0


    for (const g of guardPositionList) {
        if (g.x < middleCol && g.y < middleRow) {
            quad1++
        }
        else if (g.x > middleCol && g.y < middleRow) {
            quad2++
        }
        else if (g.x < middleCol && g.y > middleRow) {
            quad3++
        }
        else if (g.x > middleCol && g.y > middleRow) {
            quad4++
        }
    }

    return quad1 * quad2 * quad3 * quad4
}

function solve(input) {
    const guardPositionList = parse(input)

    for (const guardPosition of guardPositionList) {
        for (let i = 0; i < ELAPSED_SECONDS; i++) {
            guardPosition.iterate()
        }
    }

    console.log("The safety factor after %d seconds is %d.", ELAPSED_SECONDS, calculateSafetyFactor(guardPositionList))
}

solve(input)
