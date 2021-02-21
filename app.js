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
/*
 //压缩html css js静态文件
 const compression = require('compression')
 //尽量在其他中间件前使用compression
 app.use(compression());
 */
//跨域访问
// app.use(cors({
//   origin: ['http://192.168.124.4','http://127.0.0.1','http://localhost','http://192.168.124.4:81'],
//   credentials: true
// }))
app.use(cors())

//session
// app.use(
//   session({
//     cookie: {maxAge: 7 * 24 * 60 * 60 * 1000},
//     secret: 'gdgdgjhr4yhrtghfg',
//     resave: true,
//     saveUninitialized: false
//   })
// )
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
// app.use('/danmu', require('./router/danmuRouter'))
app.use('/api/comment', require('./router/commentRouter'))
app.use('/api/live', require('./router/liveRouter'))
app.use('/api/admin', require('./router/adminRouter'))
//管理员路由
// app.use('/admin', (req, res, next) => {
//   // if (req.url === '/login' || req.session.login) next()
//   // else res.sendStatus(403)
//   next()
// }, require('./router/adminRouter'))

app.listen(3000, args => logger.newInfo('服务器启动'))
