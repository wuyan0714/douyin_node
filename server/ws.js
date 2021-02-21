const WebSocket = require('ws')
const qs = require('qs')
const Comment = require('../db/moudle/commentModel')

// 搭建实时评论websocket服务

const ws = new WebSocket.Server({port: 8080}, () => {
  console.log('ws服务器已开启 port 8080')
})
let clients = {}

ws.on('connection', (client, req) => {
    // console.log('有用户连接')
    let room = qs.parse(req.url.split('?')[1]).room
    handJoin(room, client)
    client.room = room
    client.on('message', msg => {
        // console.log('用户的数据',msg)
        addcomment(room,msg) //将数据添加到数据库中
        sendAll(msg, client.room) //广播到各个客户端
    })
    client.on('close', () => {
        remove(client)
    })
})

//处理加入房间
function handJoin (room, client) {
  if (!clients.hasOwnProperty(room)) {
    clients[room] = []
  }
  clients[room].push(client)
}

//广播
function sendAll (msg, room) {
  clients[room].forEach(client => {
    client.send(msg)
  })
}

//移除退出的客户端
function remove (client) {
  let room = client.room
  let index = clients[room].indexOf(client)
  if (index !== -1) clients[room].splice(index, 1)
  if (clients[room].length === 0) delete clients[room]
}

//添加评论到数据库中
const addcomment = async (room, msg) => {
  try{
    let comments = await Comment.find({live: room})
    if(comments.length===0){
      let commentList = [msg]
      let data = await Comment.insertMany({
        live: room,
        commentList: commentList
      })
    }else{
      comments[0].commentList.push(msg)
      comments[0].save()
      }
    }catch{
      console.log('live_id不正确')
    }
}