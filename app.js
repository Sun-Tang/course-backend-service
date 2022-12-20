const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const {expressjwt: jwt} = require('express-jwt')
const {jwtSecretKey} = require('./config/jwtSecretKey')
const DB = require('./config/sequelize')

app.use(cors())

// 解析json数据格式
app.use(bodyParser.json())

// 解析urlencoded字符数据格式 false：返回的对象属性值为string或者array，true：任何类型
app.use(bodyParser.urlencoded({extended: false}))

app.use(
    jwt({secret: jwtSecretKey, algorithms: ['HS256']}).unless({
        path: [
            /^\/api\/notify\/v1/, // 验证码通知接排除
            /^\/api\/user\/v1\/register/, // 注册接口
            /^\/api\/wx_login\/v1/, // 微信登录所有接口
        ]
    })
)

// 通知相关的接口
const notifyRouter = require('./router/notify.js')
app.use('/api/notify/v1', notifyRouter)

// 用户相关的接口
const userRouter = require('./router/user.js')
app.use('/api/user/v1', userRouter)

// 微信登录相关的接口
const wxLoginRouter = require('./router/wxLogin.js')
app.use('/api/wx_login/v1', wxLoginRouter)

// 错误中间件
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.send({code: -1, data: null, msg: '请先登录！'})
    }
    //其他的错误
    res.send({code: -1, data: null, msg: err.message})
})

app.listen(8081, () => {
    console.log('服务启动在：http://127.0.0.1:8081')
})
