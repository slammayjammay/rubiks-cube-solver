const RubiksCube = require('../../models/RubiksCube');
const BaseSolver = require('../BaseSolver');
const utils = require('../../utils');

const R = (moves) => RubiksCube.reverseMoves(moves);

class OLLSolver extends BaseSolver {
	constructor(...args) {
		super(...args);
		this.phase = 'oll';

		// orientations in order based on http://badmephisto.com/oll.php, however the
		// actual algorithms may be different.
		this.algorithms = {
			'21000111': 'F R U RPrime UPrime FPrime', // 1
			'21111010': 'F R U RPrime UPrime FPrime F R U RPrime UPrime FPrime', // 2
			'10201020': 'R U U RPrime UPrime R U RPrime UPrime R UPrime RPrime', // 3
			'01112000': 'F U R UPrime RPrime FPrime', // 4
			'11102120': 'F U R UPrime RPrime U R UPrime RPrime FPrime', // 5
			'11210000': 'RPrime UPrime FPrime U F R', // 6
			'11102021': 'FPrime LPrime UPrime L U LPrime UPrime L U F', // 7
			'10011110': 'R L L BPrime L BPrime LPrime B B L BPrime L RPrime', // 8
			'00202121': 'LPrime R R B RPrime B R B B RPrime B RPrime L', // 9
			'01111111': 'F U R UPrime RPrime FPrime L F U FPrime UPrime LPrime', // 10
			'21212101': 'F U R UPrime RPrime FPrime R B U BPrime UPrime RPrime', // 11
			'21211111': 'F R U RPrime UPrime FPrime B U L UPrime LPrime BPrime', // 12
			'20201010': 'R U U R R UPrime R R UPrime R R U U R', // 13
			'01101110': 'R B RPrime L U LPrime UPrime R BPrime RPrime', // 14
			'21002120': 'LPrime BPrime L RPrime UPrime R U LPrime B L', // 15
			'21001100': 'RPrime F R U RPrime UPrime FPrime U R', // 16
			'01000100': 'R U RPrime UPrime MPrime U R rPrime', // 17
			'01010101': 'M U R U RPrime UPrime M M U R UPrime rPrime', // 18
			'10211021': 'F R U RPrime UPrime R U RPrime UPrime FPrime B U L UPrime LPrime BPrime', // 19
			'11000120': 'R U RPrime UPrime RPrime F R FPrime', // 20
			'10000010': 'LPrime BPrime R B L BPrime RPrime B', // 21
			'20001000': 'B LPrime BPrime R B L BPrime RPrime', // 22
			'00112001': 'RPrime UPrime RPrime F R FPrime U R', // 23
			'21112111': 'R U U RPrime RPrime F R FPrime U U RPrime F R FPrime', // 24
			'10002101': 'R U U RPrime RPrime F R FPrime R U U RPrime', // 25
			'21110101': 'M U R U RPrime UPrime MPrime RPrime F R FPrime', // 26
			'11212010': 'F LPrime U U L U U L F F LPrime F', // 27
			'01110020': 'R U RPrime U R UPrime RPrime UPrime RPrime F R FPrime', // 28
			'10012100': 'RPrime UPrime R UPrime RPrime U R U R BPrime RPrime B', // 29
			'10112021': 'RPrime UPrime R UPrime RPrime d RPrime U R B', // 30
			'01110121': 'F U R UPrime RPrime FPrime F U FPrime UPrime FPrime L F LPrime', // 31
			'01112101': 'F U R UPrime RPrime FPrime B U BPrime UPrime SPrime U B UPrime bPrime', // 32
			'21212000': 'lPrime U U L U LPrime U l', // 33
			'01212020': 'r U RPrime R U U rPrime', // 34
			'00202020': 'R U RPrime U R U U RPrime', // 35
			'10101000': 'RPrime UPrime R URprime RPrime U U R', // 36
			'01001021': 'RPrime U R U U RPrime UPrime FPrime U F U R', // 37
			'10200101': 'R UPrime RPrime U U R U B UPrime BPrime UPrime RPrime', // 38
			'21102011': 'r U RPrime U R UPrime RPrime U R U U rPrime', // 39
			'21112010': 'lPrime UPrime L UPrime LPrime U L UPrime LPrime U U l', // 40
			'11100011': 'r U U RPrime UPrime R URpime rPrime', // 41
			'11012000': 'F R UPrime RPrime UPrime R U RPrime FPrime', // 42
			'11001011': 'lPrime UPrime L UPrime LPrime U U l', // 43
			'01010000': 'r U RPrime UPrime M U R UPrime RPrime', // 44
			'01002110': 'R U RPrime UPrime BPrime RPrime F R FPrime B', // 45
			'01202120': 'L FPrime LPrime UPrime L F LPrime FPrime U F', // 46
			'11001110': 'RPrime F R U RPrime FPrime U F UPrime FPrime', // 47
			'10200000': 'R R D RPrime U U R DPrime RPrime U U RPrime', // 48
			'20112011': 'RPrime U U R R U RPrime U R U U BPrime RPrime B', // 49
			'10000121': 'R U BPrime UPrime RPrime U R B RPrime', // 50
			'11000021': 'RPrime UPrime F U R UPrime RPrime FPrime R', // 51
			'01100120': 'L FPrime LPrime UPrime L U F UPrime LPrime', // 52
			'11112020': 'RPrime F R R FPrime U U FPrime U U F RPrime', // 53
			'20110100': 'BPrime RPrime B LPrime BPrime R R BPrime RPrime B B L', // 54
			'20100101': 'B L BPrime R B L L B L B B RPrime', // 55
			'01101011': 'FPrime UPrime F L FPrime LPrime U L F LPrime', // 56
			'21012020': 'F U FPrime RPrime F R UPrime RPrime FPrime R', // 57
		};
	}

	solve() {
		return this._solve();
	}

	_getCaseNumber() {
		return this.getOllString();
	}

	_solveCase(ollString) {

	}

	getOllString() {
		let orientations = [];

		let cubies = this.getOllCubies();
		cubies.forEach(cubie => {
			let orientation = this.getOrientation(cubie);
			orientations.push(orientation);
		});

		return orientations.join('');
	}

	getOllCubies() {
		let positions = [
			['front', 'down', 'right'],
			['front', 'down'],
			['front', 'down', 'left'],
			['left', 'down'],
			['left', 'down', 'back'],
			['back', 'down'],
			['back', 'down', 'right'],
			['right', 'down']
		];

		return positions.map(pos => this.cube.getCubie(pos));
	}

	/**
	 * Returns a number indicating the orientation of the cubie.
	 * 0 --> The DOWN color is on the DOWN face.
	 * 1 --> The DOWN color is a clockwise rotation from "solved".
	 * 2 --> The DOWN color is a counter-clockwise rotation from "solved".
	 */
	getOrientation(cubie) {
		if (cubie.getColorOfFace('down') === 'd') {
			return 0;
		}

		// if cubie is an edge piece, return 1
		if (cubie.isEdge()) {
			return 1;
		}

		let [face1, face2] = cubie.faces().filter(face => face !== 'down');
		let dir = utils.getDirectionFromFaces(face1, face2, { up: 'down' });
		let rightFace = dir === 'right' ? face2 : face1;

		return cubie.getColorOfFace(rightFace) === 'd' ? 1 : 2;
	}

	_getPartitionBefore() {
		return this.getOllString();
	}

	_getPartitionAfter() {
		return null;
	}
}

module.exports = OLLSolver;
