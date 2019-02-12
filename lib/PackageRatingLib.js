const AppConfig = require('./AppConfig')
const PackageRating = require('mongoose').model('PackageRatings')
let debug = require("debug-levels")("PackageRatingLib")

const PackageRatingLib = {

  async savePackageRating (data) {
    let res
    const packageRating = new PackageRating(data)
    await packageRating.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving PackageRating!")
        return
      }
      debug.info('PackageRating Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in PackageRating!", error)
      return
    })
    return res
  },

  async updatePackageRating (data) {
    let res
    await PackageRating.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating PackageRating!")
        return
      }
      debug.info('PackageRating Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating PackageRating!", error)
      return
    })
    return res
  },

  async fetchAllPackageRatings () {
    let reply 
    await PackageRating.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRatings: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRatings found", error)
      return
    })
    return reply
  },

  async findPackageRatingById (ID) {
    let reply 
    await PackageRating.find({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  },

  async findPackageRatingByUserId (user_id) {
    let reply 
    await PackageRating.find({
      user_id: user_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  },

  async findPackageRatingByPackageId (package_id) {
    let reply 
    await PackageRating.find({
      package_id: package_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  },

  async findPendingPackageRatings () {
    let reply 
    await PackageRating.find({
      status: "PENDING"
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  },

  async findAcceptedPackageRating () {
    let reply 
    await PackageRating.find({
      status: "ACCEPTED"
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  },

  async findRejectedPackageRating () {
    let reply 
    await PackageRating.find({
      status: "REJECTED"
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  },

  async deletePackageRatingById (ID) {
    let reply
    await PackageRating.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('PackageRating: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageRating found", error)
      return
    })
    return reply
  }


}

module.exports = PackageRatingLib