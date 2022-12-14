const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())

// 解析json数据格式
app.use(bodyParser.json())

// 解析urlencoded字符数据格式 false：返回的对象属性值为string或者array，true：任何类型
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/test', (req, res) => {
  res.send('小滴课堂')
})

// 错误中间件
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.send({ code: -1, data: null, msg: '请先登录！' })
  }
  //其他的错误
  res.send({ code: -1, data: null, msg: err.message })
})

app.listen(8081, () => {
  console.log('服务启动在：http://127.0.0.1:8081')
})
