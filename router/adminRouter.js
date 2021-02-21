const express = require('express');
const router = express.Router();
const hmac = require('../utils/hmac');
const Admin = require('../db/moudle/adminModel');
const jwt = require('jsonwebtoken');

//初始化添加默认管理员账号密码
(async function init () {
  let admins = await Admin.find()
  if (!admins.length) {
    let admin = new Admin({name: 'admin', password: hmac('123456')})
    await admin.save()
  }
})()

//登录
router.post('/login', async (req, res) => {
  let {name, password} = req.body
  password = await hmac(password)
  let admin = await Admin.findOne({name})
  if (!admin) {
    res.status(422).json({error: '邮箱未注册'})
  } 
  else if (password !== admin.password) {
    res.status(422).json({error: '密码错误'})
  } 
  else {
    token = jwt.sign({_id: admin._id},'douyin')
    res.send({token})
  }
})

router.get('/isLogin', async (req, res) => {
  
  try{
    let token = String(req.headers.authorization || '')
    let {_id} = jwt.verify(token, 'douyin') 
    let admin = await Admin.findById(_id)
    if(!admin){
      res.send({isLogin: false})
    }else{
      res.send({isLogin: true})
    }
  }catch{
    res.send({isLogin: false})
  }
  
})

module.exports = router