var express = require("express");
var router = express.Router();
const SoftKey = require("../tool/SoftKey");

const keyId = "e67e5dc74cfbb3fb"; //ukey设备id
const Key = "A46A6B5148DF374B19384DFCAEA44E21"; //增强密钥1
const myriad = "13212332423";

router.get("/login", function(req, res, next) {
  res.send({
    myriad: myriad
  });
});
router.get("/login/verify", function(req, res, next) {

  const mSoftKey = new SoftKey(); //创建增强算法类
  const m_StrEnc = mSoftKey.StrEnc(myriad, Key).toUpperCase();
  res.send({
    msg: req.query.KeyID == keyId && req.query.returnEncData == m_StrEnc
  });
});
module.exports = router;
