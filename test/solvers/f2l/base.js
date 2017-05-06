const { assert } = require('chai');
const RubiksCube = require('../../../src/models/RubiksCube');
const Cubie = require('../../../src/models/Cubie');
const F2LSolver = require('../../../src/solvers/f2l');

describe('F2L Base Solver', () => {
	let solver = new F2LSolver(RubiksCube.Solved());

	it('knows if a corner matches an edge', () => {
		let corner = Cubie.FromFaces(['FRONT', 'DOWN', 'RIGHT'])
      .colorFace('FRONT', 'U')
      .colorFace('DOWN', 'F')
      .colorFace('RIGHT', 'R');
		let edge = Cubie.FromFaces(['RIGHT', 'DOWN'])
      .colorFace('RIGHT', 'R')
      .colorFace('DOWN', 'F');

		assert(solver.colorsMatch({ corner, edge }));
	});

	it('knows if a pair is matched', () => {
		let corner = Cubie.FromFaces(['FRONT', 'DOWN', 'RIGHT'])
      .colorFace('FRONT', 'U')
      .colorFace('DOWN', 'F')
      .colorFace('RIGHT', 'R');
		let edge = Cubie.FromFaces(['RIGHT', 'DOWN'])
      .colorFace('RIGHT', 'R')
      .colorFace('DOWN', 'F');

		assert(solver.isPairMatched({ corner, edge }));
	});

	it('knows if a pair is separated', () => {
		let corner = Cubie.FromFaces(['FRONT', 'DOWN', 'RIGHT'])
      .colorFace('FRONT', 'U')
      .colorFace('DOWN', 'F')
      .colorFace('RIGHT', 'R');
		let edge = Cubie.FromFaces(['LEFT', 'DOWN'])
      .colorFace('LEFT', 'F')
      .colorFace('DOWN', 'R');

		assert(solver.isPairSeparated({ corner, edge }));
	});

	it('knows if a pair is solved', () => {
		let corner = Cubie.FromFaces(['FRONT', 'UP', 'RIGHT'])
      .colorFace('FRONT', 'F')
      .colorFace('UP', 'U')
      .colorFace('RIGHT', 'R');
		let edge = Cubie.FromFaces(['FRONT', 'RIGHT'])
      .colorFace('FRONT', 'F')
      .colorFace('RIGHT', 'R');

		assert(solver.isPairSolved({ corner, edge }));
	});
});
