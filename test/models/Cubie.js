const { assert, expect } = require('chai')
const Cubie = require('../../models/Cubie')

describe('Cubie Model', () => {
  let cubie
  beforeEach(() => {
    cubie = new Cubie({
      position: [1, 1, 1],
      colorMap: {
        'FRONT': 'F',
        'RIGHT': 'R',
        'UP': 'U'
      }
    })
  })

  it('can return the color of a face', () => {
    assert(cubie.getColorOfFace('FRONT') === 'F')
    assert(cubie.getColorOfFace('RIGHT') === 'R')
    assert(cubie.getColorOfFace('UP') === 'U')
  })

  it('can return the face of a color', () => {
    assert(cubie.getFaceOfColor('F') === 'FRONT')
    assert(cubie.getFaceOfColor('R') === 'RIGHT')
    assert(cubie.getFaceOfColor('U') === 'UP')
  })

  describe('can rotate around the "x" axis', () => {
    it('updates its position', () => {
      cubie.rotate('x', -Math.PI / 2) // R
      expect(cubie.position()).to.deep.equal([1, 1, -1])
    })

    it('updates its color map', () => {
      // TODO
    })
  })

  describe('can rotate around the "y" axis', () => {
    it('updates its position', () => {
      cubie.rotate('y', -Math.PI / 2) // U
      expect(cubie.position()).to.deep.equal([-1, 1, 1])
    })

    it('updates its color map', () => {
      // TODO
    })
  })

  describe('can rotate around the "z" axis', () => {
    it('updates its position', () => {
      cubie.rotate('z', -Math.PI / 2) // F
      expect(cubie.position()).to.deep.equal([1, -1, 1])
    })

    it('updates its color map', () => {
      // TODO
    })
  })
})
