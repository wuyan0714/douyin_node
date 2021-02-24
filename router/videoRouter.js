const express = require('express')
const fs = require('fs')
const router = express.Router()
const jsonRes = require('../utils/jsonRes')
const Video = require('../db/moudle/videoModel')
const User = require('../db/moudle/userModel')
const auth = require('../middleware/auth')
const moment = require('moment')

async function findAllVideos () {
  let videos_obj = Video.find({}, ['_id','author', 'description','tagList', 'imgUrl', 'videoUrl', 'song', 'createdAt', 'updatedAt', 'like', 'comment','share']).populate('author', ['nick', 'headUrl'])
  return videos_obj.map((videos)=>{
    return videos.map((video)=>{
      let video_copy = JSON.parse(JSON.stringify(video))
      video_copy["author_id"] = video.author._id
      video_copy["author_nick"] = video.author.nick
      video_copy["author_avatar"] = video.author.headUrl
      delete video_copy.author
      return video_copy
    })  
  })
}

async function findPageVideos (limit, offset) {
  let videos_obj = Video.find({}, ['_id','author', 'description','tagList', 'imgUrl', 'videoUrl', 'song', 'createdAt', 'updatedAt', 'like', 'comment','share']).populate('author', ['nick', 'headUrl']).limit(limit).skip(offset)
  return videos_obj.map((videos)=>{
    return videos.map((video)=>{
      let video_copy = JSON.parse(JSON.stringify(video))
      video_copy["author_id"] = video.author._id
      video_copy["author_nick"] = video.author.nick
      video_copy["author_avatar"] = video.author.headUrl
      delete video_copy.author
      return video_copy
    })  
  })
}

//查询某页视频
router.get('/list', async (req, res) => {
  try{
    let {limit, offset} = req.query
    let allVideos = await findAllVideos()
    let videos = await findPageVideos(limit, offset)
    res.status(200).send({
      total: allVideos.length,
      count: videos.length,
      videos
    })
  }catch{
    res.status(500).json({error: '输入有误'})
  }
})

//添加视频
router.post('/add', auth, async (req, res) => {
  let {author, description, tagList, imgUrl, videoUrl, song} = req.body
  if (author && description && tagList && videoUrl &&song) {
    let data = await Video.insertMany({
      author,
      description,
      tagList,
      imgUrl,
      videoUrl,
      song,
      createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    })
    res.end()
  } else {
    res.status(404).json({error: "缺少必要信息,添加失败"})
  }
})

// 删除视频
router.post('/delete', auth, async (req, res) => {
  let {_id} = req.body
  if (!_id) return res.status(404).json({error: "无_id"})
  await Video.deleteOne({_id})
  res.end()
})

//获取视频
router.get('/get', async (req, res) => {
  let {_id} = req.query
  if (!_id) return res.status(404).json({error: "无_id"})
  if (_id) {
    let video = await Video.findById(_id).populate('author', ['nick', 'headUrl'])
    let video_copy = JSON.parse(JSON.stringify(video))
    video_copy["author_id"] = video.author._id
    video_copy["author_nick"] = video.author.nick
    video_copy["author_avatar"] = video.author.headUrl
    delete video_copy.author
    res.status(200).json(video_copy)
  }
})

//点赞
router.post('/like', async (req, res) => {
  let {_id} = req.body
  let video = await Video.findById(_id)
  video.like++
  await video.save()
  res.end()
})

//修改视频信息
router.post('/update', auth, async (req, res) => {
  try{
    let {_id, description, tagList, song, like, comment, share} = req.body
    await Video.findByIdAndUpdate(_id, {description, tagList, song, like, comment, share, updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')})
    res.end()
  }catch{
    res.status(422).json({error: '信息填写错误'})
  }
})

module.exports = router
