const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.use(express.json())

router.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

router.get('/:userID', (req, res) => {
  User.findById(req.params.userID, (err, user) => {
    if (err) { console.log('error') }
    res.send(user)
  })
})

router.post('/', async (req, res) => {
  const {
    name,
    type,
    performanceList,
    assignedList
  } = req.body
  const user = new User({
    name,
    type,
    performanceList,
    assignedList
  })

  const savedUser = await user.save()
  res.json(savedUser)
})

router.patch('/:userID', async (req, res) => {
  const user = await User.updateOne(
    { _id: req.params.userID },
    { $set: req.body }
  )
  res.send(user)
})

router.delete('/:userID', async (req, res) => {
  const user = await User.deleteOne({ _id: req.params.userID })
  res.send(user)
})

module.exports = router
