const router = require('express').Router()
let debug = require("debug-levels")("userApi")
const User = require('../models/User')
const UserLib = require('../lib/UserLib')
const AppConfig = require('../lib/AppConfig')
const CloudinaryLib = require('../lib/Cloudinary')
const multer  = require('multer')
const cloudinary = require('cloudinary')
const cloudinaryStorage = require("multer-storage-cloudinary")
const checkAuth = require('../middleware/check-auth')
var jwt = require('jsonwebtoken')


cloudinary.config({ 
  cloud_name: AppConfig.cloudinaryName, 
  api_key: AppConfig.cloudinaryApi, 
  api_secret: AppConfig.cloudinarySecret 
})

const storage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: "Users",
	allowedFormats: ["jpg", "png"],
})
const parser = multer({ storage: storage })


// Saving User
router.post("/user/save", parser.single("profile_picture"), async (req, res) => {
	let cloudinaryData = req.file
  let profile_picture = {}
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.user)
  // let data = req.body  // for test on Postman
	if (!data) {
    debug.error("ERROR: No Data found in User request!")
    res.status(500).send("ERROR: No Data found in User request!")
  }
  profile_picture = await CloudinaryLib.createImage(cloudinaryData)
  data.profile_picture = profile_picture || {}
  let checker = await UserLib.findUserByEmail(data.email)
  if(!checker) {
    data = await UserLib.bcryptPassword(data)
    debug.error("found in User request!", data)
    if(data) {
      let reply = await UserLib.saveUser(data)
      if (reply) {
        res.status(200).send('User Saved!')
      } else {
        res.status(500).send('ERROR: Duplicate Field Found or Error Saving User!')
      }
    } else {
      res.status(500).send('ERROR: Adding Hash For Passowrd!')
    }
  } else {
    debug.info('ERROR: Duplicate Email Found!')
    res.status(500).send('ERROR: Duplicate Email Found')
  }
  
})

//deleting User Image
router.delete("/userImage/delete", async (req, res) => {
  let response
  const data = req.body
  if (!data) {
    debug.error('ERROR: user is Undefined!', data)
    res.status(500).send('ERROR: user is Undefined!')
  }
  let ID = data.ID
  let profile_picture = data.profile_picture

  let user = await UserLib.findUserById(data)
  debug.info(user)
  if(user) {
    response = await CloudinaryLib.deleteImage(user, profile_picture)
  } else {
    res.status(500).send('ERROR: Finding User!')
  }
  debug.info('Response: ', response)
  if (response) {
    let newUser
    newUser = user[0]
    delete user[0].profile_picture
    let reply = await UserLib.updateUser(user[0])
    if (reply) {
      res.status(200).send("Image Deleted! Both in Database And Cloudinary And User Updated!")
    } else {
      res.status(500).send("ERROR: Can't Update User after Deleting Image from Cloudinary!")
    }
  } else {
    res.status(500).send('ERROR: Deleting Picture in Cloudinary!!')
  }
})

// Updating User
router.patch("/user/update", checkAuth, parser.single("profile_picture"), async (req, res) => {
  let cloudinaryData = req.file
  let profile_picture = {}
  debug.info(cloudinaryData)
  let data = JSON.parse(req.body.user)
  // let data = req.body   //for testing in postman
	if (!data) {
    debug.error("ERROR: No Data found in User request!")
    res.status(500).send("ERROR: No Data found in User request!")
  }
  profile_picture = await CloudinaryLib.createImage(cloudinaryData)
  debug.info(profile_picture)
  data.profile_picture = profile_picture
  debug.info(data.profile_picture)
  let checker = await UserLib.findOneUser(data.ID)
  if(checker) {
    if(checker.email === data.email.toLowerCase()) {
      let reply = await UserLib.updateUser(data)
      if (reply) {
        res.status(200).send('User Updated!')
      } else {
        res.status(500).send('ERROR: No ID Found or Error Updating User!')
      }
    } else {
      debug.info('ERROR: Email did not match!')
      res.status(500).send('ERROR: No ID Found or Error Updating User!')
    }
  } else {
    debug.info('ERROR: No ID Found!')
    res.status(500).send('ERROR: No ID Found!')
  }
  
})

