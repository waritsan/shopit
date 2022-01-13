const crypto = require('crypto');

const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

// Register user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({ 
        name, 
        email, 
        password, 
        avatar: { 
            public_id: 'afsdfasdfasdfasdf',
            url: 'gfghfghjghjghjg'
        }
    });

    sendToken(user, 200, res);
});

// Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password is entered by the user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password.', 400));
    }

    // Find the user in the database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password.', 401));
    }

    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
});

// Forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler('Email not found', 404));
    }
    // Get reset reset token
    const resetToken = user.getPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    // Create password reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, please ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors (async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or expired', 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400));
    }

    // Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.save();

    sendToken(user, 200, res);
});

// Get current logged in user detail => /api/v1/me
exports.getUserProfile = catchAsyncErrors (async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

// Update password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors (async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check old password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
        return next(new ErrorHandler('Previous password is incorrect', 400));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);
});

// Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, { 
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out'
    });
});