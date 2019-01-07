let DbConn = require("../lib/Config")
const debug = require('debug-levels')('City')
const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const roomSchema = mongoose.Schema({
	ID:{
    	type: Number,
      unique:true
  	},
  province: {
    type: String
	}, 
  name: {
    type: String,
    unique:true
	},
  views: Number,
  gallery: [
    {
      public_id: String,
      url: String,
      image_type: String
    }
  ]
},
{ versionKey: false })

roomSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
roomSchema.plugin(autoIncrement.plugin, { model: 'Rooms', field: 'ID' })
module.exports = mongoose.model('Rooms', roomSchema)