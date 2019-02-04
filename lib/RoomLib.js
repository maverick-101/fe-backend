const AppConfig = require('./AppConfig')
const Room = require('mongoose').model('Rooms')
let debug = require("debug-levels")("RoomLib")

const RoomLib = {

  async saveRoom (data) {
    let res
    const room = new Room(data)
    await room.save().then(result => {
      if(!result) {
        debug.error("ERROR: Saving Room!")
        return
      }
      debug.info('Room Saved Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in Room!", error)
      return
    })
    return res
  },

  async updateRoom (data) {
    let res
    await Room.findOneAndUpdate({
      ID: data.ID
    },
    data,
    {upsert:false}
    )
    .then(result => {
      if(!result) {
        debug.error("No ID Found or ERROR: updating Room!")
        return
      }
      debug.info('Room Updated Result', result)
      res = result
    })
    .catch(error => {
      debug.error("ERROR: Found in updating Room!", error)
      return
    })
    return res
  },

  async fetchAllRooms () {
    let reply 
    await Room.find()
    .exec()
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Rooms: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Rooms found", error)
      return
    })
    return reply
  },

  async findRoomById (ID) {
    let reply 
    await Room.find({
      ID : ID
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Room: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Room found", error)
      return
    })
    return reply
  },

  async findRoomByTitle (title) {
    let reply 
    await Room.find({
      title: title
    })
    .then(res => {
      if (res.length == 0) {
        return
      }
      debug.info('Room: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Room found", error)
      return
    })
    return reply
  },

  async deleteRoomById (ID) {
    let reply
    await Room.findOneAndDelete({ 
      ID: ID 
    })
    .then (res => {
      if (!res) {
        return
      }
      debug.info('Room: ', res)
      reply = res
    })
    .catch(error => {
      debug.error("No Room found", error)
      return
    })
    return reply
  }


}

module.exports = RoomLib