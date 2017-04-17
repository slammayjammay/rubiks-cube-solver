const RubiksCube = require('../models/RubiksCube');

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

		this.phases = ['cross', 'f2l', 'oll', 'pll'];
		this._afterEachCallbacks = {};
		this.phases.forEach(phase => this._afterEachCallbacks[phase] = []);

		this.partition = {};
		this.partitions = [];
		this.totalMoves = [];
	}

  /**
   * @param {string|array} notation - A string of move(s) to execute and store.
   * @param {object} options - The options to pass to RubiksCube#move.
   */
	move(notations, options) {
		if (typeof notations === 'string') {
			notations = notations.split(' ');
		}

		// this step is also in RubiksCube#move, but it is important we do it here
		// as well. The notations need to be saved to the partition correctly.
		notations = RubiksCube.normalizeNotations(notations);
		notations = RubiksCube.transformNotations(notations, options);

		for (let notation of notations) {
			this.totalMoves.push(notation);
		}

		// hmmm, passing options into RubiksCube#move could change the notations for
		// a second time...
		this.cube.move(notations, options);
	}

  /**
   * @param {string|array} phases - The phases during which to fire the callback.
   */
	afterEach(callback, phases) {
		if (typeof callback !== 'function') {
			return;
		}

    // argument parsing
		if (typeof phases === 'string') {
			if (phases === 'all') {
				phases = this.phases.slice();
			} else if (!this.phases.includes(phases)) {
				return;
			}
		}

		phases.forEach(phase => this._afterEachCallbacks[phase].push(callback));
    // this._afterEachCallbacks.push(callback)
	}

	triggerAfterEach(phase, callbackArgs) {
		this._afterEachCallbacks[phase].forEach(fn => fn(...callbackArgs));


    // this._afterEachCallbacks.forEach(callback => callback(partition, phase));

    // Object.keys(this._afterEachCallbacks).forEach(thing => {
    //   let phaseCallbacks = this._afterEachCallbacks[thing]
    //   phaseCallbacks.forEach(callback => callback(partition, phase))
    // })
	}

  /**
   * Solves the edge and/or corner and returns information about the state
   * about them right before they are solved. It's important to construct the
   * object in steps for debugging, so that we can still have access to e.g.
   * the case number if the solve method fails.
   */
	_solve(cubies = {}) {
		let { corner, edge } = cubies;

		this.partition = {};

		this.partition.before = this._getPartitionBefore(cubies);
		this.partition.after = this._getPartitionAfter(cubies);

		this.partition.caseNumber = this._getCaseNumber({ corner, edge });

		this._solveCase(this.partition.caseNumber, { corner, edge });
		this.partition.moves = this.totalMoves;

		this.totalMoves = [];

		if (!this._overrideAfterEach) {
			this.triggerAfterEach(this.phase, [this.partition, this.phase]);
		}

		return this.partition;
	}

	_solveCase(caseNumber, cubies = {}) {
		let { corner, edge } = cubies;
		this[`_solveCase${caseNumber}`]({ corner, edge });
	}
}

module.exports = BaseSolver;
