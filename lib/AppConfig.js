let AppConfigLocal = {
	cloudinarySecret: process.env.CLOUDINARY_SECRET,
	cloudinaryApi: process.env.CLOUDINARY_API,
	cloudinaryName: process.env.CLOUDINARY_NAME
}

let AppConfig = Object.assign(AppConfigLocal)

module.exports = AppConfig