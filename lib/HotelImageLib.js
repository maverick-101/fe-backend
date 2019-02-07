const AppConfig = require('./AppConfig')
const Cloudinary = require('./Cloudinary')
// const Images = require('mongoose').model('HotelImages')
const Images = require('../models/HotelImage')
let debug = require("debug-levels")("HotelImageLib")

const HotelImageLib = {

  async saveImage (data) {
    let res
    data.created_At = new Date()
    const images = new Images(data)
    await images.save().then(result => {
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
    await Images.findOneAndUpdate({
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
    await Images.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Images: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Images found", error)
      return
    })
    return reply
  },

  async findImageById (ID) {
    let reply 
    await Images.find({
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
    let reply 
    await Images.find({
      hotel_id : hotel_id
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

  async findImageByType (image_type) {
    let reply 
    await Images.find({
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
    await Images.find({
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
    await Images.findOneAndDelete({ 
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

module.exports = HotelImageLib