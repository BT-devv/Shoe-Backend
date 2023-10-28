const ModelSchema = require('./ModelSchema')
const ModelSchemaValidator = require('./ModelSchemaValidator')
const sql = require('mssql')

const RoleSchema = new ModelSchema(
    {
        id: new ModelSchemaValidator({
            name: 'id',
            sqlType: sql.Int,
            required: true,
        }),
        name: new ModelSchemaValidator({
            name: 'name',
            sqlType: sql.VarChar,
            required: true,
            validator:  function (val) {
                return val.length < 200;
            },
        })
    },'roles','id'
)
module.exports = RoleSchema