const cross = require('gl-vec3/cross')
const Face = require('../models/Face')
const Vector = require('../models/Vector')

/**
 * @param {string} move - The notation of a move, e.g. rPrime.
 * @return {string}
 */
const getFaceOfMove = (move) => {
  let faceLetter = move[0].toUpperCase()

  if (faceLetter === 'F') return 'FRONT'
  if (faceLetter === 'R') return 'RIGHT'
  if (faceLetter === 'U') return 'UP'
  if (faceLetter === 'D') return 'DOWN'
  if (faceLetter === 'L') return 'LEFT'
  if (faceLetter === 'B') return 'BACK'
}

/**
 * Almost useless. Almost.
 * @param {string} face - The string identifying a face.
 * @return {string}
 */
const getMoveOfFace = (face) => {
  return face[0].toUpperCase()
}

/**
 * Given a from-face, a to-face, and an orientation object, this returns an
 * adjacent face of from-face that points to to-face when the cube is oriented
 * specified by the orientation object.
 *
 * For example, ('DOWN', 'RIGHT', { TOP: 'BACK' }). This translates to:
 *   1) Orient the cube such that the DOWN face becomes the FRONT face.
 *   2) Then, orient the cube such that the face that was BACK becomes TOP.
 *   3) Of all the adjacent faces attached to the DOWN face (which is now the
 *      FRONT face), find the direction that points to 'RIGHT' (the given face).
 *   4) In this case, the function would return 'LEFT'.
 *   5) NOTE: The orientation object's key cannot be 'FRONT' or 'BACK'. `fromFace`
 *      is automatically oriented to become the FRONT face, and FRONT and BACK are not
 *      adjacent faces of FRONT.
 *
 * @param {Face|string} fromFace - The from face.
 * @param {Face|string} toFace - The to face.
 * @param {object} orientation - The object that specifies the cube orientation.
 * @return {string|number}
 */
const getFaceDirection = (fromFace, toFace, orientation) => {
  let _orientationKey = Object.keys(orientation)[0].toUpperCase()

  // throw error if orientation is not specific enough
  if (['FRONT', 'BACK'].includes(_orientationKey)) {
    throw new Error(`${orientation} does not correctly specify an orientation.`)
  }

  // parse arguments, sort of
  fromFace = new Face(fromFace)
  toFace = new Face(toFace)
  const orientationFrom = new Face(orientation[_orientationKey])
  const orientationTo = new Face(_orientationKey)

  // rotate fromFace to FRONT, and save the rotation
  let rotation1 = Vector.getRotationFromNormals(
    fromFace.normal(),
    fromFace.orientTo('FRONT').normal()
  )

  // rotate orientationFrom by rotation1
  orientationFrom.rotate(rotation1.axis, rotation1.angle)

  // rotate orientationFrom to orientationTo and save the rotation
  let rotation2 = Vector.getRotationFromNormals(
    orientationFrom.normal(),
    orientationFrom.orientTo(orientationTo).normal()
  )

  // perform rotation2 on fromFace
  fromFace.rotate(rotation2.axis, rotation2.angle)

  // perform both rotations on toFace
  toFace.rotate(rotation1.axis, rotation1.angle)
  toFace.rotate(rotation2.axis, rotation2.angle)

  let axis = new Vector(cross([], fromFace.normal(), toFace.normal())).getAxis()
  let direction = Vector.getAngle(fromFace.normal(), toFace.normal())

  if (axis === 'x' && direction > 0) return 'DOWN'
  if (axis === 'x' && direction < 0) return 'UP'
  if (axis === 'y' && direction > 0) return 'RIGHT'
  if (axis === 'y' && direction < 0) return 'LEFT'

  if (direction === 0) {
    return 'FRONT'
  } else if (direction === Math.PI) {
    return 'BACK'
  }
}

/**
 * Finds a move that rotates the given face around its normal, by the angle
 * described by normal1 -> normal2.
 * @param {string} face - The face to rotate.
 * @param {string} from - The from face.
 * @param {string} to - The to face.
 * @return {string}
 */
const getRotationFromTo = (face, from, to) => {
  const rotationFace = new Face(face)
  const fromFace = new Face(from)
  const toFace = new Face(to)

  let move = getMoveOfFace(face)
  let angle = Vector.getAngle(fromFace.normal(), toFace.normal())
  if (rotationFace.vector.getMagnitude() < 0) {
    angle *= -1
  }

  if (angle === 0) {
    return ``
  } else if (Math.abs(angle) === Math.PI) {
    return `${move} ${move}`
  } else if (angle < 0) {
    return `${move}`
  } else if (angle > 0) {
    return `${move}Prime`
  }
}

module.exports = {
  getFaceOfMove,
  getMoveOfFace,
  getFaceDirection,
  getRotationFromTo
}
