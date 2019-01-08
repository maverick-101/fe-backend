const router = require('express').Router()
let debug = require("debug-levels")("coverBannerApi")
const CoverBanner = require('../models/CoverBanner')
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
	folder: "CoverBanners",
	allowedFormats: ["jpg", "png"],
})
const parser = multer({ storage: storage })


// Saving CoverBanner
router.post("/coverbanner/save", parser.single("image"), async (req, res) => {
  let image = req.file
  let imageData = {}
  debug.info(image)
  let data = JSON.parse(req.body.coverBanner)
  // let data = req.body  // for test on postman
	if (!data) {
    debug.error("ERROR: No Data found in req!")
    res.send("ERROR: No Data found in req!")
  }
  if (image) {
    imageData = {
      public_id: image.public_id,
      url: image.url
    }
  }
  data.image = imageData
  const coverBanner = new CoverBanner(data)
  coverBanner.save().then(result => {
    debug.info('CoverBanner Saved Result', result)
    res.send("CoverBanner Saved!")
  })
  .catch(error => {
    debug.error("ERROR: Found in CoverBanner!", error)
    res.send(error)
  })
})

// Updating CoverBanner
router.patch("/coverbanner/update", parser.single("image"), async (req, res) => {
  let image = req.file
  let data = JSON.parse(req.body.coverBanner)
	if (!data) {
    debug.error("ERROR: No Data found in req!")
    res.send("ERROR: No Data found in req!")
  }
  let imageData = {}
  if (image) {
    debug.info(image)
    imageData.public_id = image.public_id
    imageData.url = image.url
  }
  data.image = imageData
  User.findOneAndUpdate({
    ID: data.ID
  },
  data,
  {upsert:false}
  )
  .then(result => {
    if(!result) {
      debug.error("ERROR: Found in updating CoverBanner!")
      res.send("ERROR: updating User!")
    }
    debug.info('CoverBanner Updated Result', result)
    res.send("CoverBanner Updated!")
  })
  .catch(error => {
    debug.error("ERROR: Found in updating CoverBanner!", error)
    res.send(error)
  })
})

// fetching all Users
router.get('/coverbanner/fetch', async(req, res) => {
  CoverBanner.find()
  .exec()
  .then(response => {
    debug.info('CoverBanner: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No CoverBanner found", error)
    res.send(error)
  })
})

// fetching User by ID
router.get('/coverbanner/fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No Id found in req!")
    res.send("ERROR: No Id found in req!")
  }
  CoverBanner.find({ID: Id})
  .exec()
  .then(response => {
    debug.info('CoverBanner: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No CoverBanner found", error)
    res.send(error)
  })
})

//fetching User by hotel ID
router.get('/coverbanner/fetchByHotelId/:hotel_Id', async(req, res) => {
  let hotel_Id = req.params.hotel_Id
  if (!hotel_Id ) {
    debug.error("ERROR: No email found in req!")
    res.send("ERROR: No email found in req!")
  }
  User.find({hotel_id: hotel_Id})
  .exec()
  .then(response => {
    debug.info('User: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No User found", error)
    res.send(error)
  })
})

module.exports = router
