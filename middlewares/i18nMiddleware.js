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
const clusterQueryAgent = require("../plugins/kplug-oracle/ClusterQueryAgent");
const go_sysConf = require("../configs/systemConfig");
const commonRule = require("../ruleEngine/rules/CommonRule");

module.exports = function (req, res, next) {
    let lao_localeInfo = [];
    let ls_locale = "";
    const la_sys_locales = req.cookies.sys_locales || [];
    async.series([
        async function (cb) {
            //只有登入頁需要往下跑
            if (req.originalUrl.toLocaleLowerCase().indexOf("/login") == -1 && la_sys_locales.length != 0 && _.isArray(la_sys_locales)) {
                res.cookie("sys_locales", req.cookies.sys_locales, {
                    maxAge: go_sysConf.sessionExpiredMS || 1000 * 60 * 60 * 3
                });
                return cb(null, 'done');
            }

            let lo_cond = {
                athena_id: req.params.athena_id || req.cookies.athena_id
            };

            if (req.params.comp_cod || req.cookies.comp_cod) {
                lo_cond.comp_cod = req.params.comp_cod || req.cookies.comp_cod;
            }

            lao_localeInfo = await getUseLangsByAthenaID(lo_cond);

            res.cookie("sys_locales", lao_localeInfo, {
                maxAge: go_sysConf.sessionExpiredMS || 1000 * 60 * 60 * 3
            });

            cb(null, "done1");
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


/**
 * 抓取集團公司可使用的語系
 * @param lo_cond
 * @return {Promise<any>}
 */
async function getUseLangsByAthenaID(lo_cond) {
    let lo_langRf = require("../configs/LangNameRf.json");
    return new Promise((resolve, reject) => {
        let lo_daoParams = commonRule.ConvertToQueryParams(lo_cond.athena_id, "QRY_UI_LANG_BY_ATHENA_ID");
        clusterQueryAgent.queryList(lo_daoParams, lo_cond, function (err, langs) {
            if (err) {
                console.error(err);
            }
            let lao_localeInfo = _.uniq(_.map(langs, function (lang) {
                return {
                    lang: lang.locale,
                    name: lo_langRf[lang.locale]
                        ? encodeURIComponent(lo_langRf[lang.locale])
                        : lang.locale
                };
            }), function (lao_localeInfo) {
                return lao_localeInfo.lang;
            });
            resolve(lao_localeInfo)

        });
    });
}