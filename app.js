const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const bcrypt = require('bcryptjs');

/**Set up the mongoose connection*/
main().catch((err) => {
	console.log('Connection has failed!', err);
	console.log('Attempting to reconnect...');
	main();
});

async function main() {
	console.log('Attempting connection...');
	await mongoose.connect(process.env.MONGODB_URI);
	console.log('Connected...');
}

mongoose.set('strictQuery', false);

//
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
//
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({
			client: mongoose.connection.getClient(),
		}),
		cookie: { maxAge: 1000 * 60 * 30 },
	})
);

// passport must come after session
app.use(passport.session());

// Set up function for passport.authenticate()
passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ user_name: username });
			if (!user) {
				console.log('User not found.');
				return done(null, false, {
					message:
						"This username doesn't exist or the password is incorrect.",
				});
			}
			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				console.log('Wrong password.');
				return done(null, false, {
					message:
						"This username doesn't exist or the password is incorrect.",
				});
			}
			console.log('Successful login!');
			return done(null, user);
		} catch (error) {
			return done(error);
		}
	})
);
//
passport.serializeUser((user, done) => {
	done(null, user.id);
});
//
passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (error) {
		done(error);
	}
});

// Simple logging for debug
app.use((req, res, next) => {
	//console.log('SESSION:', req.session);
	//console.log('USER:', req.user);
	console.log('Is the user AUTHENTICATED?', req.isAuthenticated());
	next();
});

//
app.use(
	sassMiddleware({
		src: path.join(__dirname, 'public'),
		dest: path.join(__dirname, 'public'),
		indentedSyntax: false, // true = .sass and false = .scss
		sourceMap: true,
	})
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
