/**
 * Created by Jun on 2016/12/26.
 */
const _ = require("underscore");
const go_sysConfig = require('../configs/systemConfig');
module.exports = function (req, res, next) {

    if (!req.session.activeSystem) {
        req.session.activeSystem = {
            id: "",
            name_zh_TW: "",
            name_en: "",
            name_ja: ""
        };
    }
    //TODO 判別每間公司館別可以用的語系，
    let options = {
        maxAge: go_sysConfig.sessionExpiredMS || 1000 * 60 * 60 * 3 // would expire after 15 minutes
        //httpOnly: true, // The cookie only accessible by the web server
        //signed: true // Indicates if the cookie should be signed
    };
    let localeInfo = [
        {lang: 'en', sort: 1, name: 'English'},
        {lang: 'zh_TW', sort: 2, name: encodeURIComponent('繁體中文')},
        {lang: 'ja', sort: 3, name: encodeURIComponent('日本語')}
    ];
    res.cookie('sys_locales', localeInfo, options);
    req.session._touchSession = new Date();
    req.session.touch();
    if (_.isUndefined(req.session.user) || _.isNull(req.session.user)) {
        if (req.cookies.athena_id && req.cookies.comp_cod) {
            res.redirect(`/${req.cookies.athena_id}/${req.cookies.comp_cod}/login`);
        }
        else {
            if (req.cookies.athena_id && !req.cookies.comp_cod) {
                res.redirect(`/login`);
            }
            else if (req.cookies.comp_cod && req.cookies.comp_cod != "") {
                res.redirect(`/${req.cookies.athena_id}/${req.cookies.comp_cod}/login`);
            }
            else {
                res.redirect(`/${req.cookies.athena_id}/login`);
            }
        }

    } else if (!_.isUndefined(req.session.user) && _.isUndefined(req.session.activeSystem.id)) {
        res.redirect("/systemOption");
    } else {
        next();
    }

};