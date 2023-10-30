const express = require('express');
const router = express.Router();

/* GET basic route */
router.get('/', function(req, res, next) {
  res.status(200).json({ message: 'Welcome to Taroko Server' });
});

module.exports = router;
