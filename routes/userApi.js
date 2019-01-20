const router = require('express').Router()
let debug = require("debug-levels")("userApi")
const User = require('../models/User')
const AppConfig = require('../lib/AppConfig')
const CloudinaryLib = require('../lib/Cloudinary')
const UserLib = require('../lib/UserLib')
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
	folder: "Users",
	allowedFormats: ["jpg", "png"],
})
const parser = multer({ storage: storage })


// Saving User
router.post("/user/save", parser.single("profile_picture"), async (req, res) => {
	let profile_picture = req.file
  debug.info(profile_picture)
  let data = JSON.parse(req.body.user)
  // let data = req.body  // for test on postman
	if (!data) {
    debug.error("ERROR: No Data found in req!")
    res.send("ERROR: No Data found in req!")
  }
  const user = new User({
		first_name: data.first_name,
		last_name: data.last_name,
		deactivated: data.deactivated,
		client_type: data.client_type,
		phone: data.phone,
		email: data.email,
		profile_picture: {
			public_id: profile_picture.public_id,
			url: profile_picture.url
		},
		address: data.address,
		password: data.password,
  	type: data.type,
  	city_id: data.city_id
	})
  user.save().then(result => {
    debug.info('User Saved Result', result)
    res.send("User Saved!")
  })
  .catch(error => {
    debug.error("ERROR: Found in User!", error)
    res.send(error)
  })
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
router.patch("/user/update", parser.single("profile_picture"), async (req, res) => {
  let profile_picture = req.file
  let data = JSON.parse(req.body.user)
	if (!data) {
    debug.error("ERROR: No Data found in req!")
    res.send("ERROR: No Data found in req!")
  }
  if (profile_picture) {
    debug.info(profile_picture)
    data.profile_picture.public_id = profile_picture.public_id
    data.profile_picture.url = profile_picture.url
  }
  let response = UserLib.updateUser(data)
  if (response) {
    res.send("User Updated!")
  } else {
    res.send("ERROR: Can't Update User!")
  }
})

// fetching all Users
router.get('/user/fetch', async(req, res) => {
  User.find()
  .exec()
  .then(response => {
    debug.info('User: ', response)
    res.json(response)
  })
  .catch(error => {
    debug.error("No Users found", error)
    res.send(error)
  })
})

// fetching User by ID
router.get('/user/fetchById/:Id', async(req, res) => {
  let Id = req.params.Id
  if (!Id) {
    debug.error("ERROR: No Id found in req!")
    res.send("ERROR: No Id found in req!")
  }
  User.find({ID: Id})
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

//fetching User by First Name
router.get('/user/fetchByFirstName/:first_name', async(req, res) => {
  let first_name = req.params.first_name
  if (!first_name ) {
    debug.error("ERROR: No first_name found in req!")
    res.send("ERROR: No first_name found in req!")
  }
  User.find({first_name: first_name})
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

//fetching User by Email
router.get('/user/fetchByEmail/:email', async(req, res) => {
  let email = req.params.email
  if (!email ) {
    debug.error("ERROR: No email found in req!")
    res.send("ERROR: No email found in req!")
  }
  User.find({email: email})
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

//fetching User by Phone
router.get('/user/fetchByPhone/:phone', async(req, res) => {
  let phone = req.params.phone
  if (!phone ) {
    debug.error("ERROR: No phone found in req!")
    res.send("ERROR: No phone found in req!")
  }
  User.find({phone: phone})
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

//fetching all Users by City
router.get('/user/fetchByCity/:city_id', async(req, res) => {
  let city_id = req.params.city_id
  if (!city_id ) {
    debug.error("ERROR: No city_id found in req!")
    res.send("ERROR: No city_id found in req!")
  }
  User.find({city_id: city_id})
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
