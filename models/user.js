const mongoose = require('mongoose');

// Create the Schema
const UserSchema = mongoose.Schema({
	first_name: { type: String, required: true, maxLenght: 100 },
	last_name: { type: String, required: true, maxLenght: 100 },
	username: { type: String, required: true, maxLenght: 100 },
	password: { type: String, required: true, maxLenght: 100 },
	membership_status: {
		type: String,
		enum: ['admin', 'user', 'guest'],
		required: true,
	},
	messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

// Create necessary virtuals
// Url
UserSchema.virtual('url').get(function () {
	return `/users/${this._id}`;
});

// Full name
UserSchema.virtual('fullname').get(function () {
	return `${this.first_name} ${this.last_name}`;
});

// Export the model
module.exports = mongoose.model('User', UserSchema);
