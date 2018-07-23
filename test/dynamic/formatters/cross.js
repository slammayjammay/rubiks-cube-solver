import chalk from 'chalk';

class CrossFormatter {
	/**
	 * Expects a cross solver for access to its methods.
	 */
	constructor(crossSolver) {
		this.solver = crossSolver;
		this.phase = 'cross';
	}

	logPartition({ cubies, caseNumber, moves = [] }, color = 'green') {
		let colors = cubies.edge.colors();
		console.log(chalk[color]('Colors:'), colors);

		console.log(chalk[color]('Case Number:'), caseNumber);
		console.log(chalk[color]('Moves:'), moves.join(' '));
		console.log();
	}
}

export { CrossFormatter };
