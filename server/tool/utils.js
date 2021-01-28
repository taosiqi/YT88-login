const utils = {
  GetRandomNum: (Min, Max) => {
    let Range = Max - Min;
    let Rand = Math.random();
    return (Min + Math.round(Rand * Range)).toString();
  }
};
module.exports = utils;
