const ini = require('ini')
const fs = require('fs')

let config = ini.parse(fs.readFileSync('Sessions/Session1/publicTX.conf', 'utf-8'))

console.log(config)