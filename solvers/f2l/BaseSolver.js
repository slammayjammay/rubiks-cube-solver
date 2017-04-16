const BaseSolver = require('../BaseSolver');
const RubiksCube = require('../../models/RubiksCube');
const utils = require('../../utils');

const R = (moves) => RubiksCube.reverseMoves(moves);

class F2LBaseSolver extends BaseSolver {
	constructor(...args) {
		super(...args);

		this.phase = 'f2l';
	}

	colorsMatch({ corner, edge }) {
		let colors = edge.colors();

		if (corner.colors().includes(colors[0]) && corner.colors().includes(colors[1])) {
			return true;
		}

		return false;
	}

	/**
	 * Returns true only if the pair is matched and in the correct slot.
	 */
	isPairSolved({ corner, edge }) {
		if (!this.isPairMatched({ corner, edge })) {
			return false;
		}

		// is the corner on the cross face?
		if (corner.getFaceOfColor('u') !== 'up') {
			return false;
		}

		// are the edge's colors on the correct face? (e.g. is the edge's 'F' color
		// on the 'FRONT' face)?
		for (let color of edge.colors()) {
			if (edge.getFaceOfColor(color) !== utils.getFaceOfMove(color)) {
				return false;
			}
		}

		return true;
	}

	isPairMatched({ corner, edge }) {
		// are the two non-cross colors the same?
		if (!this.colorsMatch({ corner, edge })) {
			return false;
		}

		// for each color, do the corner and edge share the same face?
		for (let color of edge.colors()) {
			if (corner.getFaceOfColor(color) !== edge.getFaceOfColor(color)) {
				return false;
			}
		}

		return true;
	}

	isPairSeparated({ corner, edge }) {
		// colors must match
		if (!this.colorsMatch({ corner, edge })) {
			return false;
		}

		// corner's white face cannot be UP or DOWN
		if (['up', 'down'].includes(corner.getFaceOfColor('u'))) {
			return false;
		}

		// edge must be on the DOWN face
		if (!edge.faces().includes('down')) {
			return false;
		}


		let otherColor = corner.colors().find(color => {
			return color !== 'u' && corner.getFaceOfColor(color) !== 'down';
		});

		// edge must be oriented properly
		if (edge.getFaceOfColor(otherColor) !== 'down') {
			return false;
		}

		// corner and edge must be one move away from matching
		let isOneMoveFromMatched = utils.getDirectionFromFaces(
			corner.getFaceOfColor(otherColor),
			edge.getFaceOfColor(corner.getColorOfFace('down')),
			{ up: 'up' }
		) === 'back';

		return isOneMoveFromMatched;
	}

	solveMatchedPair({ corner, edge }) {
		if (!this.isPairMatched({ corner, edge })) {
			throw new Error('Pair is not matched');
		}

		// get the color that is not on the down face and is not the crossColor
		let matchedColor = edge.colors().find(color => {
			return edge.getFaceOfColor(color) !== 'down';
		});

		let isLeft = utils.getDirectionFromFaces(
			edge.getFaceOfColor(matchedColor),
			corner.getFaceOfColor('u'),
			{ up: 'down' }
		) === 'left';

		let matchingFace = utils.getFaceOfMove(matchedColor);
		let currentFace = corner.getFaceOfColor(matchedColor);
		let prepFace = utils.getFaceFromDirection(matchingFace, isLeft ? 'right' : 'left', { up: 'up' });

		let prep = utils.getRotationFromTo('down', currentFace, prepFace);
		let open = isLeft ? matchingFace : R(matchingFace);
		let insert = isLeft ? 'DPrime' : 'D';

		let solveMoves = [prep, open, insert, R(open)].join(' ');
		this.move(solveMoves);
		return solveMoves;
	}

	solveSeparatedPair({ corner, edge }) {
		if (!this.isPairSeparated({ corner, edge })) {
			throw new Error('Pair is not separated');
		}

		// get the color that is not on the down face and is not the crossColor
		let matchedColor = edge.colors().find(color => {
			return edge.getFaceOfColor(color) !== 'down';
		});

		let isLeft = utils.getDirectionFromFaces(
			corner.getFaceOfColor('u'),
			edge.getFaceOfColor(matchedColor),
			{ up: 'down' }
		).toUpperCase() === 'LEFT';

		let currentFace = corner.getFaceOfColor('u');
		let prepFace = utils.getFaceOfMove(matchedColor);

		let prep = utils.getRotationFromTo('down', currentFace, prepFace);
		let match = utils.getMoveOfFace(prepFace);
		match = isLeft ? R(match) : match;
		let insert = isLeft ? 'DPrime' : 'D';

		let solveMoves = [prep, match, insert, R(match)].join(' ');
		this.move(solveMoves);
		return solveMoves;
	}
}

module.exports = F2LBaseSolver;
