const router = require('express').Router()
let debug = require("debug-levels")("agentPageApi")
const PackagePage = require('../models/PackagePage')
const PackagePageLib = require('../lib/PackagePageLib')
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
	folder: "PackagePages",
	allowedFormats: ["jpg", "png", "jpeg"],
})
const parser = multer({ storage: storage })

// saving packagePage
router.post("/save/packagePage-save", parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.packagePage)
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in request!")
    res.status(500).send("ERROR: No Data found in request!")
  }
  gallery = await CloudinaryLib.createGallery(data, cloudinaryData)
  data.gallery = gallery
  let reply = await PackagePageLib.savePackagePage(data)
  if (reply) {
    res.status(200).send('packagePage Saved!')
  } else {
    res.status(500).send('ERROR: Duplicate Field Found or Error Saving packagePage!')
  }
})

// Updating packagePage
router.patch("/update/packagePage-update", parser.array("gallery_images"), async (req, res) => {
  let cloudinaryData = req.files
  let gallery = []
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.agentPage)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in request!")
    res.status(500).send("ERROR: No Data found in request!")
  }
  gallery = await CloudinaryLib.updateGallery(data, cloudinaryData)
  data.gallery = gallery
  delete data.image_type
  let reply = await PackagePageLib.updatePackagePage(data)
  if (reply) {
    res.status(200).send('packagePage Updated!')
  } else {
    res.status(500).send('ERROR: No ID Found or Error Updating packagePage!')
  }
})

//fetching all packagePages
router.get('/fetch/packagePage-fetch', async(req, res) => {
  let reply = await PackagePageLib.fetchAllPackagePages()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No packagePage Found Or Error Fetching packagePages!')
  }
})

// fetching packagePage by ID
router.get('/fetchById/packagePage-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in request!")
    res.status(500).send("ERROR: No ID found in request!")
  }
  let reply = await PackagePageLib.findPackagePageById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No packagePage Found Or Error Fetching packagePage By ID!')
  }
})

// fetching packagePage by AgentID
router.get('/fetchById/packagePage-fetchByAgentId/:agent_id', async(req, res) => {
  let agent_id = req.params.agent_id
  if (!agent_id) {
    debug.error("ERROR: No agent_id found in request!")
    res.status(500).send("ERROR: No agent_id found in request!")
  }
  let reply = await PackagePageLib.findPackagePageByAgentId(agent_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No packagePage Found Or Error Fetching packagePage By AgentID!')
  }
})

//fetching packagePage by Name
router.get('/fetchByName/packagePage-fetchByName/:name', async(req, res) => {
  let name = req.params.name
  if (!name ) {
    debug.error("ERROR: No name found in request!")
    res.status(500).send("ERROR: No name found in request!")
  }
  let reply = await PackagePageLib.findPackagePageByName(name)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No packagePage Found Or Error Fetching packagePage By Name!')
  }
})

//fetching packagePages by City_id
router.get('/fetchByCity/packagePage-fetchByCity/:city_id', async(req, res) => {
  let city_id = req.params.city_id
  if (!city_id ) {
    debug.error("ERROR: No name found in request!")
    res.status(500).send("ERROR: No name found in request!")
  }
  let reply = await PackagePageLib.findPackagePageByCity_id(city_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No packagePage Found Or Error Fetching packagePage By City_id!')
  }
})

//fetching packagePage by location_id
router.get('/fetchByLocation/packagePage-fetchByLocation/:location_id', async(req, res) => {
  let location_id = req.params.location_id
  if (!location_id ) {
    debug.error("ERROR: No name found in request!")
    res.status(500).send("ERROR: No name found in request!")
  }
  let reply = await PackagePageLib.findPackagePageBylocation_id(location_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No packagePage Found Or Error Fetching packagePage By location_id!')
  }
})

//Delete packagePage by ID 
router.delete('/delete/packagePage-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in request!")
    res.status(500).send("ERROR: No ID found in request!")
  }
  let reply = await PackagePageLib.deletePackagePageById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No packagePage Found Or Deleting packagePage!')
  }
})

module.exports = router
