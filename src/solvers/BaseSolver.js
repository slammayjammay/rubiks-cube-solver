import { RubiksCube } from '../models/RubiksCube';
import { transformNotations } from '../utils/';

class BaseSolver {
	/**
	 * Solves the first step following the Fridrich Method: the cross. Solves the
	 * cross on the UP face by default.
	 *
	 * @param {string|RubiksCube} rubiksCube - This can either be a 54-character
	 * long string representing the cube state (in this case it will have to
	 * "build" another rubik's Cube), or an already built RubiksCube object.
	 */
	constructor(rubiksCube, options = {}) {
		this.cube = typeof rubiksCube === 'string' ? new RubiksCube(rubiksCube) : rubiksCube;
		this.options = options;

		this.partition = {};
		this.partitions = [];
		this.totalMoves = [];
		this._afterEachCallbacks = [];
	}

	/**
	 * @param {string|array} notation - A string of move(s) to execute and store.
	 * @param {object} options - The options to pass to RubiksCube#move.
	 */
	move(notations, options) {
		if (typeof notations === 'string') {
			notations = notations.split(' ');
		}

		this.cube.move(notations, options);

		// this step is also in RubiksCube#move, but it is important we do it here
		// as well. The notations need to be saved to the partition correctly.
		notations = transformNotations(notations, options);

		for (let notation of notations) {
			this.totalMoves.push(notation);
		}
	}

	afterEach(callback) {
		this._afterEachCallbacks.push(callback);
	}

	/**
	 * @param {...*} callbackArgs - The arguments to call the function with.
	 */
	_triggerAfterEach(...callbackArgs) {
		this._afterEachCallbacks.forEach(fn => fn(...callbackArgs));
	}

	/**
	 * Solves the edge and/or corner and returns information about the state
	 * about them right before they are solved. It's important to construct the
	 * object in steps for debugging, so that we can still have access to e.g.
	 * the case number if the solve method fails.
	 */
	_solve(cubies = {}) {

		this.partition = {};
		this.partition.cubies = cubies;

		let { corner, edge } = cubies;

		this.partition.caseNumber = this._getCaseNumber({ corner, edge });

		this._solveCase(this.partition.caseNumber, { corner, edge });
		this.partition.moves = this.totalMoves;

		this.totalMoves = [];

		if (!this._overrideAfterEach) {
			this._triggerAfterEach(this.partition, this.phase);
		}

		return this.partition;
	}

	_solveCase(caseNumber, cubies = {}) {
		let { corner, edge } = cubies;
		this[`_solveCase${caseNumber}`]({ corner, edge });
	}
}

export { BaseSolver };
