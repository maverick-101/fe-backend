const AppConfig = require('./AppConfig')
const PackagePages = require('mongoose').model('PackagePages')
let debug = require("debug-levels")("PackagePage")
const _ = require('underscore')

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

  async countPackages () {
    try {
      const packagePagesRes = await PackagePages.countDocuments()
      if(!packagePagesRes) {
        throw new Error('No Packages Found!')
      }
      debug.info('Packages: ', packagePagesRes)
      return packagePagesRes
    } catch (error) {
      debug.error("ERROR: No Packages Found!", error)
      return
    }
  },

  async fetchAllPackagePages () {
    try {
      const packagePagesRes = await PackagePages.aggregate(
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
            $lookup: 
              {
                from: "AgentPages", localField: "agent_id", foreignField: "ID", as: "agent"
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
              "path": "$agent",
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
        }
      ])
      if(!packagePagesRes) {
        throw new Error('No PackagePages Found!')
      }
      debug.info('PackagePages: ', packagePagesRes)
      return packagePagesRes
    } catch (error) {
      debug.error("ERROR: No PackagePages Found!", error)
      return
    }
  },

  async fetchPaginationPackagePages (pageSize, pageNumber) {
    pageNumber = Number(pageNumber)
    pageSize = Number(pageSize)
    try {
      const packagePagesRes = await PackagePages.aggregate(
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
            $lookup: 
              {
                from: "AgentPages", localField: "agent_id", foreignField: "ID", as: "agent"
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
              "path": "$agent",
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
        { "$skip":  pageSize * (pageNumber - 1) },
        { "$limit": pageSize }
      ])
      if(!packagePagesRes) {
        throw new Error('No PackagePages Found!')
      }
      debug.info('PackagePages: ', packagePagesRes)
      return packagePagesRes
    } catch (error) {
      debug.error("ERROR: No PackagePages Found!", error)
      return
    }
  },

  async UpdatePackagePageViews (ID) {
    let package = await PackagePageLib.findPackagePageById(ID)
    if(package) {
      package.views = package.views + 1
      let reply = await PackagePageLib.updatePackagePage(package) 
      if (reply) {
        return reply
      }else {
        debug.error("ERROR updating Package found", error)
        return
      }
    } else {
      debug.error("No PackagePage found", error)
      return
    }
  },

  async fetchManyPackages (data) {
    let reply 
    await PackagePages.find({
      ID: { $in: data }
    })
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

  async findEightRandomPackages () {
    try {
      const packagePagesRes = await PackagePages.aggregate(
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
            $lookup: 
              {
                from: "AgentPages", localField: "agent_id", foreignField: "ID", as: "agent"
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
              "path": "$agent",
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
        { "$limit": pageSize },
        { "$skip": (pageNumber - 1) * pageSize }
      ])
      if(!packagePagesRes) {
        throw new Error('No PackagePages Found!')
      }
      debug.info('PackagePages: ', packagePagesRes)
      return packagePagesRes
    } catch (error) {
      debug.error("ERROR: No PackagePages Found!", error)
      return
    }
  },

  async fetchTopVisitedExpeiriencesPackagePages () {
    await PackagePages.find()
    .sort({views: -1})
    .limit(6)
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
    ID = parseInt(ID)
    try {
      const packagePagesRes = await PackagePages.aggregate(
        [
          {
            $match: 
            {
              ID: ID
            }
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
            $lookup: 
              {
                from: "AgentPages", localField: "agent_id", foreignField: "ID", as: "agent"
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
              "path": "$agent",
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
        }
      ])
      if(!packagePagesRes) {
        throw new Error('No PackagePage Found!')
      }
      debug.info('PackagePage: ', packagePagesRes)
      return packagePagesRes
    } catch (error) {
      debug.error("ERROR: No PackagePage Found!", error)
      return
    }
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
    try {
      const packagePageRes = await PackagePages.aggregate(
        [
          {
            $match: 
            {
              city_id: city_id
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
      if(!packagePageRes) {
        throw new Error('No PackagePage Found!')
      }
      debug.info('PackagePage: ', packagePageRes)
      return packagePageRes
    } catch (error) {
      debug.error("ERROR: No PackagePage Found!", error)
      return
    }
  },

  async findTenRandomCityPackages (city_id) {
    console.log('<<<<<<<< findTenRandomCityPackages >>>>>> ')
    city_id = Number(city_id)
    try {
      const packagePageRes = await PackagePages.aggregate([
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
      if(!packagePageRes) {
        throw new Error('No PackagePages Found!')
      }
      console.log('PackagePages: ', packagePageRes)
      return packagePageRes
    } catch (error) {
      console.log("ERROR: No PackagePages Found!", error)
      return
    }
  },

  async findPackagesByProvince (city) {
    console.log('<<<<<<<< findPackagesByProvince >>>>>> ')
    let province = city.province
    let city_id = city.ID
    console.log(province, city_id)
    try {
      let packagePageRes = await PackagePages.aggregate([
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
      if(!packagePageRes) {
        throw new Error('No PackagePages Found!')
      }
      console.log('PackagePages: ', packagePageRes)
      packagePageRes = await PackagePageLib.findProvinceData(packagePageRes, province)
      return packagePageRes
    } catch (error) {
      console.log("ERROR: No PackagePages Found!", error)
      return
    }
  },

  async findProvinceData (packagePageRes, province) {
    console.log('<<<<<<<< findProvinceData >>>>>> ')
    packagePageRes = _.find(packagePageRes, function (packagePage) 
    { 
      if(packagePage.city) {
        if(packagePage.city.province) {
          return packagePage.city.province == province 
          } else {
            return []
          }
        } else {
          return []
        }
      })
    console.log('packagePageRes:    ', packagePageRes)
    return packagePageRes || []
  },

  async findRandomPackagePages (city) {
    console.log('<<<<<<<< findRandomPackagePages >>>>>> ')
    let province = city.province
    let city_id = city.ID
    try {
      let packagePageRes = await PackagePages.aggregate([
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
      if(!packagePageRes) {
        throw new Error('No PackagePages Found!')
      }
      console.log('PackagePages: ', packagePageRes)
      packagePageRes = await PackagePageLib.findOtherProvinceData(packagePageRes, province)
      return packagePageRes
    } catch (error) {
      console.log("ERROR: No PackagePages Found!", error)
      return
    }
  },

  async findOtherProvinceData (packagePageRes, province) {
    console.log('<<<<<<<< findOtherProvinceData >>>>>> ')
    packagePageRes = _.find(packagePageRes, function (packagePage) { 
      if(packagePage.city) {
        if(packagePage.city.province) {
          return packagePage.city.province !== province 
          } else {
            return []
          }
        } else {
          return []
        }
      })
    console.log('packagePageRes:    ', packagePageRes)
    return packagePageRes || []
  },

  async fetchUrlImages (ID, url) {
    let reply 
    await PackagePages.findOne({
      ID: ID,
      "gallery.url": url
    })
    .exec()
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

  async deletePackageGallery (ID, url) {
    let image = await PackagePageLib.fetchUrlImages(ID, url)
    if(image) {
      let gallery = await PackagePageLib.deletePictureObject(image, url)
      image.gallery = gallery
      return image
    }
    else {
      debug.error("ERROR: No PackageGalleryData Found To Delete PackageGalleryData!")
    }
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