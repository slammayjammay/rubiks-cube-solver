import chalk from 'chalk';
import { transformNotations } from '../../../src/utils/';

class OLLFormatter {
	/**
	 * Expects a cross solver for access to its methods.
	 */
	constructor(ollSolver) {
		this.solver = ollSolver;
		this.phase = 'oll';
	}

	logPartition({ caseNumber, moves = [] }, color = 'green') {
		let ollString = caseNumber; // TODO: ick -- caseNumber is not a good name

		console.log(chalk[color]('OLL string:'), ollString);

		let pattern = this.solver.findPattern(ollString);
		console.log(chalk[color]('Detected pattern:'), pattern);

		console.log(chalk[color]('Moves:'), moves.join(' '));

		let frontFace = this.solver._getFrontFace(ollString, pattern);

		let orientedMoves = transformNotations(moves, {
			orientation: {
				up: 'down',
				front: frontFace
			}
		});
		console.log(chalk[color]('Algorithm:'), orientedMoves.join(' '));
		console.log(chalk[color]('Where front face is '), `"${frontFace}"`);
		console.log();
	}
}

export { OLLFormatter };
