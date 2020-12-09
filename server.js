var passwd = require('passwd-linux')
var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var cors = require('cors')
var https = require('https');
var fs = require('fs');


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'KappaPrideDansGameTriHardHeyGuys',
    resave: false,
    saveUninitialized: false
}))
app.use(cors())

require('./routes/login')(app)
require('./routes/config')(app)
require('./routes/hardware')(app)

const options = {
     key: fs.readFileSync('cert/key.pem'),
     cert: fs.readFileSync('cert/cert.pem')
 };

const PORT = 1337;
https.createServer(options, app).listen(PORT);
console.log('Server listening on port: ' + PORT);