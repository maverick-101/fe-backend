const router = require('express').Router()
let debug = require("debug-levels")("loginApi")
const AppConfig = require('../lib/AppConfig')
var jwt = require('jsonwebtoken')


// login
router.post("/login", async (req, res) => {
  let email = req.body.email
  let password = req.body.password
  if (password === "saadiTrips12345" && email === "saadiTrips@gmail.com") {
    const user = {
      id: 1,
      username: "saadiTrips",
      email: "saadiTrips@gmail.com"
    }
    jwt.sign({user: user}, 'secret', (err, token)=> {
      res.json({
        token
      })
    })
  } else {
    debug.error("ERROR: No User Found!")
    res.status(500).send("ERROR: No User Found!")
  }
})

module.exports = router
