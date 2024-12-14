import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


const MAX_BUTTON_PRESSES = 100


class Contraption {
    // Represents the value that the x and y coordinates will be increased when
    // the 'a' button is pressed.
    a_x = 0
    a_y = 0

    // Represents the value that the x and y coordinates will be increased when
    // the 'b' button is pressed.
    b_x = 0
    b_y = 0

    xPrize = 0
    yPrize = 0
}

function parse(input) {
    const contraptions = []

    const fileLines = input.split('\n')
    let i = 2
    while (i < fileLines.length) {
        const buttonA = fileLines[i - 2]
        const buttonB = fileLines[i - 1]
        const prize = fileLines[i]

        // Fetch the substrings that contains strings of the form "X+11".
        const aXIncrement = /X\+\d+/.exec(buttonA).toString()
        const aXIncrementInt = parseInt(aXIncrement.split("+")[1])
        const aYIncrement = /Y\+\d+/.exec(buttonA).toString()
        const aYIncrementInt = parseInt(aYIncrement.split("+")[1])
        const bXIncrement = /X\+\d+/.exec(buttonB).toString()
        const bXIncrementInt = parseInt(bXIncrement.split("+")[1])
        const bYIncrement = /Y\+\d+/.exec(buttonB).toString()
        const bYIncrementInt = parseInt(bYIncrement.split("+")[1])

        const xPrize = /X=\d+/.exec(prize).toString()
        const xPrizeInt = parseInt(xPrize.split("=")[1])
        const yPrize = /Y=\d+/.exec(prize).toString()
        const yPrizeInt = parseInt(yPrize.split("=")[1])

        const contraption = new Contraption()
        contraption.a_x = aXIncrementInt
        contraption.a_y = aYIncrementInt
        contraption.b_x = bXIncrementInt
        contraption.b_y = bYIncrementInt
        contraption.xPrize = xPrizeInt
        contraption.yPrize = yPrizeInt
        contraptions.push(contraption)

        i += 4
    }

    return contraptions
}

/**
 * Determines the winning number of button presses and computes the token cost
 * required to reach the winning combination. If there is not a valid integer
 * number of button presses that will result in a win, then 0 is returned.
 */
function findCheapestWinCost(c) {
    // Each contraption is a system of equations. The first example is:
    //
    // 94a + 22b = 8400
    // 34a + 67b = 5400
    //
    // Add these equations to each other to create a single equation that is
    // associated with both solutions. Since this is a linear equation, there
    // can only be one solution, so there is no need to find a minimum.
    for (let b = 0; b < MAX_BUTTON_PRESSES; b++) {
        const newACoefficient = c.a_x + c.a_y
        const newBCoefficient = c.b_x + c.b_y
        const prize = c.xPrize + c.yPrize

        const a = (prize - (newBCoefficient * b)) / newACoefficient

        // Ensure the number divides evenly and is not out of bounds.
        if (a > MAX_BUTTON_PRESSES || a !== Math.floor(a)) {
            continue
        }

        // Ensure this value of 'x' satisfies the other equations.
        if (c.a_y * a + c.b_y * b === c.yPrize
                && c.a_x * a + c.b_x * b === c.xPrize) {
            return (3 * a) + b
        }
    }

    return 0
}

function solve(input) {
    const contraptions = parse(input)

    let prizeSum = 0
    for (const c of contraptions) {
        prizeSum += findCheapestWinCost(c)
    }

    console.log("The fewest tokens required to win as many prizes as possible is %d.", prizeSum)
}

solve(input)
