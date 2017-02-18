const test = require('ava')
const utils = require('../../utils')

// getFaceOfMove
test('getFaceOfMove works', t => t.is(utils.getFaceOfMove('R'), 'RIGHT'))
test('getFaceOfMove lower case works', t => t.is(utils.getFaceOfMove('r'), 'RIGHT'))
test('getFaceOfMove requires a string', t => t.throws(() => utils.getMoveOfFace(['not a string'])))

// getMoveOfFace
test('getMoveOfFace works', t => t.is(utils.getMoveOfFace('RIGHT'), 'R'))
test('getMoveOfFace lower case works', t => t.is(utils.getMoveOfFace('right'), 'R'))
test('getMoveOfFace requires a string', t => t.throws(() => utils.getMoveOfFace(['not a string'])))

// getDirectionFromFaces
let macro1 = (t, from, to, orientation, expected) => {
  t.is(utils.getDirectionFromFaces(from, to, orientation), expected)
}
test('getDirectionFromFaces works', macro1, 'FRONT', 'RIGHT', { UP: 'UP' }, 'RIGHT')
test('getDirectionFromFaces works', macro1, 'LEFT', 'DOWN', { UP: 'BACK' }, 'LEFT')
test('getDirectionFromFaces lower case works', macro1, 'front', 'right', { up: 'up' }, 'RIGHT')

// getFaceFromDirection
let macro2 = (t, from, direction, orientation, expected) => {
  t.is(utils.getFaceFromDirection(from, direction, orientation), expected)
}
test('getFaceFromDirection works', macro2, 'FRONT', 'RIGHT', { UP: 'UP' }, 'RIGHT')
test('getFaceFromDirection works', macro2, 'LEFT', 'DOWN', { UP: 'BACK' }, 'FRONT')
test('getFaceFromDirection works', macro2, 'BACK', 'RIGHT', { UP: 'DOWN' }, 'RIGHT')

// getRotationFromTo
let macro3 = (t, face, from, to, expected) => {
  t.is(utils.getRotationFromTo(face, from, to), expected)
}
test ('getRotationFromTo works', macro3, 'UP', 'FRONT', 'RIGHT', 'UPrime')
test ('getRotationFromTo lower case works', macro3, 'up', 'front', 'right', 'UPrime')
test ('getRotationFromTo works', macro3, 'LEFT', 'FRONT', 'BACK', 'L L')
test ('getRotationFromTo works', macro3, 'DOWN', 'LEFT', 'BACK', 'DPrime')
test ('getRotationFromTo works', macro3, 'FRONT', 'UP', 'LEFT', 'FPrime')
test('getRotationFromTo throws an error when given bad input', t => {
  t.throws(() => utils.getRotationFromTo('UP', 'DOWN', 'LEFT'), Error)
})
