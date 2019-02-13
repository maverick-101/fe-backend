const AppConfig = require('./AppConfig')
const PackagePages = require('mongoose').model('PackagePages')
let debug = require("debug-levels")("PackagePage")

const PackagePageLib = {

  async savePackagePage (data) {
    let res
    const packagePages = new PackagePages(data)
    await packagePages.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving PackagePage!")
        return
      }
      debug.info('PackagePage Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in PackagePage!", error)
      return
    })
    return res
  },

  async updatePackagePage (data) {
    let res
    await PackagePages.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating PackagePage!")
        return
      }
      debug.info('PackagePage Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating PackagePage!", error)
      return
    })
    return res
  },

  async fetchAllPackagePages () {
    let reply 
    await PackagePages.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackagePages: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackagePages found", error)
      return
    })
    return reply
  },

  async findPackagePageById (ID) {
    let reply 
    await PackagePages.find({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackagePage: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackagePage found", error)
      return
    })
    return reply
  },

  async findPackagePageByAgentId (agent_id) {
    let reply 
    await PackagePages.find({
      agent_id : agent_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackagePage: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackagePage found", error)
      return
    })
    return reply
  },

  async findPackagePageByName (name) {
    let reply 
    await PackagePages.find({
      name: name
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackagePage: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackagePage found", error)
      return
    })
    return reply
  },

  async findPackagePageBylocation_id (location_id) {
    let reply 
    await PackagePages.find({
      location_id: location_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackagePages: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackagePages found", error)
      return
    })
    return reply
  },

  async findPackagePageByCity_id (city_id) {
    let reply 
    await PackagePages.find({
      city_id: city_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackagePage: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackagePage found", error)
      return
    })
    return reply
  },

  async deletePackagePageById (ID) {
    let reply
    await PackagePages.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('PackagePage: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackagePage found", error)
      return
    })
    return reply
  }


}

module.exports = PackagePageLib