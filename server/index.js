const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

mongoose.connect('mongodb://localhost:27017/user', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'DB connection error:'))
db.once('open', () => console.log('DB connection successful'))

const userRouter = require('./routes/user')
app.use(cors())
app.use('/user', userRouter)

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
