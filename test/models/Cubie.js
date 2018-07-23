import { assert, expect } from 'chai';
import { Cubie } from '../../src/models/Cubie';

describe('Cubie Model', () => {
	let cubie;
	beforeEach(() => {
		cubie = new Cubie({
			colorMap: {
				'FRONT': 'F',
				'RIGHT': 'R',
				'UP': 'U'
			}
		});
	});

	it('can return the color of a face', () => {
		assert(cubie.getColorOfFace('front') === 'f');
		assert(cubie.getColorOfFace('right') === 'r');
		assert(cubie.getColorOfFace('up') === 'u');
	});

	it('can return the face of a color', () => {
		assert(cubie.getFaceOfColor('f') === 'front');
		assert(cubie.getFaceOfColor('r') === 'right');
		assert(cubie.getFaceOfColor('u') === 'up');
	});

	describe('can rotate around the "x" axis', () => {
		it('updates its color map', () => {
			// TODO
		});
	});

	describe('can rotate around the "y" axis', () => {
		it('updates its color map', () => {
			// TODO
		});
	});

	describe('can rotate around the "z" axis', () => {
		it('updates its color map', () => {
			// TODO
		});
	});
});
