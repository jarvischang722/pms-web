/**
 * Created with JetBrains WebStorm.
 * User: Jun
 * Date: 15/09/07
 * Time: 下午6:01
 * To change this template use File | Settings | File Templates.
 */

var _ = require("underscore");
var i18n = require("i18n");


module.exports = function (req, res, next) {

    if (_v(req.query["locale"]) != "") {
        i18n.overrideLocaleFromQuery(req);
        res.cookie('locale', _v(req.query["locale"]));
    } else if (_v(req.cookies.locale) != "") {
        if (req.url.indexOf("?") > 1) {
            req.url = req.url + "&locale=" + _v(req.query["locale"]);
        } else {
            req.url = req.url + "?locale=" + _v(req.query["locale"]);
        }
        i18n.overrideLocaleFromQuery(req);
    } else {
        res.cookie('locale', judgeBrowserLang(req));
        if (req.url.indexOf("?") > 1) {
            req.url = req.url + "&locale=" + judgeBrowserLang(req);
        } else {
            req.url = req.url + "?locale=" + judgeBrowserLang(req);
        }
        i18n.overrideLocaleFromQuery(req);

    }
    req.session.locale = req.cookies.locale;
    next();

}

/**
 * 抓取瀏覽器預設語言
 * @param req
 * @return {string}
 */
function judgeBrowserLang(req) {
    let defaultLocale = "en";
    let haveLangList = ["zh_TW", "ja", "en"];
    if (req.language == "zh") {
        if (req.region == 'cn') {
            defaultLocale = 'zh_CN';
        } else {
            defaultLocale = 'zh_TW';
        }
    } else {
        defaultLocale = req.language;
    }

    return _.indexOf(haveLangList, defaultLocale) > -1 ? defaultLocale : "en";
}

function _v(value) {
    if (_.isUndefined(value) || _.isNull(value)) {
        return "";
    }
    return value;
}

