const router = require('express').Router()
let debug = require("debug-levels")("roomApi")
const Room = require('../models/Room')
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
	folder: "Rooms",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })

// saving Room
router.post("/room/save", parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  debug.info(cloudinaryData)
  let gallery = []
  let data = JSON.parse(req.body.room)
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
    debug.error("ERROR: No Data Found in Room!")
    res.send("ERROR: No Data Found in Room!")
  }
  data.gallery = gallery
  const rooms = new Room(data)
  rooms.save().then(result => {
    debug.info('Room Saved Result', result)
    res.send("Room Saved!")
  })
  .catch(error => {
    debug.error("ERROR: Found in Room!", error)
    res.send(error)
  })
})

// Updating Room
router.patch("/room/update", parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.room)
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
  Room.findOneAndUpdate({
    ID: data.ID
  },
  data,
  {upsert:false}
  )
  .then(result => {
    debug.info('Room Updated Result', result)
    if(!result) {
      debug.error("ERROR: Found in updating Room!")
      res.send("ERROR: updating Room!")
    }
    res.send("Room Updated!")
  })
  .catch(error => {
    debug.error("ERROR: Found in updating Room!", error)
    res.send(error)
  })
})

//fetching all Room
router.get('/room/fetch', async(req, res) => {
  Room.find()
  .exec()
  .then(response => {
    debug.info('Rooms: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No Rooms found", error)
    res.send(error)
  })
})

// fetching Room by ID
router.get('/room/fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  Room.find({ID: Id})
  .exec()
  .then(response => {
    debug.info('Room: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No Room found", error)
    res.send(error)
  })
})

//fetching Room by Name
router.get('/room/fetchByName/:title', async(req, res) => {
  let title = req.params.title
  Room.find({title: title})
  .exec()
  .then(response => {
    debug.info('Room: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No Room found", error)
    res.send(error)
  })
})

module.exports = router
