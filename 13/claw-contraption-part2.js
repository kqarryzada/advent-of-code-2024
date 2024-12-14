import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


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

        // Add the "unit conversion" error.
        contraption.xPrize = xPrizeInt + 10_000_000_000_000
        contraption.yPrize = yPrizeInt + 10_000_000_000_000
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
function findCheapestWinCost(cont) {
    // Implement Cramer's Rule to solve the system of equations.
    const denominator = cont.a_x * cont.b_y - cont.a_y * cont.b_x
    const a = (cont.xPrize * cont.b_y - cont.yPrize * cont.b_x) / denominator
    const b = (cont.a_x * cont.yPrize - cont.a_y * cont.xPrize) / denominator

    const aIsInt = a === Math.floor(a)
    const bIsInt = b === Math.floor(b)

    // Ensure these values satisfies the other equations.
    if (aIsInt && bIsInt
            && cont.a_x * a + cont.b_x * b === cont.xPrize
            && cont.a_y * a + cont.b_y * b === cont.yPrize) {
        return (3 * a) + b
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
