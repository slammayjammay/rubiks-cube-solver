const { assert } = require('chai')
const RubiksCube = require('../../models/RubiksCube')
const Cubie = require('../../models/Cubie')
const F2LSolver = require('../../solvers/F2LSolver')

describe('F2L Solver', () => {
  it('knows if a pair is matching', () => {
    let solver = new F2LSolver(RubiksCube.Solved())

    let corner = Cubie.FromFaces(['FRONT', 'DOWN', 'RIGHT'])
      .colorFace('FRONT', 'U')
      .colorFace('DOWN', 'F')
      .colorFace('RIGHT', 'R')
    let edge = Cubie.FromFaces(['RIGHT', 'DOWN'])
      .colorFace('RIGHT', 'R')
      .colorFace('DOWN', 'F')

    // solver.cube._cubies.push(...[corner, edge])
    // solver.solveMatchedPair({ corner, edge })

    assert(solver.isPairMatched({ corner, edge }))
  })
})

// test.beforeEach(t => {
//   let solver = new F2LSolver(RubiksCube.Solved())
//
//   let corner = Cubie.FromFaces(['FRONT', 'DOWN', 'RIGHT'])
//     .colorFace('FRONT', 'U')
//     .colorFace('DOWN', 'F')
//     .colorFace('RIGHT', 'R')
//   let edge = Cubie.FromFaces(['RIGHT', 'DOWN'])
//     .colorFace('RIGHT', 'R')
//     .colorFace('DOWN', 'F')
//
//   solver.cube._cubies.push(...[corner, edge])
//   solver.solveMatchedPair({ corner, edge })
//
//   t.context.solver = solver
//   t.context.corner = corner
//   t.context.edge = edge
// })
//
// test('it knows if a pair is matching', t => {
//   t.true(t.context.solver.isPairMatched({
//     corner: t.context.corner,
//     edge: t.context.edge
//   }))
// })
