const F2LBaseSolver = require('../BaseSolver');

class F2LCaseBaseSolver extends F2LBaseSolver {
	solve({ corner, edge }) {
		return this._solve({ corner, edge });
	}
}

module.exports = F2LCaseBaseSolver;
