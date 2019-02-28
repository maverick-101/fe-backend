const AppConfig = require('./AppConfig')
const Cloudinary = require('./Cloudinary')
// const Images = require('mongoose').model('HotelImages')
const PackageResources = require('../models/PackageResources')
let debug = require("debug-levels")("PackageResourcesLib")

const PackageResourcesLib = {

  async saveImage (data) {
    let res = []
    if(data) {
      for(let i = 0; i < data.length; i++) {
        const packageResources = new PackageResources(data[i])    
        await packageResources.save().then(result => {
          if(!result) {
            debug.error("ERROR: Saving Image!")
            return
          }
          debug.info('Image Saved Result', result)
          res.push(result) 
        })
        .catch(error => {
          debug.error("ERROR: Found in Image!", error)
          return
        })
      }
    }
    return res
  },


  async updateImage (data) {
    let res
    let Id = data.ID
    await PackageResources.findOneAndUpdate({
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

  async createPackageResourceObject (gallery, data) {
    let createResourceObject = []
    if(gallery){
      createResourceObject = gallery.map( resource => {
        let resourceObject = {
          packageResources_title: data.packageResources_title,
          package_id: data.package_id,
          image_type: data.image_type,
          images:
          {
            public_id: resource.public_id,
            url: resource.url
          },
        description: data.description,
        created_At: new Date()
        }
        return resourceObject
      })
    }
    return createResourceObject
  },

  async fetchAllImages () {
    let reply 
    await PackageResources.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('PackageResources: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No PackageResources found", error)
      return
    })
    return reply
  },

  async findImageById (ID) {
    let reply 
    await PackageResources.find({
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

  async findImageByPackageId (package_id) {
    package_id = Number(package_id)
    let packageData = []
      let reply 
      try {
        packageData = await PackageResources.aggregate([
          {
            "$match":
            {
              "package_id": package_id
            }
          },
          { "$group" : 
            {
              "_id" : "$image_type", 
              "Resources": {
                "$push": { 
                "ID": "$ID",
                "url": "$images.url",
                "title": "$packageResources_title",
                "description": "$description"
                }
              },
            } 
          }
      ])
      } catch (error) {
        debug.info(error)
      }
      
      if(packageData  && packageData.length > 0) {
        return packageData
      } else {
        debug.info('ERROR: No Package Data Found To Update Rating!')
        return
      }
  },

  async findImageByType (image_type) {
    let reply 
    await PackageResources.find({
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

  async findImageByTypeAndPackageId (image_type, package_id) {
    let reply 
    await PackageResources.find({
      image_type: image_type,
      package_id: package_id
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
    await PackageImageLib.deleteImages(ID)
    await PackageResources.findOneAndDelete({ 
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
    let image = await PackageResourcesLib.findImageById(Id)
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

module.exports = PackageResourcesLib