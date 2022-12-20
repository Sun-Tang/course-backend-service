const express = require('express')
const router = express.Router()
const WxLoginController = require('../controller/WxLoginController')

// 注册接口
router.post('/callback', WxLoginController.wechat_insert)

module.exports = router
