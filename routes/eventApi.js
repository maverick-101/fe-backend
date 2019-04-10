const router = require('express').Router()
let debug = require("debug-levels")("eventApi")
const Event = require('../models/Event')
const EventLib = require('../lib/EventLib')
const AppConfig = require('../lib/AppConfig')
const GlsobalLib = require('../lib/GlobalLib')
const CloudinaryLib = require('../lib/Cloudinary')
const multer  = require('multer')
const cloudinary = require('cloudinary')
const cloudinaryStorage = require("multer-storage-cloudinary")
const checkAuth = require('../middleware/check-auth')

cloudinary.config({ 
  cloud_name: AppConfig.cloudinaryName, 
  api_key: AppConfig.cloudinaryApi, 
  api_secret: AppConfig.cloudinarySecret 
})

const storage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: "Events",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })


// Saving Events
router.post("/save/event-save", checkAuth, parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  // debug.info(cloudinaryData)
  // if (!req.body.event) {
  //   debug.error("ERROR: No Data found in Event POST request!")
  //   res.status(500).send("ERROR: No Data found in Event POST request!")
  // }
  // let data = JSON.parse(req.body.event)
  let data = req.body  // for test on Postman
  gallery = await CloudinaryLib.createGallery(data, cloudinaryData)
  data.gallery = gallery
  let reply = await EventLib.saveEvent(data)
  if (reply) {
    res.status(200).send('Event Saved!')
  } else {
    res.status(500).send('ERROR: Duplicate Field Found or Error Saving Event!')
  }
})

// Updating Events
router.patch("/update/event-update", checkAuth, parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  // if (!req.body.event) {
  //   debug.error("ERROR: No Data found in Event POST request!")
  //   res.status(500).send("ERROR: No Data found in Event POST request!")
  // }
  // let data = JSON.parse(req.body.event)
  let data = req.body   //for testing in postman
  if (cloudinaryData && cloudinaryData.length > 0) {
    gallery = await CloudinaryLib.updateGallery(data, cloudinaryData)
    data.gallery = gallery
    delete data.image_Title
    let reply = await EventLib.updateEvent(data)
    if (reply) {
      res.status(200).send('Event Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating Event!')
    }
  } else {
    let reply = await EventLib.updateEvent(data)
    if (reply) {
      res.status(200).send('Event Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating Event!')
    }
  }
})

// fetching all Events
router.get('/fetch/event-fetch', async(req, res) => {
  let reply = await EventLib.fetchAllEvents()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Event Found Or Error Fetching Events!')
  }
})

// fetching Events by ID
router.get('/fetchById/event-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in Event FetchByID request!")
    res.status(500).send("ERROR: No ID found in Event FetchByID request!")
  }
  let reply = await EventLib.findEventById(Id)
  reply = await GlobalLib.getObject(reply) || {}
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Event Found Or Error Fetching Event By ID!')
  }
})

// fetching Events by city_id
router.get('/fetchByCity/event-fetchByCity/:city_id', async(req, res) => {
  let city_id = req.params.city_id
  if (!city_id) {
    debug.error("ERROR: No city_id found in Event fetchByCityId request!")
    res.status(500).send("ERROR: No city_id found in Event fetchByCityId request!")
  }
  let reply = await EventLib.findEventByCity(city_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Event Found Or Error Fetching Event By city_id!')
  }
})

// fetching Events by location_id
router.get('/fetchByLocation/event-fetchByLocation/:location_id', async(req, res) => {
  let location_id = req.params.location_id
  if (!location_id) {
    debug.error("ERROR: No location_id found in Event fetchByLocation request!")
    res.status(500).send("ERROR: No location_id found in Event fetchByLocation request!")
  }
  let reply = await EventLib.findEventByLocation(location_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Event Found Or Error Fetching Event By location_id!')
  }
})

// fetching Events by date
router.get('/fetchByDate/event-fetchDate/:start_date/:end_start', async(req, res) => {
  let start_date = req.params.start_date
  let end_start = req.params.end_start
  if (!start_date || !end_start) {
    debug.error("ERROR: No Date found in Event fetchByDate request!")
    res.status(500).send("ERROR: No Date found in Event fetchByDate request!")
  }
  let reply = await EventLib.findEventByDate(start_date, end_start)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Event Found Or Error Fetching Event By ID!')
  }
})

//fetching Events by Title
router.get('/fetchByTitle/event-fetchByTitle/:title', async(req, res) => {
  let title = req.params.title
  if (!title ) {
    debug.error("ERROR: No title found in Event fetchByTitle  request!")
    res.status(500).send("ERROR: No title found in Event fetchByTitle  request!")
  }
  let reply = await EventLib.findEventByTitle(title)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Event Found Or Error Fetching Event By title!')
  }
})

//fetching all Recommended Events
router.get('/fetchRecommended/event-fetchRecommended', async(req, res) => {
  let reply = await EventLib.findRecommendedEvents()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Event Found Or Error Fetching Event By Recommended!')
  }
})

//Delete  by ID Event
router.delete('/delete/event-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in Event Delete request!")
    res.status(500).send("ERROR: No ID found in Event Delete request!")
  }
  let reply = await EventLib.deleteEventById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Event Found Or Deleting Event!')
  }
})

module.exports = router
