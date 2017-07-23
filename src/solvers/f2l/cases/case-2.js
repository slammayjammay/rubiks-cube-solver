import { RubiksCube } from '../../../models/RubiksCube';
import { F2LCaseBaseSolver } from './F2LCaseBaseSolver';
import {
	getDirectionFromFaces, getRotationFromTo, getFaceOfMove
} from '../../../utils';

const R = (moves) => RubiksCube.reverseMoves(moves);

/**
 * Top level case 2:
 * Corner is on the DOWN face and edge is not on DOWN or UP face.
 */
class Case2Solver extends F2LCaseBaseSolver {
	/**
	 * 4 cases:
	 *
	 * ---- Group 1: Corner's white color is on DOWN face ----
	 * 1) Pair can be matched up.
	 * 2) Pair cannot be matched up.
	 *
	 * ---- Group 2: Corner's white color is not on DOWN face ----
	 * 3) Corner's other color can match up with the edge color on that face.
	 * 4) Corner's other color cannot match up with the edge color on that face.
	 */
	_getCaseNumber({ corner, edge }) {
		// get relative right faces of corner and edge
		let cFaces = corner.faces().filter(face => face !== 'down');
		let eFaces = edge.faces();
		let cornerDir = getDirectionFromFaces(cFaces[0], cFaces[1], { up: 'down' });
		let edgeDir = getDirectionFromFaces(eFaces[0], eFaces[1], { up: 'down' });
		let cornerRight = cornerDir === 'right' ? cFaces[1] : cFaces[0];
		let edgeRight = edgeDir === 'right' ? eFaces[1] : eFaces[0];

		if (corner.getFaceOfColor('u') === 'down') {
			if (corner.getColorOfFace(cornerRight) === edge.getColorOfFace(edgeRight)) {
				return 1;
			} else {
				return 2;
			}
		}

		let otherColor = corner.colors().find(color => {
			return color !== 'u' && color !== corner.getColorOfFace('down');
		});
		let isLeft = getDirectionFromFaces(
			corner.getFaceOfColor(otherColor),
			corner.getFaceOfColor('u'),
			{ up: 'down' }
		) === 'left';
		let matchingEdgeColor = isLeft ?
			edge.getColorOfFace(edgeRight) :
			edge.colors().find(c => edge.getFaceOfColor(c) !== edgeRight);

		if (otherColor === matchingEdgeColor) {
			return 3;
		} else {
			return 4;
		}
	}

	_solveCase1({ corner, edge }) {
		let color = edge.colors()[0];
		let currentFace = corner.getFaceOfColor(color);
		let targetFace = edge.getFaceOfColor(color);

		let prep = getRotationFromTo('down', currentFace, targetFace);
		this.move(prep, { upperCase: true });

		let [face1, face2] = edge.faces();
		let dir = getDirectionFromFaces(face1 , face2, { up: 'down' });
		let rightFace = dir === 'right' ? face2 : face1;

		this.move(`${rightFace} DPrime ${R(rightFace)}`, { upperCase: true });
		this.solveMatchedPair({ corner, edge });
	}

	_solveCase2({ corner, edge }) {
		let currentFace = corner.getFaceOfColor(edge.colors()[0]);
		let targetFace = edge.getFaceOfColor(edge.colors()[1]);

		let prep = getRotationFromTo('down', currentFace, targetFace);
		this.move(prep, { upperCase: true });

		let dir = getDirectionFromFaces(edge.faces()[0], edge.faces()[1], { up: 'down' });
		let rightFace = edge.faces()[dir === 'right' ? 1 : 0];

		this.move(`${rightFace} D ${R(rightFace)} DPrime`, { upperCase: true });
		this.move(`${rightFace} D ${R(rightFace)}`, { upperCase: true });

		this.solveSeparatedPair({ corner, edge });
	}

	_solveCase3({ corner, edge }) {
		this._case3And4Helper({ corner, edge }, 3);
	}

	_solveCase4({ corner, edge }) {
		this._case3And4Helper({ corner, edge }, 4);
	}

	_case3And4Helper({ corner, edge }, caseNum) {
		let downColor = corner.getColorOfFace('down');
		let otherColor = corner.colors().find(c => ![downColor, 'u'].includes(c));
		let matchingColor = caseNum === 3 ? otherColor : downColor;
		let isLeft = getDirectionFromFaces(
			corner.getFaceOfColor(otherColor),
			corner.getFaceOfColor('u'),
			{ up: 'down' }
		) === 'left';

		let currentFace = corner.getFaceOfColor('u');
		// let targetFace = getFaceOfMove(otherColor)
		let targetFace = edge.getFaceOfColor(matchingColor);

		let prep = getRotationFromTo('down', currentFace, targetFace);
		let moveFace = isLeft ? targetFace : R(targetFace);
		let dir = isLeft ? 'DPrime' : 'D';
		dir = caseNum === 4 ? R(dir) : dir;

		this.move(`${prep} ${moveFace} ${dir} ${R(moveFace)}`, { upperCase: true });

		let method = `solve${caseNum === 3 ? 'Matched' : 'Separated'}Pair`;
		this[method]({ corner, edge });
	}
}

export { Case2Solver };
