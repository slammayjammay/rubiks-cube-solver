import { RubiksCube } from '../../../models/RubiksCube';
import { F2LCaseBaseSolver } from './F2LCaseBaseSolver';
import {
	getFaceOfMove, getFaceFromDirection, getRotationFromTo, getMoveOfFace,
	getDirectionFromFaces
} from '../../../utils';

const R = (moves) => RubiksCube.reverseMoves(moves);

/**
 * Top level case 1:
 * Both corner and edge are on the DOWN face.
 */
class Case1Solver extends F2LCaseBaseSolver {
	/**
	 * 10 Cases:
	 * 1) Pair is matched.
	 * 2) Pair is separated.
	 *
	 * ---- Group 1: Corner's white color is on DOWN face ----
	 * 3) Corner and edge share a face and colors on that face are equal.
	 * 4) Corner and edge share a face and colors on that face are not equal.
	 * 5) Corner and edge do not share a face.
	 *
	 * ---- Group 2: Corner's "other" color matches edge's "primary" color ----
	 * 6) Corner shares a face with edge.
	 * 7) Corner does not share a face with edge.
	 *
	 * ---- Group 3: Corner's "other" color doesn't match edge's "primary" color ----
	 * 8) Edge shares a face with corner's cross color's face.
	 * 9) Edge shares a face with corner's other color's face.
	 * 10) Corner does not share a face with edge.
	 *
	 * TODO: refactor
	 */
	_getCaseNumber({ corner, edge }) {
		if (this.isPairMatched({ corner, edge })) {
			return 1;
		}
		if (this.isPairSeparated({ corner, edge })) {
			return 2;
		}

		let sharedFace;
		edge.faces().forEach(face => {
			if (corner.faces().includes(face) && face !== 'down') {
				sharedFace = face;
			}
		});
		let otherColor = corner.colors().find(color => {
			return color !== 'u' && color !== corner.getColorOfFace('down');
		});
		let primaryColor = edge.colors().find(c => edge.getFaceOfColor(c) !== 'down');

		// Group 1
		if (corner.getFaceOfColor('u') === 'down') {
			if (sharedFace) {
				if (corner.getColorOfFace(sharedFace) === edge.getColorOfFace(sharedFace)) {
					return 3;
				} else {
					return 4;
				}
			} else {
				return 5;
			}
		}

		// Group 2
		if (otherColor === primaryColor) {
			if (sharedFace) {
				return 6;
			} else {
				return 7;
			}
		}

		// Group 3
		if (sharedFace) {
			if (sharedFace === corner.getFaceOfColor('u')) {
				return 8;
			} else {
				return 9;
			}
		} else {
			return 10;
		}
	}

	_solveCase1({ corner, edge }) {
		return this.solveMatchedPair({ corner, edge });
	}

	_solveCase2({ corner, edge }) {
		return this.solveSeparatedPair({ corner, edge });
	}

	_solveCase3({ corner, edge }) {
		// calculate which side the corner is on, the position, etc.
		let currentFace = edge.faces().find(face => face !== 'down');
		let targetFace = getFaceOfMove(edge.getColorOfFace('down'));
		let prepFace = getFaceFromDirection(targetFace, 'back', { up: 'down' });
		let otherFace = corner.getFaceOfColor(edge.getColorOfFace('down'));
		let isLeft = getFaceFromDirection(currentFace, otherFace, { up: 'down' }) === 'left';

		// the moves
		let prep = getRotationFromTo('down', currentFace, prepFace);
		let moveFace = getFaceOfMove(edge.getColorOfFace(currentFace));
		let dir = isLeft ? 'D' : 'DPrime';

		moveFace = isLeft ? moveFace : R(moveFace);

		let solveMoves = `${prep} ${moveFace} ${moveFace} D D `;
		solveMoves += `${moveFace} ${dir} ${R(moveFace)} ${dir} ${moveFace} ${moveFace}`;
		this.move(solveMoves, { upperCase: true });
	}

	_solveCase4({ corner, edge }) {
		// calculate which side the corner is on, the position, etc.
		let currentFace = edge.faces().find(face => face !== 'down');
		let targetFace = getFaceOfMove(edge.getColorOfFace(currentFace));
		let otherFace = corner.faces().find(face => !edge.faces().includes(face));
		let isLeft = getFaceFromDirection(otherFace, currentFace, { up: 'down' }) === 'left';

		// the moves
		let prep = getRotationFromTo('down', currentFace, targetFace);
		let moveFace = getMoveOfFace(targetFace);
		moveFace = isLeft ? R(moveFace) : moveFace;

		this.move(`${prep} ${moveFace} D D ${R(moveFace)}`, { upperCase: true });
		this.solveSeparatedPair({ corner, edge });
	}

