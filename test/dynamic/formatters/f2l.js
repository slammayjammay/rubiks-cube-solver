import chalk from 'chalk';

class F2LFormatter {
	/**
	 * Expects a cross solver for access to its methods.
	 */
	constructor(f2lSolver) {
		this.solver = f2lSolver;
		this.phase = 'f2l';
	}

	logPartition({ cubies, caseNumber, moves = [] }, color = 'green') {
		let colors = cubies.edge.colors();
		console.log(chalk[color]('Colors:'), colors);

		console.log(chalk[color]('Case Number:'), caseNumber);
		console.log(chalk[color]('Moves:'), moves.join(' '));
		console.log();
	}
}

export { F2LFormatter };
