const ModelSchema = require('./ModelSchema')
const ModelSchemaValidator = require('./ModelSchemaValidator')
const sql = require('mssql')

const UsersSchema = new ModelSchema(
    {
        id: new ModelSchemaValidator({
            name: 'id',
            sqlType: sql.Int,
        }),
        username: new ModelSchemaValidator({
            name: 'username',
            sqlType: sql.VarChar,
            return: true,
        }),
        name: new ModelSchemaValidator({
            name: 'name',
            sqlType: sql.VarChar,
            require: true,
            validator:  function (val) {
                return val.length < 200;
            },
        }),
        email: new ModelSchemaValidator({
            name: 'email',
            sqlType: sql.VarChar,
            require: true,
            validator:  function (val) {
                return String(val)
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    );
            },
        }),
        password: new ModelSchemaValidator({
            name: 'password',
            sqlType: sql.VarChar,
            require: true,
            validator:  function (val) {
                return val.length >= 5 && val.length < 200;
            },
        }),
        phone: new ModelSchemaValidator({
            name: 'phone',
            sqlType: sql.VarChar,
            require: true
        }),
        roles: new ModelSchemaValidator({
            name: 'roles',
            sqlType: sql.Int,
            require: true
        }),
        createAt: new ModelSchemaValidator({
            name: 'createAt',
            sqlType: sql.DateTime,
            require: true
        })
    },'users','createAt'
)
module.exports = UsersSchema