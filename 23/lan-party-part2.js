import {readFileSync} from 'node:fs'

const fileName = "./input.txt"
const input = readFileSync(fileName, 'utf-8').trimEnd()

const map = new Map()

/**
 * Represents an entry in a priority queue.
 *
 * An Entry records the history of a breadth-first search for a network mesh. A
 * mesh is a set of computers that are all connected to each other.
 */
class Entry {
    history = []
    depth = 0

    constructor(initialValue, depth) {
        this.name = initialValue
        this.history = [initialValue]
        this.depth = depth
    }

    add(value) {
        this.history.push(value)
    }

    toString() {
        return this.name + "," + this.depth
    }

    /**
     * Determines whether the input node is connected to all computers that are
     * in this Entry's history.
     */
    isInMesh(candidateNode) {
        let inMesh = true
        const connections = map.get(candidateNode) ?? []
        for (const node of this.history) {
            if (!connections.includes(node)) {
                inMesh = false
                break
            }
        }

        return inMesh
    }
}

function parse(input) {
    const fileLines = input.split('\n')
    fileLines.forEach(line => {
        const values = line.split('-')
        const computer1 = values[0]
        const computer2 = values[1]

        // Store the data corresponding to the key for computer 1.
        const currValues1 = map.get(computer1) ?? []
        currValues1.push(computer2)
        map.set(computer1, currValues1)

        // Store the key corresponding to the key for computer 2. This ensures
        // that the map behaves bi-directionally. For example, if we have an
        // association "tr-de", it should be possible to call 'map.get("de")'
        // and have "tr" returned in the list.
        const currValues2 = map.get(computer2) ?? []
        currValues2.push(computer1)
        map.set(computer2, currValues2)
    })
}

/**
 * Finds the biggest mesh associated with the provided computer ID.
 *
 * @param initComputer  A computer ID, e.g., "tr".
 * @returns {*[]}       An array of all the computers that are part of the mesh.
 */
function findBiggestLoop(initComputer) {
    let biggestMesh = []
    const priorityQueue = []
    const visited = new Set()

    // Initialize the priority queue with the initial computer's immediate
    // neighbors.
    for (const immediateNeighbor of map.get(initComputer) ?? []) {
        const neighborEntry = new Entry(immediateNeighbor, 1)
        neighborEntry.add(initComputer)
        priorityQueue.push(neighborEntry)
    }

    while (priorityQueue.length > 0) {
        const entry = priorityQueue.shift()
        const currentDepth = entry.depth

        if (visited.has(entry.toString())) {
            // This entry has already been analyzed at this depth.
            continue
        }
        visited.add(entry.toString())

        const neighbors = map.get(entry.name)
        for (const neighbor of neighbors) {
            if (neighbor === initComputer) {
                if (currentDepth > biggestMesh.length - 1) {
                    biggestMesh = entry.history
                }
            }
            else if (entry.history.includes(neighbor)) {
                // This field has already been visited in this path. Do nothing.
            }
            else if (entry.isInMesh(neighbor)) {
                const newEntry = new Entry(neighbor, entry.depth + 1)
                newEntry.history = entry.history.slice()
                newEntry.add(neighbor)
                priorityQueue.push(newEntry)
            }
        }

        // Sort the array so that it acts as a true priority queue.
        priorityQueue.sort((e1, e2) => e1.depth - e2.depth)
    }

    return biggestMesh
}

function solve(input) {
    parse(input)

    // Find the biggest mesh associated with each key in the map, and record the
    // largest one.
    let biggestMesh = []
    for (const key of map.keys()) {
        const loop = findBiggestLoop(key)
        if (loop.length > biggestMesh.length) {
            biggestMesh = loop
        }
    }

    let password = ""
    biggestMesh.sort().forEach(c => password += c + ",")
    password = password.slice(0, -1)

    console.log("The password to the LAN party is a connection of %d computers:", biggestMesh.length)
    console.log(password)
}

solve(input)
