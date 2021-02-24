const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/douyin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
let db = mongoose.connection
db.on('connected', function(){
    console.log('mongodb启动成功')
    })
