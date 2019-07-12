const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const mongoose = require('mongoose');
const passport = require('./config/auth');
const bcrypt = require('bcryptjs');
const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();
const session = require("express-session");
require('dotenv').config();

const app = express();

const baseRoutes = require('./routes/baseRouter');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "membersplz", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Middleware to store req.user as res.locals.currentUser
router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
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
