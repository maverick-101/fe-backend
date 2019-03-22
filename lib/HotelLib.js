const AppConfig = require('./AppConfig')
const Hotel = require('mongoose').model('Hotels')
let debug = require("debug-levels")("HotelLib")

const HotelLib = {

  async saveHotel (data) {
    let res
    const hotel = new Hotel(data)
    await hotel.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving Hotel!")
        return
      }
      debug.info('Hotel Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in Hotel!", error)
      return
    })
    return res
  },

  async updateHotel (data) {
    let res
    await Hotel.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating Hotel!")
        return
      }
      debug.info('Hotel Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating Hotel!", error)
      return
    })
    return res
  },

  async fetchAllHotels (pageSize, pageNumber) {
    pageNumber = Number(pageNumber)
    pageSize = Number(pageSize)
    try {
      const hotelRes = await Hotel.aggregate(
        [
          {
            $lookup: 
              {
                from: "cities", localField: "city_id", foreignField: "ID", as: "city"
              }
          },
          {
            $lookup: 
              {
                from: "locations", localField: "location_id", foreignField: "ID", as: "location"
              }
          },  
        {
          $match: 
          {
            details: {$ne: []}
          }
        },
        {$unwind: '$city'},
        {$unwind: '$location'},
        { "$limit": pageSize },
        { "$skip": (pageNumber - 1) * pageSize }
      ])
      if(!hotelRes) {
        throw new Error('No Hotels Found!')
      }
      debug.info('Hotels: ', hotelRes)
      return hotelRes
    } catch (error) {
      debug.error("ERROR: No Hotels Found!", error)
      return
    }
  },

  async findHotelById (ID) {
    let reply 
    await Hotel.findOne({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Hotel: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Hotel found", error)
      return
    })
    return reply
  },

  async findHotelByName (name) {
    let reply 
    await Hotel.find({
      name: name
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Hotel: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Hotel found", error)
      return
    })
    return reply
  },

  async findHotelByEmail (email) {
    let reply 
    await Hotel.find({
      email: email
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Hotel: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Hotel found", error)
      return
    })
    return reply
  },

  async findHotelByLocation (location_Id) {
    let reply 
    await Hotel.find({
      location_Id: location_Id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Hotel: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Hotel found", error)
      return
    })
    return reply
  },

  async findEightRandomHotels () {
    try {
      const hotelRes = await Hotel.aggregate(
        [
          { 
            $sample: { size: 8 } 
          },
          {
            $lookup: 
              {
                from: "cities", localField: "city_id", foreignField: "ID", as: "city"
              }
          },
          {
            $lookup: 
              {
                from: "locations", localField: "location_id", foreignField: "ID", as: "location"
              }
          },
          {$unwind: '$city'},
          {$unwind: '$location'},  
        {
          $match: 
          {
            details: {$ne: []}
          }
        },
      ])
      if(!hotelRes) {
        throw new Error('No Hotels Found!')
      }
      debug.info('Hotels: ', hotelRes)
      return hotelRes
    } catch (error) {
      debug.error("ERROR: No Hotels Found!", error)
      return
    }
  },  

  async findHotelByPhone (phone) {
    let reply 
    await Hotel.find({
      phone: phone
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Hotel: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Hotel found", error)
      return
    })
    return reply
  },

  async fetchUrlImages (ID, url) {
    let reply 
    await Hotel.findOne({
      ID: ID,
      "gallery.url": url
    })
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Hotel: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Hotel found", error)
      return
    })
    return reply
  },

  async deletePictureObject (image, url) {
    let newArrayObject = []
    let gallery = image.gallery
    gallery.map( galleryObject => {
      if(galleryObject.url !== url) {
        newArrayObject.push(galleryObject)
      }
    })
    return newArrayObject
  },

  async deleteHotelGallery (ID, url) {
    let image = await HotelLib.fetchUrlImages(ID, url)
    if(image) {
      let gallery = await HotelLib.deletePictureObject(image, url)
      image.gallery = gallery
      return image
    }
    else {
      debug.error("ERROR: No HotelGalleryData Found To Delete HotelGalleryData!")
    }
  },

  async deleteHotelById (ID) {s
    let reply
    await Hotel.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('Hotel: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Hotel found", error)
      return
    })
    return reply
  }


}

module.exports = HotelLib