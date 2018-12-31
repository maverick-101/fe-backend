// const busboy = require('connect-busboy') //middleware for form/file upload
const debug = require('debug-levels')('server')
const path = require('path')
const express = require('express')
const ModelUtils = require('./models/ModelUtils')


// basic
const DbConn = require('./lib/Config')

const app = require("./routes/Router")

const port = process.env.PORT || 3001

async function startUp() {
    // init models to load db conn
  await DbConn.init()
  await ModelUtils.initAll()
  
  app.listen(port, function () {
    console.log('fe-backend server listening on port ', port)
  })
  
}

startUp()