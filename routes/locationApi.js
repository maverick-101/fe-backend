const router = require('express').Router()
let debug = require("debug-levels")("locationApi")
const Locations = require('../models/Locations')

// saving locations
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

//fetching all locations
router.get('/locations/fetch', async(req, res) => {
  Locations.find()
  .exec()
  .then(response => {
    debug.info('locations: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No locations found", error)
    res.send(error)
  })
})

// fetching locations by ID
router.get('/locations/fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  Locations.find({ID: Id})
  .exec()
  .then(response => {
    debug.info('locations: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No locations found", error)
    res.send(error)
  })
})

//fetching locations by Name
router.get('/locations/fetchByName/:name', async(req, res) => {
  let name = req.params.name
  Locations.find({name: name})
  .exec()
  .then(response => {
    debug.info('locations: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No locations found", error)
    res.send(error)
  })
})

module.exports = router
