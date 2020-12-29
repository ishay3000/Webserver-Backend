const iniParser = require('../utils/ini-reader')
const fs = require('fs')
const path = require('path')


let configFiles = {}

function traverseDir(dir) {
    fs.readdirSync(dir).forEach(file => {
      let fullPath = path.join(dir, file);
      let parentDir = path.basename(fullPath)
      if (fs.lstatSync(fullPath).isDirectory()) {
          parent
          configFiles[parentDir] = []
          console.log(file)
         traverseDir(fullPath);
       } else {
           configFiles[parentDir]
       }  
    });
  }

module.exports = function (app) {
    app.get('/sessions', (req, res) => {

        const sessionsRootPath = 'Sessions/'
        traverseDir(sessionsRootPath)

        for(const [key, value] of Object.entries(configFiles)) {
            console.log(value)
        }

    
        let config = iniParser('Sessions/Session1/publicTX.conf')

        const session = JSON.stringify({
            "sessions": [
                config
            ]
        })

        // const session = JSON.stringify({
        //     "sessions": [
        //         {
        //             "name": "TX1",
        //             "bandwidth": "5.0"
        //         }
        //     ]
        // })
        res.end(session)
    })
}