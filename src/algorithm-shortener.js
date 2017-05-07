class AlgorithmShortener {
	/**
	 * @param {array|string} notations - The notations to shorten.
	 */
	constructor(notations) {
		if (typeof notations === 'string') {
			notations = notations.split(' ');
		}

		this.notations = notations;
		this.moves = [];
		this.window = [];

		this.shorten();
	}

	shorten() {
		for (let notation of this.notations) {
			this.addToWindow(notation);
		}
	}

	addToWindow(notation) {
		this.moves.push(this.window.shift());
		this.window.push(notation);
		this.checkForOptimizations();
	}

	checkForOptimizations() {

	}
}

module.exports = (notations) => {
	return new AlgorithmShortener(notations);
};
