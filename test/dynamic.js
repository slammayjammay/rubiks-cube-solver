const { expect } = require('chai')
const RubiksCube = require('../models/RubiksCube')
const CrossSolver = require('../solvers/cross')
const F2LSolver = require('../solvers/f2l')

const NUM_RUNS = 100
describe('Solving cross', () => {
  it('solves edges correctly', () => {
    for (let i = 0; i < NUM_RUNS; i++) {
      let cube = RubiksCube.Scrambled()
      let cross = new CrossSolver(cube)
      let f2l = new F2LSolver(cube)

      cross.solve(cube)
      expect(cross.isSolved)

      f2l.solve(cube)
      expect(f2l.isSolved)
    }
  })
})
