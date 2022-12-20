const svgCaptcha = require('svg-captcha')
const redisConfig = require('../config/redisConfig')
const aliYunMessage = require('../config/aliyunMessage')
const dayjs = require('dayjs')
const BackCode = require('../utils/BackCode')
const codeEnum = require('../utils/codeEnum')

const NotifyService = {
    captcha: (key, type) => {
        let captcha = svgCaptcha.create({
            size: 4, // 验证码长度
            ignoreChars: '0o1i', // 验证码字符中排除 0o1i
            noise: 1, // 干扰线
            background: '#bbb', // 背景颜色
            color: '#fff',
            height: 60,
            fontSize: 75
        })
        redisConfig.set(`${type}:captcha:` + key, captcha.text, 600)
        return captcha.data
    },
    sendCode: async (phone, captcha, type, key, randomCode) => {
        // -------------》方案1
        // // 60秒内不能重复获取
        // if (await redisConfig.exists(`${type}:over:` + phone)) {
        //     return BackCode.buildResult(codeEnum.CODE_LIMITED)
        // }

        // -------------》方案2
        if (await redisConfig.exists(`${type}:code:` + phone)) {
            let dateRedis = dayjs(Number((await redisConfig.get(`${type}:code:` + phone)).split('_')[0]))
            if (dayjs(Date.now()).diff(dateRedis, 'second') <= 60) {
                return BackCode.buildResult(codeEnum.CODE_LIMITED)
            }
        }

        // 是否有图形验证码
        if (!(await redisConfig.exists(`${type}:captcha:` + key))) {
            return BackCode.buildError('请发送图形验证码')
        }

        if (!captcha) {
            return BackCode.buildError('缺少captcha参数')
        }

        // 对比用户的图形验证码和redis储存的是否一致
        let captchaRedis = await redisConfig.get(`${type}:captcha:` + key)
        if (String(captcha).toLowerCase() !== captchaRedis.toLowerCase()) {
            return BackCode.buildError('图形验证码错误')
        }

        // 发送手机验证码
        let codeRes = (await aliYunMessage(phone, randomCode)).data

        // -------------》方案1
        // // 验证码存入redis
        // redisConfig.set(`${type}:code:` + phone, randomCode, 600)
        //
        // // 存60秒判断的key
        // redisConfig.set(`${type}:over:` + phone, '1', 60)

        // -------------》方案2
        // 获取当前时间拼接验证码
        let randomCodeTime = `${Date.now()}_${randomCode}`
        redisConfig.set(`${type}:code:` + phone, randomCodeTime, 600)

        // 删除图形验证码
        redisConfig.del(`${type}:captcha:` + key)
        if (codeRes.code == '0') {
            return BackCode.buildSuccessAndMsg('发送成功')
        } else {
            return BackCode.buildError('发送失败')
        }
    }
}

module.exports = NotifyService
