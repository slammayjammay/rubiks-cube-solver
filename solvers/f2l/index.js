const RubiksCube = require('../../models/RubiksCube')
const Cubie = require('../../models/Cubie')
const BaseSolver = require('./BaseSolver')
const Case1Solver = require('./case-1')
const Case2Solver = require('./case-2')
const Case3Solver = require('./case-3')

class F2LSolver extends BaseSolver {
  solve(options) {
    this.options = options

    let pairs = this.getAllPairs()
    pairs.forEach(pair => this.solvePair(pair))
  }

  isSolved() {
    let pairs = this.getAllPairs()
    for (let pair of pairs) {
      if (!this.isPairSolved(pair)) {
        return false
      }
    }

    return true
  }

  getAllPairs() {
    let corners = this.cube.corners().filter(corner => {
      return corner.hasColor('U')
    })
    let edges = this.cube.edges().filter(edge => {
      return !edge.hasColor('U') && !edge.hasColor('D')
    })

    let pairs = []

    for (let edge of edges) {
      let corner = corners.find(corner => {
        return corner.colors().includes(edge.colors()[0]) &&
               corner.colors().includes(edge.colors()[1])
      })

      pairs.push({ edge, corner })
    }

    return pairs
  }

  solvePair({ corner, edge }) {
    let caseNum = this._getCaseNumber({ corner, edge })
    if (!caseNum) return
    this[`_solveCase${caseNum}`]({ corner, edge })
  }

  /**
   * 4 top level cases:
   *
   * 1) Corner and edge are both on the DOWN face.
   * 2) Corner is on the DOWN face and edge is not on DOWN face.
   * 3) Corner is on UP face and edge is on DOWN face.
   * 4) Corner is on UP face and edge is not on DOWN face.
   */
  _getCaseNumber({ corner, edge }) {
    if (corner.faces().includes('DOWN')) {
      if (edge.faces().includes('DOWN')) {
        return 1
      }
      if (!edge.faces().includes('DOWN') && !edge.faces().includes('UP')) {
        return 2
      }
    }

    if (corner.faces().includes('UP')) {
      if (edge.faces().includes('DOWN')) {
        return 3
      }
      if (!edge.faces().includes('DOWN') && !edge.faces().includes('UP')) {
        return 4
      }
    }

    throw new Error('Could not find a top level F2L case')
  }

  _solveCase1({ corner, edge }) {
    new Case1Solver(this.cube, this.options).solve({ corner, edge })
  }

  _solveCase2({ corner, edge }) {
    new Case2Solver(this.cube, this.options).solve({ corner, edge })
  }

  _solveCase3({ corner, edge }) {
    new Case3Solver(this.cube, this.options).solve({ corner, edge })
  }

  _solveCase4({ corner, edge }) {
    this.move('R U RPrime')
    new Case2Solver(this.cube, this.options).solve({ corner, edge })
  }
}

module.exports = F2LSolver
