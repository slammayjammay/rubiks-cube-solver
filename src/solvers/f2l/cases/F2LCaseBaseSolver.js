import { F2LBaseSolver } from '../F2LBaseSolver';

class F2LCaseBaseSolver extends F2LBaseSolver {
	solve({ corner, edge }) {
		return this._solve({ corner, edge });
	}
}

export { F2LCaseBaseSolver };
