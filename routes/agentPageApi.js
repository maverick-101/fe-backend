const router = require('express').Router()
let debug = require("debug-levels")("agentPageApi")
const AgentPage = require('../models/AgentPage')
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
	folder: "AgentPages",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })

// saving AgentPage
router.post("/agentPage/save", parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  debug.info(cloudinaryData)
  let gallery = []
  let data = JSON.parse(req.body.agentPage)
  // let data = req.body // for testing on postman
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
    debug.error("ERROR: No Data Found in AgentPage!")
    res.send("ERROR: No Data Found in AgentPage!")
  }
  data.gallery = gallery
  const agentPage = new AgentPage(data)
  agentPage.save().then(result => {
    debug.info('AgentPage Saved Result', result)
    res.send("AgentPage Saved!")
  })
  .catch(error => {
    debug.error("ERROR: Found in AgentPage!", error)
    res.send(error)
  })
})

// Updating AgentPage
router.patch("/agentPage/update", parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.agentPage)
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
  AgentPage.findOneAndUpdate({
    ID: data.ID
  },
  data,
  {upsert:false}
  )
  .then(result => {
    debug.info('AgentPage Updated Result', result)
    if(!result) {
      debug.error("ERROR: Found in updating AgentPage!")
      res.send("ERROR: updating AgentPage!")
    }
    res.send("AgentPage Updated!")
  })
  .catch(error => {
    debug.error("ERROR: Found in updating AgentPage!", error)
    res.send(error)
  })
})

//fetching all agentPage
router.get('/agentPage/fetch', async(req, res) => {
  AgentPage.find()
  .exec()
  .then(response => {
    debug.info('agentPage: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No agentPage found", error)
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
