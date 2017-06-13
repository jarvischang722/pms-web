/**
 * Created by Jun on 2017/4/28.
 */
var mongoAgent = require("../../mongodb");
var moment = require("moment");
module.exports = function (io) {

    io.of("/webStatus").on('connection', function (socket) {

        //檢查session 是否存在
        socket.on("checkSessionExist", function () {

            var chkSessionInterval = setInterval(function () {

                mongoAgent.Sessions.findOne({_id: socket.request.session.id}, function (err, sessionData) {
                    var isSessionOverTime = false;
                    if (!err && sessionData) {
                        isSessionOverTime = moment(sessionData.expires).diff(moment(), "seconds") < 0
                            ? true : false;
                    } else {
                        isSessionOverTime = true;
                    }

                    if (isSessionOverTime) {
                        clearInterval(chkSessionInterval);
                        socket.emit("sessionStatus", {exist: false});
                    } else {
                        socket.emit("sessionTimeLeft", {timeLeft: moment(sessionData.expires).diff(moment(), "seconds")});
                    }

                });

            }, 1000);

        });
    });

};