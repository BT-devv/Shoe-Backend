exports.sqlConfig = {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASS,
    database: process.env.MSSQL_DB,
    server: process.env.MSSQL_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    options: {
        encrypt: false, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }      
}

exports.db = {}

