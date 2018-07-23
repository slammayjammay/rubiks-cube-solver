import { expect, assert } from 'chai';
import { RubiksCube } from '../../src/models/RubiksCube';

describe('RubiksCube Model', () => {
	describe('requires a correct input state', () => {
		it('requires a string', () => {
			expect(() => new RubiksCube()).to.throw(Error);
			expect(() => new RubiksCube([])).to.throw(Error);
			expect(() => new RubiksCube({})).to.throw(Error);
		});

		it('requires a string of the correct length', () => {
			expect(() => new RubiksCube('too short')).to.throw(Error);
		});

		it('requires a string with only 6 unique colors', () => {
			// TODO
		});
	});

	describe('movement', () => {
		it('moves "r" correctly', () => {
			let cube = RubiksCube.Solved();
			cube.move('r');
			assert(cube.toString() === 'fddfddfddrrrrrrrrruffuffuffdbbdbbdbbllllllllluubuubuub');
		});

		it('moves "d" correctly', () => {
			let cube = RubiksCube.Solved();
			cube.move('d');
			assert(cube.toString() === 'fffllllllrrrffffffuuuuuuuuudddddddddlllbbbbbbbbbrrrrrr');
		});

		it('moves "r u" correctly', () => {
			let cube = RubiksCube.Solved();
			cube.move('r u');
			let state = ['rrrrrrfdd', 'uubuubrrr', 'uuuffffff', 'dbbdbbdbb', 'fddfddlll', 'lllllluub'].join('');
			assert(cube.toString() === state);
		});
	});
});
