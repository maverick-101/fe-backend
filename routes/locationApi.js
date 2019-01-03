const router = require('express').Router()
let debug = require("debug-levels")("locationApi")
const Locations = require('../models/Locations')
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
	folder: "Locations",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })

// saving locations
router.post("/locations/save", parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  debug.info(cloudinaryData)
  let gallery = []
  let data = JSON.parse(req.body.location)
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
    debug.error("ERROR: No Data Found in Locations!")
    res.send("ERROR: No Data Found in Locations!")
  }
  data.gallery = gallery
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

// Updating Locations
router.patch("/locations/update", parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.locations)
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
  Locations.findOneAndUpdate({
    ID: data.ID
  },
  data,
  {upsert:false}
  )
  .then(result => {
    debug.info('Locations Updated Result', result)
    if(!result) {
      debug.error("ERROR: Found in updating Locations!")
      res.send("ERROR: updating Locations!")
    }
    res.send("Locations Updated!")
  })
  .catch(error => {
    debug.error("ERROR: Found in updating Locations!", error)
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
