const BaseSolver = require('../BaseSolver')
const RubiksCube = require('../../models/RubiksCube')
const Cubie = require('../../models/Cubie')
const Face = require('../../models/Face')
const utils = require('../../utils')

const INDENT_LEVEL = 0
const CROSS_COLOR = 'U'
const R = (moves) => RubiksCube.reverseMoves(moves)

class CrossSolver extends BaseSolver {
  constructor(...args) {
    super(...args)

    this.phase = 'cross'
  }

  solve() {
    let crossEdges = this._getCrossEdges()
    for (let edge of crossEdges) {
      let partition = this._solve({ edge })
      this.partitions.push(partition)
    }

    return this.partitions
  }

  isSolved() {
    let edges = this._getCrossEdges()
    for (let edge of edges) {
      if (!this.isEdgeSolved(edge)) {
        return false
      }
    }

    return true
  }

  isEdgeSolved(edge) {
    let otherColor = edge.colors().find(color => color !== 'U')
    let otherFace = edge.faces().find(face => face !== 'UP')
    const matchesMiddle = otherFace[0] === otherColor
    const isOnCrossFace = edge.getColorOfFace('UP') === 'U'

    return isOnCrossFace && matchesMiddle
  }

  /**
   * Finds all edges that have 'F' as a color.
   * @return {array}
   */
  _getCrossEdges() {
    return this.cube.edges().filter(edge => edge.hasColor(CROSS_COLOR))
  }

  /**
   * 6 Cases!
   * 1) The edge's UP color is on the UP face.
   * 2) the edge's UP color is on the DOWN face.
   * 3) The edge's UP color is not on the UP or DOWN face and the other color is on the UP face.
   * 4) The edge's UP color is not on the UP or DOWN face and the other color is on the DOWN face.
   * 5) The edge's UP color is not on the UP or DOWN face and the other color is on the RELATIVE RIGHT face.
   * 6) The edge's UP color is not on the UP or DOWN face and the other color is on the RELATIVE LEFT face.
   *
   * @param {cubie} edge
   */
  _getCaseNumber({ edge }) {
    if (edge.getColorOfFace('UP') === CROSS_COLOR) {
      return 1
    } else if (edge.getColorOfFace('DOWN') === CROSS_COLOR) {
      return 2
    }

    if (edge.faces().includes('UP')) {
      return 3
    } else if (edge.faces().includes('DOWN')) {
      return 4
    }

    let crossFace = edge.getFaceOfColor(CROSS_COLOR)
    let otherFace = edge.getFaceOfColor(edge.colors().find(color => color !== CROSS_COLOR))
    let direction = utils.getDirectionFromFaces(crossFace, otherFace, { UP: 'UP' })

    if (direction === 'RIGHT') {
      return 5
    } else if (direction === 'LEFT') {
      return 6
    }
  }

  _solveCase1({ edge }) {
    if (this.isEdgeSolved(edge)) {
      return
    }

    let face = edge.faces().find(face => face !== 'UP')
    this.move(`${face} ${face}`)
    this._solveCase2({ edge })
  }

  _solveCase2({ edge }) {
    let solveMoves = this._case1And2Helper({ edge }, 2)
    this.move(solveMoves)
  }

  _solveCase3({ edge }) {
    let prepMove = this._case3And4Helper({ edge }, 3)
    this.move(prepMove)
    this._solveCase5({ edge })
  }

  _solveCase4({ edge }) {
    let prepMove = utils.getRotationFromTo(
      'DOWN',
      edge.getFaceOfColor('U'),
      utils.getFaceOfMove(edge.getColorOfFace('DOWN'))
    )
    this.move(prepMove)

    let edgeToMiddle = R(edge.getFaceOfColor('U'))

    this.move(edgeToMiddle)
    this._solveCase5({ edge })
  }

  _solveCase5({ edge }) {
    let solveMoves = this._case5And6Helper({ edge }, 5)
    this.move(solveMoves)
  }

  _solveCase6({ edge }) {
    let solveMoves = this._case5And6Helper({ edge }, 6)
    this.move(solveMoves)
  }

  _case1And2Helper({ edge }, caseNum) {
    let crossColorFace = caseNum === 1 ? 'UP' : 'DOWN'
    let currentFace = edge.faces().find(face => face !== crossColorFace)
    let targetFace = utils.getFaceOfMove(edge.getColorOfFace(currentFace))

    let solveMoves = utils.getRotationFromTo(crossColorFace, currentFace, targetFace)

    if (caseNum === 2) {
      let edgeToCrossFace = utils.getMoveOfFace(targetFace)
      solveMoves += ` ${edgeToCrossFace} ${edgeToCrossFace}`
    }

    return solveMoves
  }

  _case3And4Helper({ edge }, caseNum) {
    let prepMove = edge.faces().find(face => !['UP', 'DOWN'].includes(face))

    if (caseNum === 4) {
      prepMove = R(prepMove)
    }

    return prepMove
  }

  _case5And6Helper({ edge }, caseNum) {
    let otherColor = edge.colors().find(color => color !== 'U')
    let currentFace = edge.getFaceOfColor(otherColor)
    let targetFace = utils.getFaceOfMove(otherColor)

    let prepMove = utils.getRotationFromTo('UP', currentFace, targetFace)
    let edgeToCrossFace = utils.getMoveOfFace(currentFace)

    if (caseNum === 6) {
      edgeToCrossFace = R(edgeToCrossFace);
    }

    return `${R(prepMove)} ${edgeToCrossFace} ${prepMove}`
  }

  logSetup({ edge }) {
    let info = `${edge.colors()[0]} ${edge.colors()[1]}`
    this.LOG_SETUP(INDENT_LEVEL, 'edge', info)
  }

  logCaseNumber(caseNumber) {
    this.LOG_CASE_NUMBER(INDENT_LEVEL, 'cross case', caseNumber)
  }

  logTotalMoves() {
    let totalMoves = this.totalMoves.join(' ')
    this.LOG_TOTAL_MOVES(INDENT_LEVEL, totalMoves)
  }
}

module.exports = CrossSolver
