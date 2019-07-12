const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const mongoDB = process.env.dbInfo;
mongoose.connect(mongoDB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// passportJS middleware setup
passport.use(session({ secret: "membersplz", resave: false, saveUninitialized: true }));
passport.use(passport.initialize());
passport.use(passport.session());

passport.use(router);
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

module.exports = passport;
