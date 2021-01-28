/**
 * 本项目基于https://www.npmjs.com/package/notp以及https://gitee.com/superzlc/otp/blob/master/otp.js
 * 原生JavaScript，未依赖第三方库，适用于uni-app，以及其他运行于JavaScript环境的框架项目。
 *
 * OTP 是 One-Time Password的简写，表示一次性密码。
 * HOTP 是HMAC-based One-Time Password的简写，表示基于HMAC算法加密的一次性密码。
 * 是事件同步，通过某一特定的事件次序及相同的种子值作为输入，通过HASH算法运算出一致的密码。
 * TOTP 是Time-based One-Time Password的简写，表示基于时间戳算法的一次性密码。
 * 是时间同步，基于客户端的动态口令和动态口令验证服务器的时间比对，一般每60秒产生一个新口令，要求客户端和服务器能够十分精确的保持正确的时钟，客户端和服务端基于时间计算的动态口令才能一致
 */

const CryptoJS = require('./crypto-js-sha1.js')
const hotp = {};

/**
 * 基于计数器使用秘钥secret生成一个一次性密码
 *
 * @return {String} 一次性密码
 *
 * Arguments:
 *
 *     key -密钥。每个用户都是唯一的，因为这是用于计算HMAC的种子
 *
 *     counter - 步进器的值。从0开始，如果使用hotp认证，这个值需要被存到数据库，googel authenticator的hotp验证码旁边有个刷新按钮，
 *	   每点击一次需要对counter做递增，这个只能二次开发，googel authenticator好像没得回调。
 *
 */
hotp.gen = function(key, opt) {
	key = key || '';
	opt = opt || {};
	let counter = opt.counter || 0;
	let p = 6;
	let v = otp_gen_number(counter, key);
	v = v + '';
	// 截断
	return v.substr(v.length - p, p);
}
/**
 * 基于计数器检查一次性密码。
 *
 * @return {Object} 为null表示失败, { delta: # } 表示成功
 * delta是客户端和服务器之间的步进差
 *
 * Arguments:
 *
 *     key - 密钥。每个用户都是唯一的，因为这是用于计算HMAC的种子
 *
 *     token - 密码验证，也就是用户提供的一次性密码
 *
 *     window - 检查指定范围内的一次性密码. 如果 window为5，步进counter为1000，则计算995到1005之间的
 *         Default - 50
 *
 *     counter - 步进器的值。如果使用hotp认证，这个值需要被存到数据库，googel authenticator的hotp验证码旁边有个刷新按钮，
 *	   每点击一次需要对counter做递增，这个只能二次开发googel authenticator。
 *
 */
hotp.verify = function(token, key, opt) {
	opt = opt || {};
	let window = opt.window || 50;
	let counter = opt.counter || 0;
	// 计算指定范围内的一次性密码，匹配到正确值后返回他的位置
	for (let i = counter - window; i <= counter + window; ++i) {
		opt.counter = i;
		if (this.gen(key, opt) === token) {
			return {
				delta: i - counter
			};
		}
	}
	// 没有匹配的代码，返回null
	return null;
}

const totp = {};

/**
 * 生成一个基于时间戳的一次性密码
 *
 * @return {String} 一次性密码
 *
 * Arguments:
 *     key -密钥。每个用户都是唯一的，因为这是用于计算HMAC的种子
 *
 *     time - 计时器的步进，生成一次性密码的间隔
 *
 *         Default - 30
 *
 */
totp.gen = function(key, opt) {
	opt = opt || {};
	let time = opt.time || 30;
	let _t = new Date().getTime();
	// 如果opt里面传了时间戳，就用传进来的(生成特点时间的一次性密码)
	if (opt._t) {
		_t = opt._t;
	}
	// 计算步进数，时间戳除以间隔
	opt.counter = Math.floor((_t / 1000) / time);
	return hotp.gen(key, opt);
}
/**
 * 基于时间戳检查一次性密码
 *
 * @return {Object} 为null表示失败, { delta: # } 表示成功
 * delta是客户端和服务器之间的步进差
 *
 * Arguments:
 *
 *     key - 密钥。每个用户都是唯一的，因为这是用于计算HMAC的种子
 *
 *     token -密码验证，也就是用户提供的一次性密码
 *
 *     window - 检查指定范围内的一次性密码. 如果 window为5，步进counter为1000，则计算995到1005之间的
 *         Default - 6
 *
 *     time - 计时器的步进，一般是30秒，每30秒一个一次性密码 ，和totp.gen的参数必须一样
 *
 *         Default - 30
 *
 */
totp.verify = function(token, key, opt) {
	opt = opt || {};
	let time = opt.time || 30;
	let _t = new Date().getTime();
	// 如果opt里面传了时间戳，就用传进来的(检验特点时间的一次性密码)
	if (opt._t) {
		_t = opt._t;
	}
	// 计算步进数，时间戳除以间隔
	opt.counter = Math.floor((_t / 1000) / time);

	return hotp.verify(token, key, opt);
}

// 需要使用CryptoJS的HmacSHA1、WordArray，counter是32bit数字
let otp_gen_number = function(counter, secret) {
	// 这一波操作没看懂 噗
	let low = counter & 0xffffffff;
	let high = Math.floor(counter / 4294967296); // 没有long类型，使用除以2^32代替右移32位
	let message = CryptoJS.lib.WordArray.create([high, low], 8);
	let wordArray = CryptoJS.HmacSHA1(message, secret);
	let num = convert(wordArray);
	return num;
}
let convert = function(wordArray) {
	let bytes20 = [];
	// 转换成bytearray
	for (let i = 0, j = 0; i < 5; i++) {
		let v = wordArray.words[i];
		bytes20[j++] = ((v >> 24) & 0xFF);
		bytes20[j++] = ((v >> 16) & 0xFF);
		bytes20[j++] = ((v >> 8) & 0xFF);
		bytes20[j++] = ((v >> 0) & 0xFF);
	}
	// 转换成数字 截断
	let offset = bytes20[19] & 0xf;
	let v = (bytes20[offset] & 0x7F) << 24 |
		(bytes20[offset + 1] & 0xFF) << 16 |
		(bytes20[offset + 2] & 0xFF) << 8 |
		(bytes20[offset + 3] & 0xFF);
	return v;
}
module.exports.hotp = hotp;
module.exports.totp = totp;
