const RubiksCube = require('./models/RubiksCube');

class AlgorithmShortener {
	/**
	 * @param {array|string} notations - The notations to shorten.
	 */
	constructor(notations) {
		this.notations = RubiksCube.normalizeNotations(notations);
		this.original = this.notations.slice(); // coz im scared
		this.moves = [];
		this.window = [];
		this.madeOptimization = false;
	}

	shorten() {
		while (this.notations.length > 0) {
			if (this.madeOptimization) {
				this.populateWindowBackwards();
				} else {
				this.populateWindowForwards();
			}

			this.reset();

			this.checkForOptimizations();
			this.makeOptimizations();
		}

		this.moves.push(...this.window);

		return this.moves;
	}

	populateWindowBackwards() {
		while (this.window.length < 2) {
			let move = this.moves.pop();

			if (typeof move !== 'undefined') {
				this.window.unshift(move);
			} else {
				let move = this.notations.shift()
				this.window.push(move);
			}
		}

		this.window.filter(move => typeof move !== 'undefined');
	}

	populateWindowForwards() {
		if (this.window.length > 1) {
			this.moves.push(this.window.shift());
		}

		while (this.window.length < 2) {
			this.window.push(this.notations.shift());
		}

		this.window.filter(move => typeof move !== 'undefined');
	}

	checkForOptimizations() {
		let [move1, move2] = this.window.slice();

		// no optimizations if the moves don't rotate the same face
		if (move1[0] !== move2[0]) {
			return;
		}

		let data1 = {
			isPrime: move1.includes('prime'),
			isDouble: move1.includes('2')
		};

		let data2 = {
			isPrime: move2.includes('prime'),
			isDouble: move2.includes('2')
		};

		// double-able
		this.canDouble = move1 === move2;

		// cancel-able
		this.canCancel = (!data1.isDouble && !data2.isDouble && data1.isPrime !== data2.isPrime);

		// one is a double-move and the other isn't
		this.canCombine = (data1.isDouble !== data2.isDouble);
	}

	makeOptimizations() {
		let optimizedMove;

		if (this.canDouble) {
			optimizedMove = this.doubleMoves(...this.window);
		} else if (this.canCancel) {
			optimizedMove = this.cancelMoves(...this.window);
		} else if (this.canCombine) {
			optimizedMove = this.combineMoves(...this.window);
		}

		if (typeof optimizedMove !== 'undefined') {
			if (optimizedMove !== '') {
				this.moves.push(optimizedMove);
			}
			this.window = [];
			this.madeOptimization = true;
		}
	}

	cancelMoves(move1, move2) {
		this.thing = true;
		return '';
	}

	combineMoves(move1, move2) {
		let [dir1, dir2] = [1, 1];

		if (move1.includes('prime')) dir1 = -1;
		else if (move1.includes('2')) dir1 = 2;

		if (move2.includes('prime')) dir2 = -1;
		else if (move2.includes('2')) dir2 = 2;

		let combinedDir = dir1 + dir2;
		if (combinedDir === 1) combinedDir = '';
		else if (Math.abs(combinedDir) === 2) combinedDir = '2';
		else if (combinedDir === -1 || combinedDir === 3) combinedDir = 'prime';

		if (combinedDir === 4) {
			return '';
		}

		return `${move1[0]}${combinedDir}`;
	}

	doubleMoves(move1, move2) {
		return `${move1[0]}2`;
	}

	reset() {
		this.canDouble = this.canCancel = this.canCombine = false;
		this.madeOptimization = false;
	}
}

module.exports = (notations) => {
	notations = new AlgorithmShortener(notations).shorten();
	notations = RubiksCube.normalizeNotations(notations);
	return notations.join(' ')
};
