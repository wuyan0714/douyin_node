const mongoose = require('mongoose')
let videoSchema = new mongoose.Schema(
  {
    //  user _id
    author: {type: mongoose.Types.ObjectId, ref: 'user', required: true},
    description: {type: String, required: true, maxlength: 30},
    tagList: [{type: String}],
    imgUrl: {type: String},
    videoUrl: {type: String, require: true},
    song: {type: String},
    createdAt: {type: String},
    updatedAt: {type: String},
    like: {type: Number, default: 0},
    comment: {type: Number, default: 0},
    share: {type: Number, default: 0},
  }
)
let Video = mongoose.model('video', videoSchema)
module.exports = Video
