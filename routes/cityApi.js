const router = require('express').Router()
let debug = require("debug-levels")("cityApi")
const City = require('../models/City')


// Saving Cities
router.post("/city/save", async (req, res) => {
  let data = req.body
	if (!data) {
    debug.error("ERROR: No Data Found in City!")
    res.send("ERROR: No Data Found in City!")
	}
  const city = new City({
    ID: data.ID,
    province: req.body.province,
    name: req.body.name,
	  views: req.body.views
  })
  city.save().then(result => {
    debug.info('City Saved Result', result)
    res.send("City Saved!")
  })
  .catch(error => {
    debug.error("ERROR: Found in City!", error)
    res.send(error)
  })
})

// fetching all cities
router.get('/city/fetch', async(req, res) => {
  City.find()
  .exec()
  .then(response => {
    debug.info('Cities: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No cities found", error)
    res.send(error)
  })
})

// fetching cities by ID
router.get('/city/fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  City.find({ID: Id})
  .exec()
  .then(response => {
    debug.info('Cities: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No cities found", error)
    res.send(error)
  })
})

//fetching cities by Name
router.get('/city/fetchByName/:name', async(req, res) => {
  let name = req.params.name
  City.find({name: name})
  .exec()
  .then(response => {
    debug.info('Cities: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No cities found", error)
    res.send(error)
  })
})

module.exports = router