// User signIn
router.post("/user/signIn", async (req, res) => {
  if (!req.body.user) {
    debug.error("ERROR: No Data found in User Sign In request!")
    res.status(500).send("ERROR: No Data found in User Sign In request!")
  }
  let data = JSON.parse(req.body.user)
  // let data = req.body   //for testing in postman
  let email = data.email
  let password = data.password
  let response = await UserLib.findUserByEmail(email)
  if(response) {
    let reply = await UserLib.bcryptComparePassword(response.password, password)
    if(!reply) {
      debug.info("Auth Failed!")
      res.status(401).send('ERROR: Auth Failed!')
    }
  } else {
    debug.info("ERROR: No User Found!")
    res.status(500).send('ERROR: No User Found!')
  }

  const user = response
  jwt.sign(
    {user: user}, 
    AppConfig.JWT_KEY,
    {
      expiresIn: "1h"
    },
    (err, token)=> {
      if(err) {
        debug.info("ERROR: Signing JWT Token!", err)
        res.status(500).send('ERROR: Signing JWT Token!')
      } else {
        res.status(200).json({
          message: 'Auth Success!',
          Token: token
        })
      }
  })
})

// fetching all Users
router.get('/user/getIndex', async(req, res) => {
  let reply = await UserLib.getIndexx()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No User Found Or Error Fetching Users!')
  }
})

// fetching all Users
router.post('/user/dropIndexOne', async(req, res) => {
  let data = req.body.data
  let reply = await UserLib.dropIndexOne()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No User Found Or Error Fetching Users!')
  }
})

// fetching all Users
router.post('/user/dropIndexMinusOne', async(req, res) => {
  let data = req.body.data
  let reply = await UserLib.dropIndexMinus(data)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No User Found Or Error Fetching Users!')
  }
})

// fetching all Users
router.post('/user/dropIndex', async(req, res) => {
  let reply = await UserLib.dropIndexx()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No User Found Or Error Fetching Users!')
  }
})

// fetching all Users
router.get('/user/me', checkAuth, async(req, res) => {
  if(!req.user) {
    res.status(500).send('ERROR: No User Found Or Error Decoding User!')
  } else {
    res.status(200).send(req.user)
  }
})

// fetching all Users
router.get('/user/fetch', async(req, res) => {
  let reply = await UserLib.fetchAllUsers()
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No User Found Or Error Fetching Users!')
  }
})

// fetching User by ID
router.get('/user/fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id ) {
    debug.error("ERROR: No Id found in User request!")
    res.status(500).send("ERROR: No Id found in User request!")
  }
  let reply = await UserLib.findUserById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No User Found Or Error Fetching User By Name!')
  }
})

//fetching User by First Name
router.get('/user/fetchByFirstName/:first_name', async(req, res) => {
  let first_name = req.params.first_name
  if (!first_name ) {
    debug.error("ERROR: No name found in User request!")
    res.status(500).send("ERROR: No name found in User request!")
  }
  let reply = await UserLib.findUserByFirstName(first_name)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No User Found Or Error Fetching User By Name!')
  }
})

//fetching User by Email
router.get('/user/fetchByEmail/:email', async(req, res) => {
  let email = req.params.email
  if (!email ) {
    debug.error("ERROR: No name found in User request!")
    res.status(500).send("ERROR: No name found in User request!")
  }
  let reply = await UserLib.findUserByEmail(email)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No User Found Or Error Fetching User By Name!')
  }
})

//fetching User by Phone
router.get('/user/fetchByPhone/:phone', async(req, res) => {
  let phone = req.params.phone
  if (!phone ) {
    debug.error("ERROR: No name found in User request!")
    res.status(500).send("ERROR: No name found in User request!")
  }
  let reply = await UserLib.findUserByPhone(phone)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No User Found Or Error Fetching User By Name!')
  }
})

//fetching all Users by City
router.get('/user/fetchByCity/:city_id', async(req, res) => {
  let city_id = req.params.city_id
  if (!city_id ) {
    debug.error("ERROR: No name found in User request!")
    res.status(500).send("ERROR: No name found in User request!")
  }
  let reply = await UserLib.findUserByCity(city_id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No User Found Or Error Fetching User By Name!')
  }
})

//Delete User by ID
router.delete('/delete/user-deleteById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No ID found in User request!")
    res.status(500).send("ERROR: No ID found in User request!")
  }
  let reply = await UserLib.deleteUserById(Id)
  if (reply) {
    res.status(200).send(reply)
  } else {
    res.status(500).send('ERROR: No User Found Or Deleting User!')
  }
})

module.exports = router
