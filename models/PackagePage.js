const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const packagePageSchema = mongoose.Schema({
  ID: Number,
  agent_id: Number, 
  city_id: Number, 
  location_id: Number, 
  price: [
    {
      person: String,
      package_title: String,
      wifi: Boolean,
      shuttle_service: Boolean,
      breakfast: Boolean,
      buffet: Boolean,
      dinner: Boolean,
      nights_stay: String,
      price: String,
      description: String,
    }
  ],
  description: String, 
  travel_modes: [
    {
      route: String,
      departure: String,
      destination: String,
      travel_time: String,
      distance: String,
      travel_type: String,
      description : String
    }
  ],
  activities: [
    {
      activity_type: String,
      description: String,
      status: Boolean
    }
  ],  
  food: [
    {
      food_type: String,
      description: String,
      start_time: String,
      end_time: String,
      items: []
    }
  ], 
  gallery: [
    {
      public_id: String,
      url: String,
      image_type: String
    }
  ], 
  latitude: String,
  longitude: String,
  rating: String
},
{ versionKey: false })

packagePageSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
packagePageSchema.plugin(autoIncrement.plugin, { model: 'PackagePages', field: 'ID' })
module.exports = mongoose.model('PackagePages', packagePageSchema)