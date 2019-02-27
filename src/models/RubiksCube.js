import { Cubie } from './Cubie';
import { algorithmShortener } from '../algorithm-shortener';
import {
	transformNotations, getMiddleMatchingFace
} from '../utils';

const SOLVED_STATE = 'fffffffffrrrrrrrrruuuuuuuuudddddddddlllllllllbbbbbbbbb';

class RubiksCube {
	/**
	 * Factory method. Returns an instance of a solved Rubiks Cube.
	 */
	static Solved() {
		return new RubiksCube(SOLVED_STATE);
	}

	/**
	 * Factory method.
	 * @param {string|array} moves
	 */
	static FromMoves(moves) {
		const cube = RubiksCube.Solved();
		cube.move(moves);
		return cube;
	}

	/**
	 * Factory method. Returns an instance of a scrambled Rubiks Cube.
	 */
	static Scrambled() {
		let cube = RubiksCube.Solved();
		let randomMoves = RubiksCube.getRandomMoves(25);
		cube.move(randomMoves);

		return cube;
	}

	/**
	 * @param {string|array} notations - The list of moves to reverse.
	 * @return {string|array} -- whichever was initially given.
	 */
	static reverseMoves(moves) {
		return RubiksCube.transformMoves(moves, { reverse: true });
	}

	/**
	 * @param {string|array} moves - The moves to transform;
	 * @param {object} options
	 * @prop {boolean} options.upperCase - Turn lowercase moves into uppercase.
	 * @prop {object} options.orientation - An object describing the orientation
	 * from which to makes the moves. See src/js/utils#orientMoves.
	 *
	 * @return {string|array} -- whichever was initially given.
	 */
	static transformMoves(moves, options = {}) {
		return transformNotations(moves, options);
	}

	static getRandomMoves(length = 25) {
		let randomMoves = [];
		let totalMoves = [
			'F',
			'Fprime',
			'R',
			'Rprime',
			'U',
			'Uprime',
			'D',
			'Dprime',
			'L',
			'Lprime',
			'B',
			'Bprime'
		];

		while (randomMoves.length < length) {
			for (let i = 0; i < length - randomMoves.length; i++) {
				let idx = ~~(Math.random() * totalMoves.length);
				randomMoves.push(totalMoves[idx]);
			}

			randomMoves = algorithmShortener(randomMoves).split(' ');
		}

		return randomMoves.join(' ');
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
			throw new Error('Wrong number of colors provided');
		}

		this._notationToRotation = {
			f: { axis: 'z', mag: -1 },
			r: { axis: 'x', mag: -1 },
			u: { axis: 'y', mag: -1 },
			d: { axis: 'y', mag: 1 },
			l: { axis: 'x', mag: 1 },
			b: { axis: 'z', mag: 1 },
			m: { axis: 'x', mag: 1 },
			e: { axis: 'y', mag: 1 },
			s: { axis: 'z', mag: -1 }
		};

