
var express = require('express');
var router = express.Router();

// Home page route.
router.get('/', function (req, res) {
  res.send('Patient endpoint');
})

// About page route.
router.get('/about', function (req, res) {
  res.send('');
})

module.exports = router;