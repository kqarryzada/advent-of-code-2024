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
        let col = 0
        for (let j = 0; j < line.length; j++) {
            const char = line[j]

            const coord1 = new Coordinate(i, col)
            const coord2 = new Coordinate(i, col + 1)
            switch (char) {
                case '#':
                    coord1.value = char
                    coord2.value = char
                    row.push(coord1)
                    row.push(coord2)
                    break
                case 'O':
                    coord1.value = "["
                    coord2.value = "]"
                    row.push(coord1)
                    row.push(coord2)
                    break
                case '@':
                    initPosition = coord1
                    row.push(coord1)
                    row.push(coord2)
                    break
                case '.':
                    row.push(coord1)
                    row.push(coord2)
                    break
                default:
                    throw new Error("Invalid character found: " + char)
            }

            col += 2
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

/**
 * Moves the lanternfish up one unit. If there is a stack of boxes above, this
 * function will recursively move all touching boxes upwards to make room for
 * the fish. If any of these boxes are touching a wall, the boxes will not be
 * moved.
 *
 * @param coordsToMove  The set of coordinates that should be moved. The first
 *                      invocation of this function should be an array of a
 *                      single coordinate.
 * @returns {boolean}   `true` if the space above is empty or the boxes were
 *                      successfully shifted upwards. If the path is blocked,
 *                      `false` is returned.
 */
function moveUp(coordsToMove) {
    const nextCoordsToMove = []
    for (const coord of coordsToMove) {
        const coordAbove = matrix[coord.row - 1][coord.col]
        if (coordAbove.isEmpty()) {
            continue
        }
        if (coordAbove.isWall()) {
            return false
        }

        const boxNeighbor = (coordAbove.value === "[")
            ? matrix[coord.row - 1][coord.col + 1] : matrix[coord.row - 1][coord.col - 1]
        nextCoordsToMove.push(coordAbove)
        nextCoordsToMove.push(boxNeighbor)
    }

    if (nextCoordsToMove.length > 0) {
        const success = moveUp(nextCoordsToMove)
        if (success === false) {
            return false
        }
    }

    // Shift the values. This must be done in two separate loops since the list
    // of coordinates is not guaranteed to be unique.
    for (const coord of coordsToMove) {
        matrix[coord.row - 1][coord.col].value = coord.value
    }
    for (const coord of coordsToMove) {
        matrix[coord.row][coord.col].setEmpty()
    }

    return true
}

/**
 * Alternate version of {@link #moveUp} that instead shifts the lanternfish (and
 * any boxes) downwards.
 */
function moveDown(coordsToMove) {
    const nextCoordsToMove = []
    for (const coord of coordsToMove) {
        const coordAbove = matrix[coord.row + 1][coord.col]
        if (coordAbove.isEmpty()) {
            continue
        }
        if (coordAbove.isWall()) {
            return false
        }

        const boxNeighbor = (coordAbove.value === "[")
            ? matrix[coord.row + 1][coord.col + 1] : matrix[coord.row + 1][coord.col - 1]
        nextCoordsToMove.push(coordAbove)
        nextCoordsToMove.push(boxNeighbor)
    }

    if (nextCoordsToMove.length > 0) {
        const success = moveDown(nextCoordsToMove)
        if (success === false) {
            return false
        }
    }

    // Shift the values. This must be done in two separate loops since the list
    // of coordinates is not guaranteed to be unique.
    for (const coord of coordsToMove) {
        matrix[coord.row + 1][coord.col].value = coord.value
    }
    for (const coord of coordsToMove) {
        matrix[coord.row][coord.col].setEmpty()
    }

    return true
}

function moveLeft(position) {
    const westCol = position.col - 1
    if (matrix[position.row][westCol].isEmpty()) {
        return new Coordinate(position.row, westCol)
    }

    let colPointer = westCol
    while (colPointer > 0) {
        if (matrix[position.row][colPointer].isWall()) {
            // The boxes are stacked against a wall.
            break
        }
        else if (matrix[position.row][colPointer].isEmpty()) {
            // This is an empty space. The boxes can be pushed down.
            matrix[position.row][westCol].setEmpty()

            for (; colPointer < westCol; colPointer += 2) {
                matrix[position.row][colPointer].value = "["
                matrix[position.row][colPointer + 1].value = "]"
            }

            return new Coordinate(position.row, westCol)
        }

        colPointer--
    }

    return position
}

function moveRight(position) {
    const eastCol = position.col + 1
    if (matrix[position.row][eastCol].isEmpty()) {
        return new Coordinate(position.row, eastCol)
    }

    let colPointer = eastCol
    while (colPointer < NUM_COLS) {
        if (matrix[position.row][colPointer].isWall()) {
            // The boxes are stacked against a wall.
            break
        }
        else if (matrix[position.row][colPointer].isEmpty()) {
            // This is an empty space. The boxes can be pushed down.
            matrix[position.row][eastCol].setEmpty()

            for (; colPointer > eastCol; colPointer -= 2) {
                matrix[position.row][colPointer].value = "]"
                matrix[position.row][colPointer - 1].value = "["
            }

            return new Coordinate(position.row, eastCol)
        }

        colPointer++
    }

    return position
}

function move(direction, position) {
    let newPosition
    let success = false

    switch (direction) {
        case Direction.up:
            success = moveUp([position])
            newPosition = (success) ? new Coordinate(position.row - 1, position.col) : position
            break
        case Direction.down:
            success = moveDown([position])
            newPosition = (success) ? new Coordinate(position.row + 1, position.col) : position
            break
        case Direction.left:
            newPosition = moveLeft(position)
            break
        case Direction.right:
            newPosition = moveRight(position)
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
            if (matrix[i][j].value === "[") {
                gps += (100 * i) + j
            }
        }
    }

    console.log("The sum of the GPS coordinates is %d.", gps)
}

solve(input)
