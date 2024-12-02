.SILENT: lint part1 part2

default: part2

# Runs es-lint to evaluate linting errors.
lint:
	npm run lint .

run: part2

# Runs the solution for part 1.
part1: lint
	node *part1.js

# Runs the solution for part 2.
part2: lint
	node *part2.js
