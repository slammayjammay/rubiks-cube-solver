const BaseSolver = require('../BaseSolver')
const utils = require('../../utils')

const R = (moves) => RubiksCube.reverseMoves(moves)

class OLLSolver extends BaseSolver {
  constructor(...args) {
    super(...args)

    this.phase = 'oll'
  }

  solve() {
    return this._solve()
  }

  _getCaseNumber() {
    let ollString = this.getOllString()
  }

  getOllString() {
    let orientations = []

    let cubies = this.getOllCubies()
    cubies.forEach(cubie => {
      let orientation = this.getOrientation(cubie)
      orientations.push(orientation)
    })

    return orientations.join('')
  }

  getOllCubies() {
    let positions = [
      ['FRONT', 'DOWN', 'RIGHT'],
      ['FRONT', 'DOWN'],
      ['FRONT', 'DOWN', 'LEFT'],
      ['LEFT', 'DOWN'],
      ['LEFT', 'DOWN', 'BACK'],
      ['BACK', 'DOWN'],
      ['BACK', 'DOWN', 'RIGHT'],
      ['RIGHT', 'DOWN']
    ]

    return positions.map(pos => this.cube.getCubie(pos))
  }

  /**
   * Returns a number indicating the orientation of the cubie.
   * 0 --> The DOWN color is on the DOWN face.
   * 1 --> The DOWN color is a clockwise rotation from "solved".
   * 2 --> The DOWN color is a counter-clockwise rotation from "solved".
   */
  getOrientation(cubie) {
    if (cubie.getColorOfFace('DOWN') === 'D') {
      return 0
    }

    // if cubie is an edge piece, return 1
    if (cubie.isEdge()) {
      return 1
    }

    let [face1, face2] = cubie.faces().filter(face => face !== 'DOWN')
    let dir = utils.getDirectionFromFaces(face1, face2, { UP: 'DOWN' })
    let rightFace = dir === 'RIGHT' ? face2 : face1

    return cubie.getColorOfFace(rightFace) === 'D' ? 1 : 2
  }
}

module.exports = OLLSolver
