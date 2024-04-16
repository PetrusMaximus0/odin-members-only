var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

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

/**Sign up*/
//
router.get('/signup', userController.signup_get);

//
router.post('/signup', userController.signup_post);

/**Log in*/
//
router.get('/login', userController.login_get);

//
router.post('/login', userController.login_post);

module.exports = router;
