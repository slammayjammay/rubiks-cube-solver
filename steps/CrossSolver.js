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

  testAll() {
    this.testCaseNums()

    let numCases = 2 // since not all cases are defined yet
    for (let i = 1; i <= numCases; i++) {
      this[`testCase${i}`]()
    }
  }

  testCaseNums() {
    let tests = [
      { position: [0, 1, 1], face1: 'UP', face2: 'FRONT', expect: 1 },
      { position: [0, -1, 1], face1: 'DOWN', face2: 'FRONT', expect: 2 },
      { position: [1, 1, 0], face1: 'RIGHT', face2: 'UP', expect: 3 },
      { position: [1, -1, 0], face1: 'RIGHT', face2: 'DOWN', expect: 4 },
      { position: [1, 0, -1], face1: 'RIGHT', face2: 'BACK', expect: 5 },
      { position: [1, 0, 1], face1: 'RIGHT', face2: 'FRONT', expect: 6 }
    ]

    this._test('Case Numbers', tests, ({ face1, face2, expect }) => {
      let edge = new Cubie([0, 1, 1]).colorFace(face1, 'U').colorFace(face2, 'R')
      return this._getCaseNumber(edge) === expect
    })
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

    this._test('Case1', tests, ({ position, currentFace, color, expect }) => {
      let edge = new Cubie(position).colorFace('UP', 'UP').colorFace(currentFace, color)
      this._solveCase1(edge)
      return this._solveCase1(edge) === expect
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

    this._test('Case2', tests, ({ position, currentFace, color, expect }) => {
      let edge = new Cubie(position).colorFace('DOWN', 'DOWN').colorFace(currentFace, color)
      return this._solveCase2(edge).trim() === expect.trim()
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
      let result = testValueCallback(test)
      if (result === true) {
        console.log(`test SUCCESS`)
      } else {
        console.log(`test FAILED --> expected: "${test.expect}" --> got: "${result}"`)
      }
    }
    console.log()
  }
}

module.exports = CrossSolver
