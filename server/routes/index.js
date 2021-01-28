var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/get', function(req, res, next) {
  res.send('get');
});

router.post('/post', function(req, res, next) {
  res.send('post');
});
router.put('/put', function(req, res, next) {
  res.send('put');
});
router.delete('/delete', function(req, res, next) {
  res.send('delete');
});
module.exports = router;
