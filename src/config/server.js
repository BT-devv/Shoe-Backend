const sql = require('mssql')
const dotenv = require('dotenv')
dotenv.config({
    path: './config.env'
})
const connectionDatabase = () =>{
    const dbConfig = require('./dbconfig')
    appPool = new sql.ConnectionPool(dbConfig.sqlConfig)
        .connect()
        .then(pool=>{
            console.log(`SQL connected!!!!!!!!`)
            dbConfig.db.pool = pool
        })
        .catch(err=>{
            console.error(`Connection failes.......${err}`)
    })
}

module.exports = connectionDatabase