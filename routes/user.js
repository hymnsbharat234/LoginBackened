const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/user');

router.get('/logout', userController.destroySession);

router.post('/create-session', passport.authenticate('local', {
    failureRedirect: '/login'
}), userController.createSession);
router.get('/login', userController.login);
router.post('/reset-password', userController.resetPassword);

router.post('/create-master-account', userController.createMasterAccount);
router.post('/delete-account', userController.deleteAccount);


module.exports = router;