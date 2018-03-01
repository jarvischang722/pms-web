/**
 * Created with JetBrains WebStorm.
 * User: Jun
 * Date: 15/09/07
 * Time: 下午6:01
 * To change this template use File | Settings | File Templates.
 */

const _ = require("underscore");
const i18n = require("i18n");
const async = require("async");
const queryAgent = require('../plugins/kplug-oracle/QueryAgent');
const go_sysConf = require("../configs/systemConfig");

module.exports = function (req, res, next) {
    let lao_localeInfo = [];
    let ls_locale = "";
    async.series([
        function (cb) {
            //只有登入頁需要往下跑
            if (req.originalUrl.indexOf("/login") == -1) {
                return cb(null, 'done');
            }
            let lo_langRf = require("../configs/LangNameRf.json");
            let lo_cond = {
                athena_id: req.params.athena_id
            };
            if (!req.params.athena_id) {
                res.clearCookie("sys_locales");
                return cb(null, "done");
            }
            if (req.params.comp_cod) {
                lo_cond.comp_cod = req.params.comp_cod;
            }
            queryAgent.queryList("QRY_UI_LANG_BY_ATHENA_ID", lo_cond, 0, 0, function (err, langs) {

                lao_localeInfo = _.uniq(_.map(langs, function (lang) {
                    return {
                        lang: lang.locale,
                        name: lo_langRf[lang.locale]
                            ? encodeURIComponent(lo_langRf[lang.locale])
                            : lang.locale
                    };
                }), function (lao_localeInfo) {
                    return lao_localeInfo.lang;
                });

                res.cookie("sys_locales", lao_localeInfo, {
                    maxAge: go_sysConf.sessionExpiredMS || 1000 * 60 * 60 * 3
                    // signed: true // Indicates if the cookie should be signed
                });

                cb(null, "done1");
            });
        },
        function (cb) {
            if (_v(req.query.locale) != "") {
                ls_locale = _v(req.query.locale);
            } else if (_v(req.cookies.locale) != "") {
                ls_locale = _v(req.cookies.locale);
            } else {
                ls_locale = judgeBrowserLang(req);
            }

            //檢查使用者可選語系
            if (lao_localeInfo.length > 0 && _.findIndex(lao_localeInfo, {lang: ls_locale}) == -1) {
                ls_locale = lao_localeInfo[0].lang;
            }
            cb(null, "done2");
        },
        function (cb) {
            res.cookie("locale", ls_locale);
            req.session.locale = ls_locale;
            let ls_redirectUrl = `${req.originalUrl.split("?")[0]}?locale=${ls_locale}`;
            _.each(req.query, function (val, key) {
                if (key !== 'locale') {
                    ls_redirectUrl += `&${key} = ${val}`;
                }
            });

            req.url = ls_redirectUrl;

            i18n.overrideLocaleFromQuery(req);
            cb(null, 'done3');
        }
    ], function (err, result) {

        next();
    });


};

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

