import { assert } from 'chai';
import { RubiksCube } from '../../../src/models/RubiksCube';
import { Cubie } from '../../../src/models/Cubie';
import { Case3Solver } from '../../../src/solvers/f2l/cases/case-3';

let tests = [];

// case 1
tests.push({
	cornerMap: { FRONT: 'F', RIGHT: 'R', UP: 'U' },
	edgeMap: { FRONT: 'R', DOWN: 'F' },
	cornerPos: [1, 1, 1],
	edgePos: [0, -1, 1]
});
// case 2
tests.push({
	cornerMap: { FRONT: 'R', UP: 'F', RIGHT: 'U' },
	edgeMap: { FRONT: 'R', DOWN: 'F' },
	cornerPos: [1, 1, 1],
	edgePos: [0, -1, 1]
});

describe('F2L case 3 solver', () => {
	tests.forEach(({ cornerMap, edgeMap, cornerPos, edgePos }, caseNum) => {
		let cube = RubiksCube.Solved();
		let corner = new Cubie({ position: cornerPos, colorMap: cornerMap });
		let edge = new Cubie({ position: edgePos, colorMap: edgeMap });
		cube._cubies.push(...[corner, edge]);

		let solver = new Case3Solver(cube);

		it(`identifies case ${caseNum + 1}`, () => {
			assert(solver._getCaseNumber({ corner, edge }) === caseNum + 1);
		});

		it(`solves case ${caseNum + 1}`, () => {
			solver.solve({ corner, edge });
			assert(solver.isPairSolved({ corner, edge }));
		});
	});
});
