const Cubie = require('./cubie')

class RubiksCube {
  /**
   * @param {string} cubeState - The string representing the Rubik's Cube.
   *
   * The cube state shall be represented as:
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
     this._build(cubeState)
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

           let cubie = new Cubie([x, y, z])
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
       cubiesToColor[i].addColor(colors[i])
     }
   }

   /**
    * Grab all the cubes on a given face, and return them in order from top left
    * to bottom right.
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
       [row, col, rowOrder, colOrder] = ['y', 'x', -1, 1]
       cubies = this._cubies.filter(cubie => cubie.z === 1)
     } else if (['R', 'RIGHT'].includes(face)) {
       [row, col, rowOrder, colOrder] = ['y', 'z', -1, -1]
       cubies = this._cubies.filter(cubie => cubie.x === 1)
     } else if (['U', 'UP'].includes(face)) {
       [row, col, rowOrder, colOrder] = ['z', 'x', 1, 1]
       cubies = this._cubies.filter(cubie => cubie.y === 1)
     } else if (['D', 'DOWN'].includes(face)) {
       [row, col, rowOrder, colOrder] = ['z', 'x', -1, 1]
       cubies = this._cubies.filter(cubie => cubie.y === -1)
     } else if (['L', 'LEFT'].includes(face)) {
       [row, col, rowOrder, colOrder] = ['y', 'z', -1, 1]
       cubies = this._cubies.filter(cubie => cubie.x === -1)
     } else if (['B', 'BACK'].includes(face)) {
       [row, col, rowOrder, colOrder] = ['y', 'x', -1, -1]
       cubies = this._cubies.filter(cubie => cubie.z === -1)
     }

     // order cubies from top left to bottom right
     return cubies.sort((first, second) => {
       if (first[row] * rowOrder < second[row] * rowOrder) {
         return -1
       } else if (first[row] * rowOrder > second[row] * rowOrder) {
         return 1
       } else {
         return first[col] * colOrder < second[col] * colOrder ? -1 : 1
       }
     })
   }

   /**
    * @param {array} pos - The x, y, and z value of the cubie.
    */
   getCubieAtPosition(pos) {
     for (let cubie of this._cubies) {
       if (cubie.positionEquals(pos)) {
         return cubie
       }
     }
   }
}

module.exports = RubiksCube
