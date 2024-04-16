//Create model that has a title, timestamp and the message text
const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
	title: { type: String, required: true, maxLenght: 100 },
	message: { type: String, required: true, maxLenght: 500 },
	timePosted: { type: Date, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

MessageSchema.virtual('url').get(function () {
	return `/messages/${this._id}`;
});

module.exports = mongoose.model('Message', MessageSchema);
