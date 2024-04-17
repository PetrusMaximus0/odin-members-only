const Message = require('../models/message');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

/**Post a new message GET*/
exports.new_message_get = asyncHandler(async (req, res, next) => {
	if (req.isAuthenticated()) {
		res.render('message-form');
	} else {
		res.redirect('/users/login');
	}
});

/**Post a new message POST*/
exports.new_message_post = [
	// Validate and Sanitize the input from the form.
	body('title')
		.trim()
		.isLength({ min: 1, max: 100 })
		.withMessage('Titles have a limit of 100 characters')
		.escape(),
	body('message')
		.trim()
		.isLength({ min: 1, max: 500 })
		.withMessage('Messages have a limit of 500 characters')
		.escape(),

	asyncHandler(async (req, res, next) => {
		if (!req.isAuthenticated()) {
			res.redirect('/login');
		}
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// Render the form again with sanitized values and error messages
			res.render('message-form', { errors: errors.array() });
			return;
		}
		// Create the message and store it in the database
		const newMessage = Message({
			title: req.body.title,
			message: req.body.message,
			timePosted: new Date(),
			author: req.params.id,
		});

		const saveResult = await Promise.all([
			newMessage.save(),
			User.findByIdAndUpdate(req.params.id, {
				$push: { messages: newMessage._id },
			}),
		]);

		if (!saveResult) {
			const error = new Error("Couldn't save the message!");
			return next(error);
		}
		res.redirect('/messages');
	}),
];

/**Delete a message by ID GET*/
exports.delete_message_get = asyncHandler(async (req, res, next) => {
	if (req.isAuthenticated() && req.user.membership_status === 'admin') {
		const message = await Message.findById(req.params.id)
			.populate('author')
			.exec();
		if (message !== null) {
			res.render('message-delete', {
				title: 'Delete message',
				message: message,
			});
		} else {
			const error = new Error("Couldn't find the message requested");
			return next(error);
		}
	} else {
		const error = new Error('You are not authorized to perform this action');
		return next(error);
	}
});

/**Delete a message by ID POST*/
exports.delete_message_post = asyncHandler(async (req, res, next) => {
	if (req.isAuthenticated()) {
		const result = await Message.findByIdAndDelete(req.params.id);
		console.log(result);
		if (result === null) {
			return next(new Error("Couldn't find the message to delete."));
		}
		res.redirect('/');
	} else {
		return next(new Error('You are not authorized to perform this action.'));
	}
});
