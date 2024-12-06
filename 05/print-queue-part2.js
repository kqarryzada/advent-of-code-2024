import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


let ruleMap = new Map()
let updateList = []


/**
 * This function takes a map (whose values contain integer arrays) and sorts the
 * integers within each array in ascending order.
 */
function sortMap(map) {
    for (const [key, value] of map) {
        const newValue = value.sort((a, b) => a - b)
        map.set(key, newValue)
    }
}

/**
 * Parses the input file, which contains a set of numerical relationships
 * (referred to as the page ordering rules), as well as the list of updates that
 * should be analyzed.
 */
function parse(input) {
    const map = new Map()

    const fileLines = input.split('\n')
    let i = 0
    for (; i < fileLines.length; i++) {
        const line = fileLines[i]

        if (line.trim() === "") {
            // The page ordering rules are finished.
            i++
            break
        }

        const [stringKey, stringValue] = line.split("|")
        const key = parseInt(stringKey)
        const value = parseInt(stringValue)

        const currentValue = map.get(key)
        const newValue = (currentValue === undefined) ? [] : currentValue
        newValue.push(value)
        map.set(key, newValue)
    }

    const updates = []
    for (; i < fileLines.length; i++) {
        const line = fileLines[i]
        const updateLine = []

        for (const updateValue of line.split(",")) {
            updateLine.push(parseInt(updateValue))
        }
        updates.push(updateLine)
    }

    // Sort the map to make individual lookups faster.
    sortMap(map)

    ruleMap = map
    updateList = updates
}

/**
 * Evaluates whether the two provided numbers would violate a rule in the
 * `ruleMap`.
 *
 * @param ruleMap   The rule map.
 * @param first     The first number.
 * @param second    The second number, which comes after the first in an update.
 * @returns {boolean}   Whether the provided order of the two numbers violates a
 *                      rule.
 */
function violatesRule(ruleMap, first, second) {
    let secondNumRules = ruleMap.get(second)
    if (secondNumRules === undefined) {
        return false
    }

    // Check if the second number has a rule that states it must be present
    // before the first. This could be accomplished with
    // `secondNumRules.indexOf(first) !== -1`, but the following approach is
    // more optimal because the list of numbers will be sorted.
    for (const value of secondNumRules) {
        if (value === first) {
            return true
        }
        if (value > first) {
            // The desired number is not in the list. Therefore, this ordering
            // is not a violation of a rule.
            return false
        }
    }

    return false
}

/**
 * Attempts to fix an update given a known rule violation. Since the bad number
 * should not be placed before the violated number, this function will modify
 * the update rule so that the bad number is placed directly after the violated
 * one. This is not guaranteed to make the update valid, but the update will be
 * one step closer to being correct.
 * <br><br>
 *
 * This function modifies the original update array and returns it, since this
 * is slightly faster than creating a copy every time.
 *
 * @param update            The invalid update.
 * @param badNumber         The number in the incorrect position.
 * @param violatedNumber    The number that has a rule stating that `badNumber`
 *                          must come after it.
 *
 * @returns {[number]}      A new update, where the `badNumber` has been placed
 *                          after the `violatedNumber`.
 */
function attemptFixUpdate(update, badNumber, violatedNumber) {
    // Removing and inserting elements from arrays is slow. Instead, shift the
    // values around so that 'badNumber' is placed after 'violatedNumber'.
    let i = 0;
    for (; i < update.length; i++) {
        if (update[i] === badNumber) {
            break
        }
    }

    i++
    for (; i < update.length; i++) {
       update[i - 1] = update[i]

        if (update[i] === violatedNumber) {
            update[i] = badNumber
            break
        }
    }

    return update
}

/**
 * Determines whether the provided update is invalid. If the update is invalid,
 * this function will return the two numbers causing the rule violation.
 */
function isInvalidUpdate(update) {
    let number = 0
    let otherNumber = 0

    for (let i = 0; i < update.length; i++) {
        number = update[i]

        for (let j = i + 1; j < update.length; j++) {
            otherNumber = update[j]
            if (violatesRule(ruleMap, number, otherNumber)) {
                return [true, number, otherNumber]
            }
        }
    }

    return [false, -1, -1]
}

function solve(input) {
    parse(input)

    // Iterate through the updates and re-queue the invalid ones. Do not use
    // values from the working updates.
    let invalidUpdates = new Set()
    for (const update of updateList) {
        const [isInvalid, first, second] = isInvalidUpdate(update)
        if (isInvalid) {
            const newUpdate = attemptFixUpdate(update, first, second)
            invalidUpdates.add(newUpdate)
        }
    }

    // Iterate through the initially-invalid updates. Attempt fixes and re-queue
    // all updates until they are all fixed.
    let sum = 0
    while (invalidUpdates.size !== 0) {
        for (const update of invalidUpdates) {
            invalidUpdates.delete(update)

            const [isInvalid, first, second] = isInvalidUpdate(update)
            if (isInvalid) {
                const newUpdate = attemptFixUpdate(update, first, second)
                invalidUpdates.add(newUpdate)
            }
            else {
                // Now that the update has been fixed, extract the middle value.
                sum += update[(update.length - 1) / 2]
            }
        }
    }

    console.log("The sum of all values from fixed updates is %d.", sum)
}

solve(input)
