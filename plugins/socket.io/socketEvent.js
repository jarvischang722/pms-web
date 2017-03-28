/**
 * Created by Jun on 2017/2/9.
 */
module.exports = function (io) {

    require("./events/datagrid-process")(io);   //datagrid socket io event
    require("./events/singleGrid-process")(io); //singleGrid socket io event


};