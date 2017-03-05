const BaseSolver = require('./BaseSolver')
const case1Solver = require('./case-1')
const RubiksCube = require('../../models/RubiksCube')
const Cubie = require('../../models/Cubie')

class F2LSolver extends BaseSolver {
  solve() {
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
    let corners = this.cube.corners()
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
   * 5 top level cases:
   * 1) corner and edge are both on the DOWN face
   * 2)
   * 3)
   * 4)
   * 5)
   */
  _getCaseNumber({ corner, edge }) {
    if (corner.faces().includes('DOWN') && edge.faces().includes('DOWN')) {
      return 1
    }
  }

  _solveCase1({ corner, edge }) {
    let solveMoves = new case1Solver({ corner, edge })
    this.move(solveMoves)
  }
}

module.exports = F2LSolver
