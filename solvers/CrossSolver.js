const BaseSolver = require('./BaseSolver')
const RubiksCube = require('../models/RubiksCube')
const Cubie = require('../models/Cubie')
const Face = require('../models/Face')
const utils = require('../utils')

const CROSS_COLOR = 'U'

class CrossSolver extends BaseSolver {
  solve() {
    let crossEdges = this._getCrossEdges()
    for (let edge of crossEdges) {
      this._solveEdge(edge)
    }

    return this.totalMoves.join(' ')
  }

  /**
   * Finds all edges that have 'F' as a color.
   * @return {array}
   */
  _getCrossEdges() {
    return this.cube.edges().filter(edge => edge.hasColor(CROSS_COLOR))
  }

  /**
   * @param {cubie} edge - The edge that will be solved.
   */
  _solveEdge(edge) {
    let caseNumber = this._getCaseNumber(edge)
    let solveMoves = this[`_solveCase${caseNumber}`](edge)
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
  _getCaseNumber(edge) {
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

  _solveCase1(edge) {
    let solveMoves = this._case1And2Helper(edge, 1)
    this.move(solveMoves)
  }

  _solveCase2(edge) {
    let solveMoves = this._case1And2Helper(edge, 2)
    this.move(solveMoves)
  }

  _solveCase3(edge) {
    let prepMove = this._case3And4Helper(edge, 3)
    this.move(prepMove)
    this._solveCase5(edge)
  }

  _solveCase4(edge) {
    let prepMove =  this._case3And4Helper(edge, 4)
    this.move(prepMove)
    this._solveCase5(edge)
  }

  _solveCase5(edge) {
    let solveMoves = this._case5And6Helper(edge, 5)
    this.move(solveMoves)
  }

  _solveCase6(edge) {
    let solveMoves = this._case5And6Helper(edge, 6)
    this.move(solveMoves)
  }

  _case1And2Helper(edge, caseNum) {
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

  _case3And4Helper(edge, caseNum) {
    let face = edge.faces().find(face => face !== 'UP')
    let prepMove = utils.getMoveOfFace(face)

    if (caseNum === 4) {
      prepMove += 'Prime'
    }

    return prepMove
  }

  _case5And6Helper(edge, caseNum) {
    let otherColor = edge.colors().find(color => color !== 'U')
    let currentFace = edge.getFaceOfColor(otherColor)
    let targetFace = utils.getFaceOfMove(otherColor)

    let prepMove = utils.getRotationFromTo('UP', currentFace, targetFace)
    let edgeToCrossFace = utils.getMoveOfFace(currentFace)

    if (caseNum === 6) {
      edgeToCrossFace = RubiksCube.reverseMoves(edgeToCrossFace);
    }

    return `${RubiksCube.reverseMoves(prepMove)} ${edgeToCrossFace} ${prepMove}`
  }
}

module.exports = CrossSolver
