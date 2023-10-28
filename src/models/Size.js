const ModelSchemaValidator = require('./ModelSchemaValidator')
const ModelSchema = require('./ModelSchema')
const sql = require('mssql')

const SizeSchema = new ModelSchema(
    {
        shoe_id: new ModelSchemaValidator({
            name: 'shoe_id',
            sqlType: sql.Int,
            isPrimaryKey: true,
            isAutoIncrement: true
        }),
        size: new ModelSchemaValidator({
            name: 'size',
            sqlType: sql.Int,
            require: true,
            validator:  function (val) {
                return val > 0;
            },
        })
    },'size','shoe_id'
)

module.exports = SizeSchema