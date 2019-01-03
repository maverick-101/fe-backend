const router = require('express').Router()
let debug = require("debug-levels")("locationResourcesApi")
const LocationResources = require('../models/LocationResources')
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
	folder: "Location Resources",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })

// saving locationResources
router.post("/lcoationResources/save", parser.array("gallery_images"), async (req, res) => {
	let cloudinaryData = req.files
  debug.info(cloudinaryData)
	let gallery = []
	let data = JSON.parse(req.body.city)
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
		debug.error("ERROR: No Data Found in LocationResources!");
		res.send("ERROR: No Data Found in LocationResources!")
	}
  const locationResources = new LocationResources({
		location_id: data.location_id,
		type: data.type,
		city_id: data.city_id,
		URL: data.URL,
		status: data.status,
		gallery: gallery
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

// Updating locationResources
router.patch("/lcoationResources/update", parser.array("gallery_images"), async (req, res) => {
	let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.locationResources)
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
