// const rotateX = require('gl-vec3/rotateX')
// const rotateY = require('gl-vec3/rotateY')
// const rotateZ = require('gl-vec3/rotateZ')
const Vector = require('./Vector')
const Face = require('./Face')

class Cubie {
  /**
   * @param {array} vector - The coordinates of this cubie's position.
   * @prop {object} _normalToColor - A map with normals as keys and colors
   * as values. For example: { '0 0 1' : 'F' }
   */
  constructor(vector) {
    this._normalToColor = {}
    this.position(vector)
  }

  /**
   * Getter/setter for the vector position.
   * @param {array} [vector] - The new position to store.
   * @return {array}
   */
  position(vector) {
    if (typeof vector === 'undefined') {
      return this.vector.toArray()
    }

    this.vector = new Vector(vector)
  }

  /**
   * @return {number}
   */
  getX() {
    return this.vector.getX()
  }

  /**
   * @return {number}
   */
  getY() {
    return this.vector.getY()
  }

  /**
   * @return {number}
   */
  getZ() {
    return this.vector.getZ()
  }

  /**
   * @return {boolean}
   */
  isCorner() {
    return Object.keys(this._normalToColor).length === 3
  }

  /**
   * @return {boolean}
   */
  isEdge() {
    return Object.keys(this._normalToColor).length === 2
  }

  /**
   * @return {boolean}
   */
  isMiddle() {
    return Object.keys(this._normalToColor).length === 1
  }

  /**
   * @return {array}
   */
  colors() {
    return Object.keys(this._normalToColor).map(normal => this._normalToColor[normal])
  }

  /**
   * @param {string} color - Check if the cubie has this color.
   * @return {boolean}
   */
  hasColor(color) {
    for (let normal of Object.keys(this._normalToColor)) {
      if (this._normalToColor[normal] === color) {
        return true
      }
    }

    return false
  }

  /**
   * Sets a color on a given face or normal of a cubie.
   * @param {string} face - The face of the cubie we want to set the color on.
   * @param {string} color - The color we want to set.
   * @return {Cubie}
   */
  colorFace(face, color) {
    let normal = Face.getNormal(face).join(' ')
    this._normalToColor[normal] = color
    return this
  }

  /**
   * @param {string} face - The color on the face this cubie sits on.
   * @return {string}
   */
  getColorOfFace(face) {
    let normal = Face.getNormal(face).join(' ')
    return this._normalToColor[normal]
  }

  /**
   * @param {string} color - Find the face that this color sits on.
   * @return {string}
   */
  getFaceOfColor(color) {
    let normal = Object.keys(this._normalToColor).find(cubieColor => {
      return this._normalToColor[cubieColor] === color
    })

    return Face.getFace(normal)
  }

  /**
   * Return all the faces this cubie sits on.
   * @return {array}
   */
  faces() {
    let faces = []

    for (let normal of Object.keys(this._normalToColor)) {
      faces.push(Face.getFace(normal))
    }

    return faces
  }

  /**
   * Rotates the position vector around `axis` by `angle`. Updates the internal
   * position vector and the normal-color map.
   * @param {string} axis - The axis of rotation.
   * @param {number} angle - The magnitude of rotation.
   * @return {null}
   */
  rotate(axis, angle) {
    // update position vector after rotation
    this.vector.rotate(axis, angle)

    // update normal-color map
    let newMap = {} // need to completely overwrite the old one

    // go through each normal, rotate it, and assign the new normal the old color
    for (let normal of Object.keys(this._normalToColor)) {
      let color = this._normalToColor[normal]
      let face = Face.fromNormal(normal)

      let newNormal = face.rotate(axis, angle).normal().join(' ')
      newMap[newNormal] = color
    }

    this._normalToColor = newMap
  }
}

module.exports = Cubie
