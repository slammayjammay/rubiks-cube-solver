const chalk = require('chalk')
const F2LBaseSolver = require('../BaseSolver')

const INDENT_LEVEL = 1

class F2LCaseBaseSolver extends F2LBaseSolver {
  solve({ corner, edge }) {
    return this._solve({ corner, edge })
  }

  logSetup() {
    // none of the f2l sub cases will log any setup
  }

  logCaseNumber(caseNumber) {
    this.LOG_CASE_NUMBER(INDENT_LEVEL, 'f2l sub-level case', caseNumber)
  }

  logTotalMoves() {
    let totalMoves = this.totalMoves.join(' ')
    this.LOG_TOTAL_MOVES(INDENT_LEVEL, totalMoves)
  }
}

module.exports = F2LCaseBaseSolver
