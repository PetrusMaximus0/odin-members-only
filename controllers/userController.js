const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Signup page GET
exports.signup_get = asyncHandler(async (req, res, next) => {
	res.render('signup', {
		title: 'Sign up',
	});
});

// Signup page POST
const validatePassword = (value, req) => {
	if (value !== req.body.password) {
		throw new Error('The passwords must match!');
	} else {
		return true;
	}
};
//
exports.signup_post = [
	// Validate and sanitize
	body('first_name').trim().isLength({ max: 100 }).escape(),
	body('last_name').trim().isLength({ max: 100 }).escape(),
	body('user_name').trim().isLength({ max: 100 }).escape(),
	body('password').trim().isLength({ max: 100 }).escape(),
	body('password-confirm')
		.trim()
		.custom((value, { req }) => validatePassword(value, req))
		.escape(),
	asyncHandler(async (req, res, next) => {
		// Extract the errors if they exist
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// There are errors, render the form again with errors and sanitized values
			res.render('signup', {
				user: {
					user_name: req.body.user_name,
					first_name: req.body.first_name,
					last_name: req.body.last_name,
				},
				title: 'Sign up',
				errors: errors.array(),
			});
			return;
		}

		// Create and save a new user on the database
		const newUser = new User({
			user_name: req.body.user_name,
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			password: await bcrypt.hash(req.body.password, 10),
			membership_status: 'guest',
		});
		await newUser.save();

		// Log in the user
		res.redirect('/users/login');
	}),
];

// Log in page GET
exports.login_get = asyncHandler(async (req, res, next) => {
	res.render('login', { title: 'Log in' });
});

// Log in page POST
exports.login_post = (req, res, next) => {
	passport.authenticate('local', function (err, user, info, status) {
		if (err) {
			console.log('We got an error');
			return next(err);
		}
		if (!user) {
			res.render('login', { errors: [info.message] });
			return;
		}
		req.logIn(user, function (err) {
			return err ? next(err) : res.redirect('/');
		});
	})(req, res, next);
};

// Log out page GET
exports.logout_get = (req, res, next) => {
	req.logout((err) => {
		return err ? next(err) : res.redirect('/');
	});
};

// Code form GET
exports.code_get = asyncHandler(async (req, res, next) => {
	if (req.isAuthenticated()) {
		res.render('upgrade-form');
	} else {
		res.redirect('/');
	}
});

exports.code_post = asyncHandler(async (req, res, next) => {
	if (!req.isAuthenticated()) {
		res.redirect('/login');
	}

	if (req.body.code === process.env.MEMBER_PASSWORD) {
		const result = await User.findByIdAndUpdate(req.params.id, {
			membership_status: 'user',
		});
		if (result) {
			res.redirect('/');
		} else {
			const err = new Error('User not found');
			return next(err);
		}
	} else {
		res.render('upgrade-form', { wrongCode: true });
	}
});

// Code form POST
