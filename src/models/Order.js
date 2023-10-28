const ModelSchema = require('./ModelSchema')
const ModelSchemaValidator = require('./ModelSchemaValidator')
const sql = require('mssql')

const OrderSchema = new ModelSchema(
    {
        id: new ModelSchemaValidator({
            name: 'id',
            sqlType: sql.Int,
            return: true
        }),
        userid: new ModelSchemaValidator({
            name: 'user_id',
            sqlType: sql.Int,
            return: true
        }),
        shoeid: new ModelSchemaValidator({
            name: 'shoe_id',
            sqlType: sql.Int,
            return: true
        }),
        quantity: new ModelSchemaValidator({
            name: 'quantity',
            sqlType: sql.Int,
            return: true
        }),
        date_order: new ModelSchemaValidator({
            name: 'date_order',
            sqlType: sql.Date,
            return: true
        })
    },'orders','date_ordered'
)

module.exports = OrderSchema