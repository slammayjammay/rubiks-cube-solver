const RubiksCube = require('./models/RubiksCube')
const cross = require('./solvers/cross')

class Solver {
  constructor(cubeState) {
    this.cube = new RubiksCube(cubeState)
    let totalMoves = []
  }
}

module.exports = Solver
