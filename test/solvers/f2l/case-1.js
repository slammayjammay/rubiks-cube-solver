import { assert } from 'chai';
import { RubiksCube } from '../../../src/models/RubiksCube';
import { Cubie } from '../../../src/models/Cubie';
import { Case1Solver } from '../../../src/solvers/f2l/cases/case-1';

let tests = [];

// case 1
tests.push({
	cornerMap: { FRONT: 'U', RIGHT: 'R', DOWN: 'F' },
	edgeMap: { RIGHT: 'R', DOWN: 'F' },
	cornerPos: [1, -1, 1],
	edgePos: [1, -1, 0]
});
// case 2
tests.push({
	cornerMap: { LEFT: 'F', FRONT: 'U', DOWN: 'R' },
	edgeMap: { RIGHT: 'R', DOWN: 'F' },
	cornerPos: [-1, -1, 1],
	edgePos: [1, -1, 0]
});
// case 3
tests.push({
	cornerMap: { LEFT: 'R', FRONT: 'F', DOWN: 'U' },
	edgeMap: { FRONT:'F', DOWN: 'R' },
	cornerPos: [-1, -1, 1],
	edgePos: [0, -1, 1]
});
// case 4
tests.push({
	cornerMap: { LEFT: 'R', FRONT: 'F', DOWN: 'U' },
	edgeMap: { FRONT:'R', DOWN: 'F' },
	cornerPos: [-1, -1, 1],
	edgePos: [0, -1, 1]
});
// case 5
tests.push({
	cornerMap: { RIGHT: 'R', BACK: 'F', DOWN: 'U' },
	edgeMap: { FRONT: 'R', DOWN: 'F' },
	cornerPos: [1, -1, -1],
	edgePos: [0, -1, 1]
});
// case 6
tests.push({
	cornerMap: { FRONT: 'U', RIGHT: 'R', DOWN: 'F' },
	edgeMap: { FRONT: 'R', DOWN: 'F' },
	cornerPos: [1, -1, 1],
	edgePos: [0, -1, 1]
});
// case 7
tests.push({
	cornerMap: { FRONT: 'R', DOWN: 'F', LEFT: 'U' },
	edgeMap: { RIGHT: 'R', DOWN: 'F' },
	cornerPos: [-1, -1, 1],
	edgePos: [1, -1, 0]
});
// case 8
tests.push({
	cornerMap: { FRONT: 'F', RIGHT: 'U', DOWN: 'R' },
	edgeMap: { RIGHT: 'R', DOWN: 'F' },
	cornerPos: [1, -1, 1],
	edgePos: [1, -1, 0]
});
// case 9
tests.push({
	cornerMap: { FRONT: 'F', RIGHT: 'U', DOWN: 'R' },
	edgeMap: { FRONT: 'R', DOWN: 'F' },
	cornerPos: [1, -1, 1],
	edgePos: [0, -1, 1]
});
// case 10
tests.push({
	cornerMap: { FRONT: 'F', RIGHT: 'U', DOWN: 'R' },
	edgeMap: { LEFT: 'R', DOWN: 'F' },
	cornerPos: [1, -1, 1],
	edgePos: [-1, -1, 0]
});

describe('F2L case 1 solver', () => {
	tests.forEach(({ cornerMap, edgeMap, cornerPos, edgePos }, caseNum) => {
		let cube = RubiksCube.Solved();
		let corner = new Cubie({ position: cornerPos, colorMap: cornerMap });
		let edge = new Cubie({ position: edgePos, colorMap: edgeMap });
		cube._cubies.push(...[corner, edge]);

		let solver = new Case1Solver(cube);

		it(`identifies case ${caseNum + 1}`, () => {
			assert(solver._getCaseNumber({ corner, edge }) === caseNum + 1);
		});

		it(`solves case ${caseNum + 1}`, () => {
			solver.solve({ corner, edge });
			assert(solver.isPairSolved({ corner, edge }));
		});
	});
});
