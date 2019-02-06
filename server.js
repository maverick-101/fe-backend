// const busboy = require('connect-busboy') //middleware for form/file upload
const debug = require('debug-levels')('server')
const path = require('path')
const express = require('express')
const ModelUtils = require('./models/ModelUtils')

const cors = require('cors');

const whitelist = ['https://admin.dev.saaditrips.com', 'http://localhost:8080', 'http://localhost:8081'];
const corsOptions = {
  origin(origin, callback) {
    console.log('---------------------------------\n origin: ', origin, '\n---------------------------------');
    if ((whitelist.indexOf(origin) !== -1 || !origin) || (app.get('env') === 'development' && (origin.indexOf('192.168') >= 0 || origin === 'null')) || origin === 'null') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// require .env
require('dotenv').config()

// basic
const DbConn = require('./lib/DbConn')

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