const rotateX = require('gl-vec3/rotateX')
const rotateY = require('gl-vec3/rotateY')
const rotateZ = require('gl-vec3/rotateZ')

class Cubie {
  /**
   * @param {array} pos - The coordinates of this cubie's position.
   */
  constructor(pos) {
    this.setPosition(pos)

    this._normalToColor = {}
    this._faceToNormal = {
      FRONT: '0 0 1',
      RIGHT: '1 0 0',
      UP: '0 1 0',
      DOWN: '0 -1 0',
      LEFT: '-1 0 0',
      BACK: '0 0 -1'
    }
  }

  /**
   * Sets a color on a given face or normal of a cubie.
   * @return {null}
   */
  setColor(face, color) {
    let normal = this._faceToNormal[face]
    this._normalToColor[normal] = color
  }

  getColorOfFace(face) {
    let normal = this._faceToNormal[face]
    return this._normalToColor[normal]
  }

  /**
   * @return {boolean}
   */
  positionEquals(pos) {
    return this.x === pos[0] && this.y === pos[1] && this.z === pos[2]
  }

  /**
   * Rotates the position vector around `axis` by `mag`.
   * @param {string} axis - The axis of rotation.
   * @param {number} mag - The magnitude of rotation.
   */
  rotate(axis, mag) {
    let rotationFn = eval(`rotate${axis.toUpperCase()}`)

    let out = [0, 0, 0]
    let origin = this._newVector(axis, 1)

    let newPos = rotationFn(out, this.pos, origin, mag).map(value => {
      return Math.round(value)
    })
    let newColors = this.getNewColors(axis, newPos)

    this.setPosition(newPos)
    this.setColors(newColors)
  }

  /**
   * Returns a normal-to-color map based on the rotation axis and the new
   * position after the rotation. This will later be assigned to `this.pos`.
   * NOTE: After every rotation, the normal-color-map will need to be updated,
   * but the normal that equals the axis rotation will not have its color
   * changed.
   *
   * @param {string} axis - The axis of rotation.
   * @param {array} newPos - The new position vector.
   * @return {object} - The new normal-color map.
   */
  getNewColors(axis, newPos) {
    let ret = {}

    // get the current and updated array of normals, sorted as 'x', 'y', 'z'
    let normals = this._sortNormals(Object.keys(this._normalToColor))
    let newNormals = this._createNormals(newPos)

    // find the normal that "matches" the rotation axis (sort of hack-y)
    let rotationNormal
    for (let normal of normals) {
      if (this._getAxisOfNormal(normal) === axis) {
        rotationNormal = normal
        break
      }
    }

    // splice out the rotation normal from the normal arrays, as this is the
    // one normal-color pair that will not change.
    normals.splice(normals.indexOf(rotationNormal), 1)
    newNormals.splice(newNormals.indexOf(rotationNormal), 1)

    ret[rotationNormal] = this._normalToColor[rotationNormal]

    // Different for corners, edges, and middles......
    if (normals.length === 0) {
      return ret
    } else if (normals.length === 1) {
      ret[newNormals[0]] = this._normalToColor[normals[0]]
    } else if (normals.length === 2) {
      ret[newNormals[0]] = this._normalToColor[normals[1]]
      ret[newNormals[1]] = this._normalToColor[normals[0]]
    }

    return ret
  }

  setPosition(newPos) {
    this.pos = newPos
    this.x = newPos[0]
    this.y = newPos[1]
    this.z = newPos[2]
  }

  setColors(newColors) {
    this._normalToColor = newColors
  }

  /**
   * Finds the index of the first non-zero value. Returns 'x', 'y', or 'z' if
   * the index is 0, 1, or 2 respectively.
   * @param {array} normal - The vector representing a normal.
   */
  _getAxisOfNormal(normal) {
    let axes = normal.split(' ')
    let index = axes.findIndex(value => parseInt(value) !== 0)

    if (index === 0) return 'x'
    if (index === 1) return 'y'
    if (index === 2) return 'z'
  }

  /**
   * @param {array} normals - The array of strings representing normals.
   */
  _sortNormals(normals) {
    return normals.sort((first, second) => {
      let firstIdx = first.split(' ').findIndex(value => parseInt(value) !== 0)
      let secondIdx = second.split(' ').findIndex(value => parseInt(value) !== 0)
      return firstIdx - secondIdx
    })
  }

  /**
   * @param {array} pos - The position vector.
   * @return {array} - An array of strings representing normals.
   */
  _createNormals(pos) {
    let normals = []

    for (let i = 0; i < pos.length; i++) {
      if (pos[i] === 0) {
        continue
      }
      let newNormal = [0, 0, 0]
      newNormal[i] = pos[i]
      normals.push(newNormal.join(' '))
    }

    return normals

    // return [
    //   `${pos[0]} 0 0`,
    //   `0 ${pos[1]} 0`,
    //   `0 0 ${pos[2]}`
    // ]
  }

  /**
   * Creates and returns a vector setting the given axis with the given mag,
   * and all other axes with a value of 0.
   * @return {array}
   */
  _newVector(axis, mag) {
    axis = axis.toLowerCase()

    if (axis === 'x') {
      return [mag, 0, 0]
    } else if (axis === 'y') {
      return [0, mag, 0]
    } else if (axis === 'z') {
      return [0, 0, mag]
    }
  }
}

module.exports = Cubie
