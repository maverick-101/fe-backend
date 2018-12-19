const router = require('express').Router()
let debug = require("debug-levels")("locationApi")
const Locations = require('../models/Locations')

router.post("/locations/save", async (req, res) => {
  let data = req.body
	if (!data) {
    debug.error("ERROR: No Data Found in Locations!")
    res.send("ERROR: No Data Found in Locations!")
	}
  const locations = new Locations(data)
  locations.save().then(result => {
    debug.info('Location Saved Result', result)
    res.send("Location Saved!")
  })
  .catch(error => {
    debug.error("ERROR: Found in Locations!", error)
    res.send(error)
  })
})

module.exports = router
