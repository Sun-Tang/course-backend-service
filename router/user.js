const express = require('express')
const router = express.Router()
const UserController = require('../controller/UserController')

// 注册接口
router.post('/register', UserController.register)

module.exports = router
