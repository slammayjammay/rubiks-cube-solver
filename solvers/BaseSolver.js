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


  /**
   * Returns a string of move notations from an array of partitions. Each
   * partition contains information about a set of moves, most likely the solve
   * moves for specific case number. If { partition: true } is set, the array
   * is returned. Otherwise, we need to combine and return all the moves from
   * each partition.
   *
   * @param {array} partitions - An array of data about a particular move set.
   * @return {string}
   */
  // returnMoves(partitions) {
  //   if (this.partition) {
  //     return partitions
  //   }

  //   let moves = []

  //   partitions.forEach(partition => moves.push(...partition.moves))

  //   return moves.join(' ')
  // }

  // _solve({ corner, edge }) {
  //   // every subclass of BaseSolver follows the same formula.
  //   // it's important to log each step when they're being done, as any on step
  //   // can throw an error and we could lose important information.

  //   // this is useful for debugging. when an error is thrown (inside a try /
  //   // catch) we have access to the pieces that failed.
  //   this.currentCubies = {
  //     corner: corner && corner.clone(),
  //     edge: edge && edge.clone()
  //   };

  //   this.options.debug && this.logSetup({ corner, edge })

  //   let caseNumber = this._getCaseNumber({ corner, edge })
  //   this.options.debug && this.logCaseNumber(caseNumber)

  //   this[`_solveCase${caseNumber}`]({ corner, edge })
  //   this.options.debug && this.logTotalMoves()

  //   return this.options.partition ? this.totalMoves : this.totalMoves.join(' ')
  // }

  LOG(indentLevel, string) {
    return
    for (let i = 0; i < indentLevel; i++) {
      process.stdout.write(' ')
      process.stdout.write(' ')
    }

    console.log(string)
  }

  LOG_SETUP(indentLevel, word, info) {
    return
    this.LOG(indentLevel, `  --> Working on ${word} [${info}]`)
  }

  LOG_CASE_NUMBER(indentLevel, step, caseNumber) {
    return
    this.LOG(indentLevel, `  --> Identified ${step} ${caseNumber}`)
  }

  LOG_TOTAL_MOVES(indentLevel, totalMoves) {
    return
    this.LOG(indentLevel, `  --> Total Moves: `)
    this.LOG(indentLevel, `  ${chalk.green(totalMoves)}`)
    console.log()
  }
}

module.exports = BaseSolver
