const Cubie = require('./Cubie')
const Vector = require('./Vector')

class RubiksCube {
   /**
    * Factory method. Returns an instance of a solved Rubiks Cube.
    */
   static Solved() {
     return new RubiksCube('FFFFFFFFFRRRRRRRRRUUUUUUUUUDDDDDDDDDLLLLLLLLLBBBBBBBBB')
   }

   static Scrambled() {
     let cube = RubiksCube.Solved()
     let randomMoves = RubiksCube.getRandomMoves()
     cube.move(randomMoves)

     return cube
   }

  static getRandomMoves(length) {
    let randomMoves = []
    let totalMoves = [
      'F',
      'FPrime',
      'R',
      'RPrime',
      'U',
      'UPrime',
      'D',
      'DPrime',
      'L',
      'LPrime',
      'B',
      'BPrime'
    ]

    for (let i = 0; i < length; i++) {
      let idx = ~~(Math.random() * totalMoves.length)
      randomMoves.push(totalMoves[idx])
    }

    return randomMoves.join(' ')
  }

   /**
    * @param {string} notations - The list of moves to reverse.
    * @return {string}
    */
   static reverseMoves(notations) {
     let reversedMoves = []

     for (let notation of notations.split(' ').filter(move => move !== '')) {
       notation = notation.toUpperCase()
       notation = notation.includes('PRIME') ? notation[0] : `${notation[0]}Prime`
       reversedMoves.push(notation)
     }

     return reversedMoves.join(' ')
   }

  /**
   * @param {string} cubeState - The string representing the Rubik's Cube.
   *
   * The cube state are represented as:
   * 'FFFFFFFFFRRRRRRRRRUUUUUUUUUDDDDDDDDDLLLLLLLLLBBBBBBBBB'
   *
   * where:
   * F stands for the FRONT COLOR
   * R stands for the RIGHT COLOR
   * U stands for the UP COLOR
   * D stands for the DOWN COLOR
   * L stands for the LEFT COLOR
   * B stands for the BACK COLOR
   *
   * and the faces are given in the order of:
   * FRONT, RIGHT, UP, DOWN, LEFT, BACK
   *
   * The order of each color per face is ordered by starting from the top left
   * corner and moving to the bottom right, as if reading lines of text.
   *
   * See this example: http://2.bp.blogspot.com/_XQ7FznWBAYE/S9Sbric1KNI/AAAAAAAAAFs/wGAb_LcSOwo/s1600/rubik.png
   */
   constructor(cubeState) {
     if (cubeState.length !== 9 * 6) {
       throw new Error('Wrong number of colors provided')
     }

     this._notationToRotation = {
       F: { axis: 'z', mag: -1 },
       R: { axis: 'x', mag: -1 },
       U: { axis: 'y', mag: -1 },
       D: { axis: 'y', mag: 1 },
       L: { axis: 'x', mag: 1 },
       B: { axis: 'z', mag: 1 },
     }

     this._build(cubeState)
   }

   /**
    * Grab all the cubes on a given face, and return them in order from top left
    * to bottom right.
    * @param {string} face - The face to grab.
    * @return {array}
    */
   getFace(face) {
     // The 3D position of cubies and the way they're ordered on each face
     // do not play nicely. Below is a shitty way to reconcile the two.
     // The way the cubies are sorted depends on the row and column they
     // occupy on their face. Cubies on a higher row will have a lower sorting
     // index, but rows are not always denoted by cubies' y position, and
     // "higher rows" do not always mean "higher axis values".

     let row, col, rowOrder, colOrder
     let cubies

     // grab correct cubies
     if (['F', 'FRONT'].includes(face)) {
       [row, col, rowOrder, colOrder] = ['Y', 'X', -1, 1]
       cubies = this._cubies.filter(cubie => cubie.getZ() === 1)
     } else if (['R', 'RIGHT'].includes(face)) {
       [row, col, rowOrder, colOrder] = ['Y', 'Z', -1, -1]
       cubies = this._cubies.filter(cubie => cubie.getX() === 1)
     } else if (['U', 'UP'].includes(face)) {
       [row, col, rowOrder, colOrder] = ['Z', 'X', 1, 1]
       cubies = this._cubies.filter(cubie => cubie.getY() === 1)
     } else if (['D', 'DOWN'].includes(face)) {
       [row, col, rowOrder, colOrder] = ['Z', 'X', -1, 1]
       cubies = this._cubies.filter(cubie => cubie.getY() === -1)
     } else if (['L', 'LEFT'].includes(face)) {
       [row, col, rowOrder, colOrder] = ['Y', 'Z', -1, 1]
       cubies = this._cubies.filter(cubie => cubie.getX() === -1)
     } else if (['B', 'BACK'].includes(face)) {
       [row, col, rowOrder, colOrder] = ['Y', 'X', -1, -1]
       cubies = this._cubies.filter(cubie => cubie.getZ() === -1)
     }

     // order cubies from top left to bottom right
     return cubies.sort((first, second) => {
       let firstCubieRow = first[`get${row}`]() * rowOrder
       let firstCubieCol = first[`get${col}`]() * colOrder

       let secondCubieRow = second[`get${row}`]() * rowOrder
       let secondCubieCol = second[`get${col}`]() * colOrder

       if (firstCubieRow < secondCubieRow) {
         return -1
       } else if (firstCubieRow > secondCubieRow) {
         return 1
       } else {
         return firstCubieCol < secondCubieCol ? -1 : 1
       }
     })
   }

