const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const hotelContactSchema = mongoose.Schema({
	ID:{
    	type: Number,
      unique:true
  	},
  room_id: Number,
  persons: Number,
  start_date: Date,
  end_date: Date,
  nights_stay: Number,
  user_id: Number
},
{ versionKey: false })

hotelContactSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
hotelContactSchema.plugin(autoIncrement.plugin, { model: 'HotelContact', field: 'ID' })
module.exports = mongoose.model('HotelContact', hotelContactSchema)