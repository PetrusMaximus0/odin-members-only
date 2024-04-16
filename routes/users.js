const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

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

/**Log out*/
//
router.get('/logout', userController.logout_get);

/**Secret code */
//
router.get('/:id/upgrade/', userController.code_get);
//
router.post('/:id/upgrade', userController.code_post);

module.exports = router;
