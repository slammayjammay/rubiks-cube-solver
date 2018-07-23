import combiner from 'array-element-combiner';

const parallelMoves = {
	F: 'B',
	R: 'L',
	U: 'D'
};

/**
 * @param {array|string} notations - The array of move notations.
 * @return {string}
 */
const algorithmShortener = (notations) => {
	if (typeof notations === 'string') {
		notations = notations.split(' ');
	}

	const options = {
		compare(a, b) {
			return a[0] === b[0];
		},
		combine(a, b) {
			const aDir = a.includes('2') ? 2 : (a.includes('prime') ? -1 : 1);
			const bDir = b.includes('2') ? 2 : (b.includes('prime') ? -1 : 1);

			let totalDir = aDir + bDir;

			if (totalDir === 4) totalDir = 0;
			if (totalDir === -2) totalDir = 2;
			if (totalDir === 3) totalDir = -1;

			if (totalDir === 0) {
				return '';
			}

			let dirString = totalDir === 2 ? '2' : (totalDir === -1 ? 'prime' : '');

			return `${a[0]}${dirString}`;
		},
		cancel(value) {
			return value === '';
		},
		ignore(a, b) {
			return (parallelMoves[a[0]] === b[0] || parallelMoves[b[0]] === a[0]);
		}
	};

	return combiner(notations, options).join(' ');
};

export { algorithmShortener };
