const cross = require('gl-vec3/cross')
const Vector = require('./Vector')

const faceToNormal = {
  FRONT: '0 0 1',
  RIGHT: '1 0 0',
  UP: '0 1 0',
  DOWN: '0 -1 0',
  LEFT: '-1 0 0',
  BACK: '0 0 -1'
}

class Face {
  /**
   * @param {string} face - The string of a face, e.g. 'RIGHT'.
   */
  constructor(face) {
    face = face.toUpperCase()
    this.vector = Vector.fromString(faceToNormal[face])
  }

  /**
   * Method to return the normal as an array.
   * @return {array}
   */
  normal() {
    return this.vector.toArray()
  }

  /**
   * @return {string}
   */
  toString() {
    return Face.getFace(this.normal())
  }

  /**
   * Simulates an orientation change where this face becomes the new given face.
   * NOTE: this only changes this face's normals, not any cubies' positions.
   * @param {string} face - The new face, e.g. 'FRONT'
   */
  orientTo(newFace) {
    if (typeof newFace === 'string') {
      newFace = new Face(newFace)
    }

    let { axis, angle } = Face.getRotationFromNormals(this.normal(), newFace.normal())
    this.vector.rotate(axis, angle)
  }

  /**
   * Convenience method for rotating this face. NOTE: this only changes this
   * face's normals, not any cubies' positions.
   * @param {string} axis - Axis of rotation.
   * @param {number} angle - Angle of rotation.
   * @return {Face}
   */
  rotate(axis, angle) {
    this.vector.rotate(axis, angle)
    return this
  }
}

/**
 * @param {string} face - A string that identifies a face.
 * @return {array}
 */
Face.getNormal = (face) => {
  return Vector.fromString(faceToNormal[face]).toArray()
}

/**
 * @param {string|array} normal - The normal that identifies a face.
 * @return {string}
 */
Face.getFace = (normal) => {
  if (typeof normal === 'string') {
    normal = Vector.fromString(normal).toArray()
  }

  for (let face of Object.keys(faceToNormal)) {
    if (normal.join(' ') === faceToNormal[face]) {
      return face
    }
  }
}

/**
 * @param {string|array} normal - The normal that identifies this face.
 * @return {Face}
 */
Face.fromNormal = (normal) => {
  if (typeof normal === 'string') {
    normal = Vector.fromString(normal).toArray()
  }

  return new Face(Face.getFace(normal))
}

/**
 * Rotates this face by a rotation and angle given by a from normal and a to
 * normal.
 * @param {array} normal1 - The normal to rotate from.
 * @param {array} normal2 - The normal to rotate to.
 * @return {object} - Stores the rotation axis and angle
 */
Face.getRotationFromNormals = (normal1, normal2) => {
  let axis = new Vector(cross([], normal1, normal2)).getAxis()
  let angle = Vector.getAngle(normal1, normal2)

  // when normal1 is equal to or opposite from normal2, it means 2 things: 1)
  // the cross axis is undefined and 2) the angle is either 0 or PI. This
  // means that rotating around the axis parallel to normal1 will not result
  // in any change, while rotating around either of the other two will work
  // properly.
  if (!axis) {
    let axes = ['x', 'y', 'z']
    axes.splice(axes.indexOf(new Vector(normal1).getAxis()), 1)
    axis = axes[0]
  }

  return { axis, angle }
}

Face.FRONT = new Face('FRONT')
Face.RIGHT = new Face('RIGHT')
Face.UP = new Face('UP')
Face.DOWN = new Face('DOWN')
Face.LEFT = new Face('LEFT')
Face.BACK = new Face('BACK')

module.exports = Face
