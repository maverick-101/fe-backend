let debug = require('debug-levels')('DbWrap')
var MongoClient = require('mongodb').MongoClient

let dbName = process.env.DB_NAME || 'fe-backend'

const DbConn = {
  conn: null,
  mongoUri: 'mongodb://localhost:27017/' + dbName,

  init: async function () {
    if (DbConn.conn) {
      debug.debug('return cached dbConn')
      return (DbConn.conn)
    }
    debug.debug('getConn mongoUri: ', DbConn.mongoUri)
    DbConn.conn = await MongoClient.connect(DbConn.mongoUri)
    return DbConn.conn
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
