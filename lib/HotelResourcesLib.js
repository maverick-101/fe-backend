const AppConfig = require('./AppConfig')
const Cloudinary = require('./Cloudinary')
// const Images = require('mongoose').model('HotelImages')
const HotelResources = require('../models/HotelResources')
let debug = require("debug-levels")("HotelResourcesLib")

const HotelResourcesLib = {

  async saveImage (data) {
    let res
    data.created_At = new Date()
    const hotelResources = new HotelResources(data)
    await hotelResources.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving Image!")
        return
      }
      debug.info('Image Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in Image!", error)
      return
    })
    return res
  },


  async updateImage (data) {
    let res
    let Id = data.ID
    await HotelResources.findOneAndUpdate({
      ID: Id
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating Image!")
        return
      }
      debug.info('Image Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating Image!", error)
      return
    })
    return res
  },

  async fetchAllImages () {
    let reply 
    await HotelResources.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelResources: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelResources found", error)
      return
    })
    return reply
  },

  async findImageById (ID) {
    let reply 
    await HotelResources.find({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Image: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Image found", error)
      return
    })
    return reply
  },

  async findImageByHotelId (hotel_id) {
    hotel_id = Number(hotel_id)
    let hotelData = []
      let reply 
      try {
        hotelData = await HotelResources.aggregate([
          {
            "$match":
            {
              "hotel_id": hotel_id
            }
          },
          { "$group" : 
            { 
              "_id" : "$image_type", 
              "url": { "$push": "$images"},
              "description": { "$push": "$description" } 
            } 
          }
      ])
      } catch (error) {
        debug.info(error)
      }
      
      if(hotelData  && hotelData.length > 0) {
        return hotelData
      } else {
        debug.info('ERROR: No Hotel Data Found To Update Rating!')
        return
      }
  },

  async findImageByType (image_type) {
    let reply 
    await HotelResources.find({
      image_type: image_type
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Image: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Image found", error)
      return
    })
    return reply
  },

  async findImageByTypeAndHotelId (image_type, hotel_id) {
    let reply 
    await HotelResources.find({
      image_type: image_type,
      hotel_id: hotel_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Image: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Image found", error)
      return
    })
    return reply
  },

  async deleteImageById (ID) {
    let reply
    await HotelImageLib.deleteImages(ID)
    await HotelResources.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('Image: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Image found", error)
      return
    })
    return reply
  },

  async deleteImages (Id) {
    let reply
    let image = await HotelImageLib.findImageById(Id)
    if(image) {
      reply = await Cloudinary.deleteMultipleHotelImages(image)
      if(reply) {
        debug.info('Picture Deleted! ', reply)
      } else {
        debug.error("ERROR: No Pictures Found OR Error Deleting Pictures of HotelImages!")
      }
    } else {
      debug.error("ERROR: No ImageData Found To Delete HotelImages!")
    }
  }


}

module.exports = HotelResourcesLib