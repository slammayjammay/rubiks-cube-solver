const cross = require('gl-vec3/cross')
const Face = require('../models/Face')
const Vector = require('../models/Vector')

/**
 * @param {string} move - The notation of a move, e.g. rPrime.
 * @return {string}
 */
const getFaceOfMove = (move) => {
  if (typeof move !== 'string') {
    throw new TypeError('move must be a string')
  }

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
  if (!['FRONT', 'RIGHT', 'UP', 'DOWN', 'LEFT', 'BACK'].includes(face.toUpperCase())) {
    throw new Error(`${face} is not valid face`)
  }

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
 *   5) NOTE: The orientation object's key cannot be 'FRONT' or 'BACK'. `origin`
 *      is automatically oriented to become the FRONT face, and FRONT and BACK are not
 *      adjacent faces of FRONT.
 *
 * @param {string} origin - The origin face.
 * @param {string} target - The target face.
 * @param {object} orientation - The object that specifies the cube orientation.
 * @return {string|number}
 */
const getDirectionFromFaces = (origin, target, orientation) => {
  // parse arguments, sort of
  let _orientationKey = Object.keys(orientation)[0]
  const fromFace = new Face(origin)
  const toFace = new Face(target)
  const orientationFrom = new Face(orientation[_orientationKey])
  const orientationTo = new Face(_orientationKey)

  let rotations = _getRotationsForOrientation(fromFace, orientationFrom, orientationTo)
  _rotateFacesByRotations([fromFace, toFace], rotations)

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
 * See `getDirectionFromFaces`. Almost identical, but instead of finding a
 * direction from an origin face and target face, this finds a target face from
 * an origin face and direction.
 * @param {string} origin - The origin face.
 * @param {string} direction - The direction.
 * @param {object} orientation - The orientation object.
 * @return {string}
 */
const getFaceFromDirection = (origin, direction, orientation) => {
  // parse arguments, sort of
  let _orientationKey = Object.keys(orientation)[0].toUpperCase()
  const fromFace = new Face(origin)
  const orientationFrom = new Face(orientation[_orientationKey])
  const orientationTo = new Face(_orientationKey)

  let rotations = _getRotationsForOrientation(fromFace, orientationFrom, orientationTo)
  // kinda hacky...but there should be at most two rotations. The second
  // rotation must be around 'z', otherwise the origin face will not stay on
  // FRONT.
  rotations[1].axis = 'z'
  _rotateFacesByRotations([fromFace], rotations)

  let directionFace = new Face(direction)
  let { axis, angle } = Vector.getRotationFromNormals(fromFace.normal(), directionFace.normal())
  fromFace.rotate(axis, angle)

  // at this point fromFace is now the target face, but we still need to revert
  // the orientation to return the correct string
  let reversedRotations = rotations.map(rotation => Vector.reverseRotation(rotation)).reverse()
  _rotateFacesByRotations([fromFace], reversedRotations)
  return fromFace.toString()
}

/**
 * Finds a move that rotates the given face around its normal, by the angle
 * described by normal1 -> normal2.
 * @param {string} face - The face to rotate.
 * @param {string} from - The origin face.
 * @param {string} to - The target face.
 * @return {string}
 */
const getRotationFromTo = (face, from, to) => {
  const rotationFace = new Face(face)
  const fromFace = new Face(from)
  const toFace = new Face(to)

  let rotationAxis = rotationFace.vector.getAxis()
  let [fromAxis, toAxis] = [fromFace.vector.getAxis(), toFace.vector.getAxis()]

  if ([fromAxis.toLowerCase(), toAxis.toLowerCase()].includes(rotationAxis.toLowerCase())) {
    throw new Error(`moving ${rotationFace} from ${fromFace} to ${toFace} is not possible.`)
  }

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
  getDirectionFromFaces,
  getRotationFromTo,
  getFaceFromDirection
}

//-----------------
// Helper functions
//-----------------

/**
 * @param {Face} fromFace - The from face.
 * @param {Face} orientationFrom - The face that will become `orientationTo`.
 * @param {Face} orientationTo - The face that `orientationFrom` becomes.
 * @return {array}
 */
function _getRotationsForOrientation(fromFace, orientationFrom, orientationTo) {
  // this is not meant to have any side effects, so clone the face objects.
  fromFace = new Face(fromFace.toString())
  orientationFrom = new Face(orientationFrom.toString())
  orientationTo = new Face(orientationTo.toString())

  // rotate fromFace to FRONT, and save the rotation
  let rotation1 = Vector.getRotationFromNormals(
    fromFace.normal(),
    fromFace.orientTo('FRONT').normal()
  )

  // rotate orientationFrom by rotation1
  orientationFrom.rotate(rotation1.axis, rotation1.angle)

  // at this point, the fromFace has already become FRONT. The orientationFrom
  // face and orientationTo face must be an adjacent face of FRONT. Otherwise,
  // there are multiple orientations that are possible.
  let _fromIsNotAjdacent = ['FRONT', 'BACK'].includes(orientationFrom.toString().toUpperCase())
  let _toIsNotAjdacent = ['FRONT', 'BACK'].includes(orientationTo.toString().toUpperCase())

  if (_fromIsNotAjdacent || _toIsNotAjdacent) {
    throw new Error(`The provied orientation object does not correctly specify a cube orientation.`)
  }

  // rotate orientationFrom to orientationTo and save the rotation
  let rotation2 = Vector.getRotationFromNormals(
    orientationFrom.normal(),
    orientationFrom.orientTo(orientationTo).normal()
  )

  return [rotation1, rotation2]
}

/**
 * @param {array} - Array of Face objects to rotate.
 * @param {array} - Array of rotations to apply to faces.
 * @return {null}
 */
function _rotateFacesByRotations(faces, rotations) {
  for (let face of faces) {
    for (let rotation of rotations) {
      face.rotate(rotation.axis, rotation.angle)
    }
  }
}
