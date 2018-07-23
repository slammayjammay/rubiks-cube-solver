import { assert } from 'chai';
import { RubiksCube } from '../../../src/models/RubiksCube';
import { Cubie } from '../../../src/models/Cubie';
import { CrossSolver } from '../../../src/solvers/cross';

let case1Tests = [
	{ face1: 'UP', face2: 'FRONT', color1: 'U', color2: 'F' },
	{ face1: 'UP', face2: 'FRONT', color1: 'U', color2: 'L' },
	{ face1: 'UP', face2: 'FRONT', color1: 'U', color2: 'R' },
	{ face1: 'UP', face2: 'FRONT', color1: 'U', color2: 'B' },
	{ face1: 'UP', face2: 'RIGHT', color1: 'U', color2: 'L' },
	{ face1: 'UP', face2: 'RIGHT', color1: 'U', color2: 'F' },
	{ face1: 'UP', face2: 'LEFT', color1: 'U', color2: 'B' },
	{ face1: 'UP', face2: 'BACK', color1: 'U', color2: 'L' }
];

let case2Tests = [
	{ face1: 'DOWN', face2: 'FRONT', color1: 'U', color2: 'F' },
	{ face1: 'DOWN', face2: 'FRONT', color1: 'U', color2: 'L' },
	{ face1: 'DOWN', face2: 'FRONT', color1: 'U', color2: 'R' },
	{ face1: 'DOWN', face2: 'FRONT', color1: 'U', color2: 'B' },
	{ face1: 'DOWN', face2: 'RIGHT', color1: 'U', color2: 'L' },
	{ face1: 'DOWN', face2: 'RIGHT', color1: 'U', color2: 'F' },
	{ face1: 'DOWN', face2: 'LEFT', color1: 'U', color2: 'B' },
	{ face1: 'DOWN', face2: 'BACK', color1: 'U', color2: 'L' }
];

let case3Tests = [
	{ face1: 'FRONT', face2: 'UP', color1: 'U', color2: 'F' },
	{ face1: 'FRONT', face2: 'UP', color1: 'U', color2: 'L' },
	{ face1: 'FRONT', face2: 'UP', color1: 'U', color2: 'R' },
	{ face1: 'FRONT', face2: 'UP', color1: 'U', color2: 'B' },
	{ face1: 'RIGHT', face2: 'UP', color1: 'U', color2: 'L' },
	{ face1: 'RIGHT', face2: 'UP', color1: 'U', color2: 'F' },
	{ face1: 'LEFT', face2: 'UP', color1: 'U', color2: 'B' },
	{ face1: 'BACK', face2: 'UP', color1: 'U', color2: 'L' }
];

let case4Tests = [
	{ face1: 'FRONT', face2: 'DOWN', color1: 'U', color2: 'F' },
	{ face1: 'FRONT', face2: 'DOWN', color1: 'U', color2: 'L' },
	{ face1: 'FRONT', face2: 'DOWN', color1: 'U', color2: 'R' },
	{ face1: 'FRONT', face2: 'DOWN', color1: 'U', color2: 'B' },
	{ face1: 'RIGHT', face2: 'DOWN', color1: 'U', color2: 'L' },
	{ face1: 'RIGHT', face2: 'DOWN', color1: 'U', color2: 'F' },
	{ face1: 'LEFT', face2: 'DOWN', color1: 'U', color2: 'B' },
	{ face1: 'BACK', face2: 'DOWN', color1: 'U', color2: 'L' }
];

let case5Tests = [
	{ face1: 'LEFT', face2: 'FRONT', color1: 'U', color2: 'R' },
	{ face1: 'LEFT', face2: 'FRONT', color1: 'U', color2: 'L' },
	{ face1: 'BACK', face2: 'LEFT', color1: 'U', color2: 'R' },
	{ face1: 'BACK', face2: 'LEFT', color1: 'U', color2: 'L' },
	{ face1: 'RIGHT', face2: 'BACK', color1: 'U', color2: 'R' },
	{ face1: 'RIGHT', face2: 'BACK', color1: 'U', color2: 'F' },
	{ face1: 'FRONT', face2: 'RIGHT', color1: 'U', color2: 'R' },
	{ face1: 'FRONT', face2: 'RIGHT', color1: 'U', color2: 'F' }
];

let case6Tests = [
	{ face1: 'LEFT', face2: 'FRONT', color1: 'R', color2: 'U' },
	{ face1: 'LEFT', face2: 'FRONT', color1: 'L', color2: 'U' },
	{ face1: 'BACK', face2: 'LEFT', color1: 'R', color2: 'U' },
	{ face1: 'BACK', face2: 'LEFT', color1: 'L', color2: 'U' },
	{ face1: 'RIGHT', face2: 'BACK', color1: 'R', color2: 'U' },
	{ face1: 'RIGHT', face2: 'BACK', color1: 'F', color2: 'U' },
	{ face1: 'FRONT', face2: 'RIGHT', color1: 'R', color2: 'U' },
	{ face1: 'FRONT', face2: 'RIGHT', color1: 'F', color2: 'U' }
];

let allTests = [case1Tests, case2Tests, case3Tests, case4Tests, case5Tests, case6Tests];

let correctCaseNumberTests = [
	{ face1: 'UP', face2: 'FRONT', expect: 1 },
	{ face1: 'DOWN', face2: 'FRONT', expect: 2 },
	{ face1: 'RIGHT', face2: 'UP', expect: 3 },
	{ face1: 'RIGHT', face2: 'DOWN', expect: 4 },
	{ face1: 'RIGHT', face2: 'BACK', expect: 5 },
	{ face1: 'RIGHT', face2: 'FRONT', expect: 6 }
];

describe('Cross Solver', () => {
	correctCaseNumberTests.forEach(({ face1, face2, expect }, caseNum) => {
		it(`identifies case ${caseNum + 1}`, () => {
			let edge = Cubie.FromFaces([face1, face2]).colorFace(face1, 'U').colorFace(face2, 'R');
			let result = new CrossSolver(RubiksCube.Solved())._getCaseNumber({ edge });
			assert(result === expect);
		});
	});

	allTests.forEach((caseTest, idx) => {
		let crossSolver = new CrossSolver(RubiksCube.Solved());

		it (`solves case ${idx + 1}`, () => {
			for (let { face1, face2, color1, color2 } of caseTest) {
				let edge = Cubie.FromFaces([face1, face2]).colorFace(face1, color1).colorFace(face2, color2);
				crossSolver.cube._cubies.push(edge);
				crossSolver[`_solveCase${idx + 1}`]({ edge });

				assert(crossSolver.isEdgeSolved(edge));
			}
		});
	});
});
