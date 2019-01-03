let DbConn = require("../lib/Config")
const debug = require('debug-levels')('Locations')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autoIncrement = require('mongoose-auto-increment')

let locationResourcesSchema = new Schema({
	ID: {
		type: Number,
		unique:true
	},
  location_id: Number,
  type: String,
  city_id: Number,
  URL: String,
  status: String,
  gallery: [
    {
      public_id: String,
      url: String,
      image_type: String
    }
  ]
},
{ 
	versionKey: false 
})

locationResourcesSchema.index({ ID: 1 }, {unique: true})

// autoIncrement.initialize(mongoose.connection)
// locationResourcesSchema.plugin(autoIncrement.plugin, { model: 'Location_Resources', field: 'ID' })
module.exports = mongoose.model('Location_Resources', locationResourcesSchema)