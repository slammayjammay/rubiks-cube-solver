const RubiksCube = require('./models/RubiksCube');
const CrossSolver = require('./solvers/cross');
const F2LSolver = require('./solvers/f2l');
const OLLSolver = require('./solvers/oll');

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

		this.currentSolver = null; // good for debugging, hopefully

		this.crossSolver = new CrossSolver(this.cube, this.options);
		this.f2lSolver = new F2LSolver(this.cube, this.options);
		this.ollSolver = new OLLSolver(this.cube, this.options);

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
			throw new Error(`"afterEach" callback is not a function.`);
		}

		// error handling
		for (let phase of phases) {
			if (!this.phases.includes(phase)) {
				throw new Error(`Phase "${phase}" isn't recognized. Please specify "cross", "f2l", "oll", "pll", or "all".`);
			}
		}

		// if everything has gone okay, add the callback
		for (let phase of phases) {
			// ignore pll for now (hasn't been implemented yet)
			if (phase === 'pll') {
				continue
			}

			let solver = this[`${phase}Solver`];
			solver.afterEach(callback);
		}
	}

	solve() {
		this.currentSolver = this.crossSolver;
		this.crossSolver.solve();

		this.currentSolver = this.f2lSolver;
		this.f2lSolver.solve();

		this.currentSolver = this.ollSolver;
		this.ollSolver.solve();
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

	_updateProgress(partition, phase) {
		this.progress[phase].push(partition);
	}
}

const solve = (cubeState, options) => {
	let solver = new Solver(cubeState, options);
	solver.solve();
};

module.exports = solve;
module.exports.Solver = Solver;
