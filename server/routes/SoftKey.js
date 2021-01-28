// JScript source code
var SoftKey=class SoftKey {
    constructor() {
    }
    StrEnc = function (InString, Key) {
        var n;
        var m;
        var nlen;

        var b = Buffer.from(InString);
        var zero_buf = Buffer.from([0]);
        b = Buffer.concat([b, zero_buf]);
        nlen = b.length;
        if (b.length < 8) {
            nlen = 8;
        }

        var outb = Buffer.alloc(nlen);
        var inb = Buffer.alloc(nlen);
        b.copy(inb);//如果少于8，则会补0，这里主要是用于补0
        b.copy(outb);


        for (n = 0; n <= (nlen - 8); n = n + 8) {
            var tmpoutb = this.sub_EnCode(inb, n, Key);
            for (m = 0; m < 8; m++) {
                outb[m + n] = tmpoutb[m];
            }
        }

        return outb.toString('hex');
    }

    StrDec = function (InString, Key)//
    {
        var n, m;
        var inb = new Buffer(InString, 'hex');
        var outb = Buffer.alloc(inb.length);
        inb.copy(outb);

        for (n = 0; n <= inb.length - 8; n = n + 8) {
            var tmpoutb = this.sub_DeCode(inb, n, Key);
            for (m = 0; m < 8; m++) {
                outb[m + n] = tmpoutb[m];
            }
        }

        return outb.toString();
    }

    EnCode = function (inb, Key) {
        this.sub_EnCode(inb, 0, Key);
    }

    sub_EnCode = function (inb, pos, Key) {
        var cnDelta, y, z, a, b, c, d;
        var outb = new Uint8Array(8);
        var n, i, nlen;
        var sum;
        var temp, temp_1;

        var buf = new Array(16);
        var temp_string;

        cnDelta = 2654435769;
        sum = 0;

        nlen = Key.length;
        i = 0;
        for (n = 1; n <= nlen; n = n + 2) {
            temp_string = Key.substring(n - 1, n - 1 + 2);
            buf[i] = this.HexToInt(temp_string);
            i = i + 1;
        }
        a = 0;
        b = 0;
        c = 0;
        d = 0;
        for (n = 0; n <= 3; n++) {
            a = (buf[n] << (n * 8)) | a;
            b = (buf[n + 4] << (n * 8)) | b;
            c = (buf[n + 4 + 4] << (n * 8)) | c;
            d = (buf[n + 4 + 4 + 4] << (n * 8)) | d;
        }

        y = 0;
        z = 0;
        for (n = 0; n <= 3; n++) {
            y = (inb[n + pos] << (n * 8)) | y;
            z = (inb[n + 4 + pos] << (n * 8)) | z;
        }

        n = 32;

        while (n > 0) {
            sum = cnDelta + sum;

            temp = (z << 4) & 0xFFFFFFFF;

            temp = (temp + a) & 0xFFFFFFFF;
            temp_1 = (z + sum) & 0xFFFFFFFF;
            temp = (temp ^ temp_1) & 0xFFFFFFFF;
            temp_1 = (z >>> 5) & 0xFFFFFFFF;
            temp_1 = (temp_1 + b) & 0xFFFFFFFF;
            temp = (temp ^ temp_1) & 0xFFFFFFFF;
            temp = (temp + y) & 0xFFFFFFFF;
            y = temp & 0xFFFFFFFF;
            // y += ((z << 4) + a) ^ (z + sum) ^ ((z >> 5) + b);

            temp = (y << 4) & 0xFFFFFFFF;
            temp = (temp + c) & 0xFFFFFFFF;
            temp_1 = (y + sum) & 0xFFFFFFFF;
            temp = (temp ^ temp_1) & 0xFFFFFFFF;
            temp_1 = (y >>> 5) & 0xFFFFFFFF;
            temp_1 = (temp_1 + d) & 0xFFFFFFFF;
            temp = (temp ^ temp_1) & 0xFFFFFFFF;
            temp = (z + temp) & 0xFFFFFFFF;
            z = temp & 0xFFFFFFFF;
            //  z += ((y << 4) + c) ^ (y + sum) ^ ((y >> 5) + d);

            n = n - 1;

        }

        for (n = 0; n <= 3; n++) {
            outb[n] = ((y >>> (n * 8)) & 255);
            outb[n + 4] = ((z >>> (n * 8)) & 255);
        }
        return outb;

    }

    DeCode = function () {
        sub_DeCode(inb, 0, Key);
    }

    sub_DeCode = function (inb, pos, Key) {
        var cnDelta, y, z, a, b, c, d;
        var outb = new Uint8Array(8);
        var n, i, nlen;
        var sum;
        var temp, temp_1;

        var buf = new Array(16);
        var temp_string;

        cnDelta = 2654435769;
        sum = 3337565984;

        nlen = Key.length;
        i = 0;
        for (n = 1; n <= nlen; n = n + 2) {
            temp_string = Key.substring(n - 1, n - 1 + 2);
            buf[i] = this.HexToInt(temp_string);
            i = i + 1;
        }
        a = 0;
        b = 0;
        c = 0;
        d = 0;
        for (n = 0; n <= 3; n++) {
            a = (buf[n] << (n * 8)) | a;
            b = (buf[n + 4] << (n * 8)) | b;
            c = (buf[n + 4 + 4] << (n * 8)) | c;
            d = (buf[n + 4 + 4 + 4] << (n * 8)) | d;
        }

        y = 0;
        z = 0;
        for (n = 0; n <= 3; n++) {
            y = (inb[n + pos] << (n * 8)) | y;
            z = (inb[n + 4 + pos] << (n * 8)) | z;
        }

        n = 32;

        while (n > 0) {

            temp = (y << 4) & 0xFFFFFFFF;
            temp = (temp + c) & 0xFFFFFFFF;
            temp_1 = (y + sum) & 0xFFFFFFFF;
            temp = (temp ^ temp_1) & 0xFFFFFFFF;
            temp_1 = (y >>> 5) & 0xFFFFFFFF;
            temp_1 = (temp_1 + d) & 0xFFFFFFFF;
            temp = (temp ^ temp_1) & 0xFFFFFFFF;
            temp = (z - temp) & 0xFFFFFFFF;
            z = temp & 0xFFFFFFFF;
            //  z += ((y << 4) + c) ^ (y + sum) ^ ((y >> 5) + d);

            temp = (z << 4) & 0xFFFFFFFF;
            temp = (temp + a) & 0xFFFFFFFF;
            temp_1 = (z + sum) & 0xFFFFFFFF;
            temp = (temp ^ temp_1) & 0xFFFFFFFF;
            temp_1 = (z >>> 5) & 0xFFFFFFFF;
            temp_1 = (temp_1 + b) & 0xFFFFFFFF;
            temp = (temp ^ temp_1) & 0xFFFFFFFF;
            temp = (y - temp) & 0xFFFFFFFF;
            y = temp & 0xFFFFFFFF;
            // y += ((z << 4) + a) ^ (z + sum) ^ ((z >> 5) + b);


            sum = sum - cnDelta;
            n = n - 1;

        }

        for (n = 0; n <= 3; n++) {
            outb[n] = ((y >>> (n * 8)) & 255);
            outb[n + 4] = ((z >>> (n * 8)) & 255);
        }
        return outb;

    }

    /////////////////////
    AddZero = function (InKey) {
        var nlen;
        var n;
        nlen = InKey.length;
        for (n = nlen; n <= 7; n++) {
            InKey = "0" + InKey;
        }
        return InKey;
    }

    myconvert = function (HKey, LKey) {
        HKey = this.AddZero(HKey);
        LKey = this.AddZero(LKey);
        var out_data = new Uint8Array(8)
        var n;
        for (n = 0; n <= 3; n++) {
            out_data[n] = this.HexToInt(HKey.substring(n * 2, n * 2 + 2));
        }
        for (n = 0; n <= 3; n++) {
            out_data[n + 4] = this.HexToInt(LKey.substring(n * 2, n * 2 + 2));
        }
        return out_data;
    }

////bin2hex  & hex2bin
    ByteArrayToHexString = function (Inb, len) {
        var outstring = "";
        for (var n = 0; n <= len - 1; n++) {
            outstring = outstring + this.myhex(Inb[n]);
        }
        return outstring;
    }

    HexStringToByteArray = function (InString) {
        var nlen;
        var retutn_len;
        var n, i;
        var b;
        var temp;
        nlen = InString.length;
        if (nlen < 16) retutn_len = 16;
        retutn_len = nlen / 2;
        b = new Uint8Array(retutn_len);
        i = 0;
        for (n = 0; n < nlen; n = n + 2) {
            temp = InString.substring(n, n + 2);
            b[i] = this.HexToInt(temp);
            i = i + 1;
        }
        return b;
    }
    ////////


//decimal to hex && hex2dec
    myhex = function (value) {
        if (value < 16)
            return '0' + value.toString(16);
        return value.toString(16);
    };


    HexToInt = function (s) {
        var hexch = "0123456789ABCDEF";
        var i, j;
        var r, n, k;
        var ch;
        s = s.toUpperCase();

        k = 1;
        r = 0;
        for (i = s.length; i > 0; i--) {
            ch = s.substring(i - 1, i - 1 + 1);
            n = 0;
            for (j = 0; j < 16; j++) {
                if (ch == hexch.substring(j, j + 1)) {
                    n = j;
                }
            }
            r += (n * k);
            k *= 16;
        }
        return r;
    };


}
module.exports = SoftKey;
