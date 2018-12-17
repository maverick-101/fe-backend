const debug = require("debug-levels")("Router")
const express = require('express')

const app = express()
app.use(express.json())

let routerList = [
]
  
for (let routerPath of routerList) {
  debug.info("rp", routerPath)
  let mod = require(routerPath)
  app.use("/api", mod)
}

module.exports = app