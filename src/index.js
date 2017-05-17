const Solver = require('./Solver');

/**
 * @param {string} cubeState - The string representing a cube state.
 * @param {object} options
 * @prop {boolean} options.partitioned - Whether to separate moves according to
 * phase.
 */
const solve = (cubeState, options = {}) => {
	let solver = new Solver(cubeState, options);
	solver.solve();

	if (options.partitioned) {
		return solver.getPartitions();
	} else {
		return solver.getMoves();
	}
};

module.exports = solve;
module.exports.Solver = Solver;