   /**
    * @param {array} pos - The x, y, and z value of the cubie.
    */
   pieceAt(pos) {
     for (let cubie of this._cubies) {
      if (Vector.areEqual(cubie.position(), pos)) {
         return cubie
       }
     }
   }

   /**
    * Finds and returns all cubies with three colors.
    * @return {array}
    */
   corners() {
     return this._cubies.filter(cubie => cubie.isCorner())
   }

   /**
    * Finds and returns all cubies with two colors.
    * @return {array}
    */
   edges() {
     return this._cubies.filter(cubie => cubie.isEdge())
   }

   /**
    * Finds and returns all cubies with one color.
    * @return {array}
    */
   middles() {
     return this._cubies.filter(cubie => cubie.isMiddle())
   }

   /**
    * Gets the rotation axis and magnitude of rotation based on notation.
    * Then finds all cubes on the correct face, and rotates them around the
    * rotation axis.
    * @param {string|array} notation - The move notation.
    */
   move(notations) {
     if (notations instanceof Array) {
       notations = notations.join(' ')
     }

     for (let notation of notations.split(' ')) {
       let move = notation[0] && notation[0].toUpperCase()
       if (!move) {
         continue
       }

       let axis = this._notationToRotation[move].axis
       let mag = this._notationToRotation[move].mag * Math.PI / 2

       if (['Prime', 'prime'].includes(notation.slice(1))) {
         mag *= -1
       }

       let cubesToRotate = this.getFace(move)
       for (let cubie of cubesToRotate) {
         cubie.rotate(axis, mag)
       }
     }
   }

   /**
    * @return {string}
    */
   toString() {
     let cubeState = ''

     let faces = ['FRONT', 'RIGHT', 'UP', 'DOWN', 'LEFT', 'BACK']
     for (let face of faces) {
       let cubies = this.getFace(face)
       for (let cubie of cubies) {
         cubeState += cubie.getColorOfFace(face)
       }
     }

     return cubeState
   }

   /**
    * Create a "virtual" cube, with individual "cubies" having a 3D coordinate
    * position and 1 or more colors attached to them.
    */
   _build(cubeState) {
     this._cubies = []
     this._populateCube()

     let parsedColors = this._parseColors(cubeState)

     for (let face of Object.keys(parsedColors)) {
       let colors = parsedColors[face]
       this._colorFace(face, colors)
     }
   }

   /**
    * Populates the "virtual" cube with 26 "empty" cubies by their position.
    * @return {null}
    */
   _populateCube() {
     for (let x = -1; x <= 1; x++) {
       for (let y = -1; y <= 1; y++) {
         for (let z = -1; z <= 1; z++) {
           // no cubie in the center of the rubik's cube
           if (x === 0 && y === 0 && z === 0) {
             continue
           }

           let cubie = new Cubie({ position: [x, y, z] })
           this._cubies.push(cubie)
         }
       }
     }
   }

   /**
    * @return {object} - A map with faces for keys and colors for values
    */
   _parseColors(cubeState) {
     let faceColors = {
       FRONT: [],
       RIGHT: [],
       UP: [],
       DOWN: [],
       LEFT: [],
       BACK: []
     }

     let currentFace

     for (let i = 0; i < cubeState.length; i++) {
       let color = cubeState[i]

       if (i < 9) {
         currentFace = 'FRONT'
       } else if (i < 9 * 2) {
         currentFace = 'RIGHT'
       } else if (i < 9 * 3) {
         currentFace = 'UP'
       } else if (i < 9 * 4) {
         currentFace = 'DOWN'
       } else if (i < 9 * 5) {
         currentFace = 'LEFT'
       } else {
         currentFace = 'BACK'
       }

       faceColors[currentFace].push(color)
     }

     return faceColors
   }

   /**
    * @param {array} face - An array of the cubies on the given face.
    * @param {array} colors - An array of the colors on the given face.
    */
   _colorFace(face, colors) {
     let cubiesToColor = this.getFace(face)
     for (let i = 0; i < colors.length; i++) {
       cubiesToColor[i].colorFace(face, colors[i])
     }
   }
}

module.exports = RubiksCube
