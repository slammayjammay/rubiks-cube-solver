const test = require('ava')
const RubiksCube = require('../../models/RubiksCube')
const Cubie = require('../../models/Cubie')
const F2LSolver = require('../../solvers/F2LSolver')

let f2lSolver = new F2LSolver(RubiksCube.Solved())

let color1 = 'R'
let color2 = 'F'

let corner = Cubie.FromFaces(['FRONT', 'DOWN', 'RIGHT'])
  .colorFace('FRONT', 'U')
  .colorFace('DOWN', 'F')
  .colorFace('RIGHT', 'R')
let edge = Cubie.FromFaces(['RIGHT', 'DOWN'])
  .colorFace('RIGHT', 'R')
  .colorFace('DOWN', 'F')

f2lSolver.cube._cubies.push(...[corner, edge])
f2lSolver.solveMatchedPair({ corner, edge })

test('stops ava from complaining about no tests.', t => t.true(true))
