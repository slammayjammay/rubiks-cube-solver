const RubiksCube = require('./models/RubiksCube')
const solveCross = require('./steps/solve-cross')

class Solver {
  constructor(cubeState) {
    if (cubeState.length !== 9 * 6) {
      throw new Error('Wrong number of colors provided');
    }

    this.cube = new RubiksCube(cubeState)
    let totalMoves = []

    let crossMoves = solveCross(this.cube)
  }
}

module.exports = Solver
