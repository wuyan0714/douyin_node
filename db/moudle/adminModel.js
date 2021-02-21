let mongoose = require('mongoose')
let adminSchema = new mongoose.Schema(
  {
    name: {type: String, unique: true},
    password: String
  }
)
let Admin = mongoose.model('admin', adminSchema)
module.exports = Admin