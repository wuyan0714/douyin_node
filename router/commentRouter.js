const express = require('express')
const router = express.Router()
const jsonRes = require('../utils/jsonRes')
const Comment = require('../db/moudle/commentModel')
const auth = require('../middleware/auth')

async function findAllComments () {
  return Comment.find({}, ['_id', 'live', 'content'])
}

//查询所有评论
router.get('/list', async (req, res) => {
  let comments = await findAllComments()
  // res.json(jsonRes(0, '', users))
  res.json(comments)
})

//获取某直播评论
router.get('/liveList', async (req, res) => {
  let {live} = req.query
  if (!live) return res.status(404).json({error: "无live_id"})
  if (live) {
    let comments = await Comment.find({live}, ['_id','live', 'content'])
    res.json(comments)
  }
})

///添加评论
router.post('/add', auth, async (req, res) => {
  try{
    let {live, content} = req.body
    let data = await Comment.insertMany({
        live,
        content,
    })
    res.end()
  }catch{
    res.status(422).json({error: "live_id不正确"})
  }
})

// 清除评论
router.post('/delete', auth, async (req, res) => {
  let {_id} = req.body
  if (!_id) return res.status(404).json({error: "无_id"})
  await Comment.findByIdAndDelete(_id)
  res.end()
})

//获取评论
router.get('/get', async (req, res) => {
  let {_id} = req.query
  if (!_id) return res.status(404).json({error: "无_id"})
  if (_id) {
    let comment = await Comment.findById(_id, ['_id','live', 'content'])
    res.json(comment)
  }
})

//修改评论
router.post('/update', auth, async (req, res) => {
  try{
    let {_id, content} = req.body
    await Comment.findByIdAndUpdate(_id, {content})
    res.end()
  }catch{
    res.status(422).json({error: '信息填写错误'})
  }
})


module.exports = router