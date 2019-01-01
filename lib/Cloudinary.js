const cloudinary = require('cloudinary')
const AppConfig = require('./AppConfig')
cloudinary.config({ 
  cloud_name: 'saaditrips', 
  api_key: AppConfig.cloudinaryApi, 
  api_secret: AppConfig.cloudinarySecret 
})

const Cloudinary = {
	uploadImage () {
		new Promise((resolve) => {
      cloudinary.v2.uploader.upload("./image.png", 
    	function(error, result) {
				if (error) {
					console.log(error)
					resolve()
				} else {
					console.log(result)
					resolve(result)
				}
			})
    })
	}
}

module.exports = Cloudinary