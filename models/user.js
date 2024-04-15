const mongoose = require('mongoose');
const message = require('./message');

// Create the Schema
const UserSchema = mongoose.Schema({
	first_name: { type: String, required: true, maxLenght: 100 },
	last_name: { type: String, required: true, maxLenght: 100 },
	username: { type: String, required: true, maxLenght: 100 },
	membership_status: {
		type: String,
		enum: ['admin', 'user', 'guest'],
		required: true,
	},
	messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

// Create necessary virtuals

// Export the model
module.exports = mongoose.model('User', UserSchema);
