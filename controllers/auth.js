const express = require('express')
const router = express.Router()
const dbcon = require('../config/dbconnection')
var utility = require('../utility/utility')

var users = []

router.post('/login', async (req, res) => {
    // Authenticate user
    const email = req.body.email;
    const password = req.body.password;
    var users = await dbcon.select('*').from('users')
    var filtered = users.filter((x) => {
        return (x.Email == email && utility.decrypt(x.Password) == password)
    });
    if (filtered.length == 0) {
        return res.json({ msg: 'Unauthorised user' })
    }
    var Token = utility.JWTgenerateToken(filtered[0])
    return res.json({ Token: Token })
})


module.exports = router