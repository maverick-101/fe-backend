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

  async fetchAllHotels () {
    let reply 
    await Hotel.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Hotels: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Hotels found", error)
      return
    })
    return reply
  },

  async findHotelById (ID) {
    let reply 
    await Hotel.find({
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

  async deleteHotelById (ID) {
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