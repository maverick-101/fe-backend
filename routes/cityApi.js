const router = require('express').Router()
let debug = require("debug-levels")("cityApi")
const City = require('../models/City')

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

module.exports = router
