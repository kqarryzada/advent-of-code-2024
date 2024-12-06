import {readFileSync} from 'node:fs';

const input = readFileSync('./input.txt', 'utf-8').trimEnd();


/**
 * Parses the input file, which contains a set of numerical relationships
 * (referred to as the page ordering rules) as well as the list of updates
 * that should be analyzed.
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

    const updateList = []
    for (; i < fileLines.length; i++) {
        const line = fileLines[i]
        const updateLine = []

        for (const updateValue of line.split(",")) {
            updateLine.push(parseInt(updateValue))
        }
        updateList.push(updateLine)
    }

    return [map, updateList]
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
    // Check if a rule states that the second number must be before the first.
    let secondNumRules = ruleMap.get(second)
    if (secondNumRules === undefined) {
        return false
    }

    return secondNumRules.indexOf(first) !== -1;
}

/**
 * Computes the value of the update. If the update violates a rule in the rule
 * map, this function will return 0. Otherwise, the value of the middle number
 * will be returned.
 */
function computeUpdateValue(ruleMap, update) {
    for (let i = 0; i < update.length; i++) {
        let number = update[i]

        for (let j = i + 1; j < update.length; j++) {
            let otherNumber = update[j]
            if (violatesRule(ruleMap, number, otherNumber)) {
                return 0
            }
        }
    }

    const middleIndex = (update.length - 1) / 2
    return update[middleIndex]
}

function solve(input) {
    let [ruleMap, updateList] = parse(input)
    let sum = 0

    for (const update of updateList) {
        sum += computeUpdateValue(ruleMap, update)
    }

    console.log("The sum of all valid middle values is %d.", sum)
}

solve(input)
