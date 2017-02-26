const nodemailer = require('nodemailer');
// var smtpTransport = require('nodemailer-smtp-transport');

module.exports=function(){

	// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD
    }
});

	function sendMail(options,cb){
        transporter.sendMail(options,cb);
	}

	return {
		sendMail:sendMail
	}
}