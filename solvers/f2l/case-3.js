const RubiksCube = require('../../models/RubiksCube')
const BaseSolver = require('./BaseSolver')
const utils = require('../../utils')

const R = (moves) => RubiksCube.reverseMoves(moves)

/**
 * Top level case 2:
 * Corner is on UP face and edge is on DOWN face.
 */
class Case3Solver extends BaseSolver {
  solve({ corner, edge }) {
    let caseNum = this._getCaseNumber({ corner, edge })
    this[`_solveCase${caseNum}`]({ corner, edge })
  }

  /**
   * 2 cases:
   *
   * 1) Corner's cross color is on the cross face.
   * 2) Corner's cross color is not on the cross face.
   */
  _getCaseNumber({ corner, edge }) {
    if (corner.getColorOfFace('UP') === 'U') {
      return 1
    } else {
      return 2
    }
  }

  _solveCase1({ corner, edge }) {
    let faces = corner.faces().filter(face => face !== 'UP')
    let direction = utils.getDirectionFromFaces(faces[0], faces[1], { UP: 'DOWN' })
    let [leftFace, rightFace] = direction === 'RIGHT' ? faces : faces.reverse()

    let currentFace = edge.faces().find(face => face !== 'DOWN')
    let primaryColor = edge.getColorOfFace(currentFace)

    let targetFace = utils.getFaceFromDirection(
      corner.getFaceOfColor(primaryColor),
      primaryColor === corner.getColorOfFace(rightFace) ? 'RIGHT' : 'LEFT',
      { UP: 'DOWN' }
    )
    let isLeft = primaryColor === corner.getColorOfFace(leftFace)

    let prep = utils.getRotationFromTo('DOWN', currentFace, targetFace)
    let moveFace = isLeft ? rightFace : R(leftFace)
    let dir = isLeft ? 'DPrime' : 'D'

    this.move(`${prep} ${moveFace} ${dir} ${R(moveFace)}`)
    this.solveMatchedPair({ corner, edge })
  }

  _solveCase2({ corner, edge }) {
    let otherColor = corner.colors().find(color => {
      return color !== 'U' && corner.getFaceOfColor(color) !== 'UP'
    })
    let currentFace = edge.faces().find(face => face !== 'DOWN')
    let primaryColor = edge.getColorOfFace(currentFace)

    let willBeMatched = otherColor !== primaryColor
    let targetFace = corner.getFaceOfColor(willBeMatched ? otherColor : 'U')

    let prep = utils.getRotationFromTo('DOWN', currentFace, targetFace)
    let isLeft = utils.getDirectionFromFaces(
      corner.getFaceOfColor(otherColor),
      corner.getFaceOfColor('U'),
      { UP: 'DOWN' }
    ) === 'LEFT'
    let dir = isLeft ? 'DPrime' : 'D'
    let moveFace = corner.getFaceOfColor('U')
    moveFace = isLeft ? R(moveFace) : moveFace

    this.move(`${prep} ${moveFace} ${dir} ${R(moveFace)}`)
    let solveFn = `solve${willBeMatched ? 'Matched' : 'Separated'}Pair`
    this[solveFn]({ corner, edge })
  }
}

module.exports = Case3Solver
