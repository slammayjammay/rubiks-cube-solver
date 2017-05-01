const minimist = require('minimist');
const chalk = require('chalk');
const Solver = require('../').Solver;
const RubiksCube = require('../models/RubiksCube');
const CrossFormatter = require('../formatters/cross');
const F2LFormatter = require('../formatters/f2l');
const OLLFormatter = require('../formatters/oll');

const argv = minimist(process.argv.slice(2));
const NUM_RUNS = argv['num-runs'] || 1;
const SHOW_OUTPUT = argv['show-output'];

let currentPhase;
let successes = 0;

if (!SHOW_OUTPUT) {
	console.log(chalk.green('Successful solves:'));
}

for (let i = 0; i < NUM_RUNS; i++) {
	// start with a solved cube
	let cube = RubiksCube.Solved();
	let solver = new Solver(cube);

	// scramble the cube and record the moves
	let scrambleMoves = RubiksCube.getRandomMoves(25);
	cube.move(scrambleMoves);

	// format output for each phase
	let crossFormatter = new CrossFormatter(solver.crossSolver);
	let f2lFormatter = new F2LFormatter(solver.f2lSolver);
	let ollFormatter = new OLLFormatter(solver.ollSolver);

	// logs all recorded partitions in the solver and formats nicely
	const logSolveData = () => {
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
			let formatter = eval(`${currentPhase}Formatter`);

			partitions.forEach(partition => formatter.logPartition(partition, 'green'));
		});
	};

	// cross partitions
	solver.afterEach('cross', (partition, phase) => {
		let edge = partition.cubies.edge;
		if (!solver.isCrossEdgeSolved(edge)) {
			logSolveData();
			console.log(chalk.bold.red(`====== Failed on phase "cross" ======`));
			crossFormatter.logPartition(partition, 'red');
			process.exit();
		}
	});

	// f2l partitions
	solver.afterEach('f2l', (partition, phase) => {
		let { corner, edge } = partition.cubies;
		if (!solver.isF2LPairSolved({ corner, edge })) {
			logSolveData();
			console.log(chalk.bold.red(`====== Failed on phase "f2l" ======`));
			f2lFormatter.logPartition(partition, 'red');
			process.exit();
		}
	});

	// oll partitions
	solver.afterEach('oll', (partition, phase) => {
		if (!solver.isOLLSolved()) {
			logSolveData();
			console.log(chalk.bold.red(`====== Failed on phase "oll" ======`));
			ollFormatter.logPartition(partition, 'red');
			process.exit();
		}
	});

	try {
		solver.solve();

		if (successes >= 50) {
			successes = 0;
			console.log();
		}

		if (SHOW_OUTPUT) {
			logSolveData();
		} else {
			process.stdout.write(chalk.green('✔'));
		}

		successes += 1;
	} catch (e) {
		console.log(chalk.bold.red(`====== Failed on phase ${currentPhase} ======`));

		// umm, get the right formatter for the current phase's partition...
		let formatter = eval(`${currentPhase}Formatter`);
		formatter.logPartition(solver.currentSolver.partition, 'red');

		throw e;
	}

	if (i === NUM_RUNS - 1) {
		console.log();
	}
}

function logPartition({ caseNumber, moves = [] }, color = 'green') {
	// if (before.edge) {
	// 	let colors = before.edge.colors();
	// 	console.log(chalk[color]('Colors:'), colors);
	// }

	console.log(chalk[color]('Case Number:'), caseNumber);
	console.log(chalk[color]('Moves:'), moves.join(' '));
	console.log();
}
