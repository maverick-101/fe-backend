const cloudinary = require('cloudinary')
const AppConfig = require('./AppConfig')
let debug = require("debug-levels")("Cloudinary")


cloudinary.config({ 
  cloud_name: 'saaditrips', 
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

	async deleteImage (profile_picture) {
		const public_id = profile_picture.public_id
		const url = profile_picture.url
		cloudinary.v2.uploader.destroy(
			public_id, 
		{invalidate: true }, 
		function(error, result) {
			if (error) {
				debug.error('ERROR: Cant Delete image', error)
				return error
			}
			else {
				debug.info('Image Deleted!', result)
				return result
			}
		})
	}
}

module.exports = Cloudinary