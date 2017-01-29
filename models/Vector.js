const angle = require('gl-vec3/angle')
const cross = require('gl-vec3/cross')
const rotateX = require('gl-vec3/rotateX')
const rotateY = require('gl-vec3/rotateY')
const rotateZ = require('gl-vec3/rotateZ')

class Vector {
  /**
   * @param {array} vector - Contains x, y, and z values.
   */
  constructor(vector) {
    this.set(vector)
  }

  /**
   * @return {array}
   */
  toArray() {
    return this.vector
  }

  /**
   * @param {array} vector - The new vector to store.
   */
  set(vector) {
    this.vector = vector.map(value => Math.round(value))
  }

  /**
   * @return {number}
   */
  getX() {
    return this.toArray()[0]
  }

  /**
   * @return {number}
   */
  getY() {
    return this.toArray()[1]
  }

  /**
   * @return {number}
   */
  getZ() {
    return this.toArray()[2]
  }

  /**
   * Kind of a flimsy method. If this vector points parallel to an axis, this
   * returns true. A hacky way to find this is to count the number of 0's and
   * return true if and only if the count is 2.
   * @return {boolean}
   */
  isAxis() {
    let count = 0
    for (let value of this.vector) {
      if (value === 0) {
        count += 1
      }
    }

    return count === 2
  }

  /**
   * Kind of a flimsy method. If this vector points parallel to an axis, return
   * that axis.
   * @return {string}
   */
  getAxis() {
    if (!this.isAxis()) {
      return
    }

    if (this.vector[0] !== 0) return 'x'
    if (this.vector[1] !== 0) return 'y'
    if (this.vector[2] !== 0) return 'z'
  }

  /**
   * Kind of a flimsy method. If this vector points parallel to an axis, return
   * the magnitude of the value along that axis. (Basically, return whether it
   * is positive or negative.)
   * @return {number}
   */
  getMagnitude() {
    if (!this.isAxis()) {
      return
    }

    return this[`get${this.getAxis().toUpperCase()}`]()
  }

  /**
   * @param {string} axis - The axis to rotate around.
   * @param {number} angle - The angle of rotation.
   * @return {Vector}
   */
  rotate(axis, angle) {
    let rotateFn = eval(`rotate${axis.toUpperCase()}`)
    this.set(rotateFn([], this.vector, [0, 0, 0], angle))
    return this
  }
}

/**
 * @param {string} vector - Space-deliminated x, y, and z values.
 * @return {Vector}
 */
Vector.fromString = (vector) => {
  return new Vector(vector.split(' ').map(value => parseInt(value)))
}

/**
 * @param {array} vector1 - Vector 1.
 * @param {array} vector2 - Vector 2.
 * @return {boolean}
 */
Vector.areEqual = (vector1, vector2) => {
  return vector1[0] === vector2[0] && vector1[1] === vector2[1] && vector1[2] === vector2[2]
}

/**
* Helper method. gl-vec3's angle function always returns positive but in many
* cases we want the angle in the direction from one vector to another. To get
* the sign of the angle, cross the two vectors and determine the direction the
* crossed vector, um, directs in. For example, the vector [0, -1, 0] would
* shoot negatively along the y-axis.
*
* @param {array} v1 - Vector 1.
* @param {array} v2 - Vector 2.
*/
Vector.getAngle = (v1, v2) => {
  let _angle = angle(v1, v2)
  let crossVector = cross([], v1, v2)
  let sign = new Vector(crossVector).getMagnitude()

  return sign ? _angle * sign : _angle
}

module.exports = Vector
