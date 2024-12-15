import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


let NUM_ROWS = 103
let NUM_COLS = 101
const DEBUG = false
const EASTER_EGG_COUNT = 8050
let iteration = 0


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

/**
 * Prints the grid of all guard locations to `stdout`. If a guard is at a
 * location, a `*` will be printed. If a location is empty, `.` will be printed.
 */
function printGrid(guardPositionList) {
    guardPositionList.sort((pos1, pos2) => {
        const yDiff = pos1.y - pos2.y
        if (yDiff !== 0) {
            return yDiff
        }
        return pos1.x - pos2.x
    })

    console.log("Second: " + iteration)
    let i = 0
    for (let row = 0; row < NUM_ROWS; row++) {
        let stringRow = ""
        for (let col = 0; col < NUM_COLS; col++) {
            let guard = guardPositionList[i]

            if (guard.x === col && guard.y === row) {
                stringRow += "*"

                // Iterate to the next guard that is not at this coordinate.
                while (guardPositionList[i].x === col && guardPositionList[i].y === row) {
                    i++
                    i %= guardPositionList.length
                }
            }
            else {
                stringRow += "."
            }
        }
        console.log(stringRow)
    }

    console.log()
}

function iterateAllGuards(guardPositionList) {
    for (const guardPosition of guardPositionList) {
        guardPosition.iterate()
    }
}

/**
 * "Solves" the problem with some debug information.
 */
async function solveDebug(input) {
    // Part 2 is unusual in that the problem asks you to find a layout that is
    // eventually reached, which requires viewing the output of the grid. I
    // initially printed out the output at every iteration, and noticed that I
    // saw occasional vertical clustering. I thought the clustered output might
    // be identical, which would indicate that the guard's positioning was
    // looping. However, the clustered pattern was always unique, and it kept
    // occurring every 101 iterations. For this reason, this function starts at
    // the point in question (iteration 71, starting from 0) and steps forward
    // by 101 iterations until the known answer for my input file is reached.
    const guardPositionList = parse(input)

    // Start at iteration 71. Use the 'iteration' global variable so that the
    // output will print the correct value.
    for (iteration = 0; iteration < 71; iteration++) {
        iterateAllGuards(guardPositionList)
    }

    while (iteration <= EASTER_EGG_COUNT) {
        printGrid(guardPositionList)

        for (let j = 0; j < 101; j++) {
            iterateAllGuards(guardPositionList)
        }
        await new Promise(r => setTimeout(r, 20));
        iteration += 101
    }
}

/**
 * Prints the output at iteration `EASTER_EGG_COUNT`, which contains a Christmas
 * tree in the grid.
 */
function solve(input) {
    const guardPositionList = parse(input)
    for (iteration = 0; iteration < EASTER_EGG_COUNT; iteration++) {
        iterateAllGuards(guardPositionList)
    }
    printGrid(guardPositionList)

    console.log()
    console.log("The easter egg appears after %d seconds.", iteration)
}


if (DEBUG) {
    void solveDebug(input)
}
else {
    solve(input)
}
