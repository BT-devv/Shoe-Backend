const express = require('express')
const morgan = require('morgan')
const connectionDatabase = require('./src/config/server')

const app = express()
const dotenv = require('dotenv')
dotenv.config({
    path: './src/config/config.env'
})

const userRouter = require('./src/routes/users.route')
const shoeRouter = require('./src/routes/shoes.route')
const reviewRouter = require('./src/routes/review.route')
const orderRouter = require('./src/routes/order.route')

app.use(morgan('combine'))
//custom middleware
app.use((req, res, next) => {
    const date = new Date().toISOString()
    req.requestTime = date
    next()
});

//using express.json middleware -> stand between req and res 
app.use(express.json());

//Connection Database
connectionDatabase()

//Router
app.use('/api/user',userRouter)
app.use('/api/shoe',shoeRouter)
app.use('/api/review',reviewRouter)
app.use('/api/order',orderRouter)

//listen port
const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server Running on port ${PORT} http://localhost:${PORT}`)
})
