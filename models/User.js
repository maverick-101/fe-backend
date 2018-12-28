let DbConn = require("../lib/Config")
const debug = require('debug-levels')('User')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autoIncrement = require('mongoose-auto-increment')

let userSchema = new Schema({
	ID: {	
		type: Number,
		unique: true
	},
	first_name: String,
	last_name: String,
	deactivated: Boolean,
	client_type: String,
	phone: {
		type: Number,
		unique: true
	},
	email: {
		type: String,
		unique: true
	},
	// profile_picture: String,
	address: String,
	password: String,
  type: String,
  city_id: Number
},
{ 
	versionKey: false 
})

userSchema.index({ ID: 1 }, {unique: true})

// autoIncrement.initialize(mongoose.connection)
// locationResourcesSchema.plugin(autoIncrement.plugin, { model: 'Location_Resources', field: 'ID' })
module.exports = mongoose.model('Users', userSchema)