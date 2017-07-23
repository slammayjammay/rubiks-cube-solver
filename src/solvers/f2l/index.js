import { RubiksCube } from '../../models/RubiksCube';
import { F2LBaseSolver } from './F2LBaseSolver';
import { Case1Solver } from './cases/case-1';
import { Case2Solver } from './cases/case-2';
import { Case3Solver } from './cases/case-3';
import { getDirectionFromFaces } from '../../utils';

const R = (moves) => RubiksCube.reverseMoves(moves);

class F2LSolver extends F2LBaseSolver {
	constructor(...args) {
		super(...args);

		this.subCaseOptions = Object.assign(this.options, {
			_overrideAfterEach: true
		});
	}

	solve() {
		this.partitions = [];

		let pairs = this.getAllPairs();
		pairs.forEach(({ corner, edge }) => {
			let partition = this._solve({ corner, edge });
			this.partitions.push(partition);
		});

		return this.partitions;
	}

	isSolved() {
		let pairs = this.getAllPairs();
		for (let pair of pairs) {
			if (!this.isPairSolved(pair)) {
				return false;
			}
		}

		return true;
	}

	getAllPairs() {
		let corners = this.cube.corners().filter(corner => {
			return corner.hasColor('u');
		});
		let edges = this.cube.edges().filter(edge => {
			return !edge.hasColor('u') && !edge.hasColor('d');
		});

		let pairs = [];

		for (let edge of edges) {
			let corner = corners.find(corner => {
				let colors = edge.colors();
				return corner.hasColor(colors[0]) && corner.hasColor(colors[1]);
			});

			pairs.push({ edge, corner });
		}

		return pairs;
	}

	/**
	 * 4 top level cases: (cross face is UP)
	 *
	 * 1) Corner and edge are both on the DOWN face.
	 * 2) Corner is on the DOWN face and edge is not on DOWN face.
	 * 3) Corner is on UP face and edge is on DOWN face.
	 * 4) Corner is on UP face and edge is not on DOWN face.
	 */
	_getCaseNumber({ corner, edge }) {
		if (corner.faces().includes('down')) {
			if (edge.faces().includes('down')) {
				return 1;
			}
			if (!edge.faces().includes('down') && !edge.faces().includes('up')) {
				return 2;
			}
		}

		if (corner.faces().includes('up')) {
			if (edge.faces().includes('down')) {
				return 3;
			}
			if (!edge.faces().includes('down') && !edge.faces().includes('up')) {
				return 4;
			}
		}

		throw new Error('Could not find a top level F2L case');
	}

	_solveCase1({ corner, edge }) {
		let solver = new Case1Solver(this.cube, this.subCaseOptions);
		let partition = solver.solve({ corner, edge });

		this.totalMoves = partition.moves;
		this.partition.caseNumber = [this.partition.caseNumber, partition.caseNumber];
	}

	_solveCase2({ corner, edge }) {
		let solver = new Case2Solver(this.cube, this.subCaseOptions);
		let partition = solver.solve({ corner, edge });

		this.totalMoves = partition.moves;
		this.partition.caseNumber = [this.partition.caseNumber, partition.caseNumber];
	}

	_solveCase3({ corner, edge }) {
		let solver = new Case3Solver(this.cube, this.subCaseOptions);
		let partition = solver.solve({ corner, edge });

		this.totalMoves = partition.moves;
		this.partition.caseNumber = [this.partition.caseNumber, partition.caseNumber];
	}

	_solveCase4({ corner, edge }) {
		if (this.isPairSolved({ corner, edge })) {
			return;
		}

		let solver;
		if (corner.faces().includes(edge.faces()[0]) &&
				corner.faces().includes(edge.faces()[1])) {
			solver = new Case1Solver(this.cube, this.subCaseOptions);
		} else {
			solver = new Case2Solver(this.cube, this.subCaseOptions);
		}

		let faces = corner.faces().filter(face => face !== 'up');
		let dir = getDirectionFromFaces(faces[0], faces[1], { up: 'down' });
		let cornerRightFace = dir === 'right' ? faces[1] : faces[0];

		this.move(`${cornerRightFace} D ${R(cornerRightFace)}`, { upperCase: true });

		let partition = solver.solve({ corner, edge });

		this.partition.caseNumber = [this.partition.caseNumber, partition.caseNumber];
		this.totalMoves = [...this.totalMoves, ...partition.moves];
	}
}

export { F2LSolver };
