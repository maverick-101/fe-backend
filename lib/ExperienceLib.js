const AppConfig = require('./AppConfig')
const Cloudinary = require('./Cloudinary')
const Experience = require('../models/Experience')
// const Experience = require('mongoose').model('Cities')
let debug = require("debug-levels")("ExperienceLib")

const ExperienceLib = {

  async saveExperience (data) {
    data.created_At = new Date()
    const experience = new Experience(data)
    try {
      const experienceRes = await experience.save()
      if(!experienceRes) {
        throw new Error('ERROR: Saving City!')
      }
      debug.info('Experience Saved!', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: Saving Experience!", error)
      return
    }
  },

  async updateExperience (data) {
    data.created_At = new Date()
    try {
      const experienceRes = await Experience.findOneAndUpdate({
        ID: data.Id
      },
      data,
      {upsert:false}
      )
      if(!experienceRes) {
        throw new Error('No ID Found or ERROR: updating Experience!')
      }
      debug.info('Experience Updated Result', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: Found in updating Experience!", error)
      return
    }
  },

  async fetchManyExperiences (data) {
    try {
      const experienceRes = await Experience.find({
        ID: { $in: data }
      })
      if(!experienceRes) {
        throw new Error('No Experiences Found!')
      }
      debug.info('Experiences: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No Experiences Found!", error)
      return
    }
  },

  async fetchAllExperiences () {
    try {
      const experienceRes = await Experience.aggregate(
        [
          {
            $lookup: 
              {
                rom: "users", localField: "user_id", foreignField: "ID", as: "UserDetails"
              }
          },  
        {
          $match: 
          {
            details: {$ne: []}
          }
        }
      ])
      if(!experienceRes) {
        throw new Error('No Experiences Found!')
      }
      debug.info('Experiences: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No Experiences Found!", error)
      return
    }
  },

  async findExperienceById (ID) {
    ID = parseInt(ID)
    try {
      const experienceRes = await Experience.aggregate(
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
      if(!experienceRes) {
        throw new Error('No Experience Found!')
      }
      debug.info('Experience: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No Experience Found!", error)
      return
    }
  },

  async findExperienceByUserName (user_name) {
    try {
      const experienceRes = await Experience.aggregate(
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
      if(!experienceRes) {
        throw new Error('No Experiences Found!')
      }
      debug.info('Experiences: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No Experiences Found!", error)
      return
    }
  },

  async findRecommendedExperiences () {
    try {
      const experienceRes = await Experience.aggregate(
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
      if(!experienceRes) {
        throw new Error('No Experiences Found!')
      }
      debug.info('Experiences: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No Experiences Found!", error)
      return
    }
  },

  async deleteExperienceById (ID) {
    try {
      const experienceRes = await Experience.findOneAndDelete({
        ID: ID
      })
      if(!experienceRes) {
        throw new Error('No Experiences Found!')
      }
      debug.info('Experiences: ', experienceRes)
      return experienceRes
    } catch (error) {
      debug.error("ERROR: No Experiences Found!", error)
      return
    }
  }

}

module.exports = ExperienceLib