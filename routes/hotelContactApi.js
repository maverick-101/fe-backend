const router = require('express').Router()
let debug = require("debug-levels")("hotelContactApi")
const HotelContact = require('../models/HotelContact')
const hotelContactLib = require('../lib/HotelContactLib')
const nodeMailer = require('../lib/NodeMailer')


// Saving hotelContact
router.post("/save/hotelContact-save", async (req, res) => {
  let data = JSON.parse(req.body.hotelContact)
  let response
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in HotelContact request!")
    res.status(500).send("ERROR: No Data found in HotelContact request!")
  }
  let reply = await hotelContactLib.saveHotelContact(data)
  if (reply) {
    debug.info('HotelContact Saved!')
    response = await nodeMailer.createHotelEmail(data)
  } else {
    res.status(500).send('ERROR: Duplicate Field Found or Error Saving HotelContact!')
  }
  if (response) {
    res.status(200).send('HotelContact Saved! And Email Sent!')
  } else {
    res.status(500).send('ERROR: Email Sent Failed!')
  }
})

// Updating hotelContact
router.patch("/update/hotelContact-update", async (req, res) => {
  let data = JSON.parse(req.body.hotelContact)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in HotelContact request!")
    res.status(500).send("ERROR: No Data found in HotelContact request!")
  }
  let reply = await hotelContactLib.updateHotelContact(data)
  if (reply) {
    res.status(200).send('HotelContact Updated!')
  } else {
    res.status(500).send('ERROR: No ID Found or Error Updating HotelContact!')
  }
})

// fetching all hotelContact
router.get('/fetch/hotelContact-fetch', async(req, res) => {
  let reply = await hotelContactLib.fetchAllHotelContacts()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelContact Found Or Error Fetching HotelContact!')
  }
})

// fetching hotelContact by ID
router.get('/fetchById/hotelContact-fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in HotelContact request!")
    res.status(500).send("ERROR: No ID found in HotelContact request!")
  }
  let reply = await hotelContactLib.findHotelContactById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelContact Found Or Error Fetching HotelContact By ID!')
  }
})

// fetching hotelContact by Room_ID
router.get('/fetchByRoomId/hotelContact-fetchByRoomId/:room_id', async(req, res) => {
  let room_id = req.params.room_id
  if (!room_id) {
    debug.error("ERROR: No ID found in HotelContact request!")
    res.status(500).send("ERROR: No ID found in HotelContact request!")
  }
  let reply = await hotelContactLib.findHotelContactByRoomID(room_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelContact Found Or Error Fetching HotelContact By ID!')
  }
})

// fetching hotelContact by User_ID
router.get('/fetchByUserId/hotelContact-fetchByUserId/:user_id', async(req, res) => {
  let user_id = req.params.user_id
  if (!user_id) {
    debug.error("ERROR: No ID found in HotelContact request!")
    res.status(500).send("ERROR: No ID found in HotelContact request!")
  }
  let reply = await hotelContactLib.findHotelContactByUserID(user_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelContact Found Or Error Fetching HotelContact By ID!')
  }
})

//Delete hotelContact by ID 
router.delete('/delete/hotelContact-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in HotelContact request!")
    res.status(500).send("ERROR: No ID found in HotelContact request!")
  }
  let reply = await hotelContactLib.deleteHotelContactById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No HotelContact Found Or Deleting HotelContact!')
  }
})

module.exports = router
