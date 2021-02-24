const express = require('express')
const jsonRes = require('../utils/jsonRes')
const router = express.Router()
const User = require('../db/moudle/userModel')
const fs = require('fs')
const hmac = require('../utils/hmac')
const auth = require('../middleware/auth')

async function findAllUsers () {
  return User.find({}, ['_id', 'email', 'nick','headUrl'])
}

//查询所有用户
router.get('/list', async (req, res) => {
  let users = await findAllUsers()
  res.json(users)
})

//添加用户
router.post('/add', auth, async (req, res) => {
  let {email, password, nick, headUrl} = req.body
  try {
    password = hmac(password)
    await User.insertMany({email, password, nick, headUrl})
    res.end()
  } catch (e) {
    res.status(404).json({error: "添加失败"})
  }
})

// 删除用户
router.post('/delete', auth, async (req, res) => {
  let {_id} = req.body
  if (!_id) return res.status(404).json({error: "无_id"})
  await User.findByIdAndDelete(_id)
  res.end()
})

//获取用户信息
router.get('/get', async (req, res) => {
  let {_id} = req.query
  if (!_id) return res.status(404).json({error: "无_id"})
  if (_id) {
    let user = await User.findById(_id, ['_id','nick', 'headUrl','email'])
    res.json(user)
  }
})

module.exports = router
