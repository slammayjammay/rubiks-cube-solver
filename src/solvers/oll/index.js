import { RubiksCube } from '../../models/RubiksCube';
import { BaseSolver } from '../BaseSolver';
import { getDirectionFromFaces } from '../../utils';

const SOLVED_STATE = '00000000';
const R = (moves) => RubiksCube.reverseMoves(moves);

class OLLSolver extends BaseSolver {
	constructor(...args) {
		super(...args);
		this.phase = 'oll';

		// orientations in order based on http://badmephisto.com/oll.php, however the
		// actual algorithms may be different.
		this.algorithms = {
			[SOLVED_STATE]: '', // solved state
			'21000110': 'F R U RPrime UPrime FPrime', // 1
			'21211010': 'F R U RPrime UPrime FPrime F R U RPrime UPrime FPrime', // 2
			'10201020': 'R U2 RPrime UPrime R U RPrime UPrime R UPrime RPrime', // 3
			'01112000': 'F U R UPrime RPrime FPrime', // 4
			'11102120': 'F U R UPrime RPrime U R UPrime RPrime FPrime', // 5
			'11210000': 'RPrime UPrime FPrime U F R', // 6
			'11102021': 'FPrime LPrime UPrime L U LPrime UPrime L U F', // 7
			'10011110': 'R L2 BPrime L BPrime LPrime B2 L BPrime L RPrime', // 8
			'00202121': 'LPrime R2 B RPrime B R B2 RPrime B RPrime L', // 9
			'01111111': 'F U R UPrime RPrime FPrime L F U FPrime UPrime LPrime', // 10
			'21212101': 'F U R UPrime RPrime FPrime R B U BPrime UPrime RPrime', // 11
			'21211111': 'F R U RPrime UPrime FPrime B U L UPrime LPrime BPrime', // 12
			'20201010': 'R U2 R2 UPrime R2 UPrime R2 U2 R', // 13
			'01101110': 'R B RPrime L U LPrime UPrime R BPrime RPrime', // 14
			'21002120': 'LPrime BPrime L RPrime UPrime R U LPrime B L', // 15
			'21001100': 'RPrime F R U RPrime UPrime FPrime U R', // 16
			'01000100': 'R U RPrime UPrime MPrime U R UPrime rPrime', // 17
			'01010101': 'M U R U RPrime UPrime M2 U R UPrime rPrime', // 18
			'10211021': 'F R U RPrime UPrime R U RPrime UPrime FPrime B U L UPrime LPrime BPrime', // 19
			'11000120': 'R U RPrime UPrime RPrime F R FPrime', // 20
			'10000020': 'LPrime BPrime R B L BPrime RPrime B', // 21
			'20001000': 'B LPrime BPrime R B L BPrime RPrime', // 22
			'00112001': 'RPrime UPrime RPrime F R FPrime U R', // 23
			'21112111': 'R U2 RPrime RPrime F R FPrime U2 RPrime F R FPrime', // 24
			'10002101': 'R U2 RPrime RPrime F R FPrime R U2 RPrime', // 25
			'21110101': 'M U R U RPrime UPrime MPrime RPrime F R FPrime', // 26
			'11212010': 'F LPrime U2 L U2 L F2 LPrime F', // 27
			'01110020': 'R U RPrime U R UPrime RPrime UPrime RPrime F R FPrime', // 28
			'10012100': 'RPrime UPrime R UPrime RPrime U R U R BPrime RPrime B', // 29
			'10112021': 'RPrime UPrime R UPrime RPrime U FPrime U F R', // 30
			'01110121': 'F U R UPrime RPrime FPrime F U FPrime UPrime FPrime L F LPrime', // 31
			'01112101': 'F U R UPrime RPrime FPrime B U BPrime UPrime SPrime U B UPrime bPrime', // 32
			'21212000': 'lPrime U2 L U LPrime U l', // 33
			'01212020': 'r U RPrime U R U2 rPrime', // 34
			'00202020': 'R U RPrime U R U2 RPrime', // 35
			'10101000': 'RPrime UPrime R URprime RPrime U2 R', // 36
			'01001021': 'RPrime U R U2 RPrime UPrime FPrime U F U R', // 37
			'10200101': 'R UPrime RPrime U2 R U B UPrime BPrime UPrime RPrime', // 38
			'21102011': 'r U RPrime U R UPrime RPrime U R U2 rPrime', // 39
			'21112010': 'lPrime UPrime L UPrime LPrime U L UPrime LPrime U2 l', // 40
			'11100011': 'r U2 RPrime UPrime R UPrime rPrime', // 41
			'11012000': 'F R UPrime RPrime UPrime R U RPrime FPrime', // 42
			'11001011': 'lPrime UPrime L UPrime LPrime U2 l', // 43
			'01010000': 'r U RPrime UPrime M U R UPrime RPrime', // 44
			'01002110': 'R U RPrime UPrime BPrime RPrime F R FPrime B', // 45
			'01202120': 'L FPrime LPrime UPrime L F LPrime FPrime U F', // 46
			'11001110': 'RPrime F R U RPrime FPrime R F UPrime FPrime', // 47
			'10200000': 'R2 D RPrime U2 R DPrime RPrime U2 RPrime', // 48
			'20112011': 'RPrime U2 R2 U RPrime U R U2 BPrime RPrime B', // 49
			'10000121': 'R U BPrime UPrime RPrime U R B RPrime', // 50
			'11000021': 'RPrime UPrime F U R UPrime RPrime FPrime R', // 51
			'01100120': 'L FPrime LPrime UPrime L U F UPrime LPrime', // 52
			'11112020': 'RPrime F R2 FPrime U2 FPrime U2 F RPrime', // 53
			'20110100': 'BPrime RPrime B LPrime BPrime R R BPrime RPrime B2 L', // 54
			'20100101': 'B L BPrime R B L2 B L B2 RPrime', // 55
			'01101011': 'FPrime UPrime F L FPrime LPrime U L F LPrime', // 56
			'21012020': 'F U FPrime RPrime F R UPrime RPrime FPrime R', // 57
		};
	}

