const minimist = require('minimist');
const chalk = require('chalk');
const Solver = require('../').Solver;
const RubiksCube = require('../models/RubiksCube');

const argv = minimist(process.argv.slice(2));
const NUM_RUNS = argv['num-runs'] || 1;
const SHOW_OUTPUT = argv['show-output'];

let currentPhase;
let successes = 0;

if (!SHOW_OUTPUT) {
	console.log(chalk.green('Successful solves:'));
}

for (let i = 0; i < NUM_RUNS; i++) {
  // get access to the scrambled state
	let cube = RubiksCube.Solved();
	let scrambleMoves = RubiksCube.getRandomMoves(25);
	cube.move(scrambleMoves);

	const afterEach = (partition, phase) => {
		let { corner, edge } = partition.after;
		let showDebugOutput = false;

		if (phase === 'cross' && !solver.isCrossEdgeSolved(edge)) {
			showDebugOutput = true;
		} else if (phase === 'f2l' && !solver.isF2LPairSolved({ corner, edge })) {
			showDebugOutput = true;
		}

		if (showDebugOutput) {
			logSolveData(scrambleMoves, solver);

			console.log(chalk.bold.red(`====== Failed on phase ${phase} ======`));
			logPartition(solver.currentSolver.partition, 'red');

			process.exit();
		}
	};

	let solver = new Solver(cube);
	solver.afterEach(afterEach, ['cross', 'f2l']);

	try {
		solver.solve();

		if (successes >= 50) {
			successes = 0;
			console.log();
		}

		if (SHOW_OUTPUT) {
			logSolveData(scrambleMoves, solver);
		} else {
			process.stdout.write(chalk.green('✔'));
		}

		successes += 1;
	} catch (e) {
		logSolveData(scrambleMoves, solver);

		console.log(chalk.bold.red(`====== Failed on phase ${currentPhase} ======`));
		logPartition(solver.currentSolver.partition, 'red');

		throw e;
	}

	if (i === NUM_RUNS - 1) {
		console.log();
	}
}

function logPartition({ before, caseNumber, moves = [] }, color = 'green') {
	if (typeof before === 'string') {

	} else {
		let colors = before.edge.colors();
		console.log(chalk[color]('Colors:'), colors);
	}

	console.log(chalk[color]('Case Number:'), caseNumber);
	console.log(chalk[color]('Moves:'), moves.join(' '));
	console.log();
}

function logSolveData(scrambleMoves, solver) {
	console.log();

	console.log(chalk.bold('Scramble moves: '));
	console.log(chalk.green(scrambleMoves));
	console.log();

	Object.keys(solver.progress).forEach(phase => {
		if (phase !== currentPhase && solver.progress[phase].length > 0) {
			console.log(chalk.bold(`====== Solving phase ${phase} ======`));
			currentPhase = phase;
		}

		let partitions = solver.progress[phase];
		partitions.forEach(partition => logPartition(partition));
	});
}
