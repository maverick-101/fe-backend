const router = require('express').Router()
let debug = require("debug-levels")("hotelImageApi")
const HotelImage = require('../models/HotelImage')
const HotelImageLib = require('../lib/HotelImageLib')
const AppConfig = require('../lib/AppConfig')
const CloudinaryLib = require('../lib/Cloudinary')
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
	folder: "HotelImages",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })


// Saving HotelImage
router.post("/save/hotelImage-save", parser.array("hotel_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.hotelImage)
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in HotelImage POST request!")
    res.status(500).send("ERROR: No Data found in HotelImage POST request!")
  }
  if (cloudinaryData) {
    gallery = await CloudinaryLib.createImages(cloudinaryData)
    data.images = gallery
    let reply = await HotelImageLib.saveImage(data)
    if (reply) {
      res.status(200).send('HotelImage Saved!')
    } else {
      res.status(500).send('ERROR: Saving HotelImage!')
    }
  } else {
    res.status(500).send('ERROR: No Cloudinary Data Found To Save HotelImage!')
  }
})

// Updating HotelImage
router.patch("/update/hotelImage-update", parser.array("hotel_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.hotelImage)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in HotelImage UPDATE request!")
    res.status(500).send("ERROR: No Data found in HotelImage UPDATE request!")
  }
  if (cloudinaryData) {
    gallery = await CloudinaryLib.updateImages(data, cloudinaryData)
    data.images = gallery
    delete data.image_type
    let reply = await HotelImageLib.updateImage(data)
    if (reply) {
      res.status(200).send('HotelImage Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating HotelImage!')
    }
  } else {
    let reply = await HotelImageLib.updateImage(data)
    if (reply) {
      res.status(200).send('HotelImage Updated!')
    } else {
      res.status(500).send('ERROR: No ID Found or Error Updating HotelImage!')
    }
  }
})

// fetching all HotelImages
router.get('/fetch/hotelImage-fetch', async(req, res) => {
  let reply = await HotelImageLib.fetchAllImages()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelImage Found Or Error Fetching HotelImages!')
  }
})

// fetching HotelImage by ID
router.get('/fetchById/hotelImage-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in HotelImage FetchByID request!")
    res.status(500).send("ERROR: No ID found in HotelImage FetchByID request!")
  }
  let reply = await HotelImageLib.findImageById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelImage Found Or Error Fetching HotelImage By ID!')
  }
})

// fetching HotelImage by hotel_id
router.get('/fetchByHotelId/hotelImage-fetchByHotelId/:hotel_id', async(req, res) => {
  let hotel_id = req.params.hotel_id
  if (!hotel_id) {
    debug.error("ERROR: No hotel_id found in HotelImage fetchByHotelId request!")
    res.status(500).send("ERROR: No hotel_id found in HotelImage fetchByHotelId request!")
  }
  let reply = await HotelImageLib.findImageByHotelId(hotel_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelImage Found Or Error Fetching HotelImage By fetchByHotelId!')
  }
})

//fetching HotelImage by Type
router.get('/fetchByType/hotelImage-fetchByType/:image_type', async(req, res) => {
  let image_type = req.params.image_type
  if (!image_type ) {
    debug.error("ERROR: No image_type found in HotelImage fetchByType  request!")
    res.status(500).send("ERROR: No image_type found in HotelImage fetchByType  request!")
  }
  let reply = await HotelImageLib.findImageByType(image_type)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelImage Found Or Error Fetching HotelImage By image_type!')
  }
})

//fetching all HotelImage by fetchByTypeAndHotelId
router.get('/fetchByTypeAndHotelId/hotelImage-fetchByType/:image_type/fetchByHotelId/:hotel_id', async(req, res) => {
  let image_type = req.params.image_type
  let hotel_id = req.params.hotel_id
  if (!image_type || !hotel_id ) {
    debug.error("ERROR: No Data found in HotelImage FetchByProvince request!")
    res.status(500).send("ERROR: No Data found in HotelImage FetchByProvince request!")
  }
  let reply = await HotelImageLib.findImageByTypeAndHotelId(image_type, hotel_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelImage Found Or Error Fetching HotelImage By fetchByTypeAndHotelId!')
  }
})

//Delete HotelImage by ID 
router.delete('/delete/hotelImage-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in HotelImage Delete request!")
    res.status(500).send("ERROR: No ID found in HotelImage Delete request!")
  }
  let reply = await HotelImageLib.deleteImageById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelImage Found Or Deleting HotelImage!')
  }
})

module.exports = router