	isSolved() {
		return this.getOllString() === SOLVED_STATE;
	}

	solve() {
		return this._solve();
	}

	_getCaseNumber() {
		return this.getOllString();
	}

	_solveCase(ollString) {
		let pattern = this.findPattern(ollString);
		let algorithm = this.getAlgorithm(pattern);
		let frontFace = this._getFrontFace(ollString, pattern);

		this.move(algorithm, {
			orientation: { up: 'down', front: frontFace }
		});
	}

	getOllString() {
		let orientations = [];

		let cubies = this._getOllCubies();
		cubies.forEach(cubie => {
			let orientation = this._getCubieOrientation(cubie);
			orientations.push(orientation);
		});

		return orientations.join('');
	}

	/**
	 * @param {string} [ollString] - Probably unnecessary. If passed in, it saves
	 * a step computing the ollString.
	 */
	findPattern(ollString) {
		if (typeof ollString === 'undefined') {
			ollString = this.getOllString();
		}

		for (let i = 0; i < 4; i++) {
			let algorithm = this.algorithms[ollString];

			if (typeof algorithm === 'string') {
				return ollString;
			} else {
				ollString = this._rotateOllStringLeft(ollString);
			}
		}

		throw new Error(`No pattern found for oll string "${ollString}"`);
	}

	/**
	 * @param {string} [pattern] - The pattern on this OLL or the ollString.
	 */
	getAlgorithm(pattern) {
		if (typeof pattern === 'undefined') {
			pattern = this.getPattern(pattern); // pattern can be an ollString
		}

		if (typeof this.algorithms[pattern] === 'undefined') {
			throw new Error(`No algorithm found for pattern "${pattern}"`);
		}

		return this.algorithms[pattern];
	}

	_getOllCubies() {
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
	_getCubieOrientation(cubie) {
		if (cubie.getColorOfFace('down') === 'd') {
			return 0;
		}

		// if cubie is an edge piece, return 1
		if (cubie.isEdge()) {
			return 1;
		}

		let [face1, face2] = cubie.faces().filter(face => face !== 'down');
		let dir = getDirectionFromFaces(face1, face2, { up: 'down' });
		let rightFace = dir === 'right' ? face2 : face1;

		return cubie.getColorOfFace(rightFace) === 'd' ? 1 : 2;
	}

	_getFrontFace(ollString, pattern) {
		let rotationOrder = ['front', 'left', 'back', 'right'];

		for (let i = 0; i < 4; i++) {
			if (ollString === pattern) {
				return rotationOrder[i];
			} else {
				ollString = this._rotateOllStringLeft(ollString);
			}
		}

		throw new Error(`OLL string "${ollString}" does not resolve to the pattern "${pattern}"`);
	}

	_rotateOllStringLeft(ollString) {
		return ollString.slice(2) + ollString.slice(0, 2);
	}

	_getPartitionBefore() {
		return this.getOllString();
	}

	_getPartitionAfter() {
		return null;
	}
}

export { OLLSolver };
