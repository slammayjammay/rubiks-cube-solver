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
    let solveMoves = this._case1And2Helper(edge, 1)
    this.move(solveMoves)
    return solveMoves
  }

  _solveCase2(edge) {
    let solveMoves = this._case1And2Helper(edge, 2)
    this.move(solveMoves)
    return solveMoves
  }

  _case1And2Helper(edge, caseNum) {
    let crossColorFace = caseNum === 1 ? 'UP' : 'DOWN'

    let currentFace = edge.faces().find(face => face !== crossColorFace)
    let targetFace = utils.getFaceOfMove(edge.getColorOfFace(currentFace))
    let direction = utils.getFaceDirection(currentFace, targetFace, { UP: 'UP' })

    let solveMoves = utils.getRotationFromTo(crossColorFace, currentFace, targetFace)

    if (caseNum === 2) {
      let edgeToCrossFace = utils.getMoveOfFace(targetFace)
      solveMoves += ` ${edgeToCrossFace} ${edgeToCrossFace}`
    }

    return solveMoves
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

  testAllCases() {
    let numCases = 2 // since not all cases are defined yet
    for (let i = 1; i <= numCases; i++) {
      this[`testCase${i}`]()
    }
  }

  testCase1() {
    let tests = [
      { position: [0, 1, 1], currentFace: 'FRONT', color: 'F', expect: '' },
      { position: [0, 1, 1], currentFace: 'FRONT', color: 'L', expect: 'U' },
      { position: [0, 1, 1], currentFace: 'FRONT', color: 'R', expect: 'UPrime' },
      { position: [0, 1, 1], currentFace: 'FRONT', color: 'B', expect: 'U U' },
      { position: [1, 1, 0], currentFace: 'RIGHT', color: 'L', expect: 'U U' },
      { position: [1, 1, 0], currentFace: 'RIGHT', color: 'F', expect: 'U' },
      { position: [-1, 1, 0], currentFace: 'LEFT', color: 'B', expect: 'U' },
      { position: [-1, 1, 0], currentFace: 'BACK', color: 'L', expect: 'UPrime' }
    ]

    this._test('Case1', tests, (test) => {
      let edge = new Cubie(test.position).colorFace('UP', 'UP').colorFace(test.currentFace, test.color)
      this._solveCase1(edge)
      return this._solveCase1(edge) === test.expect
    })
  }

  testCase2() {
    let tests = [
      { position: [0, -1, 1], currentFace: 'FRONT', color: 'F', expect: 'F F' },
      { position: [0, -1, 1], currentFace: 'FRONT', color: 'L', expect: 'DPrime L L' },
      { position: [0, -1, 1], currentFace: 'FRONT', color: 'R', expect: 'D R R' },
      { position: [0, -1, 1], currentFace: 'FRONT', color: 'B', expect: 'D D B B' },
      { position: [1, -1, 0], currentFace: 'RIGHT', color: 'L', expect: 'D D L L' },
      { position: [1, -1, 0], currentFace: 'RIGHT', color: 'F', expect: 'DPrime F F' },
      { position: [-1, -1, 0], currentFace: 'LEFT', color: 'B', expect: 'DPrime B B' },
      { position: [-1, -1, 0], currentFace: 'BACK', color: 'L', expect: 'D L L' }
    ]

    this._test('Case2', tests, (test) => {
      let edge = new Cubie(test.position).colorFace('DOWN', 'DOWN').colorFace(test.currentFace, test.color)
      return this._solveCase2(edge).trim() === test.expect.trim()
    })
  }

  /**
   * @param {string} testName - The name of the test.
   * @param {array} tests - The list of tests to run.
   * @param {function} testValueCallback - The callback to run for the test value.
   * @return {null}
   */
  _test(testName, tests, testValueCallback) {
    console.log(`--- TESTING ${testName} ---`)
    for (let test of tests) {
      if (testValueCallback(test) === true) {
        console.log(`Test SUCCESS`)
      } else {
        console.log(`Test FAILED --> expected: "${test.expect}" --> got: "${result}"`)
      }
    }
    console.log()
  }
}

module.exports = CrossSolver
