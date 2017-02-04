const RubiksCube = require('./models/RubiksCube')
const CrossSolver = require('./steps/CrossSolver')

class Solver {
  constructor(cubeState) {
    this.cube = new RubiksCube(cubeState)
    let totalMoves = []

    let cross = new CrossSolver(this.cube)
    cross.testAll()

    // let crossMoves = cross.solve(this.cube)
    // console.log(crossMoves)
  }
}

module.exports = Solver
