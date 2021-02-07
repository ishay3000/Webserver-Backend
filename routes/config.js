const iniParser = require('../utils/ini-parser');
const fs = require('fs');
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

function writeJsonAsIni(json, filePath) {
  const jsonConstructor = ({}).constructor;
  var ini = '';
  Object.keys(json).forEach(section => {
    if (json[section].constructor === jsonConstructor) {
      ini += `[${section}]\n`;

      for (let [key, value] of Object.entries(json[section])) {
        ini += `${key}=${value}\n`;
      }
    }
  })
  fs.writeFileSync(filePath, ini);
}

function modifySession(session, sessionNameChangedProps) {
  const rootSessionsDir = 'Sessions/';
  const currentSessionDir =
    rootSessionsDir + session.SessionName + '/';
  const sessionDirExists = fs.existsSync(currentSessionDir);
  const sessionNameChanged = sessionNameChangedProps.sessionNameChanged;
  const oldSessionName = sessionNameChangedProps.oldName;

  if (sessionNameChanged) {
    if (sessionDirExists) {
      throw new Error(`Cannot rename session ${oldSessionName} to ${session.SessionName}: Session already exists.`)
    }
    let oldSessionDir = rootSessionsDir + oldSessionName + '/';
    fs.renameSync(oldSessionDir, currentSessionDir);

    let publicConfig = fs.readdirSync(currentSessionDir)
      .filter(file => file.includes('public'))[0];
    writeJsonAsIni(session, currentSessionDir + publicConfig)
  } else {
    if (!sessionDirExists) {
      throw new Error(`Cannot modify session ${session.SessionName}: Session does not exist.`)
    }
    let publicConfig = fs.readdirSync(currentSessionDir)
      .filter(file => file.includes('public'))[0];
    writeJsonAsIni(session, currentSessionDir + publicConfig)
  }
}

function addSession(session) {
  const rootSessionsDir = 'Sessions/';
  log('Added session not implemented.')
  const folderPath = rootSessionsDir + session.SessionName + '/'
  log(folderPath)
  fs.mkdirSync(folderPath, { recursive: true })
  writeJsonAsIni(session, folderPath + 'public' + session.SessionType + ".conf")
  

//   mkdirp('/tmp/some/path/foo', function(err) { 

//     // path exists unless there was an error

// });

}

module.exports = function (app) {

  app.post('/sessions', (req, res) => {
    JSON.parse(req.body.data).forEach(change => {
      log(change)
      const modification = change.modification;
      var err;
      var statusCode = 200;
      try {
        if (modification === 'deleted') {
          deleteSession(change.session)
        } else if (modification === 'modified') {
          modifySession(change.session, change.sessionNameChangedProps)
        } else if (modification === 'added') {
          log("added")
          addSession(change.session)
        } else {
          // Nice try
        }
      } catch (ex) {
        err = ex;
        statusCode = 406;
      }
      // res.writeHead(statusCode, { 'Content-Type': 'text/plain' })
      //res.end(err.message)
    });
  })

  app.get('/sessions', (req, res) => {
    var sessions_json = {} // empty Object
    var key = 'Sessions';
    sessions_json[key] = [];
    const sessionsRootPath = 'Sessions/'

    const testFolder = 'Sessions/';
    const fs = require('fs');

    fs.readdirSync(testFolder).forEach(file => {
     // if (file.startsWith('Session')) {
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

        let data = JSON.stringify(sessions_json, null, 2);

        fs.writeFile('student-3.json', data, (err) => {
          if (err) throw err;
        });
     // }
    });
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(sessions_json))
  })
}