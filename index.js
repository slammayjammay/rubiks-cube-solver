const RubiksCube = require('./rubiks-cube')

class Solver {
  constructor(cubeState) {
    if (cubeState.length !== 9 * 6) {
      throw new Error('Wrong number of colors provided');
    }
    this.cube = new RubiksCube(cubeState)
  }
}

module.exports = Solver
