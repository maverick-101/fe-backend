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
		type: String,
		unique: true
	},
	email: {
		type: String,
		unique: true
	},
	profile_picture: {
		public_id: String,
		url: String
	},
	address: String,
	password: String,
  city_id: Number
},
{ 
	versionKey: false 
})

userSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
userSchema.plugin(autoIncrement.plugin, { model: 'Users', field: 'ID' })
module.exports = mongoose.model('Users', userSchema)