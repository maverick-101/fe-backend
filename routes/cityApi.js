const router = require('express').Router()
let debug = require("debug-levels")("cityApi")
const City = require('../models/City')


// Saving Cities
router.post("/city/save", async (req, res) => {
  let data = req.body
	if (!data) {
    debug.error("ERROR: No Data found in req!")
    res.send("ERROR: No Data found in req!")
	}
  const city = new City(data)
  city.save().then(result => {
    debug.info('City Saved Result', result)
    res.send("City Saved!")
  })
  .catch(error => {
    debug.error("ERROR: Found in City!", error)
    res.send(error)
  })
})

// Updating Cities
router.patch("/city/update", async (req, res) => {
  let data = req.body
	if (!data) {
    debug.error("ERROR: No Data found in req!")
    res.send("ERROR: No Data found in req!")
	}
  City.findOneAndUpdate({
    ID: data.ID
  },
  data,
  {upsert:false}
  )
  .then(result => {
    debug.info('City Updated Result', result)
    if(!result) {
      debug.error("ERROR: Found in updating City!")
      res.send("ERROR: updating City!")
    }
    res.send("City Updated!")
  })
  .catch(error => {
    debug.error("ERROR: Found in updating City!", error)
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
  if (!Id) {
    debug.error("ERROR: No Id found in req!")
    res.send("ERROR: No Id found in req!")
  }
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
  if (!name ) {
    debug.error("ERROR: No name found in req!")
    res.send("ERROR: No name found in req!")
  }
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

//fetching all cities by Province
router.get('/city/fetchByProvince/:province', async(req, res) => {
  let province = req.params.province
  if (!province ) {
    debug.error("ERROR: No province found in req!")
    res.send("ERROR: No province found in req!")
  }
  City.find({province: province})
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
