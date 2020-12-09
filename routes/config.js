const iniParser = require('../utils/ini-reader')


module.exports = function (app) {
    app.get('/sessions', (req, res) => {

        const session = JSON.stringify({
            "sessions": [
                {
                    "name": "TX1",
                    "bandwidth": "5.0"
                }
            ]
        })

        res.end(session)
    })
}