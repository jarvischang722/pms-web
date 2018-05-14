const sysConf = require("../configs/systemConfig");
const crypto = require("crypto");
const gs_public_key = sysConf.public_key;

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