const RubiksCube = require('./models/RubiksCube')
const CrossSolver = require('./solvers/cross')
const F2LSolver = require('./solvers/f2l')

class Solver {
  constructor(cubeState, options) {
    this.cube = cubeState instanceof RubiksCube ? cubeState : new RubiksCube(cubeState)
    this.options = options
    this.progress = { cross: [], f2l: [], oll: [], pll: [] }

    // save each partition to this.progress after each solve
    const afterEach = (partition, phase) => {
      this._updateProgress(partition, phase)
    }

    this.currentSolver = null // good for debugging, hopefully

    this.crossSolver = new CrossSolver(this.cube, this.options)
    this.f2lSolver = new F2LSolver(this.cube, this.options)

    this.crossSolver.afterEach(afterEach)
    this.f2lSolver.afterEach(afterEach)
  }

  afterEach(callback) {
    this.crossSolver.afterEach(callback)
    this.f2lSolver.afterEach(callback)
  }

  solve() {
    this.currentSolver = this.crossSolver
    let crossPartitions = this.currentSolver.solve()

    this.currentSolver = this.f2lSolver
    let f2lPartitions = this.currentSolver.solve()
  }

  isCrossEdgeSolved(edge) {
    return this.crossSolver.isEdgeSolved(edge)
  }

  isF2LPairSolved({ corner, edge }) {
    return this.f2lSolver.isPairSolved({ corner, edge })
  }

  _updateProgress(partition, phase) {
    this.progress[phase].push(partition)
  }
}

const solve = (cubeState, options) => {
  let solver = new Solver(cubeState, options)
  solver.solve()
}

module.exports = solve
module.exports.Solver = Solver
