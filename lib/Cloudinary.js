const AppConfig = require('./AppConfig')
let debug = require("debug-levels")("Cloudinary")
const multer  = require('multer')
const cloudinary = require('cloudinary')
const cloudinaryStorage = require("multer-storage-cloudinary")


cloudinary.config({ 
  cloud_name: AppConfig.cloudinaryName, 
  api_key: AppConfig.cloudinaryApi, 
  api_secret: AppConfig.cloudinarySecret 
})

const Cloudinary = {
	async uploadImage () {
		new Promise((resolve) => {
      cloudinary.v2.uploader.upload("./image.png", 
    	function(error, result) {
				if (error) {
					debug.error(error)
					resolve()
				} else {
					debug.info(result)
					resolve(result)
				}
			})
    })
	},

	async cloudinaryConfig() {
		const storage = cloudinaryStorage({
			cloudinary: cloudinary,
			folder: "Cities",
			allowedFormats: ["jpg", "png", "jpeg"],
		})
		const parser = await multer({ storage: storage })
		return parser
	},

	async deleteImage (res, profile_picture) {
		let reply
		res = res[0]
		if (res.profile_picture.public_id == profile_picture.public_id) {
			const public_id = profile_picture.public_id
			await cloudinary.v2.uploader.destroy(
				public_id, 
				{invalidate: true }, 
				function(error, result) {
				if (error) {
					debug.error('ERROR: Cant Delete image', error)
					return
				}
				else {
					debug.info('Image Deleted!', result)
					reply = result
				}
			})
		}
		else {
			debug.error("ERROR: public_id not matched")
			return
		}
		return reply
	},

	async createGallery (data, cloudinaryData) {
		let gallery = []
		if(cloudinaryData) {
			cloudinaryData.map(picture => {
				let pictureObject = {
					public_id: picture.public_id,
					url: picture.url,
					type: data.image_type
				}
				gallery.push(pictureObject)
			})
			return gallery
		}
	},

	async updateGallery (data, cloudinaryData) {
		let gallery = []
		if(cloudinaryData) {
			cloudinaryData.map(picture => {
				let pictureObject = {
					public_id: picture.public_id,
					url: picture.url,
					image_type: data.image_type
				}
				if (data.gallery) {
					data.gallery.push(pictureObject)
					gallery = data.gallery 
				} else {
					gallery.push(pictureObject)
				}
			})
			return gallery
		}
	},

	async deleteMultipleImages() {

	}
}

module.exports = Cloudinary