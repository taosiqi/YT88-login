var express = require('express');
var router = express.Router();
var notp = require('notp');
var base32 = require('thirty-two');
var SoftKey = require('./SoftKey');
/* GET users listing. */
router.get('/', function(req, res, next) {
  Key = "A46A6B5148DF374B19384DFCAEA44E21";
  var mSoftKey = new SoftKey(); //创建增强算法类
  var m_StrEnc = mSoftKey.StrEnc('123456789123', Key);
  res.send(m_StrEnc);
  // 对应的上 odk
});

/* GET users listing. */
router.get('/uuid', function(req, res, next) {
  res.send(uuidv4()); //01536ebb-5870-4fe2-80ff-b818c435e795
});

module.exports = router;
