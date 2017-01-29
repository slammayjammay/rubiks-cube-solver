const cross = require('gl-vec3/cross')
const Face = require('../models/Face')
const Vector = require('../models/Vector')

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
 * @return {string}
 */
const getAdjacentFaceDirection = (fromFace, toFace, orientation) => {
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

  let before, after
  let rotation1, rotation2

  // rotate fromFace to FRONT, and save the rotation
  before = fromFace.normal()
  fromFace.orientTo('FRONT')
  after = fromFace.normal()
  rotation1 = Face.getRotationFromNormals(before, after)

  // rotate orientationFrom by rotation1
  orientationFrom.rotate(rotation1.axis, rotation1.angle)

  // rotate orientationFrom to orientationTo and save the rotation
  before = orientationFrom.normal()
  orientationFrom.orientTo(orientationTo)
  after = orientationFrom.normal()
  rotation2 = Face.getRotationFromNormals(before, after)

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
  } else {
    return 'BACK'
  }
}

module.exports = {
  getAdjacentFaceDirection
}
