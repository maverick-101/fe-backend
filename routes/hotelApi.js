const router = require('express').Router()
let debug = require("debug-levels")("hotelApi")
const Hotel = require('../models/Hotel')
const AppConfig = require('../lib/AppConfig')
const CloudinaryLib = require('../lib/Cloudinary')
const HotelLib = require('../lib/HotelLib')
const multer  = require('multer')
const cloudinary = require('cloudinary')
const cloudinaryStorage = require("multer-storage-cloudinary")

cloudinary.config({ 
  cloud_name: AppConfig.cloudinaryName, 
  api_key: AppConfig.cloudinaryApi, 
  api_secret: AppConfig.cloudinarySecret 
})

const storage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: "Hotels",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })

// saving hotels
router.post("/hotel/save", parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.hotel)
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in Hotel request!")
    res.status(500).send("ERROR: No Data found in Hotel request!")
  }
  gallery = await CloudinaryLib.createGallery(data, cloudinaryData)
  data.gallery = gallery
  if(data.stars) {
    data.stars = Number(data.stars)
  }
  if(data.star_rating) {
    data.star_rating = Number(data.star_rating)
  }
  let reply = await HotelLib.saveHotel(data)
  if (reply) {
    res.status(200).send('Hotel Saved!')
  } else {
    res.status(500).send('ERROR: Duplicate Field Found or Error Saving Hotel!')
  }
})

// Updating hotels
router.patch("/hotel/update", parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.hotel)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in Hotel request!")
    res.status(500).send("ERROR: No Data found in Hotel request!")
  }
  if(data.stars) {
    data.stars = Number(data.stars)
  }
  if(data.star_rating) {
    data.star_rating = Number(data.star_rating)
  }
  if (cloudinaryData && cloudinaryData.length > 0) {
    gallery = await CloudinaryLib.updateGallery(data, cloudinaryData)
    data.gallery = gallery
    delete data.image_type
    let reply = await HotelLib.updateHotel(data)
    if (reply) {
      res.status(200).send('City Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating Hotel!')
    }
  } else {
    let reply = await HotelLib.updateHotel(data)
    if (reply) {
      res.status(200).send('City Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating Hotel!')
    }
  }
  
})

//fetching all hotels
router.get('/hotel/fetch', async(req, res) => {
  let reply = await HotelLib.fetchAllHotels()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Error Fetching Hotels!')
  }
})

// fetching hotels by ID
router.get('/hotel/fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in Hotel request!")
    res.status(500).send("ERROR: No ID found in Hotel request!")
  }
  let reply = await HotelLib.findHotelById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Error Fetching Hotel By ID!')
  }
})

//fetching hotels by Name
router.get('/hotel/fetchByName/:name', async(req, res) => {
  let name = req.params.name
  if (!name ) {
    debug.error("ERROR: No name found in Hotel request!")
    res.status(500).send("ERROR: No name found in Hotel request!")
  }
  let reply = await HotelLib.findHotelByName(name)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Error Fetching Hotel By Name!')
  }
})

//fetching hotels by email
router.get('/hotel/fetchByEmail/:email', async(req, res) => {
  let email = req.params.email
  if (!email ) {
    debug.error("ERROR: No email found in Hotel request!")
    res.status(500).send("ERROR: No email found in Hotel request!")
  }
  let reply = await HotelLib.findHotelByEmail(email)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Error Fetching Hotel By email!')
  }
})

//fetching hotels by phone
router.get('/hotel/fetchByPhone/:phone', async(req, res) => {
  let phone = req.params.phone
  if (!phone ) {
    debug.error("ERROR: No phone found in Hotel request!")
    res.status(500).send("ERROR: No phone found in Hotel request!")
  }
  let reply = await HotelLib.findHotelByPhone(phone)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Error Fetching Hotel By phone!')
  }
})

//Delete Room by ID
router.delete('/delete/hotel-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in Hotel request!")
    res.status(500).send("ERROR: No ID found in Hotel request!")
  }
  let reply = await HotelLib.deleteHotelById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No Hotel Found Or Deleting Hotel!')
  }
})

module.exports = router
