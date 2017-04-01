const RubiksCube = require('../../models/RubiksCube')
const Cubie = require('../../models/Cubie')
const utils = require('../../utils')
const BaseSolver = require('./BaseSolver')
const Case1Solver = require('./cases/case-1')
const Case2Solver = require('./cases/case-2')
const Case3Solver = require('./cases/case-3')

const INDENT_LEVEL = 0
const R = (moves) => RubiksCube.reverseMoves(moves)

class F2LSolver extends BaseSolver {
  constructor(...args) {
    super(...args)

    // the afterEach callback gets executed for this base solver, and for any
    // sub-case solvers created. Avoid this duplication
    this.subCaseOptions = Object.assign({}, this.options, {
      afterEach: null
    })
  }

  solve() {
    this.partitions = []

    let pairs = this.getAllPairs()
    pairs.forEach(({ corner, edge }) => {
      let partition = this._solve({ corner, edge })

      this.partitions.push(partition)
    })

    return this.partitions
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
    let solver = new Case1Solver(this.cube, this.subCaseOptions)
    let partition = solver.solve({ corner, edge })

    this.totalMoves = partition.moves
    this.partition.caseNumber = [this.partition.caseNumber, partition.caseNumber]

    return this.partition
    // return new Case1Solver(this.cube, this.options).solve({ corner, edge })
  }

  _solveCase2({ corner, edge }) {
    let solver = new Case2Solver(this.cube, this.subCaseOptions)
    let partition = solver.solve({ corner, edge })

    this.totalMoves = partition.moves
    this.partition.caseNumber = [this.partition.caseNumber, partition.caseNumber]
  }

  _solveCase3({ corner, edge }) {
    let solver = new Case3Solver(this.cube, this.subCaseOptions)
    let partition = solver.solve({ corner, edge })

    this.totalMoves = partition.moves
    this.partition.caseNumber = [this.partition.caseNumber, partition.caseNumber]
  }

  _solveCase4({ corner, edge }) {
    let faces = corner.faces().filter(face => face !== 'UP')
    let dir = utils.getDirectionFromFaces(faces[0], faces[1], { UP: 'DOWN' })
    let cornerRightFace = dir === 'RIGHT' ? faces[1] : faces[0]

    this.move(`${cornerRightFace} D ${R(cornerRightFace)}`)

    let solver
    if (corner.faces().includes(edge.faces()[0] &&
        corner.faces().includes(edge.faces()[1]))) {
      solver = new Case1Solver(this.cube, this.subCaseOptions)
    } else {
      solver = new Case2Solver(this.cube, this.subCaseOptions)
    }

    let partition = solver.solve({ corner, edge })
    this.partition.caseNumber = [this.partition.caseNumber, partition.caseNumber]
    this.partition.moves = [...this.totalMoves, ...partition.moves]

    return this.partition
  }

  logSetup({ corner, edge }) {
    let info = `${edge.colors()[0]} ${edge.colors()[1]}`
    this.LOG_SETUP(INDENT_LEVEL, 'pair', info)
  }

  logCaseNumber(caseNumber) {
    this.LOG_CASE_NUMBER(INDENT_LEVEL, 'f2l top-level case', caseNumber)
  }

  logTotalMoves() {
    // do nothing.
  }
}

module.exports = F2LSolver
