/**
 * Created by Jun on 2017/2/9.
 */
var _ = require("underscore");
var mongoAgent = require("../../mongodb");
var tbSVC = require("../../../services/dbTableService");
var ArrObj_lockTable = [];


module.exports = function (io) {

    io.of("/datagrid").on('connection', function (socket) {

        socket.on('datagird-process-lock', function (data) {

            var socket_id = socket.id;
            var prg_id = data.prg_id;
            var user_id = data.user_id;
            doTableLock(prg_id,user_id,function (err,success) {
                var errorMsg = "";
                ArrObj_lockTable.push({
                    socket_id: socket_id,
                    prg_id: prg_id,     //program_id
                    user_id: user_id,    //使用者
                    prgLocked: success  //是否被lock
                });

                if(!success){
                    errorMsg = "Table in use";
                    var userIdx = _.findIndex(ArrObj_lockTable,{prg_id:prg_id,prgLocked:true})  ;
                    if(userIdx != -1){
                        errorMsg += "  ( user : "+ ArrObj_lockTable[userIdx].user_id +") ";
                        socket.emit('checkTableLock', {success:false,errorMsg:errorMsg});
                    }else{
                        doTableUnLock(prg_id, "",function (err,success) {
                            socket.emit('checkTableLock', {success:success,errorMsg:err});
                        });
                    }
                }else{
                    socket.emit('checkTableLock', {success:true,errorMsg:""});
                }


            })


        });


        socket.on('disconnect', function () {
            var delIdx = _.findIndex(ArrObj_lockTable, {socket_id: socket.id});
            if (delIdx != -1 && ArrObj_lockTable[delIdx].prgLocked){
                doTableUnLock(ArrObj_lockTable[delIdx].prg_id, ArrObj_lockTable[delIdx].user_id,function(err,success){
                    ArrObj_lockTable.splice(delIdx, 1);
                });

            }

        });
    });

};

function doTableLock(prg_id,user_id,callback) {
    mongoAgent.UI_Type_Grid.findOne({prg_id: prg_id}, function (err, tmpDG) {
        if (!err && tmpDG) {
            tmpDG = tmpDG.toObject();
             tbSVC.doTableLock(prg_id,
                tmpDG.lock_table,
                user_id,
                "T",
                ""
               ,callback)
        }
    });
}

function doTableUnLock(prg_id,user_id,callback) {
    mongoAgent.UI_Type_Grid.findOne({prg_id: prg_id}, function (err, tmpDG) {
        if (!err && tmpDG) {
            tmpDG = tmpDG.toObject();
            tbSVC.doTableUnLock(prg_id,
                tmpDG.lock_table,
                user_id,
                "T",
                "",
                callback)
        }
    });
}