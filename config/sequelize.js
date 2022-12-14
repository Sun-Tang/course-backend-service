const {Sequelize} = require('sequelize')
const initModels = require('../models/init-models')
const sequelize = new Sequelize('xdclass-edu', 'root', 'xdclass.net168', {
    host: '120.25.3.72',
    dialect: 'mysql'
})

!(async function () {
    try {
        await sequelize.authenticate()
        console.log('数据库链接成功')
    } catch (error) {
        console.error('数据库链接失败:', error)
    }
})()

const models = initModels(sequelize)

module.exports = {...models, sequelize}