		this._build(cubeState);
	}

	/**
	 * Grab all the cubes on a given face, and return them in order from top left
	 * to bottom right.
	 * @param {string} face - The face to grab.
	 * @return {array}
	 */
	getFace(face) {
		if (typeof face !== 'string') {
			throw new Error(`"face" must be a string (received: ${face})`);
		}

		face = face.toLowerCase()[0];

		// The 3D position of cubies and the way they're ordered on each face
		// do not play nicely. Below is a shitty way to reconcile the two.
		// The way the cubies are sorted depends on the row and column they
		// occupy on their face. Cubies on a higher row will have a lower sorting
		// index, but rows are not always denoted by cubies' y position, and
		// "higher rows" do not always mean "higher axis values".

		let row, col, rowOrder, colOrder;
		let cubies;

		// grab correct cubies
		if (face === 'f') {
			[row, col, rowOrder, colOrder] = ['Y', 'X', -1, 1];
			cubies = this._cubies.filter(cubie => cubie.getZ() === 1);
		} else if (face === 'r') {
			[row, col, rowOrder, colOrder] = ['Y', 'Z', -1, -1];
			cubies = this._cubies.filter(cubie => cubie.getX() === 1);
		} else if (face === 'u') {
			[row, col, rowOrder, colOrder] = ['Z', 'X', 1, 1];
			cubies = this._cubies.filter(cubie => cubie.getY() === 1);
		} else if (face === 'd') {
			[row, col, rowOrder, colOrder] = ['Z', 'X', -1, 1];
			cubies = this._cubies.filter(cubie => cubie.getY() === -1);
		} else if (face === 'l') {
			[row, col, rowOrder, colOrder] = ['Y', 'Z', -1, 1];
			cubies = this._cubies.filter(cubie => cubie.getX() === -1);
		} else if (face === 'b') {
			[row, col, rowOrder, colOrder] = ['Y', 'X', -1, -1];
			cubies = this._cubies.filter(cubie => cubie.getZ() === -1);
		} else if (['m', 'e', 's'].includes(face)) {
			return this._getMiddleCubiesForMove(face);
		}

		// order cubies from top left to bottom right
		return cubies.sort((first, second) => {
			let firstCubieRow = first[`get${row}`]() * rowOrder;
			let firstCubieCol = first[`get${col}`]() * colOrder;

			let secondCubieRow = second[`get${row}`]() * rowOrder;
			let secondCubieCol = second[`get${col}`]() * colOrder;

			if (firstCubieRow < secondCubieRow) {
				return -1;
			} else if (firstCubieRow > secondCubieRow) {
				return 1;
			} else {
				return firstCubieCol < secondCubieCol ? -1 : 1;
			}
		});
	}

	/**
	 * @param {array} faces - The list of faces the cubie belongs on.
	 */
	getCubie(faces) {
		return this._cubies.find(cubie => {
			if (faces.length != cubie.faces().length) {
				return false;
			}

			for (let face of faces) {
				if (!cubie.faces().includes(face)) {
					return false;
				}
			}

			return true;
		});
	}

	/**
	 * Finds and returns all cubies with three colors.
	 * @return {array}
	 */
	corners() {
		return this._cubies.filter(cubie => cubie.isCorner());
	}

	/**
	 * Finds and returns all cubies with two colors.
	 * @return {array}
	 */
	edges() {
		return this._cubies.filter(cubie => cubie.isEdge());
	}

	/**
	 * Finds and returns all cubies with one color.
	 * @return {array}
	 */
	middles() {
		return this._cubies.filter(cubie => cubie.isMiddle());
	}

	/**
	 * Gets the rotation axis and magnitude of rotation based on notation.
	 * Then finds all cubes on the correct face, and rotates them around the
	 * rotation axis.
	 * @param {string|array} notations - The move notation.
	 * @param {object} options - Move options.
	 * @prop {boolean} options.upperCase - Turn all moves to upper case (i.e. no "double" moves).
	 */
	move(notations, options = {}) {
		if (typeof notations === 'string') {
			notations = notations.split(' ');
		}

		notations = transformNotations(notations, options);

		for (let notation of notations) {
			let move = notation[0];

			if (!move) {
				continue;
			}

			let isPrime = notation.toLowerCase().includes('prime');
			let isWithMiddle = move === move.toLowerCase();
			let isDoubleMove  = notation.includes('2');

			let { axis, mag } = this._getRotationForFace(move);
			let cubesToRotate = this.getFace(move);

			if (isPrime) mag *= -1;
			if (isDoubleMove) mag *= 2;

			if (isWithMiddle) {
				let middleMove = getMiddleMatchingFace(move);
				let middleCubies = this._getMiddleCubiesForMove(middleMove);
				cubesToRotate = [...cubesToRotate, ...middleCubies];
			}

			for (let cubie of cubesToRotate) {
				cubie.rotate(axis, mag);
			}
		}
	}

	isSolved() {
		return this.toString() === SOLVED_STATE;
	}

	toString() {
		let cubeState = '';

		let faces = ['front', 'right', 'up', 'down', 'left', 'back'];
		for (let face of faces) {
			let cubies = this.getFace(face);
			for (let cubie of cubies) {
				cubeState += cubie.getColorOfFace(face);
			}
		}

		return cubeState;
	}

	clone() {
		return new RubiksCube(this.toString());
	}

	/**
	 * Create a "virtual" cube, with individual "cubies" having a 3D coordinate
	 * position and 1 or more colors attached to them.
	 */
	_build(cubeState) {
		this._cubies = [];
		this._populateCube();

		let parsedColors = this._parseColors(cubeState);

		for (let face of Object.keys(parsedColors)) {
			let colors = parsedColors[face];
			this._colorFace(face, colors);
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
						continue;
					}

					let cubie = new Cubie({ position: [x, y, z] });
					this._cubies.push(cubie);
				}
			}
		}
	}

	/**
	 * @return {object} - A map with faces for keys and colors for values
	 */
	_parseColors(cubeState) {
		let faceColors = {
			front: [],
			right: [],
			up: [],
			down: [],
			left: [],
			back: []
		};

		let currentFace;

		for (let i = 0; i < cubeState.length; i++) {
			let color = cubeState[i];

			if (i < 9) {
				currentFace = 'front';
			} else if (i < 9 * 2) {
				currentFace = 'right';
			} else if (i < 9 * 3) {
				currentFace = 'up';
			} else if (i < 9 * 4) {
				currentFace = 'down';
			} else if (i < 9 * 5) {
				currentFace = 'left';
			} else {
				currentFace = 'back';
			}

			faceColors[currentFace].push(color);
		}

		return faceColors;
	}

	/**
	 * @param {array} face - An array of the cubies on the given face.
	 * @param {array} colors - An array of the colors on the given face.
	 */
	_colorFace(face, colors) {
		let cubiesToColor = this.getFace(face);
		for (let i = 0; i < colors.length; i++) {
			cubiesToColor[i].colorFace(face, colors[i]);
		}
	}

	/**
	 * @return {object} - The the rotation axis and magnitude for the given face.
	 */
	_getRotationForFace(face) {
		if (typeof face !== 'string') {
			throw new Error(`"face" must be a string (received: ${face})`);
		}

		face = face.toLowerCase();

		return {
			axis: this._notationToRotation[face].axis,
			mag: this._notationToRotation[face].mag * Math.PI / 2
		};
	}

	_getMiddleCubiesForMove(move) {
		move = move[0].toLowerCase();

		let nonMiddles;
		if (move === 'm') {
			nonMiddles = ['left', 'right'];
		} else if (move === 'e') {
			nonMiddles = ['up', 'down'];
		} else if (move === 's') {
			nonMiddles = ['front', 'back'];
		}

		return this._cubies.filter(cubie => {
			return !cubie.hasFace(nonMiddles[0]) && !cubie.hasFace(nonMiddles[1]);
		});
	}
}

export { RubiksCube };
