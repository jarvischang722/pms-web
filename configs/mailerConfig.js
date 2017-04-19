/**
 * Created by Jun Chang on 2016/7/25.
 * 信件寄信設定檔
 */
module.exports = {


    host: 'mail01.webhotel.net.tw',
    secure: false,
    port: 25,
    auth: {
        user: 'webhotel@webhotel.net.tw',
        pass: 'ais,123456'
    },
    tls: {
        rejectUnauthorized: false
    },
    logger: false

};