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

  async countHotels () {
    try {
      const hotelRes = await Hotel.countDocuments()
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

  async fetchAllHotels () {
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
        { 
          "$unwind": {
            "path": "$location",
            "preserveNullAndEmptyArrays": true
          } 
        },
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        }
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

  async findTenRandomHotels (city_id) {
    console.log('<<<<<<<< findTenRandomHotels >>>>>> ')
    city_id = Number(city_id)
    try {
      const hotelRes = await Hotel.aggregate([
        {
          $match: 
          {
            city_id: city_id
          }
        },
        { 
          $sample: { size: 10 } 
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
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        },
        { 
          "$unwind": {
            "path": "$location",
            "preserveNullAndEmptyArrays": true
          } 
        },  
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!hotelRes) {
        throw new Error('No Hotels Found!')
      }
      console.log('Hotels: ', hotelRes)
      return hotelRes
    } catch (error) {
      console.log("ERROR: No Hotels Found!", error)
      return
    }
  },

  async findHotelsByProvince (city) {
    console.log('<<<<<<<< findHotelsByProvince >>>>>> ')
    let province = city.province
    let city_id = city.ID
    console.log(province, city_id)
    try {
      const hotelRes = await Hotel.aggregate([
        {
          $match: 
          {
            city_id: {$ne: city_id}
          }
        },
        {
          $lookup: 
            {
              from: "cities", localField: "city_id", foreignField: "ID", as: "city"
            }
        },
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        },  
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!hotelRes) {
        throw new Error('No Hotels Found!')
      }
      console.log('Hotels: ', hotelRes)
      locationRes = await LocationLib.findProvinceData(hotelRes, province)
      return hotelRes
    } catch (error) {
      console.log("ERROR: No Hotels Found!", error)
      return
    }
  },

  async findProvinceData (hotelRes, province) {
    console.log('<<<<<<<< findProvinceData >>>>>> ')
    hotelRes = _.find(hotelRes, function (hotel) 
    { 
      if(hotel.city) {
        if(hotel.city.province) {
          return hotel.city.province == province 
          } else {
            return []
          }
        } else {
          return []
        }
      })
    console.log('hotelRes:    ', hotelRes)
    return hotelRes || []
  },

  async findRandomHotels (city) {
    console.log('<<<<<<<< findRandomHotels >>>>>> ')
    let province = city.province
    let city_id = city.ID
    try {
      const hotelRes = await Hotel.aggregate([
        {
          $match: 
          {
            city_id: {$ne: city_id}
          }
        },
        {
          $lookup: 
            {
              from: "cities", localField: "city_id", foreignField: "ID", as: "city"
            }
        },
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        },  
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!hotelRes) {
        throw new Error('No Hotels Found!')
      }
      console.log('Hotels: ', hotelRes)
      locationRes = await LocationLib.findOtherProvinceData(hotelRes, province)
      return hotelRes
    } catch (error) {
      console.log("ERROR: No Hotels Found!", error)
      return
    }
  },

  async findOtherProvinceData (hotelRes, province) {
    console.log('<<<<<<<< findOtherProvinceData >>>>>> ')
    hotelRes = _.find(hotelRes, function (hotel) { return hotel.city.province !== province })
    console.log('hotelRes:    ', hotelRes)
    return hotelRes || []
  },

  async fetchPaginationHotels (pageSize, pageNumber) {
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
        { 
          "$unwind": {
            "path": "$location",
            "preserveNullAndEmptyArrays": true
          } 
        },
        { 
          "$unwind": {
            "path": "$city",
            "preserveNullAndEmptyArrays": true
          } 
        },
        { "$skip":  pageSize * (pageNumber - 1) },
        { "$limit": pageSize }
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

  async getIndex() {
    try {
      const userRes = await Hotel.collection.getIndexes()
      if(!userRes) {
        throw new Error('No Hotel Index Found!')
      } 
      debug.info('Hotel Indexes: ', userRes)
      return userRes
    } catch (error) {
      debug.info(error)
      return
    }
  },

  async dropEmailIndex() {
    try {
      const userRes = await Hotel.collection.dropIndex( { "email" : 1 } )
      if(!userRes) {
        throw new Error('No Hotel Index Found!')
      } 
      debug.info('Hotel Indexes: ', userRes)
      return userRes
    } catch (error) {
      debug.info(error)
      return
    }
  },

  async dropPhoneIndex() {
    try {
      const userRes = await Hotel.collection.dropIndex( { "phone" : 1 } )
      if(!userRes) {
        throw new Error('No Hotel Index Found!')
      } 
      debug.info('Hotel Indexes: ', userRes)
      return userRes
    } catch (error) {
      debug.info(error)
      return
    }
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
          { 
            "$unwind": {
              "path": "$location",
              "preserveNullAndEmptyArrays": true
            } 
          },
          { 
            "$unwind": {
              "path": "$city",
              "preserveNullAndEmptyArrays": true
            } 
          },  
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