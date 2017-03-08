'use strict';
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'threebeeairline@gmail.com',
        pass: 'wearethreebee!'
    }
});

module.exports = {
    sendMail: function(recipients, subject, text) {
        // setup email data with unicode symbols
        var mailOptions = {
            from: '"ThreeBee Airlines ✈" <threebeeairline@gmail.com>', // sender address
            to: recipients, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: text // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }
};