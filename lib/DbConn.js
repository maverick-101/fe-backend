var config = require('../config.js')
let debug = require('debug-levels')('DbWrap')

debug.info(config)

let dbName = config.db.DB_NAME || 'fe-backend'
let mongoURI= config.db.mongoUri || 'mongodb://localhost:27017/'

const DbConn = {
  conn: null,
  mongoUri: mongoURI + dbName,

  init: async function () {
    if (DbConn.conn) {
      debug.debug('return cached dbConn')
      return (DbConn.conn)
    }
  },

  // capitalize collection names
  getCollName: (name) => {
    name = name.replace(/-/g, '')
    return name[0].toUpperCase() + name.slice(1)
  },

  // collection names dont have puncs in
  getColl: (name) => {
    let collName = DbConn.getCollName(name)
    return DbConn.conn.collection(collName)
  }

}

module.exports = DbConn
