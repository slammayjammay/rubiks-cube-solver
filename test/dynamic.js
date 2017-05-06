const minimist = require('minimist');
const chalk = require('chalk');
const Solver = require('../src/').Solver;
const RubiksCube = require('../src/models/RubiksCube');
const CrossFormatter = require('./formatters/cross');
const F2LFormatter = require('./formatters/f2l');
const OLLFormatter = require('./formatters/oll');
const PLLFormatter = require('./formatters/pll');

const argv = minimist(process.argv.slice(2));
const NUM_RUNS = argv['num-runs'] || 1;
const SHOW_OUTPUT = argv['show-output'];
const VERBOSE = argv['verbose'];

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
	let pllFormatter = new PLLFormatter(solver.pllSolver);

	// limits the number of moves printed per line
	const logMoves = (moves) => {
		const movesPerLine = 15;
		let counter = 0;
		for (let move of moves.split(' ')) {
			if (counter === movesPerLine) {
				console.log();
				counter = 0;
			}

			process.stdout.write(chalk.green(move));
			process.stdout.write(' ');
			counter += 1;
		}
	};

	// logs all recorded partitions in the solver and formats nicely
	const logSolveData = () => {
		console.log();

		console.log(chalk.bold('Scramble moves: '));
		// console.log(chalk.green(scrambleMoves));
		logMoves(scrambleMoves);
		console.log();

		if (VERBOSE) {
			Object.keys(solver.progress).forEach(phase => {
				if (phase !== currentPhase && solver.progress[phase].length > 0) {
					console.log(chalk.bold(`====== Solving phase ${phase} ======`));
					currentPhase = phase;
				}

				let partitions = solver.progress[phase];
				let formatter = eval(`${currentPhase}Formatter`);

				partitions.forEach(partition => formatter.logPartition(partition, 'green'));
			});
		}

		let solveMoves = solver.getMoves();
		console.log(chalk.bold(`Solve moves (${solveMoves.split(' ').length}): `));
		logMoves(solveMoves);
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

	// pll partitions
	solver.afterEach('pll', (partition, phase) => {
		if (!solver.isPLLSolved()) {
			logSolveData();
			console.log(chalk.bold.red(`====== Failed on phase "pll" ======`));
			pllFormatter.logPartition(partition, 'red');
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
		logSolveData();
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
