const jwt = require('jsonwebtoken')
const Admin = require('../db/moudle/adminModel');

// 鉴权中间件
const auth = async (req, res, next) => {
    try{
      let token = String(req.headers.authorization || '')
      let {_id} = jwt.verify(token, 'douyin') 
      let admin = await Admin.findById(_id)
      if(!admin){
        res.status(422).json({error: '授权失败'})
      }else{
        next()
      }
    }catch{
        res.status(422).json({error: '授权失败'})
    }
  }

module.exports = auth