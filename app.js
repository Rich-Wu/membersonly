const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const bcrypt = require('bcryptjs');
const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();
require('dotenv').config();

const app = express();

const baseRoutes = require('./routes/baseRouter');

// Connect to MongoDB
const mongoDB = process.env.dbInfo;
mongoose.connect(mongoDB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);
app.use(cookieParser());

// passportJS middleware setup
app.use(session({ secret: "membersplz", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Middleware to store req.user as res.locals.currentUser
router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// Specifies Login Strategy
passport.use(
  new LocalStrategy((email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { msg: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false, { msg: "Incorrect password" })
        }
      });
    });
  })
);

// Specifies Login Token Creation
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Specifies Login Token Check
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', baseRoutes);

app.listen(3000, () => console.log(`app listening on port 3000!`));
