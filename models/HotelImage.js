const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const hotelImageSchema = mongoose.Schema({
	ID:{
    	type: Number,
      unique:true
    },
  hotel_id: Number,
  image_type: {
    type: String
  },
  images: [
    {
      public_id: String,
      url: String
    }
  ],
  created_At: Date
},
{ versionKey: false })

hotelImageSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
hotelImageSchema.plugin(autoIncrement.plugin, { model: 'HotelImages', field: 'ID' })
module.exports = mongoose.model('HotelImages', hotelImageSchema)