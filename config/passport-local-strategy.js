const passport = require('passport');
const googleStrategy = require('passport-google-oauth2').Strategy;
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');


passport.use(new localStrategy({
    usernameField: 'email',
    // passReqToCallback: true
}, function(phone, password, done) {
    console.log('Phone is ' +phone+' password is' +password)
        Admin.findOne({ Phone: phone }, async function(err, user) {
            if (err) {
                console.log('Error in finding user data in passport', err);
                return done(err);
            }

            if( user)
            {
               
                let isEqual = await bcrypt.compare(password,user.password)
               
                if(isEqual){
                    console.log('hii');
                    return done(null, user);
                }
                else{
                
                    // req.flash('error', 'Invalid Username/Password');
                    return done(null, false);
                }
            }

            else{

            return done(null, user);
        }
        });
    
}));

passport.serializeUser(function(user, done) {

    return done(null, user);
});

passport.deserializeUser(async function(id, done) {
    let user = await Admin.findById(id);

        return done(null, user);
    });
    passport.checkAuthentication = function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
    
    
        return res.redirect('/login');
    }
    
    
    
    passport.checkStaffAuthentication = function(req, res, next) {
        if (req.isAuthenticated() && req.user.type == 'Staff') {
            return next();
        }
    
    
        return res.redirect('/login');
    }
    
    
    passport.setAuthenticatedUser = function(req, res, next) {
        
        if (req.isAuthenticated()) {
            res.locals.user = req.user;
        }
        next();
    }
    
    module.exports = passport;