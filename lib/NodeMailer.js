const nodemailer = require("nodemailer")
let debug = require("debug-levels")("NodeMailer")


const NodeMailer = {

  async sendEmail () {
    const transporter = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '@gmail.com',
        pass: 'ahsan1234'
      }
    })
    
    const mailOptions = {
      from: '@gmail.com',
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
  }

}

module.exports = NodeMailer