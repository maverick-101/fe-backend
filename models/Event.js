const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const eventSchema = mongoose.Schema({
	ID:{
    	type: Number,
      unique:true
  	},
  description: {
    type: String
	}, 
  title: {
    type: String
  },
  start_date: Date,
  end_date: Date,
  gallery: [
    {
      public_id: String,
      url: String,
      image_type: String
    }
  ],
  event_videos: [],
  ticket_price: Number,
  contact_number: String,
  location_id: Number,
  city_id: Number,
  Address: String,
  why_list: String,
  recommended: Boolean,
  gathering_type: String,
  created_At: Date
},
{ versionKey: false })

eventSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
eventSchema.plugin(autoIncrement.plugin, { model: 'Events', field: 'ID' })
module.exports = mongoose.model('Events', eventSchema)