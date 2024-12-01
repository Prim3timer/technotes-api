require('dotenv').config()
// having this required, we really do not need the asyncHandler function
// however i have the functin in this project
require('express-async-errors')
const express = require('express')
const app = express()
const path = require('path')
const {logger} = require('./middleware/logger')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const errorHandler = require('./middleware/errorHandler')
const {logEvents} = require('./middleware/logger')
const PORT = process.env.PORT || 5000
const authRouter = require('./routes/authRoutes')
const usersRouter = require('./routes/userRoutes')
const notesRouter = require('./routes/noteRoutes')

console.log(process.env.NODE_ENV)

// to generate access and refresh tokens, we use:
// require('crypto').randomBytes(64).toString('hex')
// and then we store them in the dotenv file.

connectDB()

app.use(logger)

app.use(cors(corsOptions))

// middleware for json files
app.use(express.json())

app.use(cookieParser())

// telling express where to find statice files eg css and image
// express.static is a middleware
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))  

app.use('/auth', authRouter)    
app.use('/users', usersRouter )
app.use('/notes', notesRouter)

app.all('*', (req, res)=> {
    res.status(404)
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')){
        res.json({message: '404 not found'})
    }else {
        res.type('txt').send('404 not found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', ()=> {
    console.log('connected to mongoDB')
    app.listen(PORT, ()=> console.log(`Server runnning on port ${PORT}`))
})

 
mongoose.connection.on('error', (error) => {
    console.log(error)
    logEvents(`${error.no}: ${error.code}\t ${error.syscall}\t${error.hostname}`,
        'mongoErrLog.log'
    )
})