//Create model that has a title, timestamp and the message text
const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const MessageSchema = mongoose.Schema({
	title: { type: String, required: true, maxLenght: 100 },
	message: { type: String, required: true, maxLenght: 500 },
	timePosted: { type: Date, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

MessageSchema.virtual('url').get(function () {
	return `/messages/${this._id}`;
});

MessageSchema.virtual('timePosted_formatted').get(function () {
	return DateTime.fromJSDate(this.timePosted).toLocaleString(
		DateTime.DATE_MED
	);
});

module.exports = mongoose.model('Message', MessageSchema);
