const dbConfig = require('../config/dbconfig')
const ImgSchema = require('../models/Image')
const dbUtils = require('../config/utils/dbUtils')

exports.getByShoeId = async  (shoe_id) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db')
    }
    let result = await dbConfig.db.pool
        .request()
        .input(ImgSchema.schema.shoe_id.name,ImgSchema.schema.shoe_id.sqlType, shoe_id)
        .query(`select ${ImgSchema.schema.img.name} from ${ImgSchema.schemaName} where ${ImgSchema.schema.shoe_id.name}=@${ImgSchema.schema.shoe_id.name}`)
    return result.recordsets[0]
} 
exports.addImageIfNotExisted = async (shoe_id, img) => {
    if (!dbConfig.db.pool) {
        throw new Error('Not connected to db');
    }
    let insertData = ImgSchema.validateData({
        shoe_id: shoe_id,
        img: img
    });
    let query = `insert into ${ImgSchema.schemaName}`;
    const {request, insertFieldNamesStr,insertValuesStr} = dbUtils.getInsertQuery(ImgSchema.schema, dbConfig.db.pool.request(), insertData);
    if (!insertFieldNamesStr || !insertValuesStr){
        throw new Error('Invalid insert param');
    }
    query += ' (' + insertFieldNamesStr + ') select ' + insertValuesStr +
        ` WHERE NOT EXISTS(SELECT * FROM ${ImgSchema.schemaName} WHERE ${ImgSchema.schema.shoe_id.name} = @${ImgSchema.schema.shoe_id.name} AND ${ImgSchema.schema.img.name} = @${ImgSchema.schema.img.name})`;
    let result = await request.query(query);
    return result.recordsets;
}
exports.deleteByShoeId = async (shoe_id) => {
    if (!dbConfig.db.pool) {
        throw new Error('Not connected to db');
    }

    let result = await dbConfig.db.pool
        .request()
        .input(ImgSchema.schema.shoe_id.name, ImgSchema.schema.shoe_id.sqlType, shoe_id)
        .query(`delete ${ImgSchema.schemaName} where ${ImgSchema.schema.shoe_id.name} = @${ImgSchema.schema.shoe_id.name}`);

    // console.log(result);
    return result.recordsets[0];
}