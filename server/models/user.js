const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: String,
  type: String,
  performanceList: Array, // includes score and feedback
  accessibleList: Array
})

module.exports = mongoose.model('User', UserSchema)
