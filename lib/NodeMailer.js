const nodemailer = require("nodemailer")
let debug = require("debug-levels")("NodeMailer")
const AppConfig = require('./AppConfig')
const PackagePageLib = require('./PackagePageLib')
const HotelLib = require('./HotelLib')
const UserLib = require('./UserLib')
const RoomLib = require('./RoomLib')


const NodeMailer = {

  async sendEmail () {
    const transporter = await nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      ecure: false,
      requireTLS: true,
      auth: {
        user: AppConfig.Email,
        pass: AppConfig.PASSWORD
      }
    })
    
    const mailOptions = {
      from: AppConfig.Email,
      to: 'ahsan_awan343@yahoo.com',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    }
    
    await transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        debug.info(error)
      } else {
        debug.info('Email sent: ' + info.response)
      }
    })
  },

  async preparePackageData (packageData) {
    let package = {}
    let packageData = await PackagePageLib.findPackagePageById(package_id)
    let agentData = await NodeMailer.prepareUserData()
    if (packageData) {
      packageData.map(data => {
        package = {
          agent_id: data.agent_id,
          
        }
      })
    } else {
      return
    }
  },

  async prepareUserData (user_id) {
    let userData = await UserLib.findUserById(user_id)
    if (userData) {
      
    } else {
      return
    }
  },

  async createPackageEmail (data) {
    let preparedPackage = await NodeMailer.preparePackageData(data.package_id)
    let preparedUser = await NodeMailer.prepareUserData(data.user_id)

    const mailOptions = {
      from: AppConfig.Email,
      to: userData[0].email,
      subject: 'Package Order',
      html: 
      '<h2> Hi ' + userData[0].first_name + ', <br> <p> </p>'
    }
  },

  async createHotelEmail (data) {
    
  }

}

module.exports = NodeMailer