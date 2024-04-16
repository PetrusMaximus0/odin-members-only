var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Members Only' });
});

/** GET sign up page */
router.get('/sign-up', userController.signup_get);

/** POST sign up page */
router.post('/sign-up', userController.signup_post);

module.exports = router;
