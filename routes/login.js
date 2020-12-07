var passwd = require('passwd-linux')


module.exports = function(app) {
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
}