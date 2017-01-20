const RubiksCube = require('./rubiks-cube')

class Solver {
  constructor(cubeState) {
    this.cube = new RubiksCube(cubeState)
  }
}

module.exports = Solver
