const Solver = require('./')
const Face = require('./models/Face')
const Vector = require('./models/Vector')
const getAdjacentFaceDirection = require('./utils/relative-faces').getAdjacentFaceDirection

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

  testAllMoves() {
    for (let move of Object.keys(this.states)) {
      this.testMove(move)
    }
  }

  testMove(notation) {
    this.solver = new Solver(SOLVED_STATE)
    this.solver.cube.move(notation)
    let success = this.solver.cube.toString() === this.states[notation]

    if (success) {
      console.log(`Move ${notation} was successful.`)
    } else {
      console.log(`Expected: `)
      console.log(this.states[notation])
      console.log(`Received: `)
      console.log(this.solver.cube.toString())
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
      let result = getAdjacentFaceDirection(test.from, test.to, { [test.orientation.to]: test.orientation.from })
      let message

      if (result === test.expect) {
        message = `test SUCCEEDED!`
      } else {
        message = `test FAILED: (${test.from}, ${test.to}, { ${test.orientation.to}: ${test.orientation.from} })`
        message += ` --> expected: ${test.expect}, got: ${result}`
      }

      console.log(message)
    }
  }
}

module.exports = new Tester()
