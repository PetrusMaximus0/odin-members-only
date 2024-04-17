const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/', (req, res, next) => {
	res.redirect('/');
});

// New message GET
router.get('/:id/new', messageController.new_message_get);

// New message POST
router.post('/:id/new', messageController.new_message_post);

// Delete message GET
router.get('/:id/delete', messageController.delete_message_get);

// Delete message POST
router.post('/:id/delete', messageController.delete_message_post);

//
module.exports = router;
