const router = require('express').Router()
let debug = require("debug-levels")("cityApi")
const LocationResources = require('../models/LocationResources')

router.post("/lcoationResources/save", async (req, res) => {
	let data = req.body
	if (!data) {
		debug.error("ERROR: No Data Found in LocationResources!");
		res.send("ERROR: No Data Found in LocationResources!")
	}
  const locationResources = new LocationResources({
		ID: data.ID,
		city_id: data.city_id,
		location_id: data.location_id,
		URL: data.URL,
		status: data.status,
		type: data.type
  })
  locationResources.save().then(result => {
		debug.info('locationResources Saved Result', result)
		res.send("locationResources Saved!")
	})
	.catch(error => {
    debug.error("ERROR: Found in locationResources!", error)
    res.send(error)
  })
})

module.exports = router
