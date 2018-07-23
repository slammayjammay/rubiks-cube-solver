import { assert } from 'chai';
import * as utils from '../../src/utils';

describe('Utils', () => {
	it('correcly returns a face given a move', () => {
		assert(utils.getFaceOfMove('R') === 'right');
		assert(utils.getFaceOfMove('R') === 'right');
	});

	it('correctly returns a move given a face', () => {
		assert(utils.getMoveOfFace('RIGHT') === 'r');
		assert(utils.getMoveOfFace('RIGHT') === 'r');
	});

	it('correctly returns the direction of two faces given an orientation', () => {
		assert(utils.getDirectionFromFaces('FRONT', 'RIGHT', { UP: 'UP' }) === 'right');
		assert(utils.getDirectionFromFaces('LEFT', 'DOWN', { UP: 'BACK' }) === 'left');
		// TODO: more of these
	});

	it('correctly returns a face given an origin face and direction', () => {
		assert(utils.getFaceFromDirection('FRONT', 'RIGHT', { UP: 'UP' }) === 'right');
		assert(utils.getFaceFromDirection('LEFT', 'DOWN', { UP: 'BACK' }) === 'front');
		assert(utils.getFaceFromDirection('RIGHT', 'BACK', { UP: 'DOWN' }) === 'left');
		// TODO: more of these
	});

	it('correctly returns a move of a given face, from an origin face to target face', () => {
		assert(utils.getRotationFromTo('UP', 'FRONT', 'RIGHT').toLowerCase() === 'uprime');
		assert(utils.getRotationFromTo('LEFT', 'FRONT', 'BACK').toLowerCase() === 'l l');
		assert(utils.getRotationFromTo('DOWN', 'LEFT', 'BACK').toLowerCase() === 'dprime');
		assert(utils.getRotationFromTo('FRONT', 'UP', 'LEFT').toLowerCase() === 'fprime');
	});

	it('correctly transforms moves', () => {
		let moves = 'R U U RPrime UPrime R U U LPrime U RPrime UPrime L'.split(' ');
		let orientedMoves = utils.orientMoves(moves, { front: 'back', down: 'right' }).join(' ');
		assert(orientedMoves.toLowerCase() === 'd l l dprime lprime d l l uprime l dprime lprime u');
		// TODO: more of these
	});
});
