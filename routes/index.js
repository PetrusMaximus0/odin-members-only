const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const asyncHandler = require('express-async-handler');
/* GET home page. */
router.get(
	'/',
	asyncHandler(async function (req, res, next) {
		const messages = await Message.find({}).populate('author').exec();
		if (req.isAuthenticated()) {
			res.render('index', {
				title: 'Members Only',
				user: req.user,
				posts: messages,
			});
		} else {
			res.render('index', { title: 'Members Only', posts: messages });
		}
	})
);

module.exports = router;
