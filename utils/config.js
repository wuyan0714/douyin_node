const config = {
  BASE_URL: 'http://182.61.20.79:3000',
  PUBLISH_URL: 'rtmp://182.61.20.79:1935',
  PLAY_URL: 'http://182.61.20.79:1936',
  // 默认昵称
  DEFAULT_NICK: '无名小子',
  //数据库存入用户默认签名
  DEFAULT_SIGN: '加油每一天',
  //数据库存入用户默认头像
  DEFAULT_HEAD: '/res/avatar/default.png',
  //  hmac加密秘钥
  SECRET_KEY: 'douyin'
}
module.exports = config
