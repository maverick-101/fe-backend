const AppConfig = require('./AppConfig')
const HotelRating = require('mongoose').model('HotelRatings')
let debug = require("debug-levels")("HotelRatingLib")

const HotelRatingLib = {

  async saveHotelRating (data) {
    let res
    const hotelRating = new HotelRating(data)
    await hotelRating.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving HotelRating!")
        return
      }
      debug.info('HotelRating Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in HotelRating!", error)
      return
    })
    return res
  },

  async updateHotelRating (data) {
    let res
    await HotelRating.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating HotelRating!")
        return
      }
      debug.info('HotelRating Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating HotelRating!", error)
      return
    })
    return res
  },

  async fetchAllHotelRatings () {
    let reply 
    await HotelRating.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRatings: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRatings found", error)
      return
    })
    return reply
  },

  async findHotelRatingById (ID) {
    let reply 
    await HotelRating.find({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  },

  async findHotelRatingByUserId (user_id) {
    let reply 
    await HotelRating.find({
      user_id: user_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  },

  async findHotelRatingByHotelId (hotel_id) {
    let reply 
    await Hotel.find({
      hotel_id: hotel_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  },

  async findPendingHotelRatings () {
    let reply 
    await HotelRating.find({
      status: "PENDING"
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  },

  async findAcceptedHotelRatings () {
    let reply 
    await HotelRating.find({
      status: "ACCEPTED"
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  },

  async findRejectedHotelRatings () {
    let reply 
    await HotelRating.find({
      status: "REJECTED"
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  },

  async deleteHotelRatingById (ID) {
    let reply
    await HotelRating.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('HotelRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No HotelRating found", error)
      return
    })
    return reply
  }


}

module.exports = HotelRatingLib