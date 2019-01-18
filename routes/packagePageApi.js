const router = require('express').Router()
let debug = require("debug-levels")("packagePageApi")
const PackagePage = require('../models/PackagePage')
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
	folder: "PackagePages",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })

// saving packagePage
router.post("/packagePage/save", parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  debug.info(cloudinaryData)
  let gallery = []
  let data = JSON.parse(req.body.packagePage)
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
    debug.error("ERROR: No Data Found in PackagePage!")
    res.send("ERROR: No Data Found in PackagePage!")
  }
  data.gallery = gallery
  const packagePage = new PackagePage(data)
  packagePage.save().then(result => {
    debug.info('PackagePage Saved Result', result)
    res.send("PackagePage Saved!")
  })
  .catch(error => {
    debug.error("ERROR: Found in PackagePage!", error)
    res.send(error)
  })
})

// Updating packagePage
router.patch("/packagePage/update", parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.packagePage)
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
  PackagePage.findOneAndUpdate({
    ID: data.ID
  },
  data,
  {upsert:false}
  )
  .then(result => {
    debug.info('packagePage Updated Result', result)
    if(!result) {
      debug.error("ERROR: Found in updating packagePage!")
      res.send("ERROR: updating packagePage!")
    }
    res.send("packagePage Updated!")
  })
  .catch(error => {
    debug.error("ERROR: Found in updating packagePage!", error)
    res.send(error)
  })
})

//fetching all packagePage
router.get('/packagePage/fetch', async(req, res) => {
  PackagePage.find()
  .exec()
  .then(response => {
    debug.info('packagePage: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No packagePage found", error)
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
  Hotel.find({name: name})
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

//fetching hotels by email
router.get('/hotel/fetchByEmail/:email', async(req, res) => {
  let email = req.params.email
  Hotel.find({email: email})
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

//fetching hotels by phone
router.get('/hotel/fetchByPhone/:phone', async(req, res) => {
  let phone = req.params.phone
  Hotel.find({phone: phone})
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

module.exports = router
