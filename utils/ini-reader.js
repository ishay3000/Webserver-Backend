const ini = require('ini')
const fs = require('fs')

module.exports = (configPath) => {
    return ini.parse(fs.readFileSync(configPath, 'utf-8'))
}