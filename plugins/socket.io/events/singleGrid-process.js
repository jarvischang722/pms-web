/**
 * Created by Jun on 2017/2/25.
 */
var _ = require("underscore");
var mongoAgent = require("../../mongodb");
var sgSVC = require("../../../services/gridSingleService");



module.exports = function (io) {

    io.of("/singleGrid").on('connection', function (socket) {

    })

};