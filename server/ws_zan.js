const WebSocket = require('ws')
const qs = require('qs')

const ws = new WebSocket.Server({port: 8081}, () => {
  console.log('ws服务器已开启 port 8081')
})
let clients = {}

ws.on('connection', (client, req) => {
    // console.log('有用户连接')
    let room = qs.parse(req.url.split('?')[1]).room
    handJoin(room, client)
    client.room = room
    client.on('message', msg => {
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