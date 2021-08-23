const express = require('express');
const router = express.Router();
const passport = require('passport');

const apiController = require('../controllers/api');
router.post('/create-account',apiController.createAccount);
router.post('/create-session', passport.authenticate('local', {
    failureRedirect: '/failRedirect'
  }), apiController.createSession);
  router.get('/getUser',apiController.getUser);
  router.get('/logout',apiController.logout);
router.post('/failRedirect',apiController.failRedirect)
router.post('/changePassword',apiController.changePassword)