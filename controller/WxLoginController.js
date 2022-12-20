/**
 * @param wechat_insert 验证微信接入
 */
const WxLoginService = require('../service/WxLoginService')
const WxLoginController = {
    wechat_insert: (req, res) => {
        let handleRes = WxLoginService.wechat_insert()
        res.send(handleRes)
    }
}

module.exports = WxLoginController
