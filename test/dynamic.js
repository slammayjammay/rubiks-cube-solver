const { assert } = require('chai')
const RubiksCube = require('../models/RubiksCube')
const CrossSolver = require('../solvers/cross')
const F2LSolver = require('../solvers/f2l')
const utils = require('../utils')

const NUM_RUNS = 1

describe('Dynamic Solving', () => {
  for (let i = 0; i < NUM_RUNS; i++) {
    let cube = RubiksCube.Solved()

    // get access to the scrambled state
    let scrambleMoves = RubiksCube.getRandomMoves(25)
    for (let move of scrambleMoves) {
      cube.move(move)
    }

    it('solves the cross', () => {
      let cross = new CrossSolver(cube)

      // get access to the moves that solve the cross
      let moves = cross.solve()

      assert(cross.isSolved())
    })
  }
})
