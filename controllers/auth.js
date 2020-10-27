const User = require('../models/users');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');


let transporter = nodemailer.createTransport({
    host: process.env.host,
    port: "587",
    secure: false,
    auth: {
        user: process.env.user,
        pass: process.env.password,
    }
});

//create User withought email account verification
exports.signup =  (req, res) => {
    const { name, email, password} = req.body;
    User.findOne({ email }).then(user => {
        if(user){
            return res.status(400).json({
                success: false,
                msg: 'User is already Register with email'
            })
        } else {

         const token = jwt.sign({name, email, password}, process.env.JWT_SECRET, { expiresIn: '20m'});

             transporter.sendMail({
            from: "",
            to: email, // list of receivers
            subject: "Vedic student account one time verification code", // Subject line
            text: "", // plain text body
            html: "<p>Hello Dear,</p>" +
                "<p>Thanks for joining VedicStudent!</p>" +
                "<p>Your one time verification code is : "+ token+"</p>" +
                "<br/>" +
                "<b>Thank You!</b>"
        }).then( body => {
                res.status(200).json({ 
                    success: true,
                    msg: ' send successfully'
                })
        }).catch(err => {
            res.status(500).json({ 
                success: false, 
                msg: err.message
            })
        })
        }

    })
}

exports.activateAccount = async(req, res) => {
    const { token } = req.body;
    if(token){
      jwt.verify(token, process.env.JWT_SECRET, function(err, decodeToken){
           if(err){
               return res.status(400).json({
                   success: false
               })
           }
           const { name, email, password } = decodeToken;
           User.findOne({ email }).exec((err, user) => {
                if(user){
                    return res.status(400).json({
                        success: false,
                        message: 'Email already exists'
                    })
                }
                let newUser = new User({
                    name,
                    email,
                    password
                })

                newUser.save((err, success) => {
                    if(err){
                        return res.status(400).json({
                            success: false,
                            message: 'something went wrong'
                        })
                    }
                    res.json({ 
                        message: 'signup success'
                    })
                })
           })
      })
}

}




// async function sendEmailVerfication(params) {
//     let info = await transporter.sendMail({
//         from: '"VedicStudent" <noreply@ebizzdevelopment.com>',
//         to: params.email, // list of receivers
//         subject: "Vedic student account one time verification code", // Subject line
//         text: "", // plain text body
//         html: "<p>Hello Dear,</p>" +
//             "<p>Thanks for joining VedicStudent!</p>" +
//             "<p>Your one time verification code is : "+ params.token+"</p>" +
//             "<br/>" +
//             "<b>Thank You!</b>"
//     });
//     return  info.messageId
// }

