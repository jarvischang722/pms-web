/**
 * Created by Jun Chang on 2016/12/30.
 * 會員驗證相關作業
 */

var authSvc = require("../services/authService");
var _ = require("underscore");
var async = require("async");
var roleFuncSvc = require("../services/roleFuncService");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var i18n = require('i18n');


//新增 角色權限
exports.getAuthorityRole = function (req, res) {
    res.render("user/authorityRole");
};
//新增 人員權限
exports.getAuthorityStaff = function (req, res) {
    res.render("user/authorityStaff");
};
//訂房確認書 email
exports.getReservationCheckMail = function (req, res) {
    res.render("user/reservationCheckMail");
};
//假日日期設定
exports.getHolidayDateSet = function (req, res) {
    res.render("user/holidayDateSet");
};
//商務公司資料編輯
exports.getBusinessCompanyData = function (req, res) {
    res.render("user/businessCompanyData");
};
//業務員資料編輯(業務→業務員設定作業→業務員資料維護)
exports.getClerkDataDefend = function (req, res) {
    res.render("user/clerkDataDefend");
};
//首頁 依房型訂房
exports.getReservationRoomType = function (req, res) {
    res.render("user/reservationRoomType");
};