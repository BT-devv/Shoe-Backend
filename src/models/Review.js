const ModelSchema = require('./ModelSchema')
const ModelSchemaValidator = require('./ModelSchemaValidator')
const sql = require('mssql')

const ReviewSchema = new ModelSchema(
    {
        id: new ModelSchemaValidator({
            name: 'id',
            sqlType: sql.Int,
            required: true,
        }),
        review: new ModelSchemaValidator({
            name: 'review',
            sqlType: sql.VarChar,
            required: true,
            validator:  function (val) {
                return val.length >= 0;
            },
        }),
        rating: new ModelSchemaValidator({
            name: 'rating',
            sqlType: sql.Int,
            required: true,
            validator:  function (val) {
              return val >= 0 && val <= 5;
            },
        }),
        shoeId: new ModelSchemaValidator({
            name: 'shoeId',
            sqlType: sql.Int,
            required: true,
        }),
        userId: new ModelSchemaValidator({
            name: 'userId',
            sqlType: sql.Int,
            required: true,
        }),
        createdAt: new ModelSchemaValidator({
            name: 'createdAt',
            sqlType: sql.Date,
            required: true,
        })
    },'review','createdAt'
)
module.exports = ReviewSchema