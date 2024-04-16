const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	if (req.isAuthenticated()) {
		res.render('index', {
			title: 'Members Only',
			user: req.user,
		});
	} else {
		res.render('index', { title: 'Members Only' });
	}
});

module.exports = router;
