const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const hotelSchema = mongoose.Schema({
    ID: {
      type: Number,
      unique: true
    },
    name: String,
    location_id: Number,
    city_id: Number,
    user_id: Number,
    description: String,
    gallery: [
      {
        public_id: String,
        url: String,
        image_type: String
      }
    ],
    stars: Number,
    url: String,
    pets_allowed: Boolean,
    smoking_allowed: Boolean,
    address: String,
    postalCode: Number,
    star_rating: Number,
    email: {
      type: String,
      unique:true
    },
    phone: {
      type: Number,
      unique:true
    },
    latitude: String,
    longitude: String,
    hotel_amenities: [
      {
        value: Boolean,
        name: String
      },
      {
        value: Boolean,
        name: String
      }
    ]},
{ versionKey: false })

hotelSchema.index({ ID: 1 }, {unique: true})

autoIncrement.initialize(mongoose.connection)
hotelSchema.plugin(autoIncrement.plugin, { model: 'Hotels', field: 'ID' })
module.exports = mongoose.model('Hotels', hotelSchema)