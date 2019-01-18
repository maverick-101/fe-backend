var config =  require ('../config.js')
let AppConfigLocal = {
	cloudinarySecret: config.cloudinary.CLOUDINARY_SECRET,
	cloudinaryApi: config.cloudinary.CLOUDINARY_API,
	cloudinaryName: config.cloudinary.CLOUDINARY_NAME
}

let AppConfig = Object.assign(AppConfigLocal)

module.exports = AppConfig