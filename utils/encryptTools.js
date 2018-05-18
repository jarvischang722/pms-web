const sysConf = require("../configs/systemConfig");
const crypto = require("crypto");
const gs_public_key = sysConf.public_key;
const net = require('net');

/**
 * 使用公鑰加密
 * @param text {string} 被加密字串
 * @returns {String} 回傳加密後轉base64字串
 */
exports.publicEncrypt = function (text) {
    let lbin_encoded = crypto.publicEncrypt(gs_public_key, Buffer.from(text));
    let ls_encoded = new Buffer(lbin_encoded, "binary").toString("base64");
    return ls_encoded;
};

/**
 * 打socket解密
 * @param rowData {array} 解密資料
 * @param fields {array} 解密欄位
 * @constructor
 */
exports.SocketDecrypt = function (rowData, fields) {
    let client = new net.Socket();
    client.connect(sysConf.socket_server.port, sysConf.socket_server.ip, function () {
        console.log("到socket server取連線資訊...");
        client.write(require("base-64").encode(JSON.stringify({"REVE_CODE": "0900"})));
    });
    client.on('data', function (res) {
        // let oracleConnInfo = JSON.parse(require("base-64").decode(res)).dbconInfo.map(conn => {
        //     conn["connectString"] = `${conn.ip}/${conn.service_name}`;
        //     conn["user"] = `${conn.username}`;
        //     return conn;
        // });
        //Oracle initial
        // require('./plugins/kplug-oracle/DB').create(oracleConnInfo);
        client.destroy();
    });
    client.on('close', function () {
        console.log('Connection closed');
    });
};