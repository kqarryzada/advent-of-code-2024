import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


const DEBUG = false

let NUM_ROWS = 0
let NUM_COLS = 0
let matrix = []
let directionList = []


const Direction = {
    up: 'Up',
    down: 'Down',
    left: 'Left',
    right: 'Right'
}

class Coordinate {
    row = 0
    col = 0
    value = "."

    constructor(row, col) {
        this.row = row
        this.col = col
    }

    isBox() {
        return this.value === "O"
    }

    setBox() {
        this.value = "O"
    }

    isWall() {
        return this.value === "#"
    }

    isEmpty() {
        return this.value === "."
    }

    setEmpty() {
        this.value = "."
    }

    /**
     * Returns a string representation of this coordinate.
     */
    toString() {
        return `(${this.row}, ${this.col})`
    }
}



function parse(input) {
    const setupMatrix = []
    let initPosition = new Coordinate(0, 0)

    const fileLines = input.split('\n')
    let i = 0
    for (; i < fileLines.length; i++) {
        const line = fileLines[i]
        if (line.length === 0) {
            break
        }

        const row = []
        for (let j = 0; j < line.length; j++) {
            const char = line[j]

            const coord = new Coordinate(i, j)
            switch (char) {
                case '#':
                case 'O':
                    coord.value = char
                    break
                case '@':
                    initPosition = new Coordinate(i, j)
                    break
                case '.':
                    // Empty space.
                    break
                default:
                    throw new Error("Invalid character found: " + char)
            }

            row.push(coord)
        }

        setupMatrix.push(row)
    }

    // Parse the direction part of the input file.
    const setupDirections = []
    for (i =  i + 1; i < fileLines.length; i++) {
        const line = fileLines[i]
        for (const char of line) {
            let direction = Direction.up
            switch (char) {
                case '^':
                    direction = Direction.up
                    break
                case 'v':
                    direction = Direction.down
                    break
                case '<':
                    direction = Direction.left
                    break
                case '>':
                    direction = Direction.right
                    break
                default:
                    throw new Error("Invalid character found: " + char)
            }

            setupDirections.push(direction)
        }
    }

    directionList = setupDirections
    matrix = setupMatrix
    NUM_ROWS = matrix.length
    NUM_COLS = matrix[0].length

    return initPosition
}

function moveVertical(position, direction) {
    const neighborRow = (direction === Direction.up) ? position.row - 1 : position.row + 1
    if (matrix[neighborRow][position.col].isEmpty()) {
        return new Coordinate(neighborRow, position.col)
    }

    let rowPointer = neighborRow
    while (rowPointer > 0) {
        if (matrix[rowPointer][position.col].isWall()) {
            // This is a list of boxes stacked against a wall.
            break
        }
        else if (matrix[rowPointer][position.col].isEmpty()) {
            // This is an empty space. The boxes can be pushed down.
            matrix[rowPointer][position.col].setBox()
            matrix[neighborRow][position.col].setEmpty()
            return new Coordinate(neighborRow, position.col)
        }

        rowPointer += (direction === Direction.up) ? -1 : 1
    }

    return position
}

function moveHorizontal(position, direction) {
    const neighborCol = (direction === Direction.left) ? position.col - 1 : position.col + 1
    if (matrix[position.row][neighborCol].isEmpty()) {
        return new Coordinate(position.row, neighborCol)
    }

    let colPointer = neighborCol
    while (colPointer > 0) {
        if (matrix[position.row][colPointer].isWall()) {
            // This is a list of boxes stacked against a wall.
            break
        }
        else if (matrix[position.row][colPointer].isEmpty()) {
            // This is an empty space. The boxes can be pushed down.
            matrix[position.row][colPointer].setBox()
            matrix[position.row][neighborCol].setEmpty()
            return new Coordinate(position.row, neighborCol)
        }

        colPointer += (direction === Direction.left) ? -1 : 1
    }

    return position
}

function move(direction, position) {
    let newPosition

    switch (direction) {
        case Direction.up:
        case Direction.down:
            newPosition = moveVertical(position, direction)
            break
        case Direction.left:
        case Direction.right:
            newPosition = moveHorizontal(position, direction)
            break
    }

    return newPosition
}

function printMatrix(position) {
    for (let i = 0; i < NUM_ROWS; i++) {
        let row = ""
        for (let j = 0; j < NUM_COLS; j++) {
            if (i === position.row && j === position.col) {
                row += "@"
            }
            else {
                row += matrix[i][j].value
            }
        }
        console.log(row)
    }
    console.log()
}

function solve(input) {
    let position = parse(input)
    for (const direction of directionList) {
        position = move(direction, position)
    }

    if (DEBUG) {
        printMatrix(position)
    }

    // Calculate the GPS coordinates. Start at row one since the top row will
    // always have walls.
    let gps = 0
    for (let i = 1; i < NUM_ROWS; i++) {
        for (let j = 0; j < NUM_COLS; j++) {
            if (matrix[i][j].isBox()) {
                gps += (100 * i) + j
            }
        }
    }

    console.log("The sum of the GPS coordinates is %d.", gps)
}

solve(input)
