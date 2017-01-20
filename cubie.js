class Cubie {
  /**
   * @param {array} pos - The coordinates of this cubie's position
   */
  constructor(pos) {
    this.pos = pos
    this.x = pos[0]
    this.y = pos[1]
    this.z = pos[2]
    this.colors = []
  }

  addColor(color) {
    this.colors.push(color)
  }

  positionEquals(pos) {
    return this.x === pos[0] && this.y === pos[1] && this.z === pos[2]
  }
}

module.exports = Cubie