	_solveCase5({ corner, edge }) {
		let primary = edge.colors().find(color => edge.getFaceOfColor(color) !== 'down');
		let secondary = edge.colors().find(color => edge.getFaceOfColor(color) === 'down');

		let isLeft = getFaceFromDirection(
			getFaceOfMove(primary),
			getFaceOfMove(secondary),
			{ up: 'down' }
		) === 'right';

		let edgeCurrent = edge.getFaceOfColor(primary);
		let edgeTarget = getFaceOfMove(primary);

		// do the prep move now. need to calculate things after this move is done
		let edgePrep = getRotationFromTo('down', edgeCurrent, edgeTarget);
		this.move(edgePrep, { upperCase: true });

		// calculate corner stuff
		let cornerCurrent = corner.getFaceOfColor(primary);
		let cornerTarget = edgeTarget;

		// the moves
		let cornerPrep = getRotationFromTo('down', cornerCurrent, cornerTarget);
		let open = isLeft ? R(edgeTarget) : edgeTarget;

		this.move(`${open} ${cornerPrep} ${R(open)}`, { upperCase: true });
		this.solveMatchedPair({ corner, edge });
	}

	_solveCase6({ corner, edge }) {
		let primary = edge.colors().find(color => edge.getFaceOfColor(color) !== 'down');

		let currentFace = edge.getFaceOfColor(primary);
		let targetFace = getFaceOfMove(edge.getColorOfFace('down'));
		let isLeft = getDirectionFromFaces(
			currentFace,
			corner.getFaceOfColor(primary),
			{ up: 'down' }
		) === 'left';

		let prep = getRotationFromTo('down', currentFace, targetFace);
		let moveFace = isLeft ? targetFace : R(targetFace);
		let dir = isLeft ? 'DPrime' : 'D';

		this.move(`${prep} ${moveFace} ${dir} ${R(moveFace)}`, { upperCase: true });
		this.solveSeparatedPair({ corner, edge});
	}

	_solveCase7({ corner, edge }) {
		let primary = edge.colors().find(c => edge.getFaceOfColor(c) !== 'down');
		let cornerCurrent = corner.getFaceOfColor('u');
		let cornerTarget = getFaceOfMove(primary);
		let isLeft = getDirectionFromFaces(
			corner.getFaceOfColor(primary),
			corner.getFaceOfColor('u'),
			{ up: 'down' }
		) === 'left';

		let cornerPrep = getRotationFromTo('down', cornerCurrent, cornerTarget);
		this.move(cornerPrep, { upperCase: true });

		let edgeCurrent = edge.getFaceOfColor(primary);
		let edgeTarget = corner.getFaceOfColor(primary);

		let open = isLeft ? corner.getFaceOfColor('u') : R(corner.getFaceOfColor('u'));
		let edgeMatch = getRotationFromTo('down', edgeCurrent, edgeTarget);
		this.move(`${open} ${edgeMatch} ${R(open)}`, { upperCase: true });

		this.solveMatchedPair({ corner, edge });
	}

	_solveCase8({ corner, edge }) {
		let primary = edge.colors().find(c => edge.getFaceOfColor(c) !== 'down');
		let secondary = edge.colors().find(c => edge.getFaceOfColor(c) === 'down');

		let currentFace = corner.getFaceOfColor(secondary);
		let targetFace = getFaceOfMove(primary);

		let isLeft = getDirectionFromFaces(
			currentFace,
			corner.getFaceOfColor('u'),
			{ up: 'down' }
		) === 'left';

		let prep = getRotationFromTo('down', currentFace, targetFace);
		let open = isLeft ? R(targetFace) : targetFace;
		let dir = isLeft ? 'D' : 'DPrime';

		this.move(`${prep} ${open} ${dir} ${R(open)}`, { upperCase: true });
		this.solveSeparatedPair({ corner, edge });
	}

	_solveCase9({ corner, edge }) {
		let otherColor = edge.colors().find(c => edge.getFaceOfColor(c) === 'down');
		let currentFace = corner.getFaceOfColor('u');
		let targetFace = getFaceOfMove(otherColor);

		let isLeft = getDirectionFromFaces(
			corner.getFaceOfColor(otherColor),
			currentFace,
			{ up: 'down' }
		) === 'left';

		let prep = getRotationFromTo('down', currentFace, targetFace);
		let moveFace = isLeft ? targetFace : R(targetFace);

		this.move(`${prep} ${moveFace} D D ${R(moveFace)}`, { upperCase: true });
		this.solveSeparatedPair({ corner, edge });
	}

	_solveCase10({ corner, edge }) {
		let primary = edge.colors().find(c => edge.getFaceOfColor(c) !== 'down');
		let secondary = edge.colors().find(c => edge.getFaceOfColor(c) === 'down');
		let cornerCurrent = corner.getFaceOfColor('u');
		let cornerTarget = getFaceOfMove(secondary);
		let isLeft = getDirectionFromFaces(
			corner.getFaceOfColor(secondary),
			corner.getFaceOfColor('u'),
			{ up: 'down' }
		) === 'left';

		let cornerPrep = getRotationFromTo('down', cornerCurrent, cornerTarget);
		this.move(cornerPrep, { upperCase: true });

		let edgeCurrent = edge.getFaceOfColor(primary);
		let edgeTarget = getFaceOfMove(primary);

		let open = isLeft ? cornerTarget : R(cornerTarget);
		let edgePrep = getRotationFromTo('down', edgeCurrent, edgeTarget);

		this.move(`${open} ${edgePrep} ${R(open)}`, { upperCase: true });
		this.solveSeparatedPair({ corner, edge });
	}
}

export { Case1Solver };
