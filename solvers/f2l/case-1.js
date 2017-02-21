const RubiksCube = require('../../models/RubiksCube')
const BaseSolver = require('./BaseSolver')
const utils = require('../../utils')

const R = (moves) => RubiksCube.reverseMoves(moves)

class case1Solver extends BaseSolver {
  solve({ corner, edge }) {
    let caseNum = this._getCaseNumber({ corner, edge })
    this[`_solveCase${caseNum}`]({ corner, edge })
  }

  /**
   * 10 Cases:
   * ---- Group 1: Corner's cross color is on DOWN ----
   * 1) Corner and edge share a face and colors on that face are equal.
   * 2) Corner and edge share a face and colors on that face are not equal.
   * 3) Corner's "right" color equals corner's "primary" color.
   * 4) Corner's "right" color does not equal corner's "primary" color.
   *
   * ---- Group 2: Corner's "other" color matches edge's "primary" color ----
   * 5) Pair is already matched up.
   * 6) Corner shares a face with edge.
   * 7) Corner does not share a face with edge.
   *
   * ---- Group 3: Corner's "other" color does not match edge's "primary" color ----
   * 8) Corner and edge are a separated pair.
   * 9) Corner shares a face with edge.
   * 10) Corner does not share a face with edge.
   *
   * TODO: Combine groups 1 and 2
   */
  _getCaseNumber({ corner, edge }) {
    if (corner.faces().includes('DOWN')) {
      return this._getGroup1Case({ corner, edge })
    }

    let primaryColor = edge.colors().find(color => {
      return edge.getFaceOfColor(color) !== 'DOWN'
    })
    let otherColor = corner.colors().find(color => {
      return color !== 'U' && corner.getFaceOfColor(color) !== 'DOWN'
    })

    if (primaryColor === otherColor) {
      return this._getGroup2Case({ corner, edge })
    } else {
      return this._getGroup3Case({ corner, edge })
    }
  }

  _getGroup1Case({ corner, edge }) {
    let sharedFace = false
    for (let face of edge.faces()) {
      if (corner.faces().includes(face)) {
        sharedFace = face
        break
      }
    }

    if (sharedFace) {
      if (corner.getColorOfFace(sharedFace) === edge.getColorOfFace(sharedFace)) {
        return 1
      } else {
        return 2
      }
    }

    let edgePrimaryColor = edge.colors().filter(color => edge.getFaceOfColor(color) !== 'DOWN')
    let faces = corner.faces().filter(face => face !== 'DOWN')

    let cornerRightColor
    if (utils.getFaceFromDirection(faces[0], 'RIGHT', { UP: 'UP' }) === faces[1]) {
      cornerRightColor = faces[1]
    } else if (utils.getFaceFromDirection(faces[1], 'RIGHT', { UP: 'UP' }) === faces[0]) {
      cornerRightColor = faces[0]
    }

    if (cornerRightColor === edgePrimaryColor) {
      return 3
    } else {
      return 4
    }
  }

  _getGroup2Case({ corner, edge }) {
    if (this.isPairMatched({ corner, edge })) {
      return 5
    }

    // corner and edge share a face
    if (corner.faces().includes(edge.faces().find(face => face !== 'DOWN'))) {
      return 6
    } else {
      return 7
    }
  }

  _getGroup3Case({ corner, edge }) {
    if (this.isPairSeparated({ corner, edge })) {
      return 8
    }

    // corner and edge share a face
    if (corner.faces().includes(edge.faces().find(face => face !== 'DOWN'))) {
      return 9
    } else {
      return 10
    }
  }

  _solveCase1({ corner, edge }) {
    // calculate which side the corner is on, the position, etc.
    let currentFace = edge.faces().find(face => face !== 'DOWN')
    let targetFace = utils.getFaceOfColor(edge.getColorOfFace('DOWN'))
    let prepFace = utils.getFaceFromDirection(targetFace, 'BACK', { DOWN: 'DOWN'})
    let otherFace = corner.faces().find(face => !edge.faces().includes(face))
    let isLeft = utils.getFaceFromDirection(targetFace, otherFace, { DOWN: 'DOWN' }) === 'LEFT'

    // the moves
    let prep = utils.getRotationFromTo('DOWN', currentFace, targetFace)
    let moveFace = utils.getMoveOfFace(otherFace)
    let dir = isLeft ? 'D' : 'DPrime'

    let solveMoves = `${prep} ${moveFace} ${moveFace} D D`
    solveMoves += `${moveFace} ${dir} ${R(moveFace)} ${dir} ${moveFace} ${moveFace}`
    this.move(solveMoves)
  }

  _solveCase2({ corner, edge }) {
    // calculate which side the corner is on, the position, etc.
    let currentFace = edge.faces().find(face => face !== 'DOWN')
    let targetFace = utils.getFaceOfColor(edge.getColorOfFace(currentFace))
    let otherFace = corner.faces().find(face => !edge.faces().includes(face))
    let isLeft = utils.getFaceFromDirection(otherFace, current, { DOWN: 'DOWN' }) === 'LEFT'

    // the moves
    let prep = utils.getRotationFromTo('DOWN', currentFace, targetFace)
    let moveFace = utils.getMoveOfFace(targetFace)
    moveFace = isLeft ? R(moveFace) : moveFace

    this.move(`${prep} ${moveFace} D D ${R(moveFace)}`)
    this.solveSeparatedPair({ corner, edge })
  }

  _solveCase3({ corner, edge }) {
    let currentFace = edge.faces().find(face => face !== 'DOWN')
    let targetFace = utils.getFaceOfColor(edge.getColorOfFace(currentFace))
    let otherFace = utils.getFaceOfColor(edge.getColorOfFace('DOWN'))

    // do the prep move now. need to calculate things after this move is done
    let prep = utils.getRotationFromTo('DOWN', currentFace, targetFace)
    this.move(prep)

    // the moves
    let open = R(targetFace)
    let dir = 'DPrime'
    this.move(`${open} ${dir} ${R(open)}`)
    this.solveMatchedPair({ corner, edge })
  }
}

module.exports = case1Solver
