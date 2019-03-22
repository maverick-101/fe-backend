const AppConfig = require('./AppConfig')
const User = require('mongoose').model('Users')
let debug = require("debug-levels")("UserLib")

const UserLib = {

  async saveUser (data) {
    let res
    const user = new User(data)
    await user.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving User!")
        return
      }
      debug.info('User Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in User!", error)
      return
    })
    return res
  },

  async updateUser (data) {
    let res
    await User.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating User!")
        return
      }
      debug.info('User Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating User!", error)
      return
    })
    return res
  },

  async fetchAllUsers () {
    let reply 
    await User.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Users: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Users found", error)
      return
    })
    return reply
  },

  async findUserById (ID) {
    ID = parseInt(ID)
    try {
      const userRes = await User.aggregate(
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
      if(!userRes) {
        throw new Error('No User Found!')
      }
      debug.info('User: ', userRes)
      return userRes
    } catch (error) {
      debug.error("ERROR: No User Found!", error)
      return
    }
  },

  async findUserByFirstName (first_name) {
    let reply 
    await User.find({
      first_name: first_name
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('User: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No User found", error)
      return
    })
    return reply
  },

  async findUserByEmail (email) {
    let reply 
    await User.find({
      email: email
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('User: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No User found", error)
      return
    })
    return reply
  },

  async findUserByPhone (phone) {
    let reply 
    await User.find({
      phone: phone
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('User: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No User found", error)
      return
    })
    return reply
  },

  async findUserByCity (city_id) {
    let reply 
    await User.find({
      city_id: city_id
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('User: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No User found", error)
      return
    })
    return reply
  },

  async deleteUserById (ID) {
    let reply
    await User.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('User: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No User found", error)
      return
    })
    return reply
  }


}

module.exports = UserLib