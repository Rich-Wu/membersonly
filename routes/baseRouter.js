const express = require('express');
const router = express.Router();
const passport = require("passport");

// Root View
router.get('/', (req, res, next) => {
  res.render('index', {title: "Posts"});
});

router.get('/login', (req, res, next) => {
  res.render('login_form', {title: "Login"});
});

router.post('/login', passport.authenticate('local', {
    successRedirect: "/",
    failureRediect: "/login"
  })
);


module.exports = router;
