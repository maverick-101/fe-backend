const router = require('express').Router()
let debug = require("debug-levels")("locationResourcesApi")
const LocationResources = require('../models/LocationResources')

// saving locationResources
router.post("/lcoationResources/save", async (req, res) => {
	let data = req.body
	if (!data) {
		debug.error("ERROR: No Data Found in LocationResources!");
		res.send("ERROR: No Data Found in LocationResources!")
	}
  const locationResources = new LocationResources(data)
  locationResources.save().then(result => {
		debug.info('locationResources Saved Result', result)
		res.send("locationResources Saved!")
	})
	.catch(error => {
    debug.error("ERROR: Found in locationResources!", error)
    res.send(error)
  })
})

// Updating locationResources
router.patch("/lcoationResources/update", async (req, res) => {
  let data = req.body
	if (!data) {
    debug.error("ERROR: No Data found in req!")
    res.send("ERROR: No Data found in req!")
	}
  LocationResources.findOneAndUpdate({
    ID: data.ID
  },
  data,
  {upsert:false}
  )
  .then(result => {
    debug.info('locationResources Updated Result', result)
    if(!result) {
      debug.error("ERROR: Found in updating locationResources!")
      res.send("ERROR: updating locationResources!")
    }
    res.send("locationResources Updated!")
  })
  .catch(error => {
    debug.error("ERROR: Found in updating locationResources!", error)
    res.send(error)
  })
})

//fetching all location resources
router.get('/lcoationResources/fetch', async(req, res) => {
	LocationResources.find()
	.exec()
	.then(response => {
	  debug.info('LocationResources: ', response)
	  res.json(response)
	})
	.catch(error => {
	  debug.error("No LocationResources found", error)
	  res.send(error)
	})
})

//fetching location resources By ID
router.get('/lcoationResources/fetchById/:Id', async(req, res) => {
	let Id = req.params.Id
	LocationResources.find({ 
		ID: Id,
	})
	.exec()
	.then(response => {
	  debug.info('LocationResources: ', response)
	  res.json(response)
	})
	.catch(error => {
	  debug.error("No LocationResources found", error)
	  res.send(error)
	})
})

//fetching location resources by ID, LocationID and CityID
router.get('/lcoationResources/fetchById/:Id/locationId/:locationId/cityId/:cityId', async(req, res) => {
	let Id = req.params.Id
	let locationId = req.params.locationId
	let cityId = req.params.cityId
	LocationResources.find({ 
		ID: Id,
		location_id: locationId,
		city_id: cityId
	})
	.exec()
	.then(response => {
	  debug.info('LocationResources: ', response)
	  res.json(response)
	})
	.catch(error => {
	  debug.error("No LocationResources found", error)
	  res.send(error)
	})
})

//fetching location resources by ID and LocationID
router.get('/lcoationResources/fetchById/:Id/locationId/:locationId', async(req, res) => {
	let Id = req.params.Id
	let locationId = req.params.locationId
	LocationResources.find({ 
		ID: Id,
		location_id: locationId
	})
	.exec()
	.then(response => {
	  debug.info('LocationResources: ', response)
	  res.json(response)
	})
	.catch(error => {
	  debug.error("No LocationResources found", error)
	  res.send(error)
	})
})


module.exports = router
