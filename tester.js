// const Solver = require('./')
const RubiksCube = require('./models/RubiksCube')
const Face = require('./models/Face')
const Vector = require('./models/Vector')
const utils = require('./utils')

const SOLVED_STATE = 'FFFFFFFFFRRRRRRRRRUUUUUUUUUDDDDDDDDDLLLLLLLLLBBBBBBBBB'

class Tester {
  constructor() {
    this.states = {
      R:      'FFDFFDFFDRRRRRRRRRUUFUUFUUFDDBDDBDDBLLLLLLLLLUBBUBBUBB',
      RPrime: 'FFUFFUFFURRRRRRRRRUUBUUBUUBDDFDDFDDFLLLLLLLLLDBBDBBDBB',
      U:      'RRRFFFFFFBBBRRRRRRUUUUUUUUUDDDDDDDDDFFFLLLLLLLLLBBBBBB',
      UPrime: 'LLLFFFFFFFFFRRRRRRUUUUUUUUUDDDDDDDDDBBBLLLLLLRRRBBBBBB',
      F:      'FFFFFFFFFURRURRURRUUUUUULLLRRRDDDDDDLLDLLDLLDBBBBBBBBB',
      FPrime: 'FFFFFFFFFDRRDRRDRRUUUUUURRRLLLDDDDDDLLULLULLUBBBBBBBBB',
      D:      'FFFFFFLLLRRRRRRFFFUUUUUUUUUDDDDDDDDDLLLLLLBBBBBBBBBRRR',
      DPrime: 'FFFFFFRRRRRRRRRBBBUUUUUUUUUDDDDDDDDDLLLLLLFFFBBBBBBLLL',
      L:      'UFFUFFUFFRRRRRRRRRBUUBUUBUUFDDFDDFDDLLLLLLLLLBBDBBDBBD',
      LPrime: 'DFFDFFDFFRRRRRRRRRFUUFUUFUUBDDBDDBDDLLLLLLLLLBBUBBUBBU',
      B:      'FFFFFFFFFRRDRRDRRDRRRUUUUUUDDDDDDLLLULLULLULLBBBBBBBBB',
      BPrime: 'FFFFFFFFFRRURRURRULLLUUUUUUDDDDDDRRRDLLDLLDLLBBBBBBBBB'
    }
  }

  testAll() {
    this.testAllMoves()
    this.testOrientations()
    this.testDirections()
    this.testRotationFromTo()
  }

  testAllMoves() {
    for (let move of Object.keys(this.states)) {
      this.testMove(move)
    }
  }

  testMove(notation) {
    let rubiksCube = new RubiksCube(SOLVED_STATE)
    rubiksCube.move(notation)
    let success = rubiksCube.toString() === this.states[notation]

    if (success) {
      console.log(`Move ${notation} was successful.`)
    } else {
      console.log(`Expected: `)
      console.log(this.states[notation])
      console.log(`Received: `)
      console.log(rubiksCube.toString())
    }
  }

  testOrientations() {
    let faces = ['FRONT', 'RIGHT', 'UP', 'DOWN', 'LEFT', 'BACK']

    // just test everything, fuck
    for (let i = 0; i < faces.length; i++) {
      for (let j = 0; j < faces.length; j++) {
        let [face1, face2] = [new Face(faces[i]), new Face(faces[j])]
        face1.orientTo(face2)

        if (face1.toString() === face2.toString()) {
          console.log(`SUCCESS!`)
        } else {
          console.log(`${faces[i]} to ${faces[j]} name change FAIL.`)
        }

        if (face1.normal().join(' ') === face2.normal().join(' ')) {
          console.log(`SUCCESS!`)
        } else {
          console.log(`${faces[i]} to ${faces[j]} name change FAIL.`)
        }
      }
    }
  }

  testDirections() {
    let tests = [
      { from: 'FRONT', to: 'RIGHT', orientation: { to: 'UP', from: 'UP' }, expect: 'RIGHT' },
      { from: 'FRONT', to: 'RIGHT', orientation: { to: 'UP', from: 'RIGHT' }, expect: 'UP' },
      { from: 'FRONT', to: 'RIGHT', orientation: { to: 'UP', from: 'DOWN' }, expect: 'LEFT' },
      { from: 'FRONT', to: 'RIGHT', orientation: { to: 'UP', from: 'LEFT' }, expect: 'DOWN' },
      { from: 'FRONT', to: 'RIGHT', orientation: { to: 'DOWN', from: 'LEFT' }, expect: 'UP' },
      { from: 'FRONT', to: 'RIGHT', orientation: { to: 'RIGHT', from: 'DOWN' }, expect: 'UP' },
      { from: 'FRONT', to: 'RIGHT', orientation: { to: 'LEFT', from: 'UP' }, expect: 'UP' },
      { from: 'DOWN', to: 'LEFT', orientation: { to: 'DOWN', from: 'FRONT' }, expect: 'RIGHT' },
      { from: 'BACK', to: 'DOWN', orientation: { to: 'LEFT', from: 'RIGHT' }, expect: 'DOWN' },
      { from: 'FRONT', to: 'BACK', orientation: { to: 'UP', from: 'UP' }, expect: 'BACK' }
    ]

    for (let test of tests) {
      let result = utils.getFaceDirection(test.from, test.to, { [test.orientation.to]: test.orientation.from })
      let message

      if (result === test.expect) {
        message = `test SUCCEEDED!`
      } else {
        message = `test FAILED: (${test.from}, ${test.to}, { ${test.orientation.to}: ${test.orientation.from} })`
        message += ` --> expected: ${test.expect} --> got: ${result}`
      }

      console.log(message)
    }
  }

  testRotationFromTo() {
    let tests = [
      { face: 'UP', from: 'FRONT', to: 'RIGHT', expect: 'UPrime' },
      { face: 'UP', from: 'FRONT', to: 'LEFT', expect: 'U' },
      { face: 'UP', from: 'FRONT', to: 'BACK', expect: 'U U' },
      { face: 'UP', from: 'FRONT', to: 'FRONT', expect: '' },
      { face: 'LEFT', from: 'FRONT', to: 'UP', expect: 'LPrime' },
      { face: 'LEFT', from: 'FRONT', to: 'DOWN', expect: 'L' },
      { face: 'DOWN', from: 'RIGHT', to: 'LEFT', expect: 'D D' },
      { face: 'DOWN', from: 'LEFT', to: 'LEFT', expect: '' },
      { face: 'BACK', from: 'LEFT', to: 'UP', expect: 'BPrime' },
      { face: 'BACK', from: 'UP', to: 'LEFT', expect: 'B' },
      { face: 'BACK', from: 'UP', to: 'RIGHT', expect: 'BPrime' }
    ]

    for (let test of tests) {
      let result = utils.getRotationFromTo(test.face, test.from, test.to)
      let message

      if (result === test.expect) {
        message = `test SUCCEEDED!`
      } else {
        message = `test FAILED: (${test.face}, ${test.from}, ${test.to})`
        message += ` --> expected: ${test.expect} --> got: ${result}`
      }

      console.log(message)
    }
  }
}

module.exports = new Tester()
