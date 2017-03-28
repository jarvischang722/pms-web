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
        req.session.locale = _v(req.query["locale"]);
    } else if (_v(req.session.locale) != "") {
        if (req.url.indexOf("?") > 1) {
            req.url = req.url + "&locale=" + req.session.locale;
        } else {
            req.url = req.url + "?locale=" + req.session.locale;
        }
        i18n.overrideLocaleFromQuery(req);
    } else {
        req.session.locale = "en";
        if (req.url.indexOf("?") > 1) {
            req.url = req.url + "&locale=" + req.session.locale;
        } else {
            req.url = req.url + "?locale=" + req.session.locale;
        }
        i18n.overrideLocaleFromQuery(req);

    }
    next();

}

function _v(value) {
    if (_.isUndefined(value) || _.isNull(value)) {
        return "";
    }
    return value;
}

