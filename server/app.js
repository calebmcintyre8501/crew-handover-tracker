const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const handoverRoutes = require('./routes/handovers')
const personnelRoutes = require('./routes/personnel')
const updateRoutes = require('./routes/updates')
const acknowledgmentRoutes = require('./routes/acknowledgments')
const sessionRoutes = require('./routes/session')

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api/handovers', handoverRoutes)
app.use('/api/personnel', personnelRoutes)
app.use('/api/updates', updateRoutes)
app.use('/api/acknowledgments', acknowledgmentRoutes)
app.use('/api/session', sessionRoutes)

module.exports = app