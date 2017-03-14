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

  _solve({ corner, edge }) {
    // every subclass of BaseSolver follows the same formula.
    // it's important to log each step when they're being done, as any on step
    // can throw an error and we could lose important information.

    this.options.debug && this.logSetup({ corner, edge })

    let caseNumber = this._getCaseNumber({ corner, edge })
    this.options.debug && this.logCaseNumber(caseNumber)

    this[`_solveCase${caseNumber}`]({ corner, edge })
    this.options.debug && this.logTotalMoves()

    return this.totalMoves.join(' ')
  }

  LOG(indentLevel, string) {
    for (let i = 0; i < indentLevel; i++) {
      process.stdout.write(' ')
      process.stdout.write(' ')
    }

    console.log(string)
  }

  LOG_SETUP(indentLevel, word, info) {
    this.LOG(indentLevel, `  --> Working on ${word} [${info}]`)
  }

  LOG_CASE_NUMBER(indentLevel, step, caseNumber) {
    this.LOG(indentLevel, `  --> Identified ${step} ${caseNumber}`)
  }

  LOG_TOTAL_MOVES(indentLevel, totalMoves) {
    this.LOG(indentLevel, `  --> Total Moves: `)
    this.LOG(indentLevel, `  ${chalk.green(totalMoves)}`)
    console.log()
  }
}

module.exports = BaseSolver
