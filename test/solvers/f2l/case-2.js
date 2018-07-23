import { assert } from 'chai';
import { RubiksCube } from '../../../src/models/RubiksCube';
import { Cubie } from '../../../src/models/Cubie';
import { Case2Solver } from '../../../src/solvers/f2l/cases/case-2';

let tests = [];

// case 1
tests.push({
	cornerMap: { RIGHT: 'F', FRONT: 'R', DOWN: 'U' },
	edgeMap: { RIGHT: 'F', FRONT: 'R' },
	cornerPos: [1, -1, 1],
	edgePos: [1, 0, 1]
});
// case 2
tests.push({
	cornerMap: { RIGHT: 'F', FRONT: 'R', DOWN: 'U' },
	edgeMap: { RIGHT: 'R', FRONT: 'F' },
	cornerPos: [1, -1, 1],
	edgePos: [1, 0, 1]
});
// case 3
tests.push({
	cornerMap: { RIGHT: 'U', FRONT: 'F', DOWN: 'R' },
	edgeMap: { RIGHT: 'R', FRONT: 'F' },
	cornerPos: [1, -1, 1],
	edgePos: [1, 0, 1]
});
// case 4
tests.push({
	cornerMap: { RIGHT: 'U', FRONT: 'F', DOWN: 'R' },
	edgeMap: { RIGHT: 'F', FRONT: 'R' },
	cornerPos: [1, -1, 1],
	edgePos: [1, 0, 1]
});

describe('F2L case 2 solver', () => {
	tests.forEach(({ cornerMap, edgeMap, cornerPos, edgePos }, caseNum) => {
		let cube = RubiksCube.Solved();
		let corner = new Cubie({ position: cornerPos, colorMap: cornerMap });
		let edge = new Cubie({ position: edgePos, colorMap: edgeMap });
		cube._cubies.push(...[corner, edge]);

		let solver = new Case2Solver(cube);

		it(`identifies case ${caseNum + 1}`, () => {
			assert(solver._getCaseNumber({ corner, edge }) === caseNum + 1);
		});

		it(`solves case ${caseNum + 1}`, () => {
			solver.solve({ corner, edge });
			assert(solver.isPairSolved({ corner, edge }));
		});
	});
});
