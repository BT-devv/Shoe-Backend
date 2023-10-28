const dbConfig = require('../config/dbconfig')
const ShoeSchema = require('../models/Shoes')
const dbUtils = require('../config/utils/dbUtils')
const StaticData = require('../config/utils/StaticData')

const SizeDao = require('./SizeDAO')
const ImgDao = require('./ImgDAO')

async function setShoeInfo(shoe){
    const images = await ImgDao.getByShoeId(shoe.id)
    const size = await SizeDao.getByShoeId(shoe.id)
    shoe.images = images
    shoe.size = size
    return shoe
}

exports.getAllShoes = async (filter) => {
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let query = `SELECT * from ${ShoeSchema.schemaName}`
    let countQuery = `SELECT COUNT(DISTINCT ${ShoeSchema.schema.id.name}) as totalItem from ${ShoeSchema.schemaName}`

    const page = filter.page * 1 || 1;
    let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
    if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
        pageSize = StaticData.config.MAX_PAGE_SIZE;
    }
    const {filterStr, paginationStr} = dbUtils.getFilterQuery(ShoeSchema.schema, filter, page, pageSize, ShoeSchema.defaultSort);

    if (filterStr){
        query += ' ' + filterStr;
        countQuery += ' ' + filterStr;
    }

    if (paginationStr){
        query += ' ' + paginationStr;
    }
    // console.log(query);
    const result = await dbConfig.db.pool.request().query(query);
    let countResult = await dbConfig.db.pool.request().query(countQuery);

    let totalItem = 0;
    if (countResult.recordsets[0].length > 0) {
        totalItem = countResult.recordsets[0][0].totalItem;
    }
    let totalPage = Math.ceil(totalItem/pageSize); //round up

    const shoes = result.recordsets[0];
    for (let i = 0 ; i < shoes.length; i++){
        const shoe = shoes[i];
        await setShoeInfo(shoes);
    }

    return {
        page,
        pageSize,
        totalPage,
        totalItem,
        shoes: shoes
    };
}

exports.getShoeById = async (id) => {
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let request = dbConfig.db.pool.request();
    let result = await request
        .input(ShoeSchema.schema.id.name, ShoeSchema.schema.id.sqlType, id)
        .query(`select * from ${ShoeSchema.schemaName} where ${ShoeSchema.schema.id.name} = @${ShoeSchema.schema.id.name}`);
    let shoe = result.recordsets[0][0];
    if(shoe){
        shoe = setShoeInfo(shoe);
    }
    // console.log(result);
    return shoe;
}

exports.getShoeByName = async (name) => {
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let request = dbConfig.db.pool.request();
    let result = await request
        .input(ShoeSchema.schema.name.name, ShoeSchema.schema.name.sqlType, name)
        .query(`select * from ${ShoeSchema.schemaName} where ${ShoeSchema.schema.name.name} = @${ShoeSchema.schema.name.name}`);
    // console.log(result);
    return result.recordsets[0][0];
}

exports.createShoe = async (shoe) =>{
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db')
    }
    if (!shoe){
        throw new Error('Invalid input param')
    }
    let now = new Date()
    shoe.createAt = now.toISOString()
    let insertData = ShoeSchema.validateData(shoe)
    let query = `insert into ${ShoeSchema.schemaName}`
    const {request, insertFieldNamesStr,insertValuesStr} = dbUtils.getInsertQuery(ShoeSchema.schema, dbConfig.db.pool.request(), insertData)

    query += ' (' + insertFieldNamesStr + ') values (' + insertValuesStr + ')'

    let result = await request.query(query)
    
    return result.recordsets
}

exports.updateShoe = async (id, updateShoe) => {
    if (!dbConfig.db.pool) {
      throw new Error('Not connected to db')
    }
  
    if (!updateShoe){
      throw new Error('Invalid update param')
    }
  
    let query = `update ${ShoeSchema.schemaName} set`
    const {request,updateStr} = dbUtils.getUpdateQuery(ShoeSchema.schema, dbConfig.db.pool.request(), updateShoe)

    if (!updateStr){
      throw new Error('Invalid update param')
    }
    request
    .input(ShoeSchema.schema.id.name, ShoeSchema.schema.id.sqlType, id)

    query += ' ' + updateStr + ` where ${ShoeSchema.schema.id.name} = @${ShoeSchema.schema.id.name}`

    let result = await request.query(query)

    return result.recordsets
}

exports.deleteShoe = async (id) => {
    if (!dbConfig.db.pool) {
        throw new Error('Not connected to db')  
    }
    let result = await dbConfig.db.pool
    .request()
    .input(ShoeSchema.schema.id.name, ShoeSchema.schema.id.sqlType, id)
    .query(`delete ${ShoeSchema.schemaName} where ${ShoeSchema.schema.id.name} = @${ShoeSchema.schema.id.name}`);
    return result.recordsets;
}