const fs = require('fs')
const express = require('express')
const router = express.Router()
const jsonRes = require('../utils/jsonRes')
const Live = require('../db/moudle/liveModel')
const User = require('../db/moudle/userModel')
const moment = require('moment')
const auth = require('../middleware/auth')
const {BASE_URL,PUBLISH_URL,PLAY_URL,DEFAULT_NICK, DEFAULT_SIGN, DEFAULT_HEAD} = require('../utils/config')

async function findAllTrueLives () {
  let lives_obj =  Live.find({living: true}, ['_id','author', 'description','publishUrl', 'playUrl', 'living','createdAt','updatedAt']).populate('author', ['nick', 'headUrl'])
  return lives_obj.map((lives)=>{
    return lives.map((live)=>{
      let live_copy = JSON.parse(JSON.stringify(live))
      live_copy["author_id"] = live.author._id
      live_copy["author_nick"] = live.author.nick
      live_copy["author_avatar"] = live.author.headUrl
      delete live_copy.author
      return live_copy
    })  
  })
}

async function findPageTrueLives (limit, offset) {
  let lives_obj =  Live.find({living: true}, ['_id','author', 'description','publishUrl', 'playUrl', 'living','createdAt','updatedAt']).populate('author', ['nick', 'headUrl']).limit(limit).skip(offset)
  return lives_obj.map((lives)=>{
    return lives.map((live)=>{
      let live_copy = JSON.parse(JSON.stringify(live))
      live_copy["author_id"] = live.author._id
      live_copy["author_nick"] = live.author.nick
      live_copy["author_avatar"] = live.author.headUrl
      delete live_copy.author
      return live_copy
    })  
  })
}

async function findAllLives () {
  let lives_obj =  Live.find({}, ['_id','author', 'description','publishUrl', 'playUrl', 'living','createdAt','updatedAt']).populate('author', ['nick', 'headUrl'])
  return lives_obj.map((lives)=>{
    return lives.map((live)=>{
      let live_copy = JSON.parse(JSON.stringify(live))
      live_copy["author_id"] = live.author._id
      live_copy["author_nick"] = live.author.nick
      live_copy["author_avatar"] = live.author.headUrl
      delete live_copy.author
      return live_copy
    })  
  })
}

async function findPageLives (limit, offset) {
  let lives_obj =  Live.find({}, ['_id','author', 'description','publishUrl', 'playUrl', 'living','createdAt','updatedAt']).populate('author', ['nick', 'headUrl']).limit(limit).skip(offset)
  return lives_obj.map((lives)=>{
    return lives.map((live)=>{
      let live_copy = JSON.parse(JSON.stringify(live))
      live_copy["author_id"] = live.author._id
      live_copy["author_nick"] = live.author.nick
      live_copy["author_avatar"] = live.author.headUrl
      delete live_copy.author
      return live_copy
    })  
  })
}

//查询开播的直播
router.get('/list', async (req, res) => {
  try{
    let {limit, offset} = req.query
    let allLives = await findAllTrueLives()
    let lives = await findPageTrueLives(limit, offset)
    res.status(200).send({
      total: allLives.length,
      count: lives.length,
      lives
    })
  }catch{
    res.status(500).json({error: '输入有误'})
  }
})

//查询所有的直播
router.get('/allList', async (req, res) => {
  try{
    let {limit, offset} = req.query
    let allLives = await findAllLives()
    let lives = await findPageLives(limit, offset)
    res.status(200).send({
      total: allLives.length,
      count: lives.length,
      lives
    })
  }catch{
    res.status(500).json({error: '输入有误'})
  }
})

//添加直播
router.post('/add', auth, async (req, res) => {
  try{
    let {author} = req.body
    if (!author) return res.status(404).json({error: "无author_id"})
    let lives = await Live.find({author})
    if(lives.length===0){
      let result = await User.findById(author)
      let nick = result.nick
      let live = await Live.insertMany({
        author, 
        publishUrl: `${PUBLISH_URL}/live/${author}`, 
        playUrl: `${PLAY_URL}/live/${author}/index.m3u8`, 
        description: `${nick}的直播间`,
        createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        living: true
      })
      res.end()
    }else{
      res.status(422).json({error: "该用户直播已存在"})
    }
  }catch{
    res.status(404).json({error: "添加失败"})
  }
})

// 删除直播
router.post('/delete', auth, async (req, res) => {
  let {_id} = req.body
  if (!_id) return res.status(404).json({error: "无_id"})
  await Live.deleteOne({_id})
  // 删除文件
  res.end()
})

//获取直播
router.get('/get', async (req, res) => {
  let {_id} = req.query
  if (!_id) return res.status(404).json({error: "无_id"})
  if (_id) {
    let live = await Live.findById(_id).populate('author', ['nick', 'headUrl'])
    let live_copy = JSON.parse(JSON.stringify(live))
    live_copy["author_id"] = live.author._id
    live_copy["author_nick"] = live.author.nick
    live_copy["author_avatar"] = live.author.headUrl
    delete live_copy.author
    res.status(200).json(live_copy)
  }
})

//修改直播
router.post('/update', auth, async (req, res) => {
  try{
    let {_id, description, living, publishUrl,playUrl} = req.body
    if(publishUrl){
      await Live.findByIdAndUpdate(_id, {publishUrl,updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')})
    }
    if(playUrl){
      await Live.findByIdAndUpdate(_id, {playUrl,updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')})
    }
    if(description){
      await Live.findByIdAndUpdate(_id, {description,updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')})
    }
    if(typeof(living)=='boolean'){
      await Live.findByIdAndUpdate(_id, {living,updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')})
    }
    res.end()
  }catch{
    res.status(422).json({error: '信息填写错误'})
  }
})

module.exports = router