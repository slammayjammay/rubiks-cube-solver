const BaseSolver = require('./BaseSolver')
const RubiksCube = require('../../models/RubiksCube')
const Cubie = require('../../models/Cubie')

class F2LSolver extends BaseSolver {
  solve() {
    let pairs = this.getAllPairs()
    pairs.forEach(pair => this.solvePair(pair))
  }

  getAllPairs() {
    let corners = this.cube.corners()
    let edges = this.cube.edges().filter(edge => {
      return !edge.hasColor('U') && !edge.hasColor('D')
    })

    let pairs = []

    for (let edge of edges) {
      let corner = corners.find(corner => {
        return corner.colors().includes(edge.colors()[0]) &&
               corner.colors().includes(edge.colors()[1])
      })

      pairs.push({ edge, corner })
    }

    return pairs
  }

   /**
    * 5 top level cases:
    * 1) corner and edge are both on the DOWN face
    * 2)
    * 3)
    * 4)
    * 5)
    */
  solvePair({ corner, edge }) {
    if (corner.faces().includes('DOWN') && edge.faces().includes('DOWN')) {

    }
  }
}

module.exports = F2LSolver









//
