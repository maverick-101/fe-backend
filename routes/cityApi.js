const router = require('express').Router()
let debug = require("debug-levels")("cityApi")
const City = require('../models/City')
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
	folder: "Cities",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })


// Saving Cities
router.post("/city/save", parser.array("gallery_images"), async (req, res) => {
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
    debug.error("ERROR: No Data found in req!")
    res.send("ERROR: No Data found in req!")
	}
  const city = new City({
    province: data.province,
    name: data.name,
    views: data.views,
    gallery: gallery
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

// Updating Cities
router.patch("/city/update", parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.city)
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
  City.findOneAndUpdate({
    ID: data.ID
  },
  data,
  {upsert:false}
  )
  .then(result => {
    debug.info('City Updated Result', result)
    if(!result) {
      debug.error("No ID Found or ERROR: updating City!")
      res.send("No ID Found or ERROR: updating City!")
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
