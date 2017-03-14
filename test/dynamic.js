const chalk = require('chalk')
const RubiksCube = require('../models/RubiksCube')
const CrossSolver = require('../solvers/cross')
const F2LSolver = require('../solvers/f2l')
const utils = require('../utils')

const NUM_RUNS = 1

for (let i = 0; i < NUM_RUNS; i++) {
  solveACube()
}

function solveACube() {
  let cube = RubiksCube.Solved()

  // get access to the scrambled state
  let scrambleMoves = RubiksCube.getRandomMoves(25)
  cube.move(scrambleMoves)

  console.log(chalk.bold('Scramble moves: '))
  console.log(chalk.green(scrambleMoves))
  console.log()

  console.log(chalk.bold('====== Solving the Cross ======'))
  solveTheCross(cube)

  console.log(chalk.bold('====== Solving the First Two Layers ======'))
  solveF2L(cube)
}

function solveTheCross(cube) {
  let cross = new CrossSolver(cube, { debug: true })

  // get access to the moves that solve the cross
  let moves = cross.solve()

  // console.log(chalk.green('Cross moves: '));
  // console.log(moves)
  // console.log()
}

function solveF2L(cube) {
  let f2l = new F2LSolver(cube, { debug: true })

  // console.log(chalk.green('F2L moves: '))

  let moves = f2l.solve()

  if (f2l.isSolved()) {
    console.log(chalk.green('throw a parade!'))
  }
}
