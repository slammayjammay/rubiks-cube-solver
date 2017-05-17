const RubiksCube = require('./models/RubiksCube');
const CrossSolver = require('./solvers/cross');
const F2LSolver = require('./solvers/f2l');
const OLLSolver = require('./solvers/oll');
const PLLSolver = require('./solvers/pll');

class Solver {
	constructor(cubeState, options) {
		this.cube = cubeState instanceof RubiksCube ? cubeState : new RubiksCube(cubeState);
		this.options = options;
		this.phases = ['cross', 'f2l', 'oll', 'pll'];
		this.progress = {};

		this.phases.forEach(phase => this.progress[phase] = []);

    // save each partition to this.progress after each solve
		const afterEach = (partition, phase) => {
			this._updateProgress(partition, phase);
		};

		this.currentPhase = null; // good for debugging
		this.currentSolver = null; // good for debugging

		this.crossSolver = new CrossSolver(this.cube, this.options);
		this.f2lSolver = new F2LSolver(this.cube, this.options);
		this.ollSolver = new OLLSolver(this.cube, this.options);
		this.pllSolver = new PLLSolver(this.cube, this.options);

		this.afterEach('all', afterEach);
	}

	afterEach(phases, callback) {
		// argument parsing
		if (typeof phases === 'function') {
			// if first argument is a function, default phases to 'all'
			callback = phases;
			phases = 'all';
		} else if (typeof phases === 'string') {
			if (phases === 'all') {
				// 'all': shortcut for array of all phases
				phases = this.phases.slice();
			} else {
				// lastly turn phases into an array
				phases = [phases];
			}
		}

		// error handling
		if (typeof callback !== 'function') {
			throw new Error('"afterEach" callback is not a function.');
		}

		// error handling
		for (let phase of phases) {
			if (!this.phases.includes(phase)) {
				throw new Error(`Phase "${phase}" isn't recognized. Please specify "cross", "f2l", "oll", "pll", or "all".`);
			}
		}

		// if everything has gone okay, add the callback
		for (let phase of phases) {
			let solver = this[`${phase}Solver`];
			solver.afterEach(callback);
		}
	}

	solve() {
		this.currentPhase = 'cross';
		this.currentSolver = this.crossSolver;
		this.crossSolver.solve();

		this.currentPhase = 'f2l';
		this.currentSolver = this.f2lSolver;
		this.f2lSolver.solve();

		this.currentPhase = 'oll';
		this.currentSolver = this.ollSolver;
		this.ollSolver.solve();

		this.currentPhase = 'pll';
		this.currentSolver = this.pllSolver;
		this.pllSolver.solve();
	}

	getMoves() {
		let moves = [];

		Object.keys(this.progress).forEach(phase => {
			let partitions = this.progress[phase];
			partitions.forEach(partition => moves.push(...partition.moves));
		});

		moves = RubiksCube.normalizeNotations(moves);

		return moves.join(' ');
	}

  getPartitions() {
    let ret = {};
    let phases = Object.keys(this.progress);
    phases.forEach(phase => {
      let partitions = this.progress[phase];

      if (partitions.length === 1) {
        ret[phase] = partitions[0].moves.join(' ');
      } else {
        let phaseMoves = [];
        this.progress[phase].forEach(partition => phaseMoves.push(partition.moves.join(' ')));
        ret[phase] = phaseMoves;
      }
    });

    return ret;
  }

	isCrossEdgeSolved(edge) {
		return this.crossSolver.isEdgeSolved(edge);
	}

	isF2LPairSolved({ corner, edge }) {
		return this.f2lSolver.isPairSolved({ corner, edge });
	}

	isOLLSolved() {
		return this.ollSolver.isSolved();
	}

	isPLLSolved() {
		return this.pllSolver.isSolved();
	}

	_updateProgress(partition, phase) {
		this.progress[phase].push(partition);
	}
}

module.exports = Solver;
