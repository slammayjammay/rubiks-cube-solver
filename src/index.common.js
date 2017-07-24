var solver = require('./');
var defaultExport = solver.default;

delete solver.default;
Object.assign(defaultExport, solver)

module.exports = defaultExport;
