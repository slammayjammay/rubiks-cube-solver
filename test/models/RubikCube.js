const test = require('ava')
const RubiksCube = require('../../models/RubiksCube')

test('needs to be given an input state', t => {
  t.throws(() => new RubiksCube('not a correct input state'))
})
