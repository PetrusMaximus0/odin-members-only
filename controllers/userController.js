const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// Signup page GET
exports.signup_get = asyncHandler(async (req, res, next) => {
	res.render('sign-up', {
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
			res.render('sign-up', {
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
			password: bcrypt.hash(req.body.password, 10),
			membership_status: 'user',
		});

		await newUser.save();
		res.redirect(newUser.url);
	}),
];
