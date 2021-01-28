/**
 * CryptoJS
 * http://github.com/brix/crypto-js
 * 只包含了core、hmac、sha1三块
 * 本文件来源https://gitee.com/superzlc/otp/blob/master/otp.js
 **/
var CryptoJS = CryptoJS || (function(Math, undefined) {
	var create = Object.create || (function() {
		function F() {}
		return function(obj) {
			var subtype;
			F.prototype = obj;
			subtype = new F();
			F.prototype = null;
			return subtype
		}
	}());
	var C = {};
	var C_lib = C.lib = {};
	var Base = C_lib.Base = (function() {
		return {
			extend: function(overrides) {
				var subtype = create(this);
				if (overrides) {
					subtype.mixIn(overrides)
				}
				if (!subtype.hasOwnProperty("init") || this.init === subtype.init) {
					subtype.init = function() {
						subtype.$super.init.apply(this, arguments)
					}
				}
				subtype.init.prototype = subtype;
				subtype.$super = this;
				return subtype
			},
			create: function() {
				var instance = this.extend();
				instance.init.apply(instance, arguments);
				return instance
			},
			init: function() {},
			mixIn: function(properties) {
				for (var propertyName in properties) {
					if (properties.hasOwnProperty(propertyName)) {
						this[propertyName] = properties[propertyName]
					}
				}
				if (properties.hasOwnProperty("toString")) {
					this.toString = properties.toString
				}
			},
			clone: function() {
				return this.init.prototype.extend(this)
			}
		}
	}());
	var WordArray = C_lib.WordArray = Base.extend({
		init: function(words, sigBytes) {
			words = this.words = words || [];
			if (sigBytes != undefined) {
				this.sigBytes = sigBytes
			} else {
				this.sigBytes = words.length * 4
			}
		},
		toString: function(encoder) {
			return (encoder || Hex).stringify(this)
		},
		concat: function(wordArray) {
			var thisWords = this.words;
			var thatWords = wordArray.words;
			var thisSigBytes = this.sigBytes;
			var thatSigBytes = wordArray.sigBytes;
			this.clamp();
			if (thisSigBytes % 4) {
				for (var i = 0; i < thatSigBytes; i++) {
					var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 255;
					thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8)
				}
			} else {
				for (var i = 0; i < thatSigBytes; i += 4) {
					thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2]
				}
			}
			this.sigBytes += thatSigBytes;
			return this
		},
		clamp: function() {
			var words = this.words;
			var sigBytes = this.sigBytes;
			words[sigBytes >>> 2] &= 4294967295 << (32 - (sigBytes % 4) * 8);
			words.length = Math.ceil(sigBytes / 4)
		},
		clone: function() {
			var clone = Base.clone.call(this);
			clone.words = this.words.slice(0);
			return clone
		},
		random: function(nBytes) {
			var words = [];
			var r = function(m_w) {
				var m_w = m_w;
				var m_z = 987654321;
				var mask = 4294967295;
				return function() {
					m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
					m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
					var result = ((m_z << 16) + m_w) & mask;
					result /= 4294967296;
					result += 0.5;
					return result * (Math.random() > 0.5 ? 1 : -1)
				}
			};
			for (var i = 0, rcache; i < nBytes; i += 4) {
				var _r = r((rcache || Math.random()) * 4294967296);
				rcache = _r() * 987654071;
				words.push((_r() * 4294967296) | 0)
			}
			return new WordArray.init(words, nBytes)
		}
	});
	var C_enc = C.enc = {};
	var Hex = C_enc.Hex = {
		stringify: function(wordArray) {
			var words = wordArray.words;
			var sigBytes = wordArray.sigBytes;
			var hexChars = [];
			for (var i = 0; i < sigBytes; i++) {
				var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 255;
				hexChars.push((bite >>> 4).toString(16));
				hexChars.push((bite & 15).toString(16))
			}
			return hexChars.join("")
		},
		parse: function(hexStr) {
			var hexStrLength = hexStr.length;
			var words = [];
			for (var i = 0; i < hexStrLength; i += 2) {
				words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4)
			}
			return new WordArray.init(words, hexStrLength / 2)
		}
	};
	var Latin1 = C_enc.Latin1 = {
		stringify: function(wordArray) {
			var words = wordArray.words;
			var sigBytes = wordArray.sigBytes;
			var latin1Chars = [];
			for (var i = 0; i < sigBytes; i++) {
				var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 255;
				latin1Chars.push(String.fromCharCode(bite))
			}
			return latin1Chars.join("")
		},
		parse: function(latin1Str) {
			var latin1StrLength = latin1Str.length;
			var words = [];
			for (var i = 0; i < latin1StrLength; i++) {
				words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << (24 - (i % 4) * 8)
			}
			return new WordArray.init(words, latin1StrLength)
		}
	};
	var Utf8 = C_enc.Utf8 = {
		stringify: function(wordArray) {
			try {
				return decodeURIComponent(escape(Latin1.stringify(wordArray)))
			} catch (e) {
				throw new Error("Malformed UTF-8 data")
			}
		},
		parse: function(utf8Str) {
			return Latin1.parse(unescape(encodeURIComponent(utf8Str)))
		}
	};
	var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
		reset: function() {
			this._data = new WordArray.init();
			this._nDataBytes = 0
		},
		_append: function(data) {
			if (typeof data == "string") {
				data = Utf8.parse(data)
			}
			this._data.concat(data);
			this._nDataBytes += data.sigBytes
		},
		_process: function(doFlush) {
			var processedWords;
			var data = this._data;
			var dataWords = data.words;
			var dataSigBytes = data.sigBytes;
			var blockSize = this.blockSize;
			var blockSizeBytes = blockSize * 4;
			var nBlocksReady = dataSigBytes / blockSizeBytes;
			if (doFlush) {
				nBlocksReady = Math.ceil(nBlocksReady)
			} else {
				nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0)
			}
			var nWordsReady = nBlocksReady * blockSize;
			var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
			if (nWordsReady) {
				for (var offset = 0; offset < nWordsReady; offset += blockSize) {
					this._doProcessBlock(dataWords, offset)
				}
				processedWords = dataWords.splice(0, nWordsReady);
				data.sigBytes -= nBytesReady
			}
			return new WordArray.init(processedWords, nBytesReady)
		},
		clone: function() {
			var clone = Base.clone.call(this);
			clone._data = this._data.clone();
			return clone
		},
		_minBufferSize: 0
	});
	var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
		cfg: Base.extend(),
		init: function(cfg) {
			this.cfg = this.cfg.extend(cfg);
			this.reset()
		},
		reset: function() {
			BufferedBlockAlgorithm.reset.call(this);
			this._doReset()
		},
		update: function(messageUpdate) {
			this._append(messageUpdate);
			this._process();
			return this
		},
		finalize: function(messageUpdate) {
			if (messageUpdate) {
				this._append(messageUpdate)
			}
			var hash = this._doFinalize();
			return hash
		},
		blockSize: 512 / 32,
		_createHelper: function(hasher) {
			return function(message, cfg) {
				return new hasher.init(cfg).finalize(message)
			}
		},
		_createHmacHelper: function(hasher) {
			return function(message, key) {
				return new C_algo.HMAC.init(hasher, key).finalize(message)
			}
		}
	});
	var C_algo = C.algo = {};
	return C
}(Math));

(function() {
	var C = CryptoJS;
	var C_lib = C.lib;
	var Base = C_lib.Base;
	var C_enc = C.enc;
	var Utf8 = C_enc.Utf8;
	var C_algo = C.algo;
	var HMAC = C_algo.HMAC = Base.extend({
		init: function(hasher, key) {
			hasher = this._hasher = new hasher.init();
			if (typeof key == "string") {
				key = Utf8.parse(key)
			}
			var hasherBlockSize = hasher.blockSize;
			var hasherBlockSizeBytes = hasherBlockSize * 4;
			if (key.sigBytes > hasherBlockSizeBytes) {
				key = hasher.finalize(key)
			}
			key.clamp();
			var oKey = this._oKey = key.clone();
			var iKey = this._iKey = key.clone();
			var oKeyWords = oKey.words;
			var iKeyWords = iKey.words;
			for (var i = 0; i < hasherBlockSize; i++) {
				oKeyWords[i] ^= 1549556828;
				iKeyWords[i] ^= 909522486
			}
			oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
			this.reset()
		},
		reset: function() {
			var hasher = this._hasher;
			hasher.reset();
			hasher.update(this._iKey)
		},
		update: function(messageUpdate) {
			this._hasher.update(messageUpdate);
			return this
		},
		finalize: function(messageUpdate) {
			var hasher = this._hasher;
			var innerHash = hasher.finalize(messageUpdate);
			hasher.reset();
			var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));
			return hmac
		}
	})
}());
(function() {
	var C = CryptoJS;
	var C_lib = C.lib;
	var WordArray = C_lib.WordArray;
	var Hasher = C_lib.Hasher;
	var C_algo = C.algo;
	var W = [];
	var SHA1 = C_algo.SHA1 = Hasher.extend({
		_doReset: function() {
			this._hash = new WordArray.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
		},
		_doProcessBlock: function(M, offset) {
			var H = this._hash.words;
			var a = H[0];
			var b = H[1];
			var c = H[2];
			var d = H[3];
			var e = H[4];
			for (var i = 0; i < 80; i++) {
				if (i < 16) {
					W[i] = M[offset + i] | 0
				} else {
					var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
					W[i] = (n << 1) | (n >>> 31)
				}
				var t = ((a << 5) | (a >>> 27)) + e + W[i];
				if (i < 20) {
					t += ((b & c) | (~b & d)) + 1518500249
				} else {
					if (i < 40) {
						t += (b ^ c ^ d) + 1859775393
					} else {
						if (i < 60) {
							t += ((b & c) | (b & d) | (c & d)) - 1894007588
						} else {
							t += (b ^ c ^ d) - 899497514
						}
					}
				}
				e = d;
				d = c;
				c = (b << 30) | (b >>> 2);
				b = a;
				a = t
			}
			H[0] = (H[0] + a) | 0;
			H[1] = (H[1] + b) | 0;
			H[2] = (H[2] + c) | 0;
			H[3] = (H[3] + d) | 0;
			H[4] = (H[4] + e) | 0
		},
		_doFinalize: function() {
			var data = this._data;
			var dataWords = data.words;
			var nBitsTotal = this._nDataBytes * 8;
			var nBitsLeft = data.sigBytes * 8;
			dataWords[nBitsLeft >>> 5] |= 128 << (24 - nBitsLeft % 32);
			dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 4294967296);
			dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
			data.sigBytes = dataWords.length * 4;
			this._process();
			return this._hash
		},
		clone: function() {
			var clone = Hasher.clone.call(this);
			clone._hash = this._hash.clone();
			return clone
		}
	});
	C.SHA1 = Hasher._createHelper(SHA1);
	C.HmacSHA1 = Hasher._createHmacHelper(SHA1)
}());


module.exports = CryptoJS;
