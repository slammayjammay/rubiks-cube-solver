const BaseSolver = require('./BaseSolver')
const RubiksCube = require('../models/RubiksCube')
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

    console.log(`--- TESTING Case Numbers ---`)

    tests.forEach(({ face1, face2, expect }) => {
      let edge = new Cubie([0, 1, 1]).colorFace(face1, 'U').colorFace(face2, 'R')
      let result = this._getCaseNumber(edge) === expect

      if (result) {
        console.log(`test SUCCESS`)
      } else {
        console.log(`test FAILED --> expected: "${test.expect}" --> got: "${result}"`)
      }
    })

    console.log()
  }

  testCase1() {
    let tests = [
      { position: [0, 1, 1], currentFace: 'FRONT', color: 'F' },
      { position: [0, 1, 1], currentFace: 'FRONT', color: 'L' },
      { position: [0, 1, 1], currentFace: 'FRONT', color: 'R' },
      { position: [0, 1, 1], currentFace: 'FRONT', color: 'B' },
      { position: [1, 1, 0], currentFace: 'RIGHT', color: 'L' },
      { position: [1, 1, 0], currentFace: 'RIGHT', color: 'F' },
      { position: [-1, 1, 0], currentFace: 'LEFT', color: 'B' },
      { position: [-1, 1, 0], currentFace: 'BACK', color: 'L' }
    ]

    this._test('Case1', tests, ({ position, currentFace, color }) => {
      let edge = new Cubie(position).colorFace('UP', 'U').colorFace(currentFace, color)
      let solveMoves = this._solveCase1(edge)
      return { edge, solveMoves }
    })
  }

  testCase2() {
    let tests = [
      { position: [0, -1, 1], currentFace: 'FRONT', color: 'F' },
      { position: [0, -1, 1], currentFace: 'FRONT', color: 'L' },
      { position: [0, -1, 1], currentFace: 'FRONT', color: 'R' },
      { position: [0, -1, 1], currentFace: 'FRONT', color: 'B' },
      { position: [1, -1, 0], currentFace: 'RIGHT', color: 'L' },
      { position: [1, -1, 0], currentFace: 'RIGHT', color: 'F' },
      { position: [-1, -1, 0], currentFace: 'LEFT', color: 'B' },
      { position: [0, -1, -1], currentFace: 'BACK', color: 'L' }
    ]

    this._test('Case2', tests, ({ position, currentFace, color }) => {
      let edge = new Cubie(position).colorFace('DOWN', 'U').colorFace(currentFace, color)
      let solveMoves = this._solveCase2(edge)
      return { edge, solveMoves }
    })
  }

  /**
   * @param {string} testName - The name of the test.
   * @param {array} tests - The list of tests to run.
   * @param {function} runTest - The callback to run for each test.
   * @return {null}
   */
  _test(testName, tests, runTest) {
    console.log(`--- TESTING ${testName} ---`)
    for (let test of tests) {
      let { edge, solveMoves } = runTest(test)

      let fakeCube = RubiksCube.Solved()
      fakeCube._cubies.push(edge)
      fakeCube.move(solveMoves)

      let otherColor = edge.colors().find(color => color !== 'U')
      let otherFace = edge.faces().find(face => face !== 'UP')
      const isMatchingMiddle = otherFace[0] === otherColor
      const isOnCrossFace = edge.getColorOfFace('UP') === 'U'

      if (isOnCrossFace && isMatchingMiddle) {
        console.log(`test SUCCESS`)
      } else {
        console.log('FAIL: ', edge._normalToColor)
      }
    }
    console.log()
  }
}

module.exports = CrossSolver
