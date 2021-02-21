const mongoose = require('mongoose')
let commentSchema = new mongoose.Schema({
  live: {type: mongoose.Types.ObjectId, index: true, require},
  // author: {type: mongoose.Types.ObjectId, ref: 'user'},
  commentList: [{type: String}],
  // content: String,
  // createdAt: {type: String},
})
let Comment = mongoose.model('comment', commentSchema)
module.exports = Comment