const BaseSolver = require('./BaseSolver')
const Cubie = require('../models/Cubie')
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
    this[`_solveCase${caseNumber}`](edge)
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
    let direction = utils.getFaceDirection(crossFace, otherFace, { UP: 'UP' })

    if (direction === 'RIGHT') {
      return 5
    } else if (direction === 'LEFT') {
      return 6
    }
  }

  _solveCase1(edge) {
    let currentFace = edge.faces().find(face => face !== 'UP')
    let targetFace = utils.getFaceOfMove(edge.getColorOfFace(currentFace))
    let direction = utils.getFaceDirection(currentFace, targetFace, { UP: 'UP' }).toUpperCase()

    let solveMove = utils.getRotationFromTo('UP', currentFace, targetFace)
    this.move(solveMove)
  }

  testCaseNums() {
    let caseNumber, message
    let edge
    let [crossColor, otherColor] = ['U', 'R']

    // case 1
    edge = new Cubie([0, 1, 1]).colorFace('UP', crossColor).colorFace('FRONT', otherColor)
    console.log(this._getCaseNumber(edge) === 1 ? 'SUCCESS' : 'FAIL')
    // case 2
    edge = new Cubie([0, -1, 1]).colorFace('DOWN', crossColor).colorFace('FRONT', otherColor)
    console.log(this._getCaseNumber(edge) === 2 ? 'SUCCESS' : 'FAIL')
    // case 3
    edge = new Cubie([1, 1, 0]).colorFace('RIGHT', crossColor).colorFace('UP', otherColor)
    console.log(this._getCaseNumber(edge) === 3 ? 'SUCCESS' : 'FAIL')
    // case 4
    edge = new Cubie([1, -1, 0]).colorFace('RIGHT', crossColor).colorFace('DOWN', otherColor)
    console.log(this._getCaseNumber(edge) === 4 ? 'SUCCESS' : 'FAIL')
    // case 5
    edge = new Cubie([1, 0, -1]).colorFace('RIGHT', crossColor).colorFace('BACK', otherColor)
    console.log(this._getCaseNumber(edge) === 5 ? 'SUCCESS' : 'FAIL')
    // case 6
    edge = new Cubie([1, 0, 1]).colorFace('RIGHT', crossColor).colorFace('FRONT', otherColor)
    console.log(this._getCaseNumber(edge) === 6 ? 'SUCCESS' : 'FAIL')
  }
}

module.exports = CrossSolver
