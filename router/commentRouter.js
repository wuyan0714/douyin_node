const express = require('express')
const router = express.Router()
const jsonRes = require('../utils/jsonRes')
const Comment = require('../db/moudle/commentModel')

async function findAllComments () {
  return Comment.find({}, ['_id', 'live', 'commentList'])
}

//查询所有评论
router.get('/list', async (req, res) => {
  let comments = await findAllComments()
  // res.json(jsonRes(0, '', users))
  res.json(comments)
})

//添加评论
router.post('/add', async (req, res) => {
  try{
    let {live, msg} = req.body
    let comment = await Comment.find({live})[0]
    if(!comment){
      let commentList = [msg]
      let data = await Comment.insertMany({
          live: live,
          commentList: commentList,
      })
      res.end()
    }else{
      comment.commentList.push(msg)
      comment.save()
      res.end()
    }
  }catch{
    res.status(422).json({error: "live_id不正确"})
  }
})

// 清除评论
router.post('/delete', async (req, res) => {
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
    let comment = await Comment.findById(_id, ['_id','live', 'commentList'])
    res.json(comment)
  }
})

//修改评论
router.post('/update', async (req, res) => {
  try{
    let {_id, commentList} = req.body
    await Comment.findByIdAndUpdate(_id, {commentList})
    res.end()
  }catch{
    res.status(422).json({error: '信息填写错误'})
  }
})

module.exports = router