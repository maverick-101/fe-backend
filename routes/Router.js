const debug = require("debug-levels")("Router")
const express = require('express')
const cors = require('cors');

const app = express()
  
const whitelist = ['https://admin.dev.saaditrips.com', 'https://admin.saaditrips.com', 'https://saaditrips.com', 'https://admindev.saaditrips.com', 'http://admindev.saaditrips.com', 'http://localhost:8080', 'http://localhost:3001', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:8083', 'https://dev.saaditrips.com'];
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

app.use(express.json({limit:'50mb'}))

let routerList = [
  './locationApi',
  './cityApi',
  './locationResourcesApi',
  './userApi',
  './roomApi',
  './hotelApi',
  './coverBannerApi',
  './packagePageApi',
  './agentPageApi.js',
  './packageContactApi.js',
  './hotelContactApi.js',
  './homePageApi.js',
  './featuredHotelApi.js',
  './featuredPackageApi.js',
  './hotelResourcesApi.js',
  './hotelRatingApi.js',
  './packageRatingApi.js',
  './packageResourcesApi.js',
  './experienceApi.js',
  './experienceResourcesApi',
  './experienceRatingApi.js',
  './eventApi.js'
]
  
for (let routerPath of routerList) {
  debug.info("rp", routerPath)
  let mod = require(routerPath)
  app.use("/api", mod)
}

module.exports = app