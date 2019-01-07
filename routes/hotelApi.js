const router = require('express').Router()
let debug = require("debug-levels")("hotelApi")
const Hotel = require('../models/Hotel')
const AppConfig = require('../lib/AppConfig')
const CloudinaryLib = require('../lib/Cloudinary')
const multer  = require('multer')
const cloudinary = require('cloudinary')
const cloudinaryStorage = require("multer-storage-cloudinary")

cloudinary.config({ 
  cloud_name: 'saaditrips', 
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
  debug.info(cloudinaryData)
  let gallery = []
  let data = JSON.parse(req.body.hotel)
  if(cloudinaryData) {
    cloudinaryData.map(picture => {
      let pictureObject = {
        public_id: picture.public_id,
				url: picture.url,
				type: data.image_type
      }
      gallery.push(pictureObject)
    })
  }
	if (!data) {
    debug.error("ERROR: No Data Found in hotels!")
    res.send("ERROR: No Data Found in hotels!")
  }
  data.gallery = gallery
  const hotels = new Hotel(data)
  hotels.save().then(result => {
    debug.info('Hotel Saved Result', result)
    res.send("Hotel Saved!")
  })
  .catch(error => {
    debug.error("ERROR: Found in hotels!", error)
    res.send(error)
  })
})

// Updating hotels
router.patch("/hotel/update", parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.location)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in req!")
    res.send("ERROR: No Data found in req!")
  }
  if(cloudinaryData) {
    cloudinaryData.map(picture => {
      let pictureObject = {
        public_id: picture.public_id,
        url: picture.url,
        image_type: data.image_type
      }
      if (data.gallery) {
        data.gallery.push(pictureObject) 
      } else {
        gallery.push(pictureObject)
      }
    })
  }
  if (!data.gallery) {
    data.gallery = gallery
  }
  delete data.image_type
  Hotel.findOneAndUpdate({
    ID: data.ID
  },
  data,
  {upsert:false}
  )
  .then(result => {
    debug.info('Hotel Updated Result', result)
    if(!result) {
      debug.error("ERROR: Found in updating Hotel!")
      res.send("ERROR: updating Hotel!")
    }
    res.send("Hotel Updated!")
  })
  .catch(error => {
    debug.error("ERROR: Found in updating Hotel!", error)
    res.send(error)
  })
})

//fetching all hotels
router.get('/hotel/fetch', async(req, res) => {
  Hotel.find()
  .exec()
  .then(response => {
    debug.info('Hotels: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No Hotels found", error)
    res.send(error)
  })
})

// fetching hotels by ID
router.get('/hotel/fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  Hotel.find({ID: Id})
  .exec()
  .then(response => {
    debug.info('Hotel: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No Hotel found", error)
    res.send(error)
  })
})

//fetching hotels by Name
router.get('/hotel/fetchByName/:name', async(req, res) => {
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
