const BaseSolver = require('../BaseSolver')
const RubiksCube = require('../../models/RubiksCube')
const utils = require('../../utils')

/**
 * NOTE: Solving this step is done when the cube is oriented so that the cross
 * face is on UP.
 */
class F2LBaseSolver extends BaseSolver {
  colorsMatch({ corner, edge }) {
    let colors = edge.colors()

    if (corner.colors().includes(colors[0]) && corner.colors().includes(colors[1])) {
      return true
    }

    return false
  }

  /**
   * Returns true only if the pair is matched and in the correct slot.
   */
  isPairSolved({ corner, edge }) {
    if (!this.isPairMatched({ corner, edge })) {
      return false
    }

    // is the corner on the cross face?
    if (corner.getFaceOfColor('U') !== 'UP') {
      return false
    }

    // are the edge's colors on the correct face? (e.g. is the edge's 'F' color
    // on the 'FRONT' face)?
    for (let color of edge.colors()) {
      let edgeFace = edge.getFaceOfColor(color)

      if (edge.getFaceOfColor(color) !== utils.getFaceOfMove(color)) {
        return false
      }
    }

    return true
  }

  isPairMatched({ corner, edge }) {
    // are the two non-cross colors the same?
    if (!this.colorsMatch({ corner, edge })) {
      return false
    }

    // for each color, do the corner and edge share the same face?
    for (let color of edge.colors()) {
      if (corner.getFaceOfColor(color) !== edge.getFaceOfColor(color)) {
        return false
      }
    }

    return true
  }

  isPairSeparated({ corner, edge }) {
    // colors must match
    if (!this.colorsMatch({ corner, edge })) {
      return false
    }

    // corner's white face cannot be UP or DOWN
    if (['UP', 'DOWN'].includes(corner.getFaceOfColor('U'))) {
      return false
    }

    // edge must be on the DOWN face
    if (!edge.faces().includes('DOWN')) {
      return false
    }


    let otherColor = corner.colors().find(color => {
      return color !== 'U' && corner.getFaceOfColor(color) !== 'DOWN'
    })

    // edge must be oriented properly
    if (edge.getFaceOfColor(otherColor) !== 'DOWN') {
      return false
    }

    // corner and edge must be one move away from matching
    let isOneMoveFromMatched = utils.getDirectionFromFaces(
      corner.getFaceOfColor(otherColor),
      edge.getFaceOfColor(corner.getColorOfFace('DOWN')),
      { UP: 'UP' }
    )

    if (isOneMoveFromMatched !== 'BACK') {
      return false
    }

    return true
  }

  solveMatchedPair({ corner, edge }) {
    // get the color that is not on the down face and is not the crossColor
    let matchedColor = edge.colors().find(color => {
      return edge.getFaceOfColor(color) !== 'DOWN'
    })

    let isLeft = utils.getDirectionFromFaces(
      edge.getFaceOfColor(matchedColor),
      corner.getFaceOfColor('U'),
      { UP: 'UP' }
    ).toUpperCase() === 'RIGHT' // may be counter-intuitive. The cross face is on UP

    let matchingFace = utils.getFaceOfMove(matchedColor)
    let prepFace = utils.getFaceFromDirection(matchingFace, isLeft ? 'RIGHT' : 'LEFT', { UP: 'UP' })

    let prep = utils.getRotationFromTo('DOWN', matchingFace, prepFace)
    let open = `${utils.getMoveOfFace(matchingFace)}${isLeft ? '' : 'Prime'}`
    let insert = isLeft ? 'DPrime' : 'D'

    this.move(`${prep} ${open} ${insert} ${RubiksCube.reverseMoves(open)}`)
  }

  solveSeparatedPair({ corner, edge }) {
    // get the color that is not on the down face and is not the crossColor
    let matchedColor = edge.colors().find(color => {
      return edge.getFaceOfColor(color) !== 'DOWN'
    })

    let isLeft = utils.getDirectionFromFaces(
      corner.getFaceOfColor('U'),
      edge.getFaceOfColor(matchedColor),
      { UP: 'UP' }
    ).toUpperCase() === 'RIGHT' // may be counter-intuitive. The cross face is on UP

    let currentFace = corner.getFaceOfColor('U')
    let prepFace = utils.getFaceOfMove(matchedColor)

    let prep = utils.getRotationFromTo('DOWN', currentFace, prepFace)
    let match = `${utils.getMoveOfFace(prepFace)}${isLeft ? 'Prime' : ''}`
    let insert = isLeft ? 'DPrime' : 'D'

    this.move(`${prep} ${match} ${insert} ${RubiksCube.reverseMoves(match)}`)
  }
}

module.exports = F2LBaseSolver
