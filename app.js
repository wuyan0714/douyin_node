'use strict'
const express = require('express')
// const session = require('express-session')
const path = require('path')
const cors = require('cors')
const logger = require('./utils/logger')
const app = express()
require('./server/nms')
require('./server/ws')
require('./server/ws_zan')
require('./db/connect')

app.use(cors())

//静态文件路径
app.use('/res', express.static(path.join(__dirname, './upload'), {
  maxAge: '1y',
  etag: false
}))

// 解析json和表单
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//路由
app.get('/test',async(req,res) =>{
  res.send('服务器连接成功')
})

app.use('/api/user', require('./router/userRouter'))
// app.use('/upload', require('./router/fileRouter'))
app.use('/api/video', require('./router/videoRouter'))
app.use('/api/comment', require('./router/commentRouter'))
app.use('/api/live', require('./router/liveRouter'))
app.use('/api/admin', require('./router/adminRouter'))

app.listen(3000, args => logger.newInfo('服务器启动'))
