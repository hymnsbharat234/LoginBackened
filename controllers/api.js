const bcrypt = require('bcryptjs')

const User=require("../models/user")

module.exports.createAccount = async(req, res) => {
    console.log(req.body)
    if(req.body.password != req.body.cpassword)
    {
        return res.json({
            status:false,
            msg:'Password Mismatch',
            phone:req.body.phone
        })  
    }

    else{
        if(req.body.phone){
        let hashedPass = await bcrypt.hash(req.body.password,10)
        let nadmin = await Admin.create({
            name:req.body.name,
           
            email:req.body.email,
            password:hashedPass,
            type:'Staff'
        })


        return res.json({
            status:true,
            msg:'Account Created Successfully',
            user:nadmin
        })
    }
    }
}

module.exports.createSession = async(req, res) => {
    let user = await Admin.findById(req.user.id);
    return res.json({
        status:true,
        user:user
    })
}
module.exports.getUser = async(req, res) => {

    let user;
    if(req.isAuthenticated()){
    user = await Admin.findById(req.user.id);
    }

    if(user)
    {
        return res.json({
            status:true,
            user:user
        })
    }
    else{
        return res.json({
            status:false,
            msg:'Please Log IN'
        })  
    }
}

module.exports.logout = async(req, res) => {
    
    req.logout()
    return res.json({
        status:true,
        msg:'User Logged Out'
    })
}
module.exports.failRedirect = async(req, res) => {
    console.log(req.body)
    return res.json({
        status:false,
        msg:'Not Verified'
    })
}
