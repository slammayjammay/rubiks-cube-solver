const { assert } = require('chai');
const utils = require('../../utils');

describe('Utils', () => {
	it('correcly returns a face given a move', () => {
		assert(utils.getFaceOfMove('R') === 'RIGHT');
		assert(utils.getFaceOfMove('r') === 'RIGHT');
	});

	it('correctly returns a move given a face', () => {
		assert(utils.getMoveOfFace('RIGHT') === 'R');
		assert(utils.getMoveOfFace('right') === 'R');
	});

	it('correctly returns the direction of two faces given an orientation', () => {
		assert(utils.getDirectionFromFaces('FRONT', 'RIGHT', { UP: 'UP' }) === 'RIGHT');
		assert(utils.getDirectionFromFaces('LEFT', 'DOWN', { UP: 'BACK' }) === 'LEFT');
    // TODO: more of these
	});

	it('correctly returns a face given an origin face and direction', () => {
		assert(utils.getFaceFromDirection('FRONT', 'RIGHT', { UP: 'UP' }) === 'RIGHT');
		assert(utils.getFaceFromDirection('LEFT', 'DOWN', { UP: 'BACK' }) === 'FRONT');
		assert(utils.getFaceFromDirection('RIGHT', 'BACK', { UP: 'DOWN' }) === 'LEFT');
    // TODO: more of these
	});

	it('correctly returns a move of a given face, from an origin face to target face', () => {
		assert(utils.getRotationFromTo('UP', 'FRONT', 'RIGHT') === 'UPrime');
		assert(utils.getRotationFromTo('LEFT', 'FRONT', 'BACK') === 'L L');
		assert(utils.getRotationFromTo('DOWN', 'LEFT', 'BACK') === 'DPrime');
		assert(utils.getRotationFromTo('FRONT', 'UP', 'LEFT') === 'FPrime');
	});
});
