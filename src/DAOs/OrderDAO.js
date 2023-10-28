const dbConfig = require('../config/dbconfig')
const OrderSchema = require('../models/Order')
const dbUtils = require('../config/utils/dbUtils')
const StaticData = require('../config/utils/StaticData')

exports.getAllOrder = async (filter) =>{
    if (!dbConfig.db.pool) {
      throw new Error('Not connected to db');
    }
  
    let query = `SELECT * from ${OrderSchema.schemaName}`
    let countQuery = `SELECT COUNT(DISTINCT ${OrderSchema.schema.id.name}) as totalItem from ${OrderSchema.schemaName}`
  
    const page = filter.page * 1 || 1;
    let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
    if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
      pageSize = StaticData.config.MAX_PAGE_SIZE;
    }
  
    const {filterStr,paginationStr} = dbUtils.getFilterQuery(OrderSchema.schema, filter,page ,pageSize, OrderSchema.defaultSort);
    if (filterStr){
      query += ' ' + filterStr;
      countQuery += ' ' + filterStr;
    }
  
    if (paginationStr){
      query += ' ' + paginationStr;
    }
    // console.log(query);
    let result = await dbConfig.db.pool.request().query(query);
    let countResult = await dbConfig.db.pool.request().query(countQuery);
  
    let totalItem = 0;
    if (countResult.recordsets[0].length > 0) {
      totalItem = countResult.recordsets[0][0].totalItem;
    }
    let totalPage = Math.ceil(totalItem/pageSize); //round up
    return {
      page,
      pageSize,
      totalPage,
      totalItem,
      order: result.recordsets[0]
    };
}
  
exports.getOrder = async (id) =>{
    if (!dbConfig.db.pool) {
      throw new Error('Not connected to db');
    }
    let result = await dbConfig.db.pool
        .request()
        .input(OrderSchema.schema.id.name, OrderSchema.schema.id.sqlType, id)
        .query(`SELECT * from ${OrderSchema.schemaName} where ${OrderSchema.schema.id.name} = @${OrderSchema.schema.id.name}`);
  
    if (result.recordsets[0].length > 0) {
      return result.recordsets[0][0];
    }
    return null;
}
  
exports.updateOrder = async (id,order) =>{
    if (!dbConfig.db.pool) {
      throw new Error('Not connected to db')
    }
    if(!order){
      throw new Error('Invalid update param')
    }
  
    let query = `update ${OrderSchema.schemaName} set`
    const {request,updateStr} = dbUtils.getUpdateQuery(OrderSchema.schema, dbConfig.db.pool.request(), order)
    if (!updateStr ){
      throw new Error('Invalid update param')
    }
    request.input(OrderSchema.schema.id.name,OrderSchema.schema.id.sqlType, id)
    query += ' ' + ` ${updateStr}` + ` where ${OrderSchema.schema.id.name} = @${OrderSchema.schema.id.name}`
    
    let result = await request.query(query)
  
    return result.recordsets
}

exports.createOrder = async  (order) => {
  if (!dbConfig.db.pool) {
    throw new Error('Not connected to db')
  }
  let now = new Date();
  order.createdAt = now.toISOString()

  let insertData = OrderSchema.validateData(order)

  let query = `insert into ${OrderSchema.schemaName}`

  const {request, insertFieldNamesStr,insertValuesStr} = dbUtils.getInsertQuery(OrderSchema.schema, dbConfig.db.pool.request(), insertData)
  if (!insertFieldNamesStr || !insertValuesStr){
    throw new Error('Invalid insert param')
  }

  query += ' (' + insertFieldNamesStr + ') values (' + insertValuesStr + ')'
  console.log(query)

  let result = await request.query(query)
  return result.recordsets
} 

exports.deleteOrder = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error('Not connected to db')
  }
  let result = await dbConfig.db.pool
  .request()
  .input(OrderSchema.schema.id.name, OrderSchema.schema.id.sqlType, id)
  .query(`delete ${OrderSchema.schemaName} where ${OrderSchema.schema.id.name} = @${OrderSchema.schema.id.name}`);
  return result.recordsets;
}

exports.deleteOrderbyUserId = async (userid) =>{
  if (!dbConfig.db.pool) {
    throw new Error('Not connected to db')
  }
  let result = await dbConfig.db.pool
  .request()
  .input(OrderSchema.schema.userid.name, OrderSchema.schema.userid.sqlType, userid)
  .query(`delete ${OrderSchema.schemaName} where ${OrderSchema.schema.userid.name} = @${OrderSchema.schema.userid.name}`);
  return result.recordsets;
}