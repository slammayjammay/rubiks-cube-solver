import { RubiksCube } from '../../../models/RubiksCube';
import { F2LCaseBaseSolver } from './F2LCaseBaseSolver';
import {
	getDirectionFromFaces, getFaceFromDirection, getRotationFromTo
} from '../../../utils';

const R = (moves) => RubiksCube.reverseMoves(moves);

/**
 * Top level case 3:
 * Corner is on UP face and edge is on DOWN face.
 */
class Case3Solver extends F2LCaseBaseSolver {
	/**
   * 2 cases:
   *
   * 1) Corner's cross color is on the cross face.
   * 2) Corner's cross color is not on the cross face.
   */
	_getCaseNumber({ corner, edge }) {
		if (corner.getColorOfFace('up') === 'u') {
			return 1;
		} else {
			return 2;
		}
	}

	_solveCase1({ corner, edge }) {
		let faces = corner.faces().filter(face => face !== 'up');
		let direction = getDirectionFromFaces(faces[0], faces[1], { up: 'down' });
		let [leftFace, rightFace] = direction === 'right' ? faces : faces.reverse();

		let currentFace = edge.faces().find(face => face !== 'down');
		let primaryColor = edge.getColorOfFace(currentFace);

		let targetFace = getFaceFromDirection(
			corner.getFaceOfColor(primaryColor),
			primaryColor === corner.getColorOfFace(rightFace) ? 'right' : 'left',
			{ up: 'down' }
		);
		let isLeft = primaryColor === corner.getColorOfFace(leftFace);

		let prep = getRotationFromTo('down', currentFace, targetFace);
		let moveFace = isLeft ? rightFace : R(leftFace);
		let dir = isLeft ? 'DPrime' : 'D';

		this.move(`${prep} ${moveFace} ${dir} ${R(moveFace)}`, { upperCase: true });
		this.solveMatchedPair({ corner, edge });
	}

	_solveCase2({ corner, edge }) {
		let otherColor = corner.colors().find(color => {
			return color !== 'u' && corner.getFaceOfColor(color) !== 'up';
		});
		let currentFace = edge.faces().find(face => face !== 'down');
		let primaryColor = edge.getColorOfFace(currentFace);

		let willBeMatched = otherColor !== primaryColor;
		let targetFace = corner.getFaceOfColor(willBeMatched ? otherColor : 'u');

		let prep = getRotationFromTo('down', currentFace, targetFace);
		let isLeft = getDirectionFromFaces(
			corner.getFaceOfColor(otherColor),
			corner.getFaceOfColor('u'),
			{ up: 'down' }
		) === 'left';
		let dir = isLeft ? 'DPrime' : 'D';
		let moveFace = corner.getFaceOfColor('u');
		moveFace = isLeft ? R(moveFace) : moveFace;

		this.move(`${prep} ${moveFace} ${dir} ${R(moveFace)}`, { upperCase: true });
		let solveFn = `solve${willBeMatched ? 'Matched' : 'Separated'}Pair`;
		this[solveFn]({ corner, edge });
	}
}

export { Case3Solver };
