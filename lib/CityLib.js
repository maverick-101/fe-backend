const AppConfig = require('./AppConfig')
const Cloudinary = require('./Cloudinary')
const City = require('mongoose').model('Cities')
let debug = require("debug-levels")("CityLib")

const CityLib = {

  async saveCity (data) {
    let res
    data.created_At = new Date()
    const city = new City(data)
    await city.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving City!")
        return
      }
      debug.info('City Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in City!", error)
      return
    })
    return res
  },


  async updateCity (data) {
    let res
    await City.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating City!")
        return
      }
      debug.info('City Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating City!", error)
      return
    })
    return res
  },

  async fetchAllCities () {
    let reply 
    await City.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Cities: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No cities found", error)
      return
    })
    return reply
  },

  async findCityById (ID) {
    let reply 
    await City.find({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('City: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No City found", error)
      return
    })
    return reply
  },

  async findCityByName (name) {
    let reply 
    await City.find({
      name: name
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('City: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No City found", error)
      return
    })
    return reply
  },

  async findCityByProvince (province) {
    let reply 
    await City.find({
      province: province
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('City: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No City found", error)
      return
    })
    return reply
  },

  async deleteCityById (ID) {
    let reply
    await CityLib.deleteImages(ID)
    await City.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('City: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No City found", error)
      return
    })
    return reply
  },

  async deleteImages (Id) {
    let reply
    let city = await CityLib.findCityById(Id)
    if(city) {
      reply = Cloudinary.deleteMultipleImages(city)
      if(reply) {
        debug.info('Picture Deleted! ', reply)
      } else {
        debug.error("ERROR: No Pictures Found OR Error Deleting Pictures of City!")
      }
    } else {
      debug.error("ERROR: No City Found To Delete Images!")
    }
  }


}

module.exports = CityLib