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
   * @return {null}
   */
  setColor(face, color) {

    let normal = Face.getNormal(face).join(' ')
    this._normalToColor[normal] = color
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

    return Face.findFace(normal)
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

  // /**
  //  * Returns a normal-to-color map based on the rotation axis and the new
  //  * position after the rotation. This will later be assigned to `this.pos`.
  //  * NOTE: After every rotation, the normal-color-map will need to be updated,
  //  * but the normal that equals the axis rotation will not have its color
  //  * changed.
  //  *
  //  * @param {string} axis - The axis of rotation.
  //  * @param {array} newPos - The new position vector.
  //  * @return {object} - The new normal-color map.
  //  */
  // _getNewColors(axis, newPos) {
  //   let ret = {}
  //
  //   // get the current and updated array of normals, sorted as 'x', 'y', 'z'
  //   let normals = this._sortNormals(Object.keys(this._normalToColor))
  //   let newNormals = this._createNormals(newPos)
  //
  //   // find the normal that "matches" the rotation axis (sort of hack-y)
  //   let rotationNormal
  //   for (let normal of normals) {
  //     if (this._getAxisOfNormal(normal) === axis) {
  //       rotationNormal = normal
  //       break
  //     }
  //   }
  //
  //   // splice out the rotation normal from the normal arrays, as this is the
  //   // one normal-color pair that will not change.
  //   normals.splice(normals.indexOf(rotationNormal), 1)
  //   newNormals.splice(newNormals.indexOf(rotationNormal), 1)
  //
  //   ret[rotationNormal] = this._normalToColor[rotationNormal]
  //
  //   // Different for corners, edges, and middles......
  //   if (normals.length === 0) {
  //     return ret
  //   } else if (normals.length === 1) {
  //     ret[newNormals[0]] = this._normalToColor[normals[0]]
  //   } else if (normals.length === 2) {
  //     ret[newNormals[0]] = this._normalToColor[normals[1]]
  //     ret[newNormals[1]] = this._normalToColor[normals[0]]
  //   }
  //
  //   return ret
  // }

  // /**
  //  * Finds the index of the first non-zero value. Returns 'x', 'y', or 'z' if
  //  * the index is 0, 1, or 2 respectively.
  //  * @param {array} normal - The vector representing a normal.
  //  */
  // _getAxisOfNormal(normal) {
  //   let axes = normal.split(' ')
  //   let index = axes.findIndex(value => parseInt(value) !== 0)
  //
  //   if (index === 0) return 'x'
  //   if (index === 1) return 'y'
  //   if (index === 2) return 'z'
  // }

  // /**
  //  * @param {array} normals - The array of strings representing normals.
  //  */
  // _sortNormals(normals) {
  //   return normals.sort((first, second) => {
  //     let firstIdx = first.split(' ').findIndex(value => parseInt(value) !== 0)
  //     let secondIdx = second.split(' ').findIndex(value => parseInt(value) !== 0)
  //     return firstIdx - secondIdx
  //   })
  // }

  // /**
  //  * @param {array} pos - The position vector.
  //  * @return {array} - An array of strings representing normals.
  //  */
  // _createNormals(pos) {
  //   let normals = []
  //
  //   for (let i = 0; i < pos.length; i++) {
  //     if (pos[i] === 0) {
  //       continue
  //     }
  //     let newNormal = [0, 0, 0]
  //     newNormal[i] = pos[i]
  //     normals.push(newNormal.join(' '))
  //   }
  //
  //   return normals
  // }

  // /**
  //  * Creates and returns a vector setting the given axis with the given mag,
  //  * and all other axes with a value of 0.
  //  * @return {array}
  //  */
  // _newVector(axis, mag) {
  //   axis = axis.toLowerCase()
  //
  //   if (axis === 'x') {
  //     return [mag, 0, 0]
  //   } else if (axis === 'y') {
  //     return [0, mag, 0]
  //   } else if (axis === 'z') {
  //     return [0, 0, mag]
  //   }
  // }
}

module.exports = Cubie
