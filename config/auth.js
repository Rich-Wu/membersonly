// const session = require("express-session");
// const LocalStrategy = require("passport-local").Strategy;
// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const passport = require("passport");
// require('dotenv').config();
//
// // Connect to MongoDB
// const mongoDB = process.env.dbInfo;
// mongoose.connect(mongoDB, { useNewUrlParser: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//
// module.exports = function(){
//   // Specifies Login Token Creation
//   passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });
//
//   // Specifies Login Token Check
//   passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//       done(err, user);
//     });
//   });
//
//   // // Specifies Login Strategy
//   // passport.use(
//   //   new LocalStrategy((email, password, done) => {
//   //     User.findOne({ email: email }, (err, user) => {
//   //       if (err) return done(err);
//   //       if (!user) {
//   //         return done(null, false, { msg: "Incorrect username" });
//   //       }
//   //       bcrypt.compare(password, user.password, (err, res) => {
//   //         if (res) {
//   //           // passwords match! log user in
//   //           return done(null, user)
//   //         } else {
//   //           // passwords do not match!
//   //           return done(null, false, { msg: "Incorrect password" })
//   //         }
  //       });
  //     });
  //   })
  // );
}

const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/user');

passport.use(new LocalStrategy((email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) return done(err);
    if (!user) {
      return done(null, false, {msg: "Invalid Username"});
    }
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        return done(null, user);
      } else {
        return done(null, false, {msg: "Incorrect password"});
      }
    });
  });
}));
