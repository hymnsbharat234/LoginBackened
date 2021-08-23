let User = require('../models/user');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const request = require('request');
const bcrypt = require('bcryptjs')



module.exports.destroySession = function(req, res) {
    req.logout();

    return res.redirect('/');
}
module.exports.createUserAccount = async(req, res) => {
    let admin = await Admin.find({});
    let radmin = await Admin.findOne({type:'Admin'});

    if(req.body.password != req.body.cpassword)
    {
        req.flash('error', 'Password Donot Match');
        return res.render('register',{
            title:'Register',
            phone:req.body.phone,
            length:admin.length
            
        })  
    }

    else{
        let hashedPass = await bcrypt.hash(req.body.password,10)
        let nadmin = await Admin.create({
            name:req.body.name,
            phone:req.body.phone,
            email:req.body.email,
            password:hashedPass,
            type:'Staff',
            adminid:radmin._id
        })


        return res.redirect('/login')
    }
}

module.exports.deleteUser = async(req, res) => {

    let user = await Admin.findById(req.user.id);
        user.projects.pull(req.body.id)
        user.save()
    return res.redirect('/login')
}
module.exports.login = async function(req, res) {

    if(req.body.phone > 10 || re.body.phone < 10){
        return  res.status(403).json({
            status:false,
            msg:'Enter a 10 digit phone number'
        })
    }
    let user = await User.findOne({phone:req.body.phone,service:'email',type:'Patient'})
    const users = {
        username:user.phone
    }
    const accessToken = generateAccessToken(users);

    
    if( user && user.encrypt)
    {
       
        let isEqual = await bcrypt.compare(req.body.password,user.password)
       
        if(isEqual){
            return res.json({
                accessToken:accessToken,
                user:user
                
            })
        }
        else{
            res.status(403).json({
                status:false,
                msg:'Invalid Username/Password'
            })
        }
    }

    else{

    if (!user || user.password != req.body.password) {
        res.status(403).json({
            status:false,
            msg:'Invalid Username/Password'
        })
    }

    return res.json({
        accessToken:accessToken,
        user:user
        
    })
}
  

}

module.exports.sendOtp = async(req, res) => {
    let admin = await Admin.findOne({type:'Admin'})
    let projects = await Project.find({});
    var flag = false;
    for(pro of projects)
    {
        if(pro.phone == req.body.phone)
        flag = true;
    }

    if (req.body.phone.length > 10) {
        req.flash('error', 'Please do not use (+91 or 0) before your phone number.');
        return res.redirect('back');
    }
    

    let user = await Admin.findOne({ phone: req.body.phone });

    if (user) {
        req.flash('error', 'Account already linked with this mobile number');
        return res.redirect('back');
    } else {

        if(!admin || flag)
        {

        client
            .verify
            .services(config.serviceID)
            .verifications
            .create({
                to: `+91${req.body.phone}`,
                channel: 'sms'
            }).then((data) => {
                return res.render('verify_otp', {
                    title: 'Phone verification',
                    phone: req.body.phone
                });
            });

        }
        else{
            req.flash('error', 'Unauthorised Access! Please Contact Adminstrator');
        return res.redirect('back');
        }

    }
}
module.exports.resendOtp = async(req, res) => {
    if (req.body.phone.length > 10) {
        req.flash('error', 'Please do not use (+91 or 0) before your phone number.');
        return res.redirect('back');
    }

    let user = await Admin.findOne({ phone: req.body.phone });

    if (user) {
        req.flash('error', 'Account already linked with this mobile number');
        return res.redirect('back');
    } else {

        client
            .verify
            .services(config.serviceID)
            .verifications
            .create({
                to: `+91${req.body.phone}`,
                channel: req.query.service
            }).then((data) => {
                return res.render('verify_otp', {
                    title: 'Phone verification',
                    phone: req.body.phone
                });
            });

    }
}
module.exports.sendOtpFp = async(req, res) => {
    if (req.body.phone.length > 10) {
        req.flash('error', 'Please do not use (+91 or 0) before your phone number.');
        return res.redirect('back');
    }

    let user = await Admin.findOne({ phone: req.body.phone });

    if (!user) {
        req.flash('error', 'No Account linked with this mobile number');
        return res.redirect('back');
    } else {

        client
            .verify
            .services(config.serviceID)
            .verifications
            .create({
                to: `+91${req.body.phone}`,
                channel: 'sms'
            }).then((data) => {
                return res.render('forgot_verify_otp', {
                    title: 'Phone verification',
                    phone: req.body.phone
                });
            });

    }
}
module.exports.verifyOtp = async(req, res) => {
    console.log(req.body)
    let data = await client
    .verify
    .services(config.serviceID)
    .verificationChecks
    .create({
        to: `+91${req.body.phone}`,
        code: req.body.otp
    });

let admin = await Admin.find({});

if (data.status == 'approved') {
    return res.render('register',{
        title:'Register',
        phone:req.body.phone,
        length:admin.length
    })
}
else {
    
    req.flash('error', 'Wrong Otp');
    return res.render('verify_otp', {
        title: 'Phone verification',
        phone: req.body.phone
    });

}

}

module.exports.verifyOtpFp = async(req, res) => {
    let data = await client
    .verify
    .services(config.serviceID)
    .verificationChecks
    .create({
        to: `+91${req.body.phone}`,
        code: req.body.otp
    });


if (data.status == 'approved') {
    return res.render('reset-password',{
        title:'Reset Password',
        phone:req.body.phone
    })
}
else {
    
    req.flash('error', 'Wrong Otp');
    return res.render('forgot_verify_otp', {
        title: 'Phone verification',
        phone: req.body.phone
    });

}

}

module.exports.changePassword = async(req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (req.body.old != user.password) {
        req.flash('error', 'Wrong Old Password!');
        return res.redirect('back');
    }

    if (req.body.password != req.body.confirm) {
        req.flash('error', 'Passwords do not match!')
        return res.redirect('back');
    }

    user.password = req.body.password;
    user.save();

    req.flash('success', 'Password changed successfully!');
    return res.redirect('back');
}
module.exports.resetPassword = async(req, res) => {
    let user = await Admin.findOne({phone:req.body.phone});
    if(req.body.password != req.body.cpassword)
    {
        req.flash('error', 'Password Donot Match');

        return res.render('reset-password',{
            title:'Reset Password',
            phone:req.body.phone
        })
    }

    else{
        let hashedPass = await bcrypt.hash(req.body.password,10)
        user.password = hashedPass;
        user.save();
        
        return res.redirect('/login')
    }

}

module.exports.popup = async function(req, res) {


    return res.redirect('/');
}