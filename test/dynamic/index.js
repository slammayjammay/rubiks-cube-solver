import minimist from 'minimist';
import chalk from 'chalk';
import { RubiksCube, Solver, algorithmShortener } from '../../src/';
import { CrossFormatter, F2LFormatter, OLLFormatter, PLLFormatter } from './formatters';

const argv = minimist(process.argv.slice(2));
const NUM_RUNS = argv['num-runs'] || 1;
const SHOW_OUTPUT = argv['show-output'];
const VERBOSE = argv['verbose'];
const TEST_OPTIMIZED = argv['optimized'];

const OPTIMIZATION_ERR_MESSAGE = 'Optimization failed.';

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
		console.log();
	};

	// logs all recorded partitions in the solver and formats nicely
	const logSolveData = (force) => {
		console.log();

		console.log(chalk.bold('Scramble moves: '));
		logMoves(scrambleMoves);
		console.log();

		if (VERBOSE || force) {
			Object.keys(solver.progress).forEach(phase => {
				if (phase !== solver.currentPhase && solver.progress[phase].length > 0) {
					console.log(chalk.bold(`====== Solving phase ${phase} ======`));
				}

				let partitions = solver.progress[phase];
				let formatter = eval(`${phase}Formatter`);
				partitions.forEach(partition => formatter.logPartition(partition, 'green'));
			});
		}

		let solveMoves = solver.getMoves();
		let numMoves = solveMoves.split(' ').length;
		console.log(chalk.bold(`Solve moves (${numMoves}): `));
		logMoves(solveMoves);
		console.log();
	};

	// cross partitions
	solver.afterEach('cross', (partition, phase) => {
		let edge = partition.cubies.edge;
		if (!solver.isCrossEdgeSolved(edge)) {
			logSolveData();
			console.log(chalk.bold.red('====== Failed on phase "cross" ======'));
			crossFormatter.logPartition(partition, 'red');
			process.exit();
		}
	});

	// f2l partitions
	solver.afterEach('f2l', (partition, phase) => {
		let { corner, edge } = partition.cubies;
		if (!solver.isF2LPairSolved({ corner, edge })) {
			logSolveData();
			console.log(chalk.bold.red('====== Failed on phase "f2l" ======'));
			f2lFormatter.logPartition(partition, 'red');
			process.exit();
		}
	});

	// oll partitions
	solver.afterEach('oll', (partition, phase) => {
		if (!solver.isOLLSolved()) {
			logSolveData();
			console.log(chalk.bold.red('====== Failed on phase "oll" ======'));
			ollFormatter.logPartition(partition, 'red');
			process.exit();
		}
	});

	// pll partitions
	solver.afterEach('pll', (partition, phase) => {
		if (!solver.isPLLSolved()) {
			logSolveData();
			console.log(chalk.bold.red('====== Failed on phase "pll" ======'));
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

		if (TEST_OPTIMIZED) {
			let optimizedMoves = algorithmShortener(solver.getMoves());
			cube.move(scrambleMoves);
			cube.move(optimizedMoves);

			let numMoves = optimizedMoves.split(' ').length;

			if (cube.isSolved()) {
				if (SHOW_OUTPUT) {
					console.log(chalk.bold(`Optimized (${numMoves}):`));
					logMoves(optimizedMoves);
					console.log();
				}
			} else {
				throw new Error(OPTIMIZATION_ERR_MESSAGE);
			}
		}

		successes += 1;
	} catch (e) {
		logSolveData(true);

		if (solver.currentSolver) {
			console.log(chalk.bold.red(`====== Failed on phase ${solver.currentPhase} ======`));

			// get the right formatter for the current phase's partition...
			let formatter = eval(`${solver.currentPhase}Formatter`);
			formatter.logPartition(solver.currentSolver.partition, 'red');
		}

		if (e.message === OPTIMIZATION_ERR_MESSAGE) {
			let optimizedMoves = algorithmShortener(solver.getMoves());
			console.log(chalk.bold.red(`Failed optimizing (${numMoves}):`));
			logMoves(optimizedMoves);
			console.log();
		}

		throw e;
	}

	if (i === NUM_RUNS - 1) {
		console.log();
	}
}
