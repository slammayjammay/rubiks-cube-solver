const join = require('path').join
const fork = require('child_process').fork

fork(join(__dirname, `./cross.js`))
