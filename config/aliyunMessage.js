const axios = require('axios')
const sendMsgCode = (phone, randomCode) => {
    return axios({
        method: 'post',
        url: 'https://api-v2.xdclass.net/send_sms',
        data: {
            appid: "WqslwQUbHzVj7peWwX",
            appSecret: "cFA9WOFw4BmDu1H1lWDIPxDF5DvTQ8Ok",
            code: randomCode,
            phoneNum: phone,
            templateCode: "SMS_168781429"
        }
    })
}

module.exports = sendMsgCode;
