const mongoose = require('mongoose')
const {BASE_URL,DEFAULT_NICK, DEFAULT_SIGN, DEFAULT_HEAD} = require('../../utils/config')
let userSchema = new mongoose.Schema({
  email: {type: String, unique: true},
  password: {type: String, required: true},
  nick: {type: String, default: DEFAULT_NICK, maxlength: 14},
  headUrl: {type: String, default: BASE_URL+DEFAULT_HEAD}
})
let User = mongoose.model('user', userSchema)
module.exports = User
