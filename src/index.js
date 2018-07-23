import { Solver } from './Solver';
import { algorithmShortener } from './algorithm-shortener';

// solver constructor
export { Solver };

// models
export { Cubie } from './models/Cubie';
export { RubiksCube } from './models/RubiksCube';

// solvers
export { CrossSolver } from './solvers/cross';
export { F2LSolver } from './solvers/f2l';
export { OLLSolver } from './solvers/oll';
export { PLLSolver } from './solvers/pll';

// algorithm shortener
export { algorithmShortener } from './algorithm-shortener';

/**
 * @param {string} cubeState - The string representing a cube state.
 * @param {object} options
 * @prop {boolean} options.partitioned - Whether to separate moves according to
 * phase.
 */
export default (cubeState, options = {}) => {
	let solver = new Solver(cubeState, options);
	solver.solve();

	if (options.partitioned) {
		return solver.getPartitions();
	} else {
		return algorithmShortener(solver.getMoves());
	}
};
