import * as solver from './';
const defaultExport = solver.default;
delete solver.default;
Object.assign(defaultExport, solver);
module.exports = defaultExport;
