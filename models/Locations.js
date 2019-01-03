let DbConn = require("../lib/Config")
const debug = require('debug-levels')('Locations')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autoIncrement = require('mongoose-auto-increment')

let locationSchema  = new Schema({
  ID: {
    type: Number,
    unique:true
  },
  city_id: Number,
  name: {
    type: String
  },
  gallery: [
    {
      public_id: String,
      url: String,
      image_type: String
    }
  ],
  views: Number,
},
{ versionKey: false })

locationSchema.index({ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
locationSchema.plugin(autoIncrement.plugin, { model: 'Locations', field: 'ID' })
module.exports = mongoose.model('Locations', locationSchema)