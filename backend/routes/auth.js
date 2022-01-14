const express = require('express');

const { isAuthenticatedUser } = require('../middlewares/auth');

const router = express.Router();

const { 
    registerUser,
    loginUser, 
    forgotPassword, 
    resetPassword, 
    getUserProfile,
    updateProfile,
    updatePassword, 
    logout 
} = require('../controllers/authController');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);
router.route('/password/update/').put(isAuthenticatedUser, updatePassword);

module.exports = router;