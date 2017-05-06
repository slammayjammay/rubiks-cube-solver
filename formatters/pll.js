const chalk = require('chalk');
const RubiksCube = require('../models/RubiksCube');

class PLLFormatter {
  /**
   * Expects a cross solver for access to its methods.
   */
  constructor(pllSolver) {
    this.solver = pllSolver;
    this.phase = 'pll';
  }

  logPartition({ caseNumber, moves = [] }, color = 'green') {
    let pllString = caseNumber; // TODO: ick -- caseNumber is not a good name

    console.log(chalk[color]('PLL string:'), pllString);

    let pattern = this.solver.findPattern(pllString);
    console.log(chalk[color]('Detected pattern:'), pattern);

  	console.log(chalk[color]('Moves:'), moves.join(' '));

    let frontFace = this.solver._getFrontFace(pllString, pattern);

    let orientedMoves = RubiksCube.transformNotations(moves, {
      orientation: {
        up: 'down',
        front: frontFace
      }
    });
  	console.log(chalk[color]('Algorithm:'), orientedMoves.join(' '));
    console.log(chalk[color]('Where front face is '), `"${frontFace}"`);
    console.log();
  }
}

module.exports = PLLFormatter;