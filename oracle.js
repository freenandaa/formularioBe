const oracledb = require('oracledb')
const config = require('./config')
oracledb.initOracleClient()
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

class Oracle {
  
  constructor (params = config) {
    oracledb.autoCommit = true
    this.oracledb = oracledb
    this.connection = null
    this.config = params
  }
  async connect () {
    try {
      if (!this.connection) {
        this.connection = await this.oracledb.getConnection(this.config)
        this.connection.execute('alter session SET NLS_COMP=LINGUISTIC')
        this.connection.execute('alter session SET NLS_SORT=BINARY_CI')
      }
      return this.connection
    } catch (err) {
      console.log(err)
    }
  }
  async disconnect () {
    try {
      if (this.connection !== null) {
        await this.connection.close()
        this.connection = null
      }
    } catch (err) {
      new MailRepository().defaultMail('Oracle DB Disconnect', err)
      throw new OracleDbError(500, err.message, JSON.stringify(err, null, 2))
    }
  }
}
module.exports = Oracle
