const express = require("express");
const router = express.Router();
const SoftKey = require("../tool/SoftKey");
const utils = require("../tool/utils");

router.get("/get", function(req, res, next) {
  const myriad = utils.GetRandomNum(1, 65535) + utils.GetRandomNum(1, 65535); //赋值随机数，以实现一次一密
  const Key = "A46A6B5148DF374B19384DFCAEA44E21";
  const mSoftKey = new SoftKey(); //创建增强算法类
  const m_StrEnc = mSoftKey.StrEnc("123456789123", Key);
  res.send(myriad);
});
module.exports = router;
