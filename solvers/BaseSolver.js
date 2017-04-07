const chalk = require('chalk')

class BaseSolver {
  /**
   * Solves the first step following the Fridrich Method: the cross. Solves the
   * cross on the UP face by default.
   *
   * @param {string|RubiksCube} rubiksCube - This can either be a 54-character
   * long string representing the cube state (in this case it will have to
   * "build" another rubik's Cube), or an already built RubiksCube object.
   */
  constructor(rubiksCube, options = {}) {
    this.cube = typeof rubiksCube === 'string' ? new RubiksCube(rubiksCube) : rubiksCube
    this.options = options

    this._afterEachCallbacks = []

    this.partition = {}
    this.partitions = []
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

  afterEach(callback) {
    if (typeof callback !== 'function') {
      return
    }

    this._afterEachCallbacks.push(callback)
  }

  triggerAfterEach(...args) {
    this._afterEachCallbacks.forEach(callback => callback(...args));
  }

  /**
   * Solves the edge and/or corner and returns information about the state
   * about them right before they are solved. It's important to construct the
   * object in steps for debugging, so that we can still have access to e.g.
   * the case number if the solve method fails.
   */
  _solve({ corner, edge }) {
    this.partition = {};

    this.partition.before = {
      corner: corner && corner.clone(),
      edge: edge && edge.clone()
    }

    this.partition.after = {
      corner: corner && corner,
      edge: edge && edge
    }

    this.partition.caseNumber = this._getCaseNumber({ corner, edge })

    this[`_solveCase${this.partition.caseNumber}`]({ corner, edge })
    this.partition.moves = this.totalMoves

    this.totalMoves = [];

    if (!this._overrideAfterEach) {
      this.triggerAfterEach(this.partition, this.phase)
    }

    return this.partition
  }
}

module.exports = BaseSolver
