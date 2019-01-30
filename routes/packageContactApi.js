const router = require('express').Router()
let debug = require("debug-levels")("packageContactApi")
const PackageContact = require('../models/PackageContact')
const packageContactLib = require('../lib/PackageContactLib')


// Saving packageContact
router.post("/save/packageContact-save", async (req, res) => {
  let data = JSON.parse(req.body.packageContact)
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in packageContact request!")
    res.status(500).send("ERROR: No Data found in packageContact request!")
  }
  let reply = await packageContactLib.savePackageContact(data)
  if (reply) {
    res.status(200).send('PackageContact Saved!')
  } else {
    res.status(500).send('ERROR: Duplicate Field Found or Error Saving PackageContact!')
  }
})

// Updating packageContact
router.patch("/update/packageContact-update", async (req, res) => {
  let data = JSON.parse(req.body.packageContact)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in PackageContact request!")
    res.status(500).send("ERROR: No Data found in PackageContact request!")
  }
  let reply = await packageContactLib.updatePackageContact(data)
  if (reply) {
    res.status(200).send('PackageContact Updated!')
  } else {
    res.status(500).send('ERROR: No ID Found or Error Updating PackageContact!')
  }
})

// fetching all PackageContacts
router.get('/fetch/packageContact-fetch', async(req, res) => {
  let reply = await packageContactLib.fetchAllPackageContacts()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageContact Found Or Error Fetching PackageContacts!')
  }
})

// fetching PackageContacts by ID
router.get('/fetchById/packageContact-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in PackageContact request!")
    res.status(500).send("ERROR: No ID found in PackageContact request!")
  }
  let reply = await packageContactLib.findPackageContactById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageContact Found Or Error Fetching PackageContact By ID!')
  }
})

// fetching PackageContacts by Package_ID
router.get('/fetchByPackageId/packageContact-fetchByPackageId/:package_id', async(req, res) => {
  let package_id = req.params.package_id
  if (!package_id) {
    debug.error("ERROR: No ID found in PackageContact request!")
    res.status(500).send("ERROR: No ID found in PackageContact request!")
  }
  let reply = await packageContactLib.findPackageContactByPackageID(package_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageContact Found Or Error Fetching PackageContact By ID!')
  }
})

// fetching PackageContacts by User_ID
router.get('/fetchByUserId/packageContact-fetchByUserId/:user_id', async(req, res) => {
  let user_id = req.params.user_id
  if (!user_id) {
    debug.error("ERROR: No ID found in PackageContact request!")
    res.status(500).send("ERROR: No ID found in PackageContact request!")
  }
  let reply = await packageContactLib.findPackageContactByUserID(user_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageContact Found Or Error Fetching PackageContact By ID!')
  }
})

//Delete packageContact by ID 
router.delete('/delete/packageContact-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in PackageContact request!")
    res.status(500).send("ERROR: No ID found in PackageContact request!")
  }
  let reply = await packageContactLib.deletePackageContactById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No PackageContact Found Or Deleting PackageContact!')
  }
})

module.exports = router
