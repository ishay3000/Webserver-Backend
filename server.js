var passwd = require('passwd-linux')
var express = require('express')
var session = require('express-session')
var passport = require('passport')
var passportLocal = require('passport-local').Strategy
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


app.post('/login', (req, res) => {
    var username = req.body.data.username
    var password = req.body.data.password
    
    passwd.checkPassword(username, password, function (err, response) {
        if (response) {
            res.sendStatus(200)
        } else {
            if (err) {
                console.log(err)
            }
            res.sendStatus(418)
        }
    })
})

const options = {
     key: fs.readFileSync('cert/key.pem'),
     cert: fs.readFileSync('cert/cert.pem')
 };

const PORT = 1337;
https.createServer(options, app).listen(PORT);
console.log('Server listening on port: ' + PORT);