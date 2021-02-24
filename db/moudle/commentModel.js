const mongoose = require('mongoose')
let commentSchema = new mongoose.Schema({
  live: {type: mongoose.Types.ObjectId, index: true, require},
  content: String,
})
let Comment = mongoose.model('comment', commentSchema)
module.exports = Comment