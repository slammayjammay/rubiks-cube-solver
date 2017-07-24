var solver = require('./');
var defaultExport = solver.default;

delete solver.default;
Object.assign(solver.default, solver)

module.exports = solver.default;
