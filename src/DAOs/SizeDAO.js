const dbConfig = require('../config/dbconfig')
const SizeSchema = require('../models/Size')
const dbUtils = require('../config/utils/dbUtils')

exports.getByShoeId = async  (shoe_id) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db')
    }
    let result = await dbConfig.db.pool
        .request()
        .input(SizeSchema.schema.shoe_id.name,SizeSchema.schema.shoe_id.sqlType, shoe_id)
        .query(`select ${SizeSchema.schema.size.name} from ${SizeSchema.schemaName} where ${SizeSchema.schema.shoe_id.name} = @${SizeSchema.schema.shoe_id.name}`)
    return result.recordsets[0]
} 

exports.deleteByShoeId = async (shoe_id) => {
    if (!dbConfig.db.pool) {
        throw new Error('Not connected to db');
    }

    let result = await dbConfig.db.pool
        .request()
        .input(SizeSchema.schema.shoe_id.name, SizeSchema.schema.shoe_id.sqlType, shoe_id)
        .query(`delete ${SizeSchema.schemaName} where ${SizeSchema.schema.shoe_id.name} = @${SizeSchema.schema.shoe_id.name}`);

    // console.log(result);
    return result.recordsets[0];
}

exports.addSizeIfNotExisted = async (shoe_id, size) => {
    if (!dbConfig.db.pool) {
        throw new Error('Not connected to db');
    }
    let insertData = SizeSchema.validateData({
        shoe_id: shoe_id,
        size: size
    });
    let query = `insert into ${SizeSchema.schemaName}`;
    const {request, insertFieldNamesStr,insertValuesStr} = dbUtils.getInsertQuery(SizeSchema.schema, dbConfig.db.pool.request(), insertData);
    if (!insertFieldNamesStr || !insertValuesStr){
        throw new Error('Invalid insert param');
    }
    query += ' (' + insertFieldNamesStr + ') select ' + insertValuesStr +
        ` WHERE NOT EXISTS(SELECT * FROM ${SizeSchema.schemaName} WHERE ${SizeSchema.schema.shoe_id.name} = @${SizeSchema.schema.shoe_id.name} AND ${SizeSchema.schema.size.name} = @${SizeSchema.schema.size.name})`;
    let result = await request.query(query);
    return result.recordsets;
}