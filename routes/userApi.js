const router = require('express').Router()
let debug = require("debug-levels")("userApi")
const User = require('../models/User')


// Saving User
router.post("/user/save", async (req, res) => {
  let data = req.body
	if (!data) {
    debug.error("ERROR: No Data found in req!")
    res.send("ERROR: No Data found in req!")
	}
  const user = new User(data)
  user.save().then(result => {
    debug.info('User Saved Result', result)
    res.send("User Saved!")
  })
  .catch(error => {
    debug.error("ERROR: Found in User!", error)
    res.send(error)
  })
})

// Updating User
router.patch("/user/update", async (req, res) => {
  let data = req.body
	if (!data) {
    debug.error("ERROR: No Data found in req!")
    res.send("ERROR: No Data found in req!")
	}
  User.findOneAndUpdate({
    ID: data.ID
  },
  data,
  {upsert:false}
  )
  .then(result => {
    debug.info('User Updated Result', result)
    if(!result) {
      debug.error("ERROR: Found in updating User!")
      res.send("ERROR: updating User!")
    }
    res.send("User Updated!")
  })
  .catch(error => {
    debug.error("ERROR: Found in updating User!", error)
    res.send(error)
  })
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
