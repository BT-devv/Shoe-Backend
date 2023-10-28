const ModelSchemaValidator = require('./ModelSchemaValidator')
const ModelSchema = require('./ModelSchema')
const sql = require('mssql')

const ImageSchema = new ModelSchema(
    {
        shoe_id: new ModelSchemaValidator({
            name: 'shoe_id',
            sqlType: sql.Int,
            isPrimaryKey: true,
            isAutoIncrement: true
        }),
        img: new ModelSchemaValidator({
            name: 'img',
            sqlType: sql.VarChar,
            require: true,
            validator:  function (val) {
                return val.length > 0;
            },
        })
    },'img','shoe_id'
)

module.exports = ImageSchema