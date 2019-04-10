const AppConfig = require('./AppConfig')
const Cloudinary = require('./Cloudinary')
const Event = require('../models/Event')
// const Event = require('mongoose').model('Cities')
let debug = require("debug-levels")("EventLib")

const EventLib = {

  async saveEvent (data) {
    data.created_At = new Date()
    const event = new Event(data)
    try {
      const eventRes = await Event.save()
      if(!eventRes) {
        throw new Error('ERROR: Saving Event!')
      }
      debug.info('Event Saved!', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: Saving Event!", error)
      return
    }
  },

  async updateEvent (data) {
    data.created_At = new Date()
    try {
      const eventRes = await Event.findOneAndUpdate({
        ID: data.ID
      },
      data,
      {upsert:false}
      )
      if(!eventRes) {
        throw new Error('No ID Found or ERROR: updating Event!')
      }
      debug.info('Event Updated Result', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: Found in updating Event!", error)
      return
    }
  },

  async fetchAllEvents () {
    try {
      const eventRes = await Event.aggregate(
        [
          {
            $lookup: 
              {
                from: "locations", localField: "location_id", foreignField: "ID", as: "location"
              }
          },
          {
            $lookup: 
              {
                from: "cities", localField: "city_id", foreignField: "ID", as: "city"
              }
          },  
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!eventRes) {
        throw new Error('No Events Found!')
      }
      debug.info('Events: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Events Found!", error)
      return
    }
  },

  async findEventById (ID) {
    ID = parseInt(ID)
    try {
      const eventRes = await Event.aggregate(
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
                from: "users", localField: "user_id", foreignField: "ID", as: "UserDetails"
              }
          },  
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!eventRes) {
        throw new Error('No Event Found!')
      }
      debug.info('Event: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Event Found!", error)
      return
    }
  },

  async findEventByUserName (user_name) {
    try {
      const eventRes = await Event.aggregate(
        [
          {
            $match: 
            {
              user_name: user_name
            }
          },
          {
            $lookup: 
              {
                from: "users", localField: "user_id", foreignField: "ID", as: "UserDetails"
              }
          },  
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!eventRes) {
        throw new Error('No Events Found!')
      }
      debug.info('Events: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Events Found!", error)
      return
    }
  },

  async findRecommendedEvents () {
    try {
      const eventRes = await Event.aggregate(
        [
          {
            $match: 
            {
              recommended: true
            }
          },
          {
            $lookup: 
              {
                from: "users", localField: "user_id", foreignField: "ID", as: "UserDetails"
              }
          },  
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!eventRes) {
        throw new Error('No Events Found!')
      }
      debug.info('Events: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Events Found!", error)
      return
    }
  },

  async deleteEventById (ID) {
    try {
      const eventRes = await Event.findOneAndDelete({
        ID: ID
      })
      if(!eventRes) {
        throw new Error('No Events Found!')
      }
      debug.info('Events: ', eventRes)
      return eventRes
    } catch (error) {
      debug.error("ERROR: No Events Found!", error)
      return
    }
  }

}

module.exports = EventLib