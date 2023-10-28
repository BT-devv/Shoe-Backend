const dbConfig = require('../config/dbconfig')
const ReviewSchema = require('../models/Review')
const dbUtils = require('../config/utils/dbUtils')
const StaticData = require('../config/utils/StaticData')

exports.getAllReviews = async (filter) => {
    if (!dbConfig.db.pool) {
      throw new Error('Not connected to db');
    }
  
    let query = `SELECT * from ${ReviewSchema.schemaName}`
    let countQuery = `SELECT COUNT(DISTINCT ${ReviewSchema.schema.id.name}) as totalItem from ${ReviewSchema.schemaName}`
  
    const page = filter.page * 1 || 1
    let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE
    if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
      pageSize = StaticData.config.MAX_PAGE_SIZE
    }
  
    const {filterStr,paginationStr} = dbUtils.getFilterQuery(ReviewSchema.schema, filter,page ,pageSize, ReviewSchema.defaultSort)
    if (filterStr){
      query += ' ' + filterStr
      countQuery += ' ' + filterStr
    }
  
    if (paginationStr){
      query += ' ' + paginationStr
    }
    let result = await dbConfig.db.pool.request().query(query)
    let countResult = await dbConfig.db.pool.request().query(countQuery)
  
    let totalItem = 0
    if (countResult.recordsets[0].length > 0) {
      totalItem = countResult.recordsets[0][0].totalItem
    }
    let totalPage = Math.ceil(totalItem/pageSize) //round up
    return {
      page,
      pageSize,
      totalPage,
      totalItem,
      reviews: result.recordsets[0]
    }
}
  
exports.getReview = async (id) => {
    if (!dbConfig.db.pool) {
      throw new Error('Not connected to db')
    }
    let result = await dbConfig.db.pool
        .request()
        .input(ReviewSchema.schema.id.name, ReviewSchema.schema.id.sqlType, id)
        .query(`SELECT * from ${ReviewSchema.schemaName} where ${ReviewSchema.schema.id.name} = @${ReviewSchema.schema.id.name}`)
  
    if (result.recordsets[0].length > 0) {
      return result.recordsets[0][0]
    }
    return null
}
  
exports.createReview = async  (review) => {
  if (!dbConfig.db.pool) {
    throw new Error('Not connected to db')
  }
  let now = new Date()
  review.createdAt = now.toISOString()

  let insertData = ReviewSchema.validateData(review)

  // console.log(insertData);
  let query = `insert into ${ReviewSchema.schemaName}`

  const {request, insertFieldNamesStr,insertValuesStr} = dbUtils.getInsertQuery(ReviewSchema.schema, dbConfig.db.pool.request(), insertData)
  if (!insertFieldNamesStr || !insertValuesStr){
    throw new Error('Invalid insert param')
  }

  query += ' (' + insertFieldNamesStr + ') values (' + insertValuesStr + ')'
  console.log(query)

  let result = await request.query(query)
  return result.recordsets
}

exports.updateReview = async (id,review) =>{
  if (!dbConfig.db.pool) {
    throw new Error('Not connected to db')
  }
  if(!review){
    throw new Error('Invalid update param')
  }

  let query = `update ${ReviewSchema.schemaName} set`
  const {request,updateStr} = dbUtils.getUpdateQuery(ReviewSchema.schema, dbConfig.db.pool.request(), review)
  if (!updateStr ){
    throw new Error('Invalid update param')
  }
  request.input(ReviewSchema.schema.id.name,ReviewSchema.schema.id.sqlType, id)
  query += ' ' + ` ${updateStr}` + ` where ${ReviewSchema.schema.id.name} = @${ReviewSchema.schema.id.name}`
  
  let result = await request.query(query)

  return result.recordsets
}

exports.deleteReview = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error('Not connected to db')
  }
  let result = await dbConfig.db.pool
  .request()
  .input(ReviewSchema.schema.id.name, ReviewSchema.schema.id.sqlType, id)
  .query(`delete ${ReviewSchema.schemaName} where ${ReviewSchema.schema.id.name} = @${ReviewSchema.schema.id.name}`)
  return result.recordsets
}

exports.deleteOrderbyUserId = async (userId) =>{
  if (!dbConfig.db.pool) {
    throw new Error('Not connected to db')
  }
  let result = await dbConfig.db.pool
  .request()
  .input(ReviewSchema.schema.userId.name, ReviewSchema.schema.userId.sqlType, userId)
  .query(`delete ${ReviewSchema.schemaName} where ${ReviewSchema.schema.userId.name} = @${ReviewSchema.schema.userId.name}`)
  return result.recordsets
}