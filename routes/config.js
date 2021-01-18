const iniParser = require('../utils/ini-reader')
const fs = require('fs')
const path = require('path');


function log(text) {
  console.log('\x1b[31m%s\x1b[0m', text);
}

function deleteSession(sessionName) {
  const sessionFolder = 'Sessions/' + sessionName;
  if (fs.existsSync(sessionFolder)) {
    fs.rmdirSync(sessionFolder, { recursive: true });
  }
}

module.exports = function (app) {

  app.post('/sessions', (req, res) => {
    JSON.parse(req.body.data).forEach(change => {
      if (change.modification === 'deleted') {
        deleteSession(change.session)
      }
    });
  })

  app.get('/sessions', (req, res) => {
    var sessions_json = {} // empty Object
    var key = 'Sessions';
    sessions_json[key] = [];
    const sessionsRootPath = 'Sessions/'
    log(sessionsRootPath)

    const testFolder = 'Sessions/';
    const fs = require('fs');

    fs.readdirSync(testFolder).forEach(file => {
      if (file.startsWith('Session')) {
        let config
        try {
          let path = `Sessions/${file}/publicTX.conf`

          if (fs.existsSync(path)) {
            config = iniParser(path)
            config['Type'] = 'TX'

            var sessions_json_tx = {}
            sessions_json_tx[file] = config
            sessions_json[key].push(sessions_json_tx)

          } else {
            path = `Sessions/${file}/publicRX.conf`
            config = iniParser(path)
            config['Type'] = 'RX'
            var sessions_json_rx = {}
            sessions_json_rx[file] = config
            sessions_json[key].push(sessions_json_rx)
          }
          config['Name'] = file
        } catch (err) {
          console.error(err)
        }

        log(JSON.stringify(sessions_json));
        let data = JSON.stringify(sessions_json, null, 2);

        fs.writeFile('student-3.json', data, (err) => {
          if (err) throw err;
          console.log('Data written to file');
        });
      }
    });
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(sessions_json))
  })
}