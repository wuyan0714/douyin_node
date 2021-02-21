const express = require('express')
const jsonRes = require('../utils/jsonRes')
const router = express.Router()
const User = require('../db/moudle/userModel')
const fs = require('fs')
const hmac = require('../utils/hmac')

async function findAllUsers () {
  return User.find({}, ['_id', 'email', 'nick','headUrl'])
}

//查询所有用户
router.get('/list', async (req, res) => {
  let users = await findAllUsers()
  // res.json(jsonRes(0, '', users))
  res.json(users)
})

//添加用户
router.post('/add', async (req, res) => {
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
router.post('/delete', async (req, res) => {
  let {_id} = req.body
  if (!_id) return res.status(404).json({error: "无_id"})
  await User.findByIdAndDelete(_id)
  res.end()
})

//获取用户信息 get
router.get('/get', async (req, res) => {
  let {_id} = req.query
  if (!_id) return res.status(404).json({error: "无_id"})
  if (_id) {
    let user = await User.findById(_id, ['_id','nick', 'headUrl','email'])
    res.json(user)
  }
})

/* ******************************************************** */
//登录
router.post('/login', async (req, res) => {
  let {email, password} = req.body
  password = await hmac(password)
  let user = await User.findOne({email})
  if (!user) {
    res.json(jsonRes(-1, '邮箱未注册'))
  } else if (password !== user.password) {
    res.json(jsonRes(-2, '密码错误'))
  } else {
    //登陆成功后将相关信息存入session中
    req.session.login = true
    res.json(jsonRes(0, '登录成功', user))
  }
})
//退出
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.json(jsonRes(0, '退出成功'))
})
//是否登录
router.get('/isLogin', (req, res) => {
  if (req.session.login) {
    res.json(jsonRes(0, '已登录'))
  } else res.json(jsonRes(-1, '未登录'))
})

//获取用户头像
router.get('/headUrl', async (req, res) => {
  let {_id} = req.query
  if (!_id) return res.json(jsonRes(-1, '无id'))
  let user = await User.findById(_id, ['nick', 'headUrl', 'attentionList'])
  res.json(jsonRes(0, '', user))
})

//修改用户信息 put
router.post('/update', async (req, res) => {
  let {_id,nick,headUrl} = req.body
  if (!_id) return res.json(jsonRes(-1, '无id'))
  //签名
  if (_id && sign) {
    await User.findByIdAndUpdate(_id, {sign})
    let user = await User.findById(_id, ['nick', 'headUrl', 'sex', 'sign', 'sex', 'fansCount'])
    res.json(jsonRes(0, '', user))
  } else {
    res.json(jsonRes(-1, '缺少关键字段'))
  }
  //昵称
  if (_id && nick) {
    if (headUrl) {
      let avatarName = headUrl.split('/').pop()
      //从临时文件移到avatar
      const readable = fs.createReadStream('upload/temp/' + avatarName);
      const writable = fs.createWriteStream('upload/avatar/' + avatarName);
      readable.pipe(writable);
      fs.unlinkSync('upload/temp/' + avatarName)
      let user = await User.findById(_id)
      let index = user.headUrl.indexOf('icon.png')
      // let index = user.headUrl.indexOf('jpg')
      if (index === -1) {
        let oldName = user.headUrl.split('/').pop()
        fs.unlinkSync('upload/avatar/' + oldName)
      }
      user.headUrl = '/res/avatar/' + avatarName
      user.nick = nick
      user.sex = sex
      await user.save()
    } else {
      await User.findByIdAndUpdate(_id, {nick, sex})
    }
  }
})

//获取邮箱
router.get('/email', async (req, res) => {
  let {_id} = req.query
  if (!_id) return res.json(jsonRes(-1, '无id'))
  let result = await User.findById(_id, 'email')
  res.json(jsonRes(0, '', result))
})
module.exports = router
