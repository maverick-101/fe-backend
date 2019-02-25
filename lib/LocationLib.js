const AppConfig = require('./AppConfig')
const Locations = require('mongoose').model('Locations')
let debug = require("debug-levels")("LocationLib")

const LocationLib = {

  async saveLocation (data) {
    let res
    const locations = new Locations(data)
    await locations.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving Location!")
        return
      }
      debug.info('Location Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in Location!", error)
      return
    })
    return res
  },

  async updateLocation (data) {
    let res
    await Locations.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating Location!")
        return
      }
      debug.info('Location Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating Location!", error)
      return
    })
    return res
  },

  async fetchAllLocations () {
    let reply 
    await Locations.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Locations: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Locations found", error)
      return
    })
    return reply
  },

  async fetchAllRecommendedLocations () {
    let reply 
    await Locations.find({
      recommended: true
    })
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Locations: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Locations found", error)
      return
    })
    return reply
  },

  async findLocationById (ID) {
    let reply 
    await Locations.find({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Location: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Location found", error)
      return
    })
    return reply
  },

  async findLocationByName (name) {
    let reply 
    await Locations.find({
      name: name
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Location: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Location found", error)
      return
    })
    return reply
  },

  async findLocationByCity_id (city_id) {
    let reply 
    await Locations.find({
      city_id: city_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Location: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Location found", error)
      return
    })
    return reply
  },

  async deleteLocationById (ID) {
    let reply
    await Locations.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('Location: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Location found", error)
      return
    })
    return reply
  }


}

module.exports = LocationLib