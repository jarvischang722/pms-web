/**
 * Created by user on 2017/4/7.
 */
var mailSvc = require("../services/mailService");

var mailInfo = {

    subject : 'excetion mail Test',
    exceptionType:"api time out",
    errorMsg:"test............"

};

mailSvc.sendExceptionMail(mailInfo);