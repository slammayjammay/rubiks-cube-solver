class BaseSolver {
  /**
   * Solves the first step following the Fridrich Method: the cross. Solves the
   * cross on the UP face by default.
   *
   * @param {string|RubiksCube} rubiksCube - This can either be a 54-character
   * long string representing the cube state (in this case it will have to
   * "build" another rubik's Cube), or an already built RubiksCube object.
   */
  constructor(rubiksCube) {
    this.cube = typeof rubiksCube === 'string' ? new RubiksCube(rubiksCube) : rubiksCube
    this.totalMoves = []
  }

  /**
   * @param {string} notation - A string of move(s) to execute and store.
   */
  move(notations) {
    for (let notation of notations.split(' ')) {
      if (notation !== '') {
        this.totalMoves.push(notation)
      }
    }
    this.cube.move(notations)
  }
}

module.exports = BaseSolver
