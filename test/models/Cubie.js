const test = require('ava')
const Cubie = require('../../models/Cubie')

test.beforeEach(t => {
  t.context.cubie = new Cubie({
    position: [1, 1, 1],
    colorMap: {
      '0 0 1': 'F',
      '1 0 0': 'R',
      '0 1 0': 'U'
    }
  })
})

test('getColorOfFace() works', t => {
  t.plan(3)

  t.is(t.context.cubie.getColorOfFace('FRONT'), 'F')
  t.is(t.context.cubie.getColorOfFace('RIGHT'), 'R')
  t.is(t.context.cubie.getColorOfFace('UP'), 'U')
})

test('getFaceOfColor() works', t => {
  t.plan(3)

  t.is(t.context.cubie.getFaceOfColor('F'), 'FRONT')
  t.is(t.context.cubie.getFaceOfColor('R'), 'RIGHT')
  t.is(t.context.cubie.getFaceOfColor('U'), 'UP')
})

test('rotateing around "x" updates cubie position correctly', t => {
  t.context.cubie.rotate('x', -Math.PI / 2) // R
  t.deepEqual(t.context.cubie.position(), [1, 1, -1])
})

test('rotateing around "y" updates cubie position correctly', t => {
  t.context.cubie.rotate('y', -Math.PI / 2) // U
  t.deepEqual(t.context.cubie.position(), [-1, 1, 1])
})

test('rotateing around "z" updates cubie position correctly', t => {
  t.context.cubie.rotate('z', -Math.PI / 2) // F
  t.deepEqual(t.context.cubie.position(), [1, -1, 1])
})
