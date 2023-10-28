const ModelSchemaValidator = require('./ModelSchemaValidator')
const ModelSchema = require('./ModelSchema')
const sql = require('mssql')

const ShoesSchema = new ModelSchema(
    {
        id: new ModelSchemaValidator({
            name: 'id',
            sqlType: sql.Int,
            isPrimaryKey: true,
            isAutoIncrement: true
        }),
        name: new ModelSchemaValidator({
            name: 'name',
            sqlType: sql.VarChar,
            require: true,
            validator:  function (val) {
                return val.length < 200;
            },
        }),
        brand: new ModelSchemaValidator({
            name: 'brand',
            sqlType: sql.VarChar,
            require: true,
            validator:  function (val) {
                return val.length < 200;
            },
        }),
        type: new ModelSchemaValidator({
            name: 'type',
            sqlType: sql.VarChar,
            require: true,
            validator:  function (val) {
                return val.length < 200;
            },
        }),
        color: new ModelSchemaValidator({
            name: 'color',
            sqlType: sql.VarChar,
            require: true,
            validator:  function (val) {
                return val.length < 200;
            },
        }),
        imageS: new ModelSchemaValidator({
            name: 'imageS',
            sqlType: sql.VarChar,
            require: true,
            validator:  function (val) {
                return val.length > 0;
            },
        }),
        sizeS: new ModelSchemaValidator({
            name: 'sizeS',
            sqlType: sql.Int,
            require: true,
            validator:  function (val) {
                return val > 0;
            },
        }),
        price: new ModelSchemaValidator({
            name: 'price',
            sqlType: sql.Decimal,
            require: true,
            validator:  function (val) {
                return val > 0;
            },
        }),
        quantity: new ModelSchemaValidator({
            name: 'quantity',
            sqlType: sql.Int,
            require: true,
        }),
        createAt: new ModelSchemaValidator({
            name: 'createAt',
            sqlType: sql.Date,
            require: true,
            
        })
    },'shoes','createAt'
)

module.exports = ShoesSchema