const RubiksCube = require('./models/RubiksCube')
const cross = require('./solvers/cross')

class Solver {
  constructor(cubeState) {
    this.cube = new RubiksCube(cubeState)
    let totalMoves = []

    // let cross = new CrossSolver(this.cube)

    // let crossMoves = cross.solve(this.cube)
    // console.log(crossMoves)
  }
}

module.exports = Solver
