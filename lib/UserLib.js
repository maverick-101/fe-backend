const AppConfig = require('./AppConfig')
const User = require('../models/User')
let debug = require("debug-levels")("UserLib")

const UserLib = {
  async updateUser (data) {
    User.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("ERROR: Found in updating User!")
        res.send("ERROR: updating User!")
        return
      }
      debug.info('User Updated Result', result)
      
      return result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating User!", error)
      return
    })
  },

  async findUserById (data) {
    let reply 
    await User.find({
      ID : data.ID
    })
    .then(res => {
      debug.info('User: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Users found", error)
      return
    })
    return reply
  }
}

module.exports = UserLib