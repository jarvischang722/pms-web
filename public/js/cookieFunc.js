/**
 * Created by Jun Chang on 2017/2/17.
 */
/**
 * 設定 Set cookie
 * @param name
 * @param value
 * @param path　: cookie　存在網址
 * @param keep_time {number} :　有效時間保存
 */
function setupCookie(name, value, path, keep_time) {

    if (_.isUndefined(path) || _.isEmpty(path)) {
        path = "/";
    }

    if (_.isUndefined(keep_time) || _.isNaN(Number(keep_time))) {
        keep_time = 86400000;  //預設1天
    }

    var expires = new Date();
    //有效時間保存  1*24*60*60*1000 (天 * 時 * 分 * 秒  * 毫秒)
    expires.setTime(expires.getTime() + keep_time);
    document.cookie = name.trim() + "=" + escape(value) + ";expires=" + expires.toGMTString() + ";path=" + path;
}

/** 查詢 Get cookie by name **/
function getCookie(name) {
    var arg = escape(name) + "=";
    var nameLen = arg.length;
    var cookieLen = document.cookie.length;
    var i = 0;
    while (i < cookieLen) {
        var j = i + nameLen;
        if (document.cookie.substring(i, j) == arg) {
            return getCookieValueByIndex(j);
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) {
            break;
        }
    }
    return null;
}

function getCookieValueByIndex(startIndex) {
    var endIndex = document.cookie.indexOf(";", startIndex);
    if (endIndex == -1) {
        endIndex = document.cookie.length;
    }
    return unescape(document.cookie.substring(startIndex, endIndex));
}


/** 刪除 Delete cookie entry **/
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    document.cookie = escape(name) + "=" + cval + "; expires=" + exp.toGMTString();
}