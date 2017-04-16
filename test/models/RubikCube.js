const { expect } = require('chai');
const RubiksCube = require('../../models/RubiksCube');

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
});
