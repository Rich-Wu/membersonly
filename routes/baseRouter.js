const express = require('express');
const router = express.Router();

// Root View
router.get('/', (req, res, next) => {
  res.render('index');
})

module.exports = router;