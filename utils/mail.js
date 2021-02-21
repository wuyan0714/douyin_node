const nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    // user: 'smile22333@163.com', // generated ethereal user
    // pass: 'PXLDLNOGUNRLKQEO' // generated ethereal password
    user: '205534627@qq.com', // generated ethereal user
    pass: 'bjgmzeetoubhcajj' // generated ethereal password
  }
})

async function sendMail (mail, code) {
  // send mail with defined transport object
  let content = {
    from: '"danMu管理员" <205534627@qq.com>', // sender address
    to: mail, // list of receivers
    subject: '邮箱验证码', // Subject line
    html: `本次请求的邮件验证码是：<b style='font-size: 18px;color: red'>${code}</b><br/>本验证码5分钟内有效，请及时输入！` // html body
  }
  return transporter.sendMail(content)
}

module.exports = {sendMail}
