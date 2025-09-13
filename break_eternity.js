(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Decimal = factory());
})(this, (function () { 'use strict';
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  var LRUCache = function () {
    function LRUCache(maxSize) {
      _classCallCheck(this, LRUCache);
      this.map = new Map();
      this.first = undefined;
      this.last = undefined;
      this.maxSize = maxSize;
    }
    _createClass(LRUCache, [{
      key: "size",
      get: function get() {
        return this.map.size;
      }
    }, {
      key: "get",
      value: function get(key) {
        var node = this.map.get(key);
        if (node === undefined) {
          return undefined;
        }
        if (node !== this.first) {
          if (node === this.last) {
            this.last = node.prev;
            this.last.next = undefined;
          } else {
            node.prev.next = node.next;
            node.next.prev = node.prev;
          }
          node.next = this.first;
          this.first.prev = node;
          this.first = node;
        }
        return node.value;
      }
    }, {
      key: "set",
      value: function set(key, value) {
        if (this.maxSize < 1) {
          return;
        }
        if (this.map.has(key)) {
          throw new Error("Cannot update existing keys in the cache");
        }
        var node = new ListNode(key, value);
        if (this.first === undefined) {
          this.first = node;
          this.last = node;
        } else {
          node.next = this.first;
          this.first.prev = node;
          this.first = node;
        }
        this.map.set(key, node);
        while (this.map.size > this.maxSize) {
          var last = this.last;
          this.map["delete"](last.key);
          this.last = last.prev;
          this.last.next = undefined;
        }
      }
    }]);
    return LRUCache;
  }();
  var ListNode = _createClass(function ListNode(key, value) {
    _classCallCheck(this, ListNode);
    this.next = undefined;
    this.prev = undefined;
    this.key = key;
    this.value = value;
  });
  var MAX_SIGNIFICANT_DIGITS = 17;
  var EXP_LIMIT = 9e15;
  var LAYER_DOWN = Math.log10(9e15);
  var FIRST_NEG_LAYER = 1 / 9e15;
  var NUMBER_EXP_MAX = 308;
  var NUMBER_EXP_MIN = -324;
  var MAX_ES_IN_A_ROW = 5;
  var DEFAULT_FROM_STRING_CACHE_SIZE = (1 << 10) - 1;
  var powerOf10 = function () {
    var powersOf10 = [];
    for (var i = NUMBER_EXP_MIN + 1; i <= NUMBER_EXP_MAX; i++) {
      powersOf10.push(Number("1e" + i));
    }
    var indexOf0InPowersOf10 = 323;
    return function (power) {
      return powersOf10[power + indexOf0InPowersOf10];
    };
  }();
  var critical_headers = [2, Math.E, 3, 4, 5, 6, 7, 8, 9, 10];
  var critical_tetr_values = [[
  1, 1.0891180521811202527, 1.1789767925673958433, 1.2701455431742086633, 1.3632090180450091941, 1.4587818160364217007, 1.5575237916251418333, 1.6601571006859253673, 1.7674858188369780435, 1.8804192098842727359, 2], [
  1, 1.1121114330934078681, 1.2310389249316089299, 1.3583836963111376089, 1.4960519303993531879, 1.6463542337511945810, 1.8121385357018724464, 1.9969713246183068478, 2.2053895545527544330, 2.4432574483385252544, Math.E
  ], [
  1, 1.1187738849693603, 1.2464963939368214, 1.38527004705667, 1.5376664685821402, 1.7068895236551784, 1.897001227148399, 2.1132403089001035, 2.362480153784171, 2.6539010333870774, 3], [
  1, 1.1367350847096405, 1.2889510672956703, 1.4606478703324786, 1.6570295196661111, 1.8850062585672889, 2.1539465047453485, 2.476829779693097, 2.872061932789197, 3.3664204535587183, 4], [
  1, 1.1494592900767588, 1.319708228183931, 1.5166291280087583, 1.748171114438024, 2.0253263297298045, 2.3636668498288547, 2.7858359149579424, 3.3257226212448145, 4.035730287722532, 5], [
  1, 1.159225940787673, 1.343712473580932, 1.5611293155111927, 1.8221199554561318, 2.14183924486326, 2.542468319282638, 3.0574682501653316, 3.7390572020926873, 4.6719550537360774, 6], [
  1, 1.1670905356972596, 1.3632807444991446, 1.5979222279405536, 1.8842640123816674, 2.2416069644878687, 2.69893426559423, 3.3012632110403577, 4.121250340630164, 5.281493033448316, 7], [
  1, 1.1736630594087796, 1.379783782386201, 1.6292821855668218, 1.9378971836180754, 2.3289975651071977, 2.8384347394720835, 3.5232708454565906, 4.478242031114584, 5.868592169644505, 8], [
  1, 1.1793017514670474, 1.394054150657457, 1.65664127441059, 1.985170999970283, 2.4069682290577457, 2.9647310119960752, 3.7278665320924946, 4.814462547283592, 6.436522247411611, 9], [
  1, 1.1840100246247336579, 1.4061375836156954169, 1.6802272208863963918, 2.026757028388618927, 2.4770056063449647580, 3.0805252717554819987, 3.9191964192627283911, 5.1351528408331864230, 6.9899611795347148455, 10]];
  var critical_slog_values = [[
  -1, -0.9194161097107025, -0.8335625019330468, -0.7425599821143978, -0.6466611521029437, -0.5462617907227869, -0.4419033816638769, -0.3342645487554494, -0.224140440909962, -0.11241087890006762, 0], [
  -1, -0.90603157029014, -0.80786507256596, -0.7064666939634, -0.60294836853664, -0.49849837513117, -0.39430303318768, -0.29147201034755, -0.19097820800866, -0.09361896280296, 0
  ], [
  -1, -0.9021579584316141, -0.8005762598234203, -0.6964780623319391, -0.5911906810998454, -0.486050182576545, -0.3823089430815083, -0.28106046722897615, -0.1831906535795894, -0.08935809204418144, 0], [
  -1, -0.8917227442365535, -0.781258746326964, -0.6705130326902455, -0.5612813129406509, -0.4551067709033134, -0.35319256652135966, -0.2563741554088552, -0.1651412821106526, -0.0796919581982668, 0], [
  -1, -0.8843387974366064, -0.7678744063886243, -0.6529563724510552, -0.5415870994657841, -0.4352842206588936, -0.33504449124791424, -0.24138853420685147, -0.15445285440944467, -0.07409659641336663, 0], [
  -1, -0.8786709358426346, -0.7577735191184886, -0.6399546189952064, -0.527284921869926, -0.4211627631006314, -0.3223479611761232, -0.23107655627789858, -0.1472057700818259, -0.07035171210706326, 0], [
  -1, -0.8740862815291583, -0.7497032990976209, -0.6297119746181752, -0.5161838335958787, -0.41036238255751956, -0.31277212146489963, -0.2233976621705518, -0.1418697367979619, -0.06762117662323441, 0], [
  -1, -0.8702632331800649, -0.7430366914122081, -0.6213373075161548, -0.5072025698095242, -0.40171437727184167, -0.30517930701410456, -0.21736343968190863, -0.137710238299109, -0.06550774483471955, 0], [
  -1, -0.8670016295947213, -0.7373984232432306, -0.6143173985094293, -0.49973884395492807, -0.394584953527678, -0.2989649949848695, -0.21245647317021688, -0.13434688362382652, -0.0638072667348083, 0], [
  -1, -0.8641642839543857, -0.732534623168535, -0.6083127477059322, -0.4934049257184696, -0.3885773075899922, -0.29376029055315767, -0.2083678561173622, -0.13155653399373268, -0.062401588652553186, 0]];
  var D = function D(value) {
    return Decimal.fromValue_noAlloc(value);
  };
  var FC = function FC(sign, layer, mag) {
    return Decimal.fromComponents(sign, layer, mag);
  };
  var FC_NN = function FC_NN(sign, layer, mag) {
    return Decimal.fromComponents_noNormalize(sign, layer, mag);
  };
  var decimalPlaces = function decimalPlaces(value, places) {
    var len = places + 1;
    var numDigits = Math.ceil(Math.log10(Math.abs(value)));
    var rounded = Math.round(value * Math.pow(10, len - numDigits)) * Math.pow(10, numDigits - len);
    return parseFloat(rounded.toFixed(Math.max(len - numDigits, 0)));
  };
  var f_maglog10 = function f_maglog10(n) {
    return Math.sign(n) * Math.log10(Math.abs(n));
  };
  var f_gamma = function f_gamma(n) {
    if (!isFinite(n)) {
      return n;
    }
    if (n < -50) {
      if (n === Math.trunc(n)) {
        return Number.NEGATIVE_INFINITY;
      }
      return 0;
    }
    var scal1 = 1;
    while (n < 10) {
      scal1 = scal1 * n;
      ++n;
    }
    n -= 1;
    var l = 0.9189385332046727;
    l = l + (n + 0.5) * Math.log(n);
    l = l - n;
    var n2 = n * n;
    var np = n;
    l = l + 1 / (12 * np);
    np = np * n2;
    l = l - 1 / (360 * np);
    np = np * n2;
    l = l + 1 / (1260 * np);
    np = np * n2;
    l = l - 1 / (1680 * np);
    np = np * n2;
    l = l + 1 / (1188 * np);
    np = np * n2;
    l = l - 691 / (360360 * np);
    np = np * n2;
    l = l + 7 / (1092 * np);
    np = np * n2;
    l = l - 3617 / (122400 * np);
    return Math.exp(l) / scal1;
  };
  var _EXPN1 = 0.36787944117144232159553;
  var OMEGA = 0.56714329040978387299997;
  var f_lambertw = function f_lambertw(z) {
    var tol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e-10;
    var principal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var w;
    var wn;
    if (!Number.isFinite(z)) {
      return z;
    }
    if (principal) {
      if (z === 0) {
        return z;
      }
      if (z === 1) {
        return OMEGA;
      }
      if (z < 10) {
        w = 0;
      } else {
        w = Math.log(z) - Math.log(Math.log(z));
      }
    } else {
      if (z === 0) return -Infinity;
      if (z <= -0.1) {
        w = -2;
      } else {
        w = Math.log(-z) - Math.log(-Math.log(-z));
      }
    }
    for (var i = 0; i < 100; ++i) {
      wn = (z * Math.exp(-w) + w * w) / (w + 1);
      if (Math.abs(wn - w) < tol * Math.abs(wn)) {
        return wn;
      } else {
        w = wn;
      }
    }
    throw Error("Iteration failed to converge: ".concat(z.toString()));
  };
  function d_lambertw(z) {
    var tol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e-10;
    var principal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var w;
    var ew, wewz, wn;
    if (!Number.isFinite(z.mag)) {
      return new Decimal(z);
    }
    if (principal) {
      if (z.eq(Decimal.dZero)) {
        return FC_NN(0, 0, 0);
      }
      if (z.eq(Decimal.dOne)) {
        return Decimal.fromNumber(OMEGA);
      }
      w = Decimal.ln(z);
    } else {
      if (z.eq(Decimal.dZero)) {
        return new Decimal(Decimal.dNegInf);
      }
      w = Decimal.ln(z.neg());
    }
    for (var i = 0; i < 100; ++i) {
      ew = w.neg().exp();
      wewz = w.sub(z.mul(ew));
      wn = w.sub(wewz.div(w.add(1).sub(w.add(2).mul(wewz).div(Decimal.mul(2, w).add(2)))));
      if (Decimal.abs(wn.sub(w)).lt(Decimal.abs(wn).mul(tol))) {
        return wn;
      } else {
        w = wn;
      }
    }
    throw Error("Iteration failed to converge: ".concat(z.toString()));
  }
  var Decimal = function () {
    function Decimal(value) {
      _classCallCheck(this, Decimal);
      this.sign = 0;
      this.mag = 0;
      this.layer = 0;
      if (value instanceof Decimal) {
        this.fromDecimal(value);
      } else if (typeof value === "number") {
        this.fromNumber(value);
      } else if (typeof value === "string") {
        this.fromString(value);
      }
    }
    _createClass(Decimal, [{
      key: "m",
      get: function get() {
        if (this.sign === 0) {
          return 0;
        } else if (this.layer === 0) {
          var exp = Math.floor(Math.log10(this.mag));
          var man;
          if (this.mag === 5e-324) {
            man = 5;
          } else {
            man = this.mag / powerOf10(exp);
          }
          return this.sign * man;
        } else if (this.layer === 1) {
          var residue = this.mag - Math.floor(this.mag);
          return this.sign * Math.pow(10, residue);
        } else {
          return this.sign;
        }
      },
      set: function set(value) {
        if (this.layer <= 2) {
          this.fromMantissaExponent(value, this.e);
        } else {
          this.sign = Math.sign(value);
          if (this.sign === 0) {
            this.layer = 0;
            this.exponent = 0;
          }
        }
      }
    }, {
      key: "e",
      get: function get() {
        if (this.sign === 0) {
          return 0;
        } else if (this.layer === 0) {
          return Math.floor(Math.log10(this.mag));
        } else if (this.layer === 1) {
          return Math.floor(this.mag);
        } else if (this.layer === 2) {
          return Math.floor(Math.sign(this.mag) * Math.pow(10, Math.abs(this.mag)));
        } else {
          return this.mag * Number.POSITIVE_INFINITY;
        }
      },
      set: function set(value) {
        this.fromMantissaExponent(this.m, value);
      }
    }, {
      key: "s",
      get: function get() {
        return this.sign;
      },
      set: function set(value) {
        if (value === 0) {
          this.sign = 0;
          this.layer = 0;
          this.mag = 0;
        } else {
          this.sign = value;
        }
      }
    }, {
      key: "mantissa",
      get: function get() {
        return this.m;
      },
      set: function set(value) {
        this.m = value;
      }
    }, {
      key: "exponent",
      get: function get() {
        return this.e;
      },
      set: function set(value) {
        this.e = value;
      }
    }, {
      key: "normalize",
      value:
      function normalize() {
        if (this.sign === 0 || this.mag === 0 && this.layer === 0 || this.mag === Number.NEGATIVE_INFINITY && this.layer > 0 && Number.isFinite(this.layer)) {
          this.sign = 0;
          this.mag = 0;
          this.layer = 0;
          return this;
        }
        if (this.layer === 0 && this.mag < 0) {
          this.mag = -this.mag;
          this.sign = -this.sign;
        }
        if (this.mag === Number.POSITIVE_INFINITY || this.layer === Number.POSITIVE_INFINITY || this.mag === Number.NEGATIVE_INFINITY || this.layer === Number.NEGATIVE_INFINITY) {
          this.mag = Number.POSITIVE_INFINITY;
          this.layer = Number.POSITIVE_INFINITY;
          return this;
        }
        if (this.layer === 0 && this.mag < FIRST_NEG_LAYER) {
          this.layer += 1;
          this.mag = Math.log10(this.mag);
          return this;
        }
        var absmag = Math.abs(this.mag);
        var signmag = Math.sign(this.mag);
        if (absmag >= EXP_LIMIT) {
          this.layer += 1;
          this.mag = signmag * Math.log10(absmag);
          return this;
        } else {
          while (absmag < LAYER_DOWN && this.layer > 0) {
            this.layer -= 1;
            if (this.layer === 0) {
              this.mag = Math.pow(10, this.mag);
            } else {
              this.mag = signmag * Math.pow(10, absmag);
              absmag = Math.abs(this.mag);
              signmag = Math.sign(this.mag);
            }
          }
          if (this.layer === 0) {
            if (this.mag < 0) {
              this.mag = -this.mag;
              this.sign = -this.sign;
            } else if (this.mag === 0) {
              this.sign = 0;
            }
          }
        }
        if (Number.isNaN(this.sign) || Number.isNaN(this.layer) || Number.isNaN(this.mag)) {
          this.sign = Number.NaN;
          this.layer = Number.NaN;
          this.mag = Number.NaN;
        }
        return this;
      }
    }, {
      key: "fromComponents",
      value: function fromComponents(sign, layer, mag) {
        this.sign = sign;
        this.layer = layer;
        this.mag = mag;
        this.normalize();
        return this;
      }
    }, {
      key: "fromComponents_noNormalize",
      value: function fromComponents_noNormalize(sign, layer, mag) {
        this.sign = sign;
        this.layer = layer;
        this.mag = mag;
        return this;
      }
    }, {
      key: "fromMantissaExponent",
      value: function fromMantissaExponent(mantissa, exponent) {
        this.layer = 1;
        this.sign = Math.sign(mantissa);
        mantissa = Math.abs(mantissa);
        this.mag = exponent + Math.log10(mantissa);
        this.normalize();
        return this;
      }
    }, {
      key: "fromMantissaExponent_noNormalize",
      value: function fromMantissaExponent_noNormalize(mantissa, exponent) {
        this.fromMantissaExponent(mantissa, exponent);
        return this;
      }
    }, {
      key: "fromDecimal",
      value: function fromDecimal(value) {
        this.sign = value.sign;
        this.layer = value.layer;
        this.mag = value.mag;
        return this;
      }
    }, {
      key: "fromNumber",
      value: function fromNumber(value) {
        this.mag = Math.abs(value);
        this.sign = Math.sign(value);
        this.layer = 0;
        this.normalize();
        return this;
      }
    }, {
      key: "fromString",
      value: function fromString(value) {
        var linearhyper4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var originalValue = value;
        var cached = Decimal.fromStringCache.get(originalValue);
        if (cached !== undefined) {
          return this.fromDecimal(cached);
        }
        {
          value = value.replace(",", "");
        }
        var pentationparts = value.split("^^^");
        if (pentationparts.length === 2) {
          var _base = parseFloat(pentationparts[0]);
          var _height = parseFloat(pentationparts[1]);
          var heightparts = pentationparts[1].split(";");
          var payload = 1;
          if (heightparts.length === 2) {
            payload = parseFloat(heightparts[1]);
            if (!isFinite(payload)) {
              payload = 1;
            }
          }
          if (isFinite(_base) && isFinite(_height)) {
            var result = Decimal.pentate(_base, _height, payload, linearhyper4);
            this.sign = result.sign;
            this.layer = result.layer;
            this.mag = result.mag;
            if (Decimal.fromStringCache.maxSize >= 1) {
              Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
            }
            return this;
          }
        }
        var tetrationparts = value.split("^^");
        if (tetrationparts.length === 2) {
          var _base2 = parseFloat(tetrationparts[0]);
          var _height2 = parseFloat(tetrationparts[1]);
          var _heightparts = tetrationparts[1].split(";");
          var _payload = 1;
          if (_heightparts.length === 2) {
            _payload = parseFloat(_heightparts[1]);
            if (!isFinite(_payload)) {
              _payload = 1;
            }
          }
          if (isFinite(_base2) && isFinite(_height2)) {
            var _result = Decimal.tetrate(_base2, _height2, _payload, linearhyper4);
            this.sign = _result.sign;
            this.layer = _result.layer;
            this.mag = _result.mag;
            if (Decimal.fromStringCache.maxSize >= 1) {
              Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
            }
            return this;
          }
        }
        var powparts = value.split("^");
        if (powparts.length === 2) {
          var _base3 = parseFloat(powparts[0]);
          var _exponent = parseFloat(powparts[1]);
          if (isFinite(_base3) && isFinite(_exponent)) {
            var _result2 = Decimal.pow(_base3, _exponent);
            this.sign = _result2.sign;
            this.layer = _result2.layer;
            this.mag = _result2.mag;
            if (Decimal.fromStringCache.maxSize >= 1) {
              Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
            }
            return this;
          }
        }
        value = value.trim().toLowerCase();
        var base;
        var height;
        var ptparts = value.split("pt");
        if (ptparts.length === 2) {
          base = 10;
          var negative = false;
          if (ptparts[0][0] == "-") {
            negative = true;
            ptparts[0] = ptparts[0].slice(1);
          }
          height = parseFloat(ptparts[0]);
          ptparts[1] = ptparts[1].replace("(", "");
          ptparts[1] = ptparts[1].replace(")", "");
          var _payload2 = parseFloat(ptparts[1]);
          if (!isFinite(_payload2)) {
            _payload2 = 1;
          }
          if (isFinite(base) && isFinite(height)) {
            var _result3 = Decimal.tetrate(base, height, _payload2, linearhyper4);
            this.sign = _result3.sign;
            this.layer = _result3.layer;
            this.mag = _result3.mag;
            if (Decimal.fromStringCache.maxSize >= 1) {
              Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
            }
            if (negative) this.sign *= -1;
            return this;
          }
        }
        ptparts = value.split("p");
        if (ptparts.length === 2) {
          base = 10;
          var _negative = false;
          if (ptparts[0][0] == "-") {
            _negative = true;
            ptparts[0] = ptparts[0].slice(1);
          }
          height = parseFloat(ptparts[0]);
          ptparts[1] = ptparts[1].replace("(", "");
          ptparts[1] = ptparts[1].replace(")", "");
          var _payload3 = parseFloat(ptparts[1]);
          if (!isFinite(_payload3)) {
            _payload3 = 1;
          }
          if (isFinite(base) && isFinite(height)) {
            var _result4 = Decimal.tetrate(base, height, _payload3, linearhyper4);
            this.sign = _result4.sign;
            this.layer = _result4.layer;
            this.mag = _result4.mag;
            if (Decimal.fromStringCache.maxSize >= 1) {
              Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
            }
            if (_negative) this.sign *= -1;
            return this;
          }
        }
        ptparts = value.split("f");
        if (ptparts.length === 2) {
          base = 10;
          var _negative2 = false;
          if (ptparts[0][0] == "-") {
            _negative2 = true;
            ptparts[0] = ptparts[0].slice(1);
          }
          ptparts[0] = ptparts[0].replace("(", "");
          ptparts[0] = ptparts[0].replace(")", "");
          var _payload4 = parseFloat(ptparts[0]);
          ptparts[1] = ptparts[1].replace("(", "");
          ptparts[1] = ptparts[1].replace(")", "");
          height = parseFloat(ptparts[1]);
          if (!isFinite(_payload4)) {
            _payload4 = 1;
          }
          if (isFinite(base) && isFinite(height)) {
            var _result5 = Decimal.tetrate(base, height, _payload4, linearhyper4);
            this.sign = _result5.sign;
            this.layer = _result5.layer;
            this.mag = _result5.mag;
            if (Decimal.fromStringCache.maxSize >= 1) {
              Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
            }
            if (_negative2) this.sign *= -1;
            return this;
          }
        }
        var parts = value.split("e");
        var ecount = parts.length - 1;
        if (ecount === 0) {
          var numberAttempt = parseFloat(value);
          if (isFinite(numberAttempt)) {
            this.fromNumber(numberAttempt);
            if (Decimal.fromStringCache.size >= 1) {
              Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
            }
            return this;
          }
        } else if (ecount === 1) {
          var _numberAttempt = parseFloat(value);
          if (isFinite(_numberAttempt) && Math.abs(_numberAttempt) > 1e-307) {
            this.fromNumber(_numberAttempt);
            if (Decimal.fromStringCache.maxSize >= 1) {
              Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
            }
            return this;
          }
        }
        var newparts = value.split("e^");
        if (newparts.length === 2) {
          this.sign = 1;
          if (newparts[0].charAt(0) == "-") {
            this.sign = -1;
          }
          var layerstring = "";
          for (var i = 0; i < newparts[1].length; ++i) {
            var chrcode = newparts[1].charCodeAt(i);
            if (chrcode >= 43 && chrcode <= 57 || chrcode === 101) {
              layerstring += newparts[1].charAt(i);
            }
            else {
              this.layer = parseFloat(layerstring);
              this.mag = parseFloat(newparts[1].substr(i + 1));
              if (this.layer < 0 || this.layer % 1 != 0) {
                var _result6 = Decimal.tetrate(10, this.layer, this.mag, linearhyper4);
                this.sign = _result6.sign;
                this.layer = _result6.layer;
                this.mag = _result6.mag;
              }
              this.normalize();
              if (Decimal.fromStringCache.maxSize >= 1) {
                Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
              }
              return this;
            }
          }
        }
        if (ecount < 1) {
          this.sign = 0;
          this.layer = 0;
          this.mag = 0;
          if (Decimal.fromStringCache.maxSize >= 1) {
            Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
          }
          return this;
        }
        var mantissa = parseFloat(parts[0]);
        if (mantissa === 0) {
          this.sign = 0;
          this.layer = 0;
          this.mag = 0;
          if (Decimal.fromStringCache.maxSize >= 1) {
            Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
          }
          return this;
        }
        var exponent = parseFloat(parts[parts.length - 1]);
        if (ecount >= 2) {
          var me = parseFloat(parts[parts.length - 2]);
          if (isFinite(me)) {
            exponent *= Math.sign(me);
            exponent += f_maglog10(me);
          }
        }
        if (!isFinite(mantissa)) {
          this.sign = parts[0] === "-" ? -1 : 1;
          this.layer = ecount;
          this.mag = exponent;
        }
        else if (ecount === 1) {
          this.sign = Math.sign(mantissa);
          this.layer = 1;
          this.mag = exponent + Math.log10(Math.abs(mantissa));
        }
        else {
          this.sign = Math.sign(mantissa);
          this.layer = ecount;
          if (ecount === 2) {
            var _result7 = Decimal.mul(FC(1, 2, exponent), D(mantissa));
            this.sign = _result7.sign;
            this.layer = _result7.layer;
            this.mag = _result7.mag;
            if (Decimal.fromStringCache.maxSize >= 1) {
              Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
            }
            return this;
          } else {
            this.mag = exponent;
          }
        }
        this.normalize();
        if (Decimal.fromStringCache.maxSize >= 1) {
          Decimal.fromStringCache.set(originalValue, Decimal.fromDecimal(this));
        }
        return this;
      }
    }, {
      key: "fromValue",
      value: function fromValue(value) {
        if (value instanceof Decimal) {
          return this.fromDecimal(value);
        }
        if (typeof value === "number") {
          return this.fromNumber(value);
        }
        if (typeof value === "string") {
          return this.fromString(value);
        }
        this.sign = 0;
        this.layer = 0;
        this.mag = 0;
        return this;
      }
    }, {
      key: "toNumber",
      value: function toNumber() {
        if (this.mag === Number.POSITIVE_INFINITY && this.layer === Number.POSITIVE_INFINITY && this.sign === 1) {
          return Number.POSITIVE_INFINITY;
        }
        if (this.mag === Number.POSITIVE_INFINITY && this.layer === Number.POSITIVE_INFINITY && this.sign === -1) {
          return Number.NEGATIVE_INFINITY;
        }
        if (!Number.isFinite(this.layer)) {
          return Number.NaN;
        }
        if (this.layer === 0) {
          return this.sign * this.mag;
        } else if (this.layer === 1) {
          return this.sign * Math.pow(10, this.mag);
        }
        else {
          return this.mag > 0 ? this.sign > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : 0;
        }
      }
    }, {
      key: "mantissaWithDecimalPlaces",
      value: function mantissaWithDecimalPlaces(places) {
        if (isNaN(this.m)) {
          return Number.NaN;
        }
        if (this.m === 0) {
          return 0;
        }
        return decimalPlaces(this.m, places);
      }
    }, {
      key: "magnitudeWithDecimalPlaces",
      value: function magnitudeWithDecimalPlaces(places) {
        if (isNaN(this.mag)) {
          return Number.NaN;
        }
        if (this.mag === 0) {
          return 0;
        }
        return decimalPlaces(this.mag, places);
      }
    }, {
      key: "toString",
      value: function toString() {
        if (isNaN(this.layer) || isNaN(this.sign) || isNaN(this.mag)) {
          return "NaN";
        }
        if (this.mag === Number.POSITIVE_INFINITY || this.layer === Number.POSITIVE_INFINITY) {
          return this.sign === 1 ? "Infinity" : "-Infinity";
        }
        if (this.layer === 0) {
          if (this.mag < 1e21 && this.mag > 1e-7 || this.mag === 0) {
            return (this.sign * this.mag).toString();
          }
          return this.m + "e" + this.e;
        } else if (this.layer === 1) {
          return this.m + "e" + this.e;
        } else {
          if (this.layer <= MAX_ES_IN_A_ROW) {
            return (this.sign === -1 ? "-" : "") + "e".repeat(this.layer) + this.mag;
          } else {
            return (this.sign === -1 ? "-" : "") + "(e^" + this.layer + ")" + this.mag;
          }
        }
      }
    }, {
      key: "toExponential",
      value: function toExponential(places) {
        if (this.layer === 0) {
          return (this.sign * this.mag).toExponential(places);
        }
        return this.toStringWithDecimalPlaces(places);
      }
    }, {
      key: "toFixed",
      value: function toFixed(places) {
        if (this.layer === 0) {
          return (this.sign * this.mag).toFixed(places);
        }
        return this.toStringWithDecimalPlaces(places);
      }
    }, {
      key: "toPrecision",
      value: function toPrecision(places) {
        if (this.e <= -7) {
          return this.toExponential(places - 1);
        }
        if (places > this.e) {
          return this.toFixed(places - this.exponent - 1);
        }
        return this.toExponential(places - 1);
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        return this.toString();
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return this.toString();
      }
    }, {
      key: "toStringWithDecimalPlaces",
      value: function toStringWithDecimalPlaces(places) {
        if (this.layer === 0) {
          if (this.mag < 1e21 && this.mag > 1e-7 || this.mag === 0) {
            return (this.sign * this.mag).toFixed(places);
          }
          return decimalPlaces(this.m, places) + "e" + decimalPlaces(this.e, places);
        } else if (this.layer === 1) {
          return decimalPlaces(this.m, places) + "e" + decimalPlaces(this.e, places);
        } else {
          if (this.layer <= MAX_ES_IN_A_ROW) {
            return (this.sign === -1 ? "-" : "") + "e".repeat(this.layer) + decimalPlaces(this.mag, places);
          } else {
            return (this.sign === -1 ? "-" : "") + "(e^" + this.layer + ")" + decimalPlaces(this.mag, places);
          }
        }
      }
    }, {
      key: "abs",
      value: function abs() {
        return FC_NN(this.sign === 0 ? 0 : 1, this.layer, this.mag);
      }
    }, {
      key: "neg",
      value: function neg() {
        return FC_NN(-this.sign, this.layer, this.mag);
      }
    }, {
      key: "negate",
      value: function negate() {
        return this.neg();
      }
    }, {
      key: "negated",
      value: function negated() {
        return this.neg();
      }
    }, {
      key: "sgn",
      value: function sgn() {
        return this.sign;
      }
    }, {
      key: "round",
      value: function round() {
        if (this.mag < 0) {
          return FC_NN(0, 0, 0);
        }
        if (this.layer === 0) {
          return FC(this.sign, 0, Math.round(this.mag));
        }
        return new Decimal(this);
      }
    }, {
      key: "floor",
      value: function floor() {
        if (this.mag < 0) {
          if (this.sign === -1) return FC_NN(-1, 0, 1);else return FC_NN(0, 0, 0);
        }
        if (this.sign === -1) return this.neg().ceil().neg();
        if (this.layer === 0) {
          return FC(this.sign, 0, Math.floor(this.mag));
        }
        return new Decimal(this);
      }
    }, {
      key: "ceil",
      value: function ceil() {
        if (this.mag < 0) {
          if (this.sign === 1) return FC_NN(1, 0, 1);
          else return FC_NN(0, 0, 0);
        }
        if (this.sign === -1) return this.neg().floor().neg();
        if (this.layer === 0) {
          return FC(this.sign, 0, Math.ceil(this.mag));
        }
        return new Decimal(this);
      }
    }, {
      key: "trunc",
      value: function trunc() {
        if (this.mag < 0) {
          return FC_NN(0, 0, 0);
        }
        if (this.layer === 0) {
          return FC(this.sign, 0, Math.trunc(this.mag));
        }
        return new Decimal(this);
      }
    }, {
      key: "add",
      value: function add(value) {
        var decimal = D(value);
        if (this.eq(Decimal.dInf) && decimal.eq(Decimal.dNegInf) || this.eq(Decimal.dNegInf) && decimal.eq(Decimal.dInf)) {
          return new Decimal(Decimal.dNaN);
        }
        if (!Number.isFinite(this.layer)) {
          return new Decimal(this);
        }
        if (!Number.isFinite(decimal.layer)) {
          return new Decimal(decimal);
        }
        if (this.sign === 0) {
          return new Decimal(decimal);
        }
        if (decimal.sign === 0) {
          return new Decimal(this);
        }
        if (this.sign === -decimal.sign && this.layer === decimal.layer && this.mag === decimal.mag) {
          return FC_NN(0, 0, 0);
        }
        var a;
        var b;
        if (this.layer >= 2 || decimal.layer >= 2) {
          return this.maxabs(decimal);
        }
        if (Decimal.cmpabs(this, decimal) > 0) {
          a = new Decimal(this);
          b = new Decimal(decimal);
        } else {
          a = new Decimal(decimal);
          b = new Decimal(this);
        }
        if (a.layer === 0 && b.layer === 0) {
          return Decimal.fromNumber(a.sign * a.mag + b.sign * b.mag);
        }
        var layera = a.layer * Math.sign(a.mag);
        var layerb = b.layer * Math.sign(b.mag);
        if (layera - layerb >= 2) {
          return a;
        }
        if (layera === 0 && layerb === -1) {
          if (Math.abs(b.mag - Math.log10(a.mag)) > MAX_SIGNIFICANT_DIGITS) {
            return a;
          } else {
            var magdiff = Math.pow(10, Math.log10(a.mag) - b.mag);
            var mantissa = b.sign + a.sign * magdiff;
            return FC(Math.sign(mantissa), 1, b.mag + Math.log10(Math.abs(mantissa)));
          }
        }
        if (layera === 1 && layerb === 0) {
          if (Math.abs(a.mag - Math.log10(b.mag)) > MAX_SIGNIFICANT_DIGITS) {
            return a;
          } else {
            var _magdiff = Math.pow(10, a.mag - Math.log10(b.mag));
            var _mantissa = b.sign + a.sign * _magdiff;
            return FC(Math.sign(_mantissa), 1, Math.log10(b.mag) + Math.log10(Math.abs(_mantissa)));
          }
        }
        if (Math.abs(a.mag - b.mag) > MAX_SIGNIFICANT_DIGITS) {
          return a;
        } else {
          var _magdiff2 = Math.pow(10, a.mag - b.mag);
          var _mantissa2 = b.sign + a.sign * _magdiff2;
          return FC(Math.sign(_mantissa2), 1, b.mag + Math.log10(Math.abs(_mantissa2)));
        }
      }
    }, {
      key: "plus",
      value: function plus(value) {
        return this.add(value);
      }
    }, {
      key: "sub",
      value: function sub(value) {
        return this.add(D(value).neg());
      }
    }, {
      key: "subtract",
      value: function subtract(value) {
        return this.sub(value);
      }
    }, {
      key: "minus",
      value: function minus(value) {
        return this.sub(value);
      }
    }, {
      key: "mul",
      value: function mul(value) {
        var decimal = D(value);
        if (this.eq(Decimal.dInf) && decimal.eq(Decimal.dNegInf) || this.eq(Decimal.dNegInf) && decimal.eq(Decimal.dInf)) {
          return new Decimal(Decimal.dNegInf);
        }
        if (this.mag == Number.POSITIVE_INFINITY && decimal.eq(Decimal.dZero) || this.eq(Decimal.dZero) && this.mag == Number.POSITIVE_INFINITY) {
          return new Decimal(Decimal.dNaN);
        }
        if (this.eq(Decimal.dNegInf) && decimal.eq(Decimal.dNegInf)) {
          return new Decimal(Decimal.dInf);
        }
        if (!Number.isFinite(this.layer)) {
          return new Decimal(this);
        }
        if (!Number.isFinite(decimal.layer)) {
          return new Decimal(decimal);
        }
        if (this.sign === 0 || decimal.sign === 0) {
          return FC_NN(0, 0, 0);
        }
        if (this.layer === decimal.layer && this.mag === -decimal.mag) {
          return FC_NN(this.sign * decimal.sign, 0, 1);
        }
        var a;
        var b;
        if (this.layer > decimal.layer || this.layer == decimal.layer && Math.abs(this.mag) > Math.abs(decimal.mag)) {
          a = new Decimal(this);
          b = new Decimal(decimal);
        } else {
          a = new Decimal(decimal);
          b = new Decimal(this);
        }
        if (a.layer === 0 && b.layer === 0) {
          return Decimal.fromNumber(a.sign * b.sign * a.mag * b.mag);
        }
        if (a.layer >= 3 || a.layer - b.layer >= 2) {
          return FC(a.sign * b.sign, a.layer, a.mag);
        }
        if (a.layer === 1 && b.layer === 0) {
          return FC(a.sign * b.sign, 1, a.mag + Math.log10(b.mag));
        }
        if (a.layer === 1 && b.layer === 1) {
          return FC(a.sign * b.sign, 1, a.mag + b.mag);
        }
        if (a.layer === 2 && b.layer === 1) {
          var newmag = FC(Math.sign(a.mag), a.layer - 1, Math.abs(a.mag)).add(FC(Math.sign(b.mag), b.layer - 1, Math.abs(b.mag)));
          return FC(a.sign * b.sign, newmag.layer + 1, newmag.sign * newmag.mag);
        }
        if (a.layer === 2 && b.layer === 2) {
          var _newmag = FC(Math.sign(a.mag), a.layer - 1, Math.abs(a.mag)).add(FC(Math.sign(b.mag), b.layer - 1, Math.abs(b.mag)));
          return FC(a.sign * b.sign, _newmag.layer + 1, _newmag.sign * _newmag.mag);
        }
        throw Error("Bad arguments to mul: " + this + ", " + value);
      }
    }, {
      key: "multiply",
      value: function multiply(value) {
        return this.mul(value);
      }
    }, {
      key: "times",
      value: function times(value) {
        return this.mul(value);
      }
    }, {
      key: "div",
      value: function div(value) {
        var decimal = D(value);
        return this.mul(decimal.recip());
      }
    }, {
      key: "divide",
      value: function divide(value) {
        return this.div(value);
      }
    }, {
      key: "divideBy",
      value: function divideBy(value) {
        return this.div(value);
      }
    }, {
      key: "dividedBy",
      value: function dividedBy(value) {
        return this.div(value);
      }
    }, {
      key: "recip",
      value: function recip() {
        if (this.mag === 0) {
          return new Decimal(Decimal.dNaN);
        } else if (this.mag === Number.POSITIVE_INFINITY) {
          return FC_NN(0, 0, 0);
        } else if (this.layer === 0) {
          return FC(this.sign, 0, 1 / this.mag);
        } else {
          return FC(this.sign, this.layer, -this.mag);
        }
      }
    }, {
      key: "reciprocal",
      value: function reciprocal() {
        return this.recip();
      }
    }, {
      key: "reciprocate",
      value: function reciprocate() {
        return this.recip();
      }
    }, {
      key: "mod",
      value: function mod(value) {
        var floored = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var vd = D(value);
        var decimal = vd.abs();
        if (this.eq(Decimal.dZero) || decimal.eq(Decimal.dZero)) return FC_NN(0, 0, 0);
        if (floored) {
          var absmod = this.abs().mod(decimal);
          if (this.sign == -1 != (vd.sign == -1)) absmod = vd.abs().sub(absmod);
          return absmod.mul(vd.sign);
        }
        var num_this = this.toNumber();
        var num_decimal = decimal.toNumber();
        if (isFinite(num_this) && isFinite(num_decimal) && num_this != 0 && num_decimal != 0) {
          return new Decimal(num_this % num_decimal);
        }
        if (this.sub(decimal).eq(this)) {
          return FC_NN(0, 0, 0);
        }
        if (decimal.sub(this).eq(decimal)) {
          return new Decimal(this);
        }
        if (this.sign == -1) return this.abs().mod(decimal).neg();
        return this.sub(this.div(decimal).floor().mul(decimal));
      }
    }, {
      key: "modulo",
      value: function modulo(value) {
        var floored = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return this.mod(value, floored);
      }
    }, {
      key: "modular",
      value: function modular(value) {
        var floored = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return this.mod(value, floored);
      }
    }, {
      key: "cmp",
      value: function cmp(value) {
        var decimal = D(value);
        if (this.sign > decimal.sign) {
          return 1;
        }
        if (this.sign < decimal.sign) {
          return -1;
        }
        return this.sign * this.cmpabs(value);
      }
    }, {
      key: "cmpabs",
      value: function cmpabs(value) {
        var decimal = D(value);
        var layera = this.mag > 0 ? this.layer : -this.layer;
        var layerb = decimal.mag > 0 ? decimal.layer : -decimal.layer;
        if (layera > layerb) {
          return 1;
        }
        if (layera < layerb) {
          return -1;
        }
        if (this.mag > decimal.mag) {
          return 1;
        }
        if (this.mag < decimal.mag) {
          return -1;
        }
        return 0;
      }
    }, {
      key: "compare",
      value: function compare(value) {
        return this.cmp(value);
      }
    }, {
      key: "isNan",
      value: function isNan() {
        return isNaN(this.sign) || isNaN(this.layer) || isNaN(this.mag);
      }
    }, {
      key: "isFinite",
      value: function (_isFinite2) {
        function isFinite() {
          return _isFinite2.apply(this, arguments);
        }
        isFinite.toString = function () {
          return _isFinite2.toString();
        };
        return isFinite;
      }(function () {
        return isFinite(this.sign) && isFinite(this.layer) && isFinite(this.mag);
      }
      )
    }, {
      key: "eq",
      value: function eq(value) {
        var decimal = D(value);
        return this.sign === decimal.sign && this.layer === decimal.layer && this.mag === decimal.mag;
      }
    }, {
      key: "equals",
      value: function equals(value) {
        return this.eq(value);
      }
    }, {
      key: "neq",
      value: function neq(value) {
        return !this.eq(value);
      }
    }, {
      key: "notEquals",
      value: function notEquals(value) {
        return this.neq(value);
      }
    }, {
      key: "lt",
      value: function lt(value) {
        return this.cmp(value) === -1;
      }
    }, {
      key: "lte",
      value: function lte(value) {
        return !this.gt(value);
      }
    }, {
      key: "gt",
      value: function gt(value) {
        return this.cmp(value) === 1;
      }
    }, {
      key: "gte",
      value: function gte(value) {
        return !this.lt(value);
      }
    }, {
      key: "max",
      value: function max(value) {
        var decimal = D(value);
        return this.lt(decimal) ? new Decimal(decimal) : new Decimal(this);
      }
    }, {
      key: "min",
      value: function min(value) {
        var decimal = D(value);
        return this.gt(decimal) ? new Decimal(decimal) : new Decimal(this);
      }
    }, {
      key: "maxabs",
      value: function maxabs(value) {
        var decimal = D(value);
        return this.cmpabs(decimal) < 0 ? new Decimal(decimal) : new Decimal(this);
      }
    }, {
      key: "minabs",
      value: function minabs(value) {
        var decimal = D(value);
        return this.cmpabs(decimal) > 0 ? new Decimal(decimal) : new Decimal(this);
      }
    }, {
      key: "clamp",
      value: function clamp(min, max) {
        return this.max(min).min(max);
      }
    }, {
      key: "clampMin",
      value: function clampMin(min) {
        return this.max(min);
      }
    }, {
      key: "clampMax",
      value: function clampMax(max) {
        return this.min(max);
      }
    }, {
      key: "cmp_tolerance",
      value: function cmp_tolerance(value, tolerance) {
        var decimal = D(value);
        return this.eq_tolerance(decimal, tolerance) ? 0 : this.cmp(decimal);
      }
    }, {
      key: "compare_tolerance",
      value: function compare_tolerance(value, tolerance) {
        return this.cmp_tolerance(value, tolerance);
      }
    }, {
      key: "eq_tolerance",
      value: function eq_tolerance(value, tolerance) {
        var decimal = D(value);
        if (tolerance == null) {
          tolerance = 1e-7;
        }
        if (this.sign !== decimal.sign) {
          return false;
        }
        if (Math.abs(this.layer - decimal.layer) > 1) {
          return false;
        }
        var magA = this.mag;
        var magB = decimal.mag;
        if (this.layer > decimal.layer) {
          magB = f_maglog10(magB);
        }
        if (this.layer < decimal.layer) {
          magA = f_maglog10(magA);
        }
        return Math.abs(magA - magB) <= tolerance * Math.max(Math.abs(magA), Math.abs(magB));
      }
    }, {
      key: "equals_tolerance",
      value: function equals_tolerance(value, tolerance) {
        return this.eq_tolerance(value, tolerance);
      }
    }, {
      key: "neq_tolerance",
      value: function neq_tolerance(value, tolerance) {
        return !this.eq_tolerance(value, tolerance);
      }
    }, {
      key: "notEquals_tolerance",
      value: function notEquals_tolerance(value, tolerance) {
        return this.neq_tolerance(value, tolerance);
      }
    }, {
      key: "lt_tolerance",
      value: function lt_tolerance(value, tolerance) {
        var decimal = D(value);
        return !this.eq_tolerance(decimal, tolerance) && this.lt(decimal);
      }
    }, {
      key: "lte_tolerance",
      value: function lte_tolerance(value, tolerance) {
        var decimal = D(value);
        return this.eq_tolerance(decimal, tolerance) || this.lt(decimal);
      }
    }, {
      key: "gt_tolerance",
      value: function gt_tolerance(value, tolerance) {
        var decimal = D(value);
        return !this.eq_tolerance(decimal, tolerance) && this.gt(decimal);
      }
    }, {
      key: "gte_tolerance",
      value: function gte_tolerance(value, tolerance) {
        var decimal = D(value);
        return this.eq_tolerance(decimal, tolerance) || this.gt(decimal);
      }
    }, {
      key: "pLog10",
      value: function pLog10() {
        if (this.lt(Decimal.dZero)) {
          return FC_NN(0, 0, 0);
        }
        return this.log10();
      }
    }, {
      key: "absLog10",
      value: function absLog10() {
        if (this.sign === 0) {
          return new Decimal(Decimal.dNaN);
        } else if (this.layer > 0) {
          return FC(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag));
        } else {
          return FC(1, 0, Math.log10(this.mag));
        }
      }
    }, {
      key: "log10",
      value: function log10() {
        if (this.sign <= 0) {
          return new Decimal(Decimal.dNaN);
        } else if (this.layer > 0) {
          return FC(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag));
        } else {
          return FC(this.sign, 0, Math.log10(this.mag));
        }
      }
    }, {
      key: "log",
      value: function log(base) {
        base = D(base);
        if (this.sign <= 0) {
          return new Decimal(Decimal.dNaN);
        }
        if (base.sign <= 0) {
          return new Decimal(Decimal.dNaN);
        }
        if (base.sign === 1 && base.layer === 0 && base.mag === 1) {
          return new Decimal(Decimal.dNaN);
        } else if (this.layer === 0 && base.layer === 0) {
          return FC(this.sign, 0, Math.log(this.mag) / Math.log(base.mag));
        }
        return Decimal.div(this.log10(), base.log10());
      }
    }, {
      key: "log2",
      value: function log2() {
        if (this.sign <= 0) {
          return new Decimal(Decimal.dNaN);
        } else if (this.layer === 0) {
          return FC(this.sign, 0, Math.log2(this.mag));
        } else if (this.layer === 1) {
          return FC(Math.sign(this.mag), 0, Math.abs(this.mag) * 3.321928094887362);
        } else if (this.layer === 2) {
          return FC(Math.sign(this.mag), 1, Math.abs(this.mag) + 0.5213902276543247);
        } else {
          return FC(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag));
        }
      }
    }, {
      key: "ln",
      value: function ln() {
        if (this.sign <= 0) {
          return new Decimal(Decimal.dNaN);
        } else if (this.layer === 0) {
          return FC(this.sign, 0, Math.log(this.mag));
        } else if (this.layer === 1) {
          return FC(Math.sign(this.mag), 0, Math.abs(this.mag) * 2.302585092994046);
        } else if (this.layer === 2) {
          return FC(Math.sign(this.mag), 1, Math.abs(this.mag) + 0.36221568869946325);
        } else {
          return FC(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag));
        }
      }
    }, {
      key: "logarithm",
      value: function logarithm(base) {
        return this.log(base);
      }
    }, {
      key: "pow",
      value: function pow(value) {
        var decimal = D(value);
        var a = new Decimal(this);
        var b = new Decimal(decimal);
        if (a.sign === 0) {
          return b.eq(0) ? FC_NN(1, 0, 1) : a;
        }
        if (a.sign === 1 && a.layer === 0 && a.mag === 1) {
          return a;
        }
        if (b.sign === 0) {
          return FC_NN(1, 0, 1);
        }
        if (b.sign === 1 && b.layer === 0 && b.mag === 1) {
          return a;
        }
        var result = a.absLog10().mul(b).pow10();
        if (this.sign === -1) {
          if (Math.abs(b.toNumber() % 2) % 2 === 1) {
            return result.neg();
          } else if (Math.abs(b.toNumber() % 2) % 2 === 0) {
            return result;
          }
          return new Decimal(Decimal.dNaN);
        }
        return result;
      }
    }, {
      key: "pow10",
      value: function pow10() {
        if (this.eq(Decimal.dInf)) {
          return new Decimal(Decimal.dInf);
        }
        if (this.eq(Decimal.dNegInf)) {
          return FC_NN(0, 0, 0);
        }
        if (!Number.isFinite(this.layer) || !Number.isFinite(this.mag)) {
          return new Decimal(Decimal.dNaN);
        }
        var a = new Decimal(this);
        if (a.layer === 0) {
          var newmag = Math.pow(10, a.sign * a.mag);
          if (Number.isFinite(newmag) && Math.abs(newmag) >= 0.1) {
            return FC(1, 0, newmag);
          } else {
            if (a.sign === 0) {
              return FC_NN(1, 0, 1);
            } else {
              a = FC_NN(a.sign, a.layer + 1, Math.log10(a.mag));
            }
          }
        }
        if (a.sign > 0 && a.mag >= 0) {
          return FC(a.sign, a.layer + 1, a.mag);
        }
        if (a.sign < 0 && a.mag >= 0) {
          return FC(-a.sign, a.layer + 1, -a.mag);
        }
        return FC_NN(1, 0, 1);
      }
    }, {
      key: "pow_base",
      value: function pow_base(value) {
        return D(value).pow(this);
      }
    }, {
      key: "root",
      value: function root(value) {
        var decimal = D(value);
        if (this.lt(0) && decimal.mod(2, true).eq(1)) return this.neg().root(decimal).neg();
        return this.pow(decimal.recip());
      }
    }, {
      key: "factorial",
      value: function factorial() {
        if (this.mag < 0) {
          return this.add(1).gamma();
        } else if (this.layer === 0) {
          return this.add(1).gamma();
        } else if (this.layer === 1) {
          return Decimal.exp(Decimal.mul(this, Decimal.ln(this).sub(1)));
        } else {
          return Decimal.exp(this);
        }
      }
    }, {
      key: "gamma",
      value: function gamma() {
        if (this.mag < 0) {
          return this.recip();
        } else if (this.layer === 0) {
          if (this.lt(FC_NN(1, 0, 24))) {
            return Decimal.fromNumber(f_gamma(this.sign * this.mag));
          }
          var t = this.mag - 1;
          var l = 0.9189385332046727;
          l = l + (t + 0.5) * Math.log(t);
          l = l - t;
          var n2 = t * t;
          var np = t;
          var lm = 12 * np;
          var adj = 1 / lm;
          var l2 = l + adj;
          if (l2 === l) {
            return Decimal.exp(l);
          }
          l = l2;
          np = np * n2;
          lm = 360 * np;
          adj = 1 / lm;
          l2 = l - adj;
          if (l2 === l) {
            return Decimal.exp(l);
          }
          l = l2;
          np = np * n2;
          lm = 1260 * np;
          var lt = 1 / lm;
          l = l + lt;
          np = np * n2;
          lm = 1680 * np;
          lt = 1 / lm;
          l = l - lt;
          return Decimal.exp(l);
        } else if (this.layer === 1) {
          return Decimal.exp(Decimal.mul(this, Decimal.ln(this).sub(1)));
        } else {
          return Decimal.exp(this);
        }
      }
    }, {
      key: "lngamma",
      value: function lngamma() {
        return this.gamma().ln();
      }
    }, {
      key: "exp",
      value: function exp() {
        if (this.mag < 0) {
          return FC_NN(1, 0, 1);
        }
        if (this.layer === 0 && this.mag <= 709.7) {
          return Decimal.fromNumber(Math.exp(this.sign * this.mag));
        } else if (this.layer === 0) {
          return FC(1, 1, this.sign * Math.log10(Math.E) * this.mag);
        } else if (this.layer === 1) {
          return FC(1, 2, this.sign * (Math.log10(0.4342944819032518) + this.mag));
        } else {
          return FC(1, this.layer + 1, this.sign * this.mag);
        }
      }
    }, {
      key: "sqr",
      value: function sqr() {
        return this.pow(2);
      }
    }, {
      key: "sqrt",
      value: function sqrt() {
        if (this.layer === 0) {
          return Decimal.fromNumber(Math.sqrt(this.sign * this.mag));
        } else if (this.layer === 1) {
          return FC(1, 2, Math.log10(this.mag) - 0.3010299956639812);
        } else {
          var result = Decimal.div(FC_NN(this.sign, this.layer - 1, this.mag), FC_NN(1, 0, 2));
          result.layer += 1;
          result.normalize();
          return result;
        }
      }
    }, {
      key: "cube",
      value: function cube() {
        return this.pow(3);
      }
    }, {
      key: "cbrt",
      value: function cbrt() {
        if (this.lt(0)) return this.neg().pow(1 / 3).neg();
        return this.pow(1 / 3);
      }
    }, {
      key: "tetrate",
      value: function tetrate() {
        var height = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
        var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FC_NN(1, 0, 1);
        var linear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        if (height === 1) {
          return Decimal.pow(this, payload);
        }
        if (height === 0) {
          return new Decimal(payload);
        }
        if (this.eq(Decimal.dOne)) {
          return FC_NN(1, 0, 1);
        }
        if (this.eq(-1)) {
          return Decimal.pow(this, payload);
        }
        if (height === Number.POSITIVE_INFINITY) {
          var this_num = this.toNumber();
          if (this_num <= 1.44466786100976613366 && this_num >= 0.06598803584531253708) {
            var negln = Decimal.ln(this).neg();
            var lower = negln.lambertw().div(negln);
            if (this_num < 1) return lower;
            var upper = negln.lambertw(false).div(negln);
            if (this_num > 1.444667861009099) {
              lower = upper = Decimal.fromNumber(Math.E);
            }
            payload = D(payload);
            if (payload.eq(upper)) return upper;else if (payload.lt(upper)) return lower;else return new Decimal(Decimal.dInf);
          } else if (this_num > 1.44466786100976613366) {
            return new Decimal(Decimal.dInf);
          } else {
            return new Decimal(Decimal.dNaN);
          }
        }
        if (this.eq(Decimal.dZero)) {
          var result = Math.abs((height + 1) % 2);
          if (result > 1) {
            result = 2 - result;
          }
          return Decimal.fromNumber(result);
        }
        if (height < 0) {
          return Decimal.iteratedlog(payload, this, -height, linear);
        }
        payload = new Decimal(payload);
        var oldheight = height;
        height = Math.trunc(height);
        var fracheight = oldheight - height;
        if (this.gt(Decimal.dZero) && (this.lt(1) || this.lte(1.44466786100976613366) && payload.lte(Decimal.ln(this).neg().lambertw(false).div(Decimal.ln(this).neg()))) && (oldheight > 10000 || !linear)) {
          var limitheight = Math.min(10000, height);
          if (payload.eq(Decimal.dOne)) payload = this.pow(fracheight);else if (this.lt(1)) payload = payload.pow(1 - fracheight).mul(this.pow(payload).pow(fracheight));else payload = payload.layeradd(fracheight, this);
          for (var i = 0; i < limitheight; ++i) {
            var old_payload = payload;
            payload = this.pow(payload);
            if (old_payload.eq(payload)) {
              return payload;
            }
          }
          if (oldheight > 10000 && Math.ceil(oldheight) % 2 == 1) {
            return this.pow(payload);
          }
          return payload;
        }
        if (fracheight !== 0) {
          if (payload.eq(Decimal.dOne)) {
            if (this.gt(10) || linear) {
              payload = this.pow(fracheight);
            } else {
              payload = Decimal.fromNumber(Decimal.tetrate_critical(this.toNumber(), fracheight));
              if (this.lt(2)) {
                payload = payload.sub(1).mul(this.minus(1)).plus(1);
              }
            }
          } else {
            if (this.eq(10)) {
              payload = payload.layeradd10(fracheight, linear);
            } else if (this.lt(1)) {
              payload = payload.pow(1 - fracheight).mul(this.pow(payload).pow(fracheight));
            } else {
              payload = payload.layeradd(fracheight, this, linear);
            }
          }
        }
        for (var _i = 0; _i < height; ++_i) {
          payload = this.pow(payload);
          if (!isFinite(payload.layer) || !isFinite(payload.mag)) {
            return payload.normalize();
          }
          if (payload.layer - this.layer > 3) {
            return FC_NN(payload.sign, payload.layer + (height - _i - 1), payload.mag);
          }
          if (_i > 10000) {
            return payload;
          }
        }
        return payload;
      }
    }, {
      key: "iteratedexp",
      value: function iteratedexp() {
        var height = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
        var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FC_NN(1, 0, 1);
        var linear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        return this.tetrate(height, payload, linear);
      }
    }, {
      key: "iteratedlog",
      value: function iteratedlog() {
        var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
        var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var linear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        if (times < 0) {
          return Decimal.tetrate(base, -times, this, linear);
        }
        base = D(base);
        var result = Decimal.fromDecimal(this);
        var fulltimes = times;
        times = Math.trunc(times);
        var fraction = fulltimes - times;
        if (result.layer - base.layer > 3) {
          var layerloss = Math.min(times, result.layer - base.layer - 3);
          times -= layerloss;
          result.layer -= layerloss;
        }
        for (var i = 0; i < times; ++i) {
          result = result.log(base);
          if (!isFinite(result.layer) || !isFinite(result.mag)) {
            return result.normalize();
          }
          if (i > 10000) {
            return result;
          }
        }
        if (fraction > 0 && fraction < 1) {
          if (base.eq(10)) {
            result = result.layeradd10(-fraction, linear);
          } else {
            result = result.layeradd(-fraction, base, linear);
          }
        }
        return result;
      }
    }, {
      key: "slog",
      value: function slog() {
        var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
        var iterations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
        var linear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var step_size = 0.001;
        var has_changed_directions_once = false;
        var previously_rose = false;
        var result = this.slog_internal(base, linear).toNumber();
        for (var i = 1; i < iterations; ++i) {
          var new_decimal = new Decimal(base).tetrate(result, Decimal.dOne, linear);
          var currently_rose = new_decimal.gt(this);
          if (i > 1) {
            if (previously_rose != currently_rose) {
              has_changed_directions_once = true;
            }
          }
          previously_rose = currently_rose;
          if (has_changed_directions_once) {
            step_size /= 2;
          } else {
            step_size *= 2;
          }
          step_size = Math.abs(step_size) * (currently_rose ? -1 : 1);
          result += step_size;
          if (step_size === 0) {
            break;
          }
        }
        return Decimal.fromNumber(result);
      }
    }, {
      key: "slog_internal",
      value: function slog_internal() {
        var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
        var linear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        base = D(base);
        if (base.lte(Decimal.dZero)) {
          return new Decimal(Decimal.dNaN);
        }
        if (base.eq(Decimal.dOne)) {
          return new Decimal(Decimal.dNaN);
        }
        if (base.lt(Decimal.dOne)) {
          if (this.eq(Decimal.dOne)) {
            return FC_NN(0, 0, 0);
          }
          if (this.eq(Decimal.dZero)) {
            return FC_NN(-1, 0, 1);
          }
          return new Decimal(Decimal.dNaN);
        }
        if (this.mag < 0 || this.eq(Decimal.dZero)) {
          return FC_NN(-1, 0, 1);
        }
        if (base.lt(1.44466786100976613366)) {
          var negln = Decimal.ln(base).neg();
          var infTower = negln.lambertw().div(negln);
          if (this.eq(infTower)) return new Decimal(Decimal.dInf);
          if (this.gt(infTower)) return new Decimal(Decimal.dNaN);
        }
        var result = 0;
        var copy = Decimal.fromDecimal(this);
        if (copy.layer - base.layer > 3) {
          var layerloss = copy.layer - base.layer - 3;
          result += layerloss;
          copy.layer -= layerloss;
        }
        for (var i = 0; i < 100; ++i) {
          if (copy.lt(Decimal.dZero)) {
            copy = Decimal.pow(base, copy);
            result -= 1;
          } else if (copy.lte(Decimal.dOne)) {
            if (linear) return Decimal.fromNumber(result + copy.toNumber() - 1);else return Decimal.fromNumber(result + Decimal.slog_critical(base.toNumber(), copy.toNumber()));
          } else {
            result += 1;
            copy = Decimal.log(copy, base);
          }
        }
        return Decimal.fromNumber(result);
      }
    }, {
      key: "layeradd10",
      value:
      function layeradd10(diff) {
        var linear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        diff = Decimal.fromValue_noAlloc(diff).toNumber();
        var result = Decimal.fromDecimal(this);
        if (diff >= 1) {
          if (result.mag < 0 && result.layer > 0) {
            result.sign = 0;
            result.mag = 0;
            result.layer = 0;
          } else if (result.sign === -1 && result.layer == 0) {
            result.sign = 1;
            result.mag = -result.mag;
          }
          var layeradd = Math.trunc(diff);
          diff -= layeradd;
          result.layer += layeradd;
        }
        if (diff <= -1) {
          var _layeradd = Math.trunc(diff);
          diff -= _layeradd;
          result.layer += _layeradd;
          if (result.layer < 0) {
            for (var i = 0; i < 100; ++i) {
              result.layer++;
              result.mag = Math.log10(result.mag);
              if (!isFinite(result.mag)) {
                if (result.sign === 0) {
                  result.sign = 1;
                }
                if (result.layer < 0) {
                  result.layer = 0;
                }
                return result.normalize();
              }
              if (result.layer >= 0) {
                break;
              }
            }
          }
        }
        while (result.layer < 0) {
          result.layer++;
          result.mag = Math.log10(result.mag);
        }
        if (result.sign === 0) {
          result.sign = 1;
          if (result.mag === 0 && result.layer >= 1) {
            result.layer -= 1;
            result.mag = 1;
          }
        }
        result.normalize();
        if (diff !== 0) {
          return result.layeradd(diff, 10, linear);
        }
        return result;
      }
    }, {
      key: "layeradd",
      value: function layeradd(diff, base) {
        var linear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var baseD = D(base);
        if (baseD.gt(1) && baseD.lte(1.44466786100976613366)) {
          var excessSlog = Decimal.excess_slog(this, base, linear);
          var _slogthis = excessSlog[0].toNumber();
          var range = excessSlog[1];
          var _slogdest = _slogthis + diff;
          var negln = Decimal.ln(base).neg();
          var lower = negln.lambertw().div(negln);
          var upper = negln.lambertw(false).div(negln);
          var slogzero = Decimal.dOne;
          if (range == 1) slogzero = lower.mul(upper).sqrt();else if (range == 2) slogzero = upper.mul(2);
          var slogone = baseD.pow(slogzero);
          var wholeheight = Math.floor(_slogdest);
          var fracheight = _slogdest - wholeheight;
          var towertop = slogzero.pow(1 - fracheight).mul(slogone.pow(fracheight));
          return Decimal.tetrate(baseD, wholeheight, towertop, linear);
        }
        var slogthis = this.slog(base, 100, linear).toNumber();
        var slogdest = slogthis + diff;
        if (slogdest >= 0) {
          return Decimal.tetrate(base, slogdest, Decimal.dOne, linear);
        } else if (!Number.isFinite(slogdest)) {
          return new Decimal(Decimal.dNaN);
        } else if (slogdest >= -1) {
          return Decimal.log(Decimal.tetrate(base, slogdest + 1, Decimal.dOne, linear), base);
        } else {
          return Decimal.log(Decimal.log(Decimal.tetrate(base, slogdest + 2, Decimal.dOne, linear), base), base);
        }
      }
    }, {
      key: "lambertw",
      value:
      function lambertw() {
        var principal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        if (this.lt(-0.3678794411710499)) {
          return new Decimal(Decimal.dNaN);
        } else if (principal) {
          if (this.abs().lt("1e-300")) return new Decimal(this);else if (this.mag < 0) {
            return Decimal.fromNumber(f_lambertw(this.toNumber()));
          } else if (this.layer === 0) {
            return Decimal.fromNumber(f_lambertw(this.sign * this.mag));
          } else if (this.lt("eee15")) {
            return d_lambertw(this);
          } else {
            return this.ln();
          }
        } else {
          if (this.sign === 1) {
            return new Decimal(Decimal.dNaN);
          }
          if (this.layer === 0) {
            return Decimal.fromNumber(f_lambertw(this.sign * this.mag, 1e-10, false));
          } else if (this.layer == 1) {
            return d_lambertw(this, 1e-10, false);
          } else {
            return this.neg().recip().lambertw().neg();
          }
        }
      }
    }, {
      key: "ssqrt",
      value: function ssqrt() {
        return this.linear_sroot(2);
      }
    }, {
      key: "linear_sroot",
      value: function linear_sroot(degree) {
        if (degree == 1) {
          return this;
        }
        if (this.eq(Decimal.dInf)) {
          return new Decimal(Decimal.dInf);
        }
        if (!this.isFinite()) {
          return new Decimal(Decimal.dNaN);
        }
        if (degree > 0 && degree < 1) {
          return this.root(degree);
        }
        if (degree > -2 && degree < -1) {
          return Decimal.fromNumber(degree).add(2).pow(this.recip());
        }
        if (degree <= 0) {
          return new Decimal(Decimal.dNaN);
        }
        if (degree == Number.POSITIVE_INFINITY) {
          var this_num = this.toNumber();
          if (this_num < Math.E && this_num > _EXPN1) {
            return this.pow(this.recip());
          } else {
            return new Decimal(Decimal.dNaN);
          }
        }
        if (this.eq(1)) {
          return FC_NN(1, 0, 1);
        }
        if (this.lt(0)) {
          return new Decimal(Decimal.dNaN);
        }
        if (this.lte("1ee-16")) {
          if (degree % 2 == 1) return new Decimal(this);else return new Decimal(Decimal.dNaN);
        }
        if (this.gt(1)) {
          var upperBound = Decimal.dTen;
          if (this.gte(Decimal.tetrate(10, degree, 1, true))) {
            upperBound = this.iteratedlog(10, degree - 1, true);
          }
          if (degree <= 1) {
            upperBound = this.root(degree);
          }
          var lower = Decimal.dZero;
          var layer = upperBound.layer;
          var upper = upperBound.iteratedlog(10, layer, true);
          var previous = upper;
          var guess = upper.div(2);
          var loopGoing = true;
          while (loopGoing) {
            guess = lower.add(upper).div(2);
            if (Decimal.iteratedexp(10, layer, guess, true).tetrate(degree, 1, true).gt(this)) upper = guess;else lower = guess;
            if (guess.eq(previous)) loopGoing = false;else previous = guess;
          }
          return Decimal.iteratedexp(10, layer, guess, true);
        }
        else {
          var stage = 1;
          var minimum = FC(1, 10, 1);
          var maximum = FC(1, 10, 1);
          var _lower = FC(1, 10, 1);
          var _upper = FC(1, 1, -16);
          var prevspan = Decimal.dZero;
          var difference = FC(1, 10, 1);
          var _upperBound = _upper.pow10().recip();
          var distance = Decimal.dZero;
          var prevPoint = _upperBound;
          var nextPoint = _upperBound;
          var evenDegree = Math.ceil(degree) % 2 == 0;
          var range = 0;
          var lastValid = FC(1, 10, 1);
          var infLoopDetector = false;
          var previousUpper = Decimal.dZero;
          var decreasingFound = false;
          while (stage < 4) {
            if (stage == 2) {
              if (evenDegree) break;else {
                _lower = FC(1, 10, 1);
                _upper = minimum;
                stage = 3;
                difference = FC(1, 10, 1);
                lastValid = FC(1, 10, 1);
              }
            }
            infLoopDetector = false;
            while (_upper.neq(_lower)) {
              previousUpper = _upper;
              if (_upper.pow10().recip().tetrate(degree, 1, true).eq(1) && _upper.pow10().recip().lt(0.4)) {
                _upperBound = _upper.pow10().recip();
                prevPoint = _upper.pow10().recip();
                nextPoint = _upper.pow10().recip();
                distance = Decimal.dZero;
                range = -1;
                if (stage == 3) lastValid = _upper;
              } else if (_upper.pow10().recip().tetrate(degree, 1, true).eq(_upper.pow10().recip()) && !evenDegree && _upper.pow10().recip().lt(0.4)) {
                _upperBound = _upper.pow10().recip();
                prevPoint = _upper.pow10().recip();
                nextPoint = _upper.pow10().recip();
                distance = Decimal.dZero;
                range = 0;
              } else if (_upper.pow10().recip().tetrate(degree, 1, true).eq(_upper.pow10().recip().mul(2).tetrate(degree, 1, true))) {
                _upperBound = _upper.pow10().recip();
                prevPoint = Decimal.dZero;
                nextPoint = _upperBound.mul(2);
                distance = _upperBound;
                if (evenDegree) range = -1;else range = 0;
              } else {
                prevspan = _upper.mul(1.2e-16);
                _upperBound = _upper.pow10().recip();
                prevPoint = _upper.add(prevspan).pow10().recip();
                distance = _upperBound.sub(prevPoint);
                nextPoint = _upperBound.add(distance);
                while (prevPoint.tetrate(degree, 1, true).eq(_upperBound.tetrate(degree, 1, true)) || nextPoint.tetrate(degree, 1, true).eq(_upperBound.tetrate(degree, 1, true)) || prevPoint.gte(_upperBound) || nextPoint.lte(_upperBound)) {
                  prevspan = prevspan.mul(2);
                  prevPoint = _upper.add(prevspan).pow10().recip();
                  distance = _upperBound.sub(prevPoint);
                  nextPoint = _upperBound.add(distance);
                }
                if (stage == 1 && nextPoint.tetrate(degree, 1, true).gt(_upperBound.tetrate(degree, 1, true)) && prevPoint.tetrate(degree, 1, true).gt(_upperBound.tetrate(degree, 1, true)) || stage == 3 && nextPoint.tetrate(degree, 1, true).lt(_upperBound.tetrate(degree, 1, true)) && prevPoint.tetrate(degree, 1, true).lt(_upperBound.tetrate(degree, 1, true))) {
                  lastValid = _upper;
                }
                if (nextPoint.tetrate(degree, 1, true).lt(_upperBound.tetrate(degree, 1, true))) {
                  range = -1;
                } else if (evenDegree) {
                  range = 1;
                } else if (stage == 3 && _upper.gt_tolerance(minimum, 1e-8)) {
                  range = 0;
                } else {
                  while (prevPoint.tetrate(degree, 1, true).eq_tolerance(_upperBound.tetrate(degree, 1, true), 1e-8) || nextPoint.tetrate(degree, 1, true).eq_tolerance(_upperBound.tetrate(degree, 1, true), 1e-8) || prevPoint.gte(_upperBound) || nextPoint.lte(_upperBound)) {
                    prevspan = prevspan.mul(2);
                    prevPoint = _upper.add(prevspan).pow10().recip();
                    distance = _upperBound.sub(prevPoint);
                    nextPoint = _upperBound.add(distance);
                  }
                  if (nextPoint.tetrate(degree, 1, true).sub(_upperBound.tetrate(degree, 1, true)).lt(_upperBound.tetrate(degree, 1, true).sub(prevPoint.tetrate(degree, 1, true)))) {
                    range = 0;
                  } else {
                    range = 1;
                  }
                }
              }
              if (range == -1) decreasingFound = true;
              if (stage == 1 && range == 1 || stage == 3 && range != 0) {
                if (_lower.eq(FC(1, 10, 1))) {
                  _upper = _upper.mul(2);
                } else {
                  var cutOff = false;
                  if (infLoopDetector && (range == 1 && stage == 1 || range == -1 && stage == 3)) cutOff = true;
                  _upper = _upper.add(_lower).div(2);
                  if (cutOff) break;
                }
              } else {
                if (_lower.eq(FC(1, 10, 1))) {
                  _lower = _upper;
                  _upper = _upper.div(2);
                } else {
                  var _cutOff = false;
                  if (infLoopDetector && (range == 1 && stage == 1 || range == -1 && stage == 3)) _cutOff = true;
                  _lower = _lower.sub(difference);
                  _upper = _upper.sub(difference);
                  if (_cutOff) break;
                }
              }
              if (_lower.sub(_upper).div(2).abs().gt(difference.mul(1.5))) infLoopDetector = true;
              difference = _lower.sub(_upper).div(2).abs();
              if (_upper.gt("1e18")) break;
              if (_upper.eq(previousUpper)) break;
            }
            if (_upper.gt("1e18")) break;
            if (!decreasingFound) break;
            if (lastValid == FC(1, 10, 1)) {
              break;
            }
            if (stage == 1) minimum = lastValid;else if (stage == 3) maximum = lastValid;
            stage++;
          }
          _lower = minimum;
          _upper = FC(1, 1, -18);
          var _previous = _upper;
          var _guess = Decimal.dZero;
          var _loopGoing = true;
          while (_loopGoing) {
            if (_lower.eq(FC(1, 10, 1))) _guess = _upper.mul(2);else _guess = _lower.add(_upper).div(2);
            if (Decimal.pow(10, _guess).recip().tetrate(degree, 1, true).gt(this)) _upper = _guess;else _lower = _guess;
            if (_guess.eq(_previous)) _loopGoing = false;else _previous = _guess;
            if (_upper.gt("1e18")) return new Decimal(Decimal.dNaN);
          }
          if (!_guess.eq_tolerance(minimum, 1e-15)) {
            return _guess.pow10().recip();
          } else {
            if (maximum.eq(FC(1, 10, 1))) {
              return new Decimal(Decimal.dNaN);
            }
            _lower = FC(1, 10, 1);
            _upper = maximum;
            _previous = _upper;
            _guess = Decimal.dZero;
            _loopGoing = true;
            while (_loopGoing) {
              if (_lower.eq(FC(1, 10, 1))) _guess = _upper.mul(2);else _guess = _lower.add(_upper).div(2);
              if (Decimal.pow(10, _guess).recip().tetrate(degree, 1, true).gt(this)) _upper = _guess;else _lower = _guess;
              if (_guess.eq(_previous)) _loopGoing = false;else _previous = _guess;
              if (_upper.gt("1e18")) return new Decimal(Decimal.dNaN);
            }
            return _guess.pow10().recip();
          }
        }
      }
    }, {
      key: "pentate",
      value:
      function pentate() {
        var height = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
        var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FC_NN(1, 0, 1);
        var linear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        payload = new Decimal(payload);
        var oldheight = height;
        height = Math.floor(height);
        var fracheight = oldheight - height;
        var prevpayload = Decimal.dZero;
        var prevtwopayload = Decimal.dZero;
        if (fracheight !== 0) {
          if (payload.eq(Decimal.dOne)) {
            ++height;
            payload = Decimal.fromNumber(fracheight);
          } else {
            return this.pentate(payload.penta_log(this, undefined, linear).plus(oldheight).toNumber(), 1, linear);
          }
        }
        if (height > 0) {
          for (var i = 0; i < height;) {
            prevtwopayload = prevpayload;
            prevpayload = payload;
            payload = this.tetrate(payload.toNumber(), Decimal.dOne, linear);
            ++i;
            if (this.gt(0) && this.lte(1) && payload.gt(0) && payload.lte(1)) return this.tetrate(height - i, payload, linear);
            if (payload.eq(prevpayload) || payload.eq(prevtwopayload) && i % 2 == height % 2) return payload.normalize();
            if (!isFinite(payload.layer) || !isFinite(payload.mag)) {
              return payload.normalize();
            }
            if (i > 10000) {
              return payload;
            }
          }
        } else {
          for (var _i2 = 0; _i2 < -height; ++_i2) {
            prevpayload = payload;
            payload = payload.slog(this, undefined, linear);
            if (payload.eq(prevpayload)) return payload.normalize();
            if (!isFinite(payload.layer) || !isFinite(payload.mag)) {
              return payload.normalize();
            }
            if (_i2 > 100) {
              return payload;
            }
          }
        }
        return payload;
      }
    }, {
      key: "penta_log",
      value: function penta_log() {
        var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
        var iterations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
        var linear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        base = new Decimal(base);
        if (base.lte(1)) return new Decimal(Decimal.dNaN);
        if (this.eq(1)) return FC_NN(0, 0, 0);
        if (this.eq(Decimal.dInf)) return new Decimal(Decimal.dInf);
        var value = new Decimal(1);
        var result = 0;
        var step_size = 1;
        if (this.lt(-1)) {
          if (this.lte(-2)) return new Decimal(Decimal.dNaN);
          var limitcheck = base.tetrate(this.toNumber(), 1, linear);
          if (this.eq(limitcheck)) return new Decimal(Decimal.dNegInf);
          if (this.gt(limitcheck)) return new Decimal(Decimal.dNaN);
        }
        if (this.gt(1)) {
          while (value.lt(this)) {
            result++;
            value = Decimal.tetrate(base, value.toNumber(), 1, linear);
            if (result > 1000) {
              return new Decimal(Decimal.dNaN);
            }
          }
        } else {
          while (value.gt(this)) {
            result--;
            value = Decimal.slog(value, base, linear);
            if (result > 100) {
              return new Decimal(Decimal.dNaN);
            }
          }
        }
        for (var i = 1; i < iterations; ++i) {
          var new_decimal = base.pentate(result, Decimal.dOne, linear);
          if (new_decimal.eq(this)) break;
          var currently_rose = new_decimal.gt(this);
          step_size = Math.abs(step_size) * (currently_rose ? -1 : 1);
          result += step_size;
          step_size /= 2;
          if (step_size === 0) {
            break;
          }
        }
        return Decimal.fromNumber(result);
      }
    }, {
      key: "linear_penta_root",
      value: function linear_penta_root(degree) {
        if (degree == 1) {
          return this;
        }
        if (degree < 0) {
          return new Decimal(Decimal.dNaN);
        }
        if (this.eq(Decimal.dInf)) {
          return new Decimal(Decimal.dInf);
        }
        if (!this.isFinite()) {
          return new Decimal(Decimal.dNaN);
        }
        if (degree > 0 && degree < 1) {
          return this.root(degree);
        }
        if (this.eq(1)) {
          return FC_NN(1, 0, 1);
        }
        if (this.lt(0)) {
          return new Decimal(Decimal.dNaN);
        }
        if (this.lt(1)) {
          return this.linear_sroot(degree);
        }
        return Decimal.increasingInverse(function (value) {
          return Decimal.pentate(value, degree, 1, true);
        })(this);
      }
    }, {
      key: "sin",
      value: function sin() {
        if (this.mag < 0) {
          return new Decimal(this);
        }
        if (this.layer === 0) {
          return Decimal.fromNumber(Math.sin(this.sign * this.mag));
        }
        return FC_NN(0, 0, 0);
      }
    }, {
      key: "cos",
      value: function cos() {
        if (this.mag < 0) {
          return FC_NN(1, 0, 1);
        }
        if (this.layer === 0) {
          return Decimal.fromNumber(Math.cos(this.sign * this.mag));
        }
        return FC_NN(0, 0, 0);
      }
    }, {
      key: "tan",
      value: function tan() {
        if (this.mag < 0) {
          return new Decimal(this);
        }
        if (this.layer === 0) {
          return Decimal.fromNumber(Math.tan(this.sign * this.mag));
        }
        return FC_NN(0, 0, 0);
      }
    }, {
      key: "asin",
      value: function asin() {
        if (this.mag < 0) {
          return new Decimal(this);
        }
        if (this.layer === 0) {
          return Decimal.fromNumber(Math.asin(this.sign * this.mag));
        }
        return new Decimal(Decimal.dNaN);
      }
    }, {
      key: "acos",
      value: function acos() {
        if (this.mag < 0) {
          return Decimal.fromNumber(Math.acos(this.toNumber()));
        }
        if (this.layer === 0) {
          return Decimal.fromNumber(Math.acos(this.sign * this.mag));
        }
        return new Decimal(Decimal.dNaN);
      }
    }, {
      key: "atan",
      value: function atan() {
        if (this.mag < 0) {
          return new Decimal(this);
        }
        if (this.layer === 0) {
          return Decimal.fromNumber(Math.atan(this.sign * this.mag));
        }
        return Decimal.fromNumber(Math.atan(this.sign * 1.8e308));
      }
    }, {
      key: "sinh",
      value: function sinh() {
        return this.exp().sub(this.negate().exp()).div(2);
      }
    }, {
      key: "cosh",
      value: function cosh() {
        return this.exp().add(this.negate().exp()).div(2);
      }
    }, {
      key: "tanh",
      value: function tanh() {
        return this.sinh().div(this.cosh());
      }
    }, {
      key: "asinh",
      value: function asinh() {
        return Decimal.ln(this.add(this.sqr().add(1).sqrt()));
      }
    }, {
      key: "acosh",
      value: function acosh() {
        return Decimal.ln(this.add(this.sqr().sub(1).sqrt()));
      }
    }, {
      key: "atanh",
      value: function atanh() {
        if (this.abs().gte(1)) {
          return new Decimal(Decimal.dNaN);
        }
        return Decimal.ln(this.add(1).div(Decimal.fromNumber(1).sub(this))).div(2);
      }
    }, {
      key: "ascensionPenalty",
      value: function ascensionPenalty(ascensions) {
        if (ascensions === 0) {
          return new Decimal(this);
        }
        return this.root(Decimal.pow(10, ascensions));
      }
    }, {
      key: "egg",
      value: function egg() {
        return this.add(9);
      }
    }, {
      key: "lessThanOrEqualTo",
      value: function lessThanOrEqualTo(other) {
        return this.cmp(other) < 1;
      }
    }, {
      key: "lessThan",
      value: function lessThan(other) {
        return this.cmp(other) < 0;
      }
    }, {
      key: "greaterThanOrEqualTo",
      value: function greaterThanOrEqualTo(other) {
        return this.cmp(other) > -1;
      }
    }, {
      key: "greaterThan",
      value: function greaterThan(other) {
        return this.cmp(other) > 0;
      }
    }], [{
      key: "fromComponents",
      value: function fromComponents(sign, layer, mag) {
        return new Decimal().fromComponents(sign, layer, mag);
      }
    }, {
      key: "fromComponents_noNormalize",
      value: function fromComponents_noNormalize(sign, layer, mag) {
        return new Decimal().fromComponents_noNormalize(sign, layer, mag);
      }
    }, {
      key: "fromMantissaExponent",
      value: function fromMantissaExponent(mantissa, exponent) {
        return new Decimal().fromMantissaExponent(mantissa, exponent);
      }
    }, {
      key: "fromMantissaExponent_noNormalize",
      value: function fromMantissaExponent_noNormalize(mantissa, exponent) {
        return new Decimal().fromMantissaExponent_noNormalize(mantissa, exponent);
      }
    }, {
      key: "fromDecimal",
      value: function fromDecimal(value) {
        return new Decimal().fromDecimal(value);
      }
    }, {
      key: "fromNumber",
      value: function fromNumber(value) {
        return new Decimal().fromNumber(value);
      }
    }, {
      key: "fromString",
      value: function fromString(value) {
        var linearhyper4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return new Decimal().fromString(value, linearhyper4);
      }
    }, {
      key: "fromValue",
      value: function fromValue(value) {
        return new Decimal().fromValue(value);
      }
    }, {
      key: "fromValue_noAlloc",
      value: function fromValue_noAlloc(value) {
        if (value instanceof Decimal) {
          return value;
        } else if (typeof value === "string") {
          var cached = Decimal.fromStringCache.get(value);
          if (cached !== undefined) {
            return cached;
          }
          return Decimal.fromString(value);
        } else if (typeof value === "number") {
          return Decimal.fromNumber(value);
        } else {
          return FC_NN(0, 0, 0);
        }
      }
    }, {
      key: "abs",
      value: function abs(value) {
        return D(value).abs();
      }
    }, {
      key: "neg",
      value: function neg(value) {
        return D(value).neg();
      }
    }, {
      key: "negate",
      value: function negate(value) {
        return D(value).neg();
      }
    }, {
      key: "negated",
      value: function negated(value) {
        return D(value).neg();
      }
    }, {
      key: "sign",
      value: function sign(value) {
        return D(value).sign;
      }
    }, {
      key: "sgn",
      value: function sgn(value) {
        return D(value).sign;
      }
    }, {
      key: "round",
      value: function round(value) {
        return D(value).round();
      }
    }, {
      key: "floor",
      value: function floor(value) {
        return D(value).floor();
      }
    }, {
      key: "ceil",
      value: function ceil(value) {
        return D(value).ceil();
      }
    }, {
      key: "trunc",
      value: function trunc(value) {
        return D(value).trunc();
      }
    }, {
      key: "add",
      value: function add(value, other) {
        return D(value).add(other);
      }
    }, {
      key: "plus",
      value: function plus(value, other) {
        return D(value).add(other);
      }
    }, {
      key: "sub",
      value: function sub(value, other) {
        return D(value).sub(other);
      }
    }, {
      key: "subtract",
      value: function subtract(value, other) {
        return D(value).sub(other);
      }
    }, {
      key: "minus",
      value: function minus(value, other) {
        return D(value).sub(other);
      }
    }, {
      key: "mul",
      value: function mul(value, other) {
        return D(value).mul(other);
      }
    }, {
      key: "multiply",
      value: function multiply(value, other) {
        return D(value).mul(other);
      }
    }, {
      key: "times",
      value: function times(value, other) {
        return D(value).mul(other);
      }
    }, {
      key: "div",
      value: function div(value, other) {
        return D(value).div(other);
      }
    }, {
      key: "divide",
      value: function divide(value, other) {
        return D(value).div(other);
      }
    }, {
      key: "recip",
      value: function recip(value) {
        return D(value).recip();
      }
    }, {
      key: "reciprocal",
      value: function reciprocal(value) {
        return D(value).recip();
      }
    }, {
      key: "reciprocate",
      value: function reciprocate(value) {
        return D(value).reciprocate();
      }
    }, {
      key: "mod",
      value: function mod(value, other) {
        var floored = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        return D(value).mod(other, floored);
      }
    }, {
      key: "modulo",
      value: function modulo(value, other) {
        var floored = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        return D(value).modulo(other, floored);
      }
    }, {
      key: "modular",
      value: function modular(value, other) {
        var floored = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        return D(value).modular(other, floored);
      }
    }, {
      key: "cmp",
      value: function cmp(value, other) {
        return D(value).cmp(other);
      }
    }, {
      key: "cmpabs",
      value: function cmpabs(value, other) {
        return D(value).cmpabs(other);
      }
    }, {
      key: "compare",
      value: function compare(value, other) {
        return D(value).cmp(other);
      }
    }, {
      key: "isNaN",
      value: function (_isNaN) {
        function isNaN(_x) {
          return _isNaN.apply(this, arguments);
        }
        isNaN.toString = function () {
          return _isNaN.toString();
        };
        return isNaN;
      }(function (value) {
        value = D(value);
        return isNaN(value.sign) || isNaN(value.layer) || isNaN(value.mag);
      }
      )
    }, {
      key: "isFinite",
      value: function (_isFinite) {
        function isFinite(_x2) {
          return _isFinite.apply(this, arguments);
        }
        isFinite.toString = function () {
          return _isFinite.toString();
        };
        return isFinite;
      }(function (value) {
        value = D(value);
        return isFinite(value.sign) && isFinite(value.layer) && isFinite(value.mag);
      }
      )
    }, {
      key: "eq",
      value: function eq(value, other) {
        return D(value).eq(other);
      }
    }, {
      key: "equals",
      value: function equals(value, other) {
        return D(value).eq(other);
      }
    }, {
      key: "neq",
      value: function neq(value, other) {
        return D(value).neq(other);
      }
    }, {
      key: "notEquals",
      value: function notEquals(value, other) {
        return D(value).notEquals(other);
      }
    }, {
      key: "lt",
      value: function lt(value, other) {
        return D(value).lt(other);
      }
    }, {
      key: "lte",
      value: function lte(value, other) {
        return D(value).lte(other);
      }
    }, {
      key: "gt",
      value: function gt(value, other) {
        return D(value).gt(other);
      }
    }, {
      key: "gte",
      value: function gte(value, other) {
        return D(value).gte(other);
      }
    }, {
      key: "max",
      value: function max(value, other) {
        return D(value).max(other);
      }
    }, {
      key: "min",
      value: function min(value, other) {
        return D(value).min(other);
      }
    }, {
      key: "minabs",
      value: function minabs(value, other) {
        return D(value).minabs(other);
      }
    }, {
      key: "maxabs",
      value: function maxabs(value, other) {
        return D(value).maxabs(other);
      }
    }, {
      key: "clamp",
      value: function clamp(value, min, max) {
        return D(value).clamp(min, max);
      }
    }, {
      key: "clampMin",
      value: function clampMin(value, min) {
        return D(value).clampMin(min);
      }
    }, {
      key: "clampMax",
      value: function clampMax(value, max) {
        return D(value).clampMax(max);
      }
    }, {
      key: "cmp_tolerance",
      value: function cmp_tolerance(value, other, tolerance) {
        return D(value).cmp_tolerance(other, tolerance);
      }
    }, {
      key: "compare_tolerance",
      value: function compare_tolerance(value, other, tolerance) {
        return D(value).cmp_tolerance(other, tolerance);
      }
    }, {
      key: "eq_tolerance",
      value: function eq_tolerance(value, other, tolerance) {
        return D(value).eq_tolerance(other, tolerance);
      }
    }, {
      key: "equals_tolerance",
      value: function equals_tolerance(value, other, tolerance) {
        return D(value).eq_tolerance(other, tolerance);
      }
    }, {
      key: "neq_tolerance",
      value: function neq_tolerance(value, other, tolerance) {
        return D(value).neq_tolerance(other, tolerance);
      }
    }, {
      key: "notEquals_tolerance",
      value: function notEquals_tolerance(value, other, tolerance) {
        return D(value).notEquals_tolerance(other, tolerance);
      }
    }, {
      key: "lt_tolerance",
      value: function lt_tolerance(value, other, tolerance) {
        return D(value).lt_tolerance(other, tolerance);
      }
    }, {
      key: "lte_tolerance",
      value: function lte_tolerance(value, other, tolerance) {
        return D(value).lte_tolerance(other, tolerance);
      }
    }, {
      key: "gt_tolerance",
      value: function gt_tolerance(value, other, tolerance) {
        return D(value).gt_tolerance(other, tolerance);
      }
    }, {
      key: "gte_tolerance",
      value: function gte_tolerance(value, other, tolerance) {
        return D(value).gte_tolerance(other, tolerance);
      }
    }, {
      key: "pLog10",
      value: function pLog10(value) {
        return D(value).pLog10();
      }
    }, {
      key: "absLog10",
      value: function absLog10(value) {
        return D(value).absLog10();
      }
    }, {
      key: "log10",
      value: function log10(value) {
        return D(value).log10();
      }
    }, {
      key: "log",
      value: function log(value, base) {
        return D(value).log(base);
      }
    }, {
      key: "log2",
      value: function log2(value) {
        return D(value).log2();
      }
    }, {
      key: "ln",
      value: function ln(value) {
        return D(value).ln();
      }
    }, {
      key: "logarithm",
      value: function logarithm(value, base) {
        return D(value).logarithm(base);
      }
    }, {
      key: "pow",
      value: function pow(value, other) {
        return D(value).pow(other);
      }
    }, {
      key: "pow10",
      value: function pow10(value) {
        return D(value).pow10();
      }
    }, {
      key: "root",
      value: function root(value, other) {
        return D(value).root(other);
      }
    }, {
      key: "factorial",
      value: function factorial(value, _other) {
        return D(value).factorial();
      }
    }, {
      key: "gamma",
      value: function gamma(value, _other) {
        return D(value).gamma();
      }
    }, {
      key: "lngamma",
      value: function lngamma(value, _other) {
        return D(value).lngamma();
      }
    }, {
      key: "exp",
      value: function exp(value) {
        return D(value).exp();
      }
    }, {
      key: "sqr",
      value: function sqr(value) {
        return D(value).sqr();
      }
    }, {
      key: "sqrt",
      value: function sqrt(value) {
        return D(value).sqrt();
      }
    }, {
      key: "cube",
      value: function cube(value) {
        return D(value).cube();
      }
    }, {
      key: "cbrt",
      value: function cbrt(value) {
        return D(value).cbrt();
      }
    }, {
      key: "tetrate",
      value: function tetrate(value) {
        var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
        var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : FC_NN(1, 0, 1);
        var linear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        return D(value).tetrate(height, payload, linear);
      }
    }, {
      key: "iteratedexp",
      value: function iteratedexp(value) {
        var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
        var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : FC_NN(1, 0, 1);
        var linear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        return D(value).iteratedexp(height, payload, linear);
      }
    }, {
      key: "iteratedlog",
      value: function iteratedlog(value) {
        var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
        var times = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var linear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        return D(value).iteratedlog(base, times, linear);
      }
    }, {
      key: "layeradd10",
      value: function layeradd10(value, diff) {
        var linear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        return D(value).layeradd10(diff, linear);
      }
    }, {
      key: "layeradd",
      value: function layeradd(value, diff) {
        var base = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
        var linear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        return D(value).layeradd(diff, base, linear);
      }
    }, {
      key: "slog",
      value: function slog(value) {
        var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
        var linear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        return D(value).slog(base, 100, linear);
      }
    }, {
      key: "lambertw",
      value: function lambertw(value, principal) {
        return D(value).lambertw(principal);
      }
    }, {
      key: "ssqrt",
      value: function ssqrt(value) {
        return D(value).ssqrt();
      }
    }, {
      key: "linear_sroot",
      value: function linear_sroot(value, degree) {
        return D(value).linear_sroot(degree);
      }
    }, {
      key: "pentate",
      value: function pentate(value) {
        var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
        var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : FC_NN(1, 0, 1);
        var linear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        return D(value).pentate(height, payload, linear);
      }
    }, {
      key: "penta_log",
      value: function penta_log(value) {
        var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
        var linear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        return D(value).penta_log(base, 100, linear);
      }
    }, {
      key: "linear_penta_root",
      value: function linear_penta_root(value, degree) {
        return D(value).linear_penta_root(degree);
      }
    }, {
      key: "sin",
      value: function sin(value) {
        return D(value).sin();
      }
    }, {
      key: "cos",
      value: function cos(value) {
        return D(value).cos();
      }
    }, {
      key: "tan",
      value: function tan(value) {
        return D(value).tan();
      }
    }, {
      key: "asin",
      value: function asin(value) {
        return D(value).asin();
      }
    }, {
      key: "acos",
      value: function acos(value) {
        return D(value).acos();
      }
    }, {
      key: "atan",
      value: function atan(value) {
        return D(value).atan();
      }
    }, {
      key: "sinh",
      value: function sinh(value) {
        return D(value).sinh();
      }
    }, {
      key: "cosh",
      value: function cosh(value) {
        return D(value).cosh();
      }
    }, {
      key: "tanh",
      value: function tanh(value) {
        return D(value).tanh();
      }
    }, {
      key: "asinh",
      value: function asinh(value) {
        return D(value).asinh();
      }
    }, {
      key: "acosh",
      value: function acosh(value) {
        return D(value).acosh();
      }
    }, {
      key: "atanh",
      value: function atanh(value) {
        return D(value).atanh();
      }
    }, {
      key: "affordGeometricSeries",
      value: function affordGeometricSeries(resourcesAvailable, priceStart, priceRatio, currentOwned) {
        return this.affordGeometricSeries_core(D(resourcesAvailable), D(priceStart), D(priceRatio), currentOwned);
      }
    }, {
      key: "sumGeometricSeries",
      value: function sumGeometricSeries(numItems, priceStart, priceRatio, currentOwned) {
        return this.sumGeometricSeries_core(numItems, D(priceStart), D(priceRatio), currentOwned);
      }
    }, {
      key: "affordArithmeticSeries",
      value: function affordArithmeticSeries(resourcesAvailable, priceStart, priceAdd, currentOwned) {
        return this.affordArithmeticSeries_core(D(resourcesAvailable), D(priceStart), D(priceAdd), D(currentOwned));
      }
    }, {
      key: "sumArithmeticSeries",
      value: function sumArithmeticSeries(numItems, priceStart, priceAdd, currentOwned) {
        return this.sumArithmeticSeries_core(D(numItems), D(priceStart), D(priceAdd), D(currentOwned));
      }
    }, {
      key: "efficiencyOfPurchase",
      value: function efficiencyOfPurchase(cost, currentRpS, deltaRpS) {
        return this.efficiencyOfPurchase_core(D(cost), D(currentRpS), D(deltaRpS));
      }
    }, {
      key: "randomDecimalForTesting",
      value: function randomDecimalForTesting(maxLayers) {
        if (Math.random() * 20 < 1) {
          return FC_NN(0, 0, 0);
        }
        var randomsign = Math.random() > 0.5 ? 1 : -1;
        if (Math.random() * 20 < 1) {
          return FC_NN(randomsign, 0, 1);
        }
        var layer = Math.floor(Math.random() * (maxLayers + 1));
        var randomexp = layer === 0 ? Math.random() * 616 - 308 : Math.random() * 16;
        if (Math.random() > 0.9) {
          randomexp = Math.trunc(randomexp);
        }
        var randommag = Math.pow(10, randomexp);
        if (Math.random() > 0.9) {
          randommag = Math.trunc(randommag);
        }
        return FC(randomsign, layer, randommag);
      }
    }, {
      key: "affordGeometricSeries_core",
      value: function affordGeometricSeries_core(resourcesAvailable, priceStart, priceRatio, currentOwned) {
        var actualStart = priceStart.mul(priceRatio.pow(currentOwned));
        return Decimal.floor(resourcesAvailable.div(actualStart).mul(priceRatio.sub(1)).add(1).log10().div(priceRatio.log10()));
      }
    }, {
      key: "sumGeometricSeries_core",
      value: function sumGeometricSeries_core(numItems, priceStart, priceRatio, currentOwned) {
        return priceStart.mul(priceRatio.pow(currentOwned)).mul(Decimal.sub(1, priceRatio.pow(numItems))).div(Decimal.sub(1, priceRatio));
      }
    }, {
      key: "affordArithmeticSeries_core",
      value: function affordArithmeticSeries_core(resourcesAvailable, priceStart, priceAdd, currentOwned) {
        var actualStart = priceStart.add(currentOwned.mul(priceAdd));
        var b = actualStart.sub(priceAdd.div(2));
        var b2 = b.pow(2);
        return b.neg().add(b2.add(priceAdd.mul(resourcesAvailable).mul(2)).sqrt()).div(priceAdd).floor();
      }
    }, {
      key: "sumArithmeticSeries_core",
      value: function sumArithmeticSeries_core(numItems, priceStart, priceAdd, currentOwned) {
        var actualStart = priceStart.add(currentOwned.mul(priceAdd));
        return numItems.div(2).mul(actualStart.mul(2).plus(numItems.sub(1).mul(priceAdd)));
      }
    }, {
      key: "efficiencyOfPurchase_core",
      value: function efficiencyOfPurchase_core(cost, currentRpS, deltaRpS) {
        return cost.div(currentRpS).add(cost.div(deltaRpS));
      }
    }, {
      key: "slog_critical",
      value: function slog_critical(base, height) {
        if (base > 10) {
          return height - 1;
        }
        return Decimal.critical_section(base, height, critical_slog_values);
      }
    }, {
      key: "tetrate_critical",
      value: function tetrate_critical(base, height) {
        return Decimal.critical_section(base, height, critical_tetr_values);
      }
    }, {
      key: "critical_section",
      value: function critical_section(base, height, grid) {
        height *= 10;
        if (height < 0) {
          height = 0;
        }
        if (height > 10) {
          height = 10;
        }
        if (base < 2) {
          base = 2;
        }
        if (base > 10) {
          base = 10;
        }
        var lower = 0;
        var upper = 0;
        for (var i = 0; i < critical_headers.length; ++i) {
          if (critical_headers[i] == base) {
            lower = grid[i][Math.floor(height)];
            upper = grid[i][Math.ceil(height)];
            break;
          } else if (critical_headers[i] < base && critical_headers[i + 1] > base) {
            var basefrac = (base - critical_headers[i]) / (critical_headers[i + 1] - critical_headers[i]);
            lower = grid[i][Math.floor(height)] * (1 - basefrac) + grid[i + 1][Math.floor(height)] * basefrac;
            upper = grid[i][Math.ceil(height)] * (1 - basefrac) + grid[i + 1][Math.ceil(height)] * basefrac;
            break;
          }
        }
        var frac = height - Math.floor(height);
        if (lower <= 0 || upper <= 0) {
          return lower * (1 - frac) + upper * frac;
        } else {
          return Math.pow(base, Math.log(lower) / Math.log(base) * (1 - frac) + Math.log(upper) / Math.log(base) * frac);
        }
      }
    }, {
      key: "excess_slog",
      value: function excess_slog(value, base) {
        var linear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        value = D(value);
        base = D(base);
        var baseD = base;
        base = base.toNumber();
        if (base == 1 || base <= 0) return [new Decimal(Decimal.dNaN), 0];
        if (base > 1.44466786100976613366) return [value.slog(base, 100, linear), 0];
        var negln = Decimal.ln(base).neg();
        var lower = negln.lambertw().div(negln);
        var upper = Decimal.dInf;
        if (base > 1) upper = negln.lambertw(false).div(negln);
        if (base > 1.444667861009099) {
          lower = upper = Decimal.fromNumber(Math.E);
        }
        if (value.lt(lower)) return [value.slog(base, 100, linear), 0];
        if (value.eq(lower)) return [new Decimal(Decimal.dInf), 0];
        if (value.eq(upper)) return [new Decimal(Decimal.dNegInf), 2];
        if (value.gt(upper)) {
          var slogzero = upper.mul(2);
          var slogone = baseD.pow(slogzero);
          var estimate = 0;
          if (value.gte(slogzero) && value.lt(slogone)) estimate = 0;else if (value.gte(slogone)) {
            var payload = slogone;
            estimate = 1;
            while (payload.lt(value)) {
              payload = baseD.pow(payload);
              estimate = estimate + 1;
              if (payload.layer > 3) {
                var layersleft = Math.floor(value.layer - payload.layer + 1);
                payload = baseD.iteratedexp(layersleft, payload, linear);
                estimate = estimate + layersleft;
              }
            }
            if (payload.gt(value)) {
              payload = payload.log(base);
              estimate = estimate - 1;
            }
          } else if (value.lt(slogzero)) {
            var _payload5 = slogzero;
            estimate = 0;
            while (_payload5.gt(value)) {
              _payload5 = _payload5.log(base);
              estimate = estimate - 1;
            }
          }
          var fracheight = 0;
          var tested = 0;
          var step_size = 0.5;
          var towertop = slogzero;
          var guess = Decimal.dZero;
          while (step_size > 1e-16) {
            tested = fracheight + step_size;
            towertop = slogzero.pow(1 - tested).mul(slogone.pow(tested));
            guess = Decimal.iteratedexp(base, estimate, towertop);
            if (guess.eq(value)) return [new Decimal(estimate + tested), 2];else if (guess.lt(value)) fracheight += step_size;
            step_size /= 2;
          }
          if (guess.neq_tolerance(value, 1e-7)) return [new Decimal(Decimal.dNaN), 0];
          return [new Decimal(estimate + fracheight), 2];
        }
        if (value.lt(upper) && value.gt(lower)) {
          var _slogzero = lower.mul(upper).sqrt();
          var _slogone = baseD.pow(_slogzero);
          var _estimate = 0;
          if (value.lte(_slogzero) && value.gt(_slogone)) _estimate = 0;else if (value.lte(_slogone)) {
            var _payload6 = _slogone;
            _estimate = 1;
            while (_payload6.gt(value)) {
              _payload6 = baseD.pow(_payload6);
              _estimate = _estimate + 1;
            }
            if (_payload6.lt(value)) {
              _payload6 = _payload6.log(base);
              _estimate = _estimate - 1;
            }
          } else if (value.gt(_slogzero)) {
            var _payload7 = _slogzero;
            _estimate = 0;
            while (_payload7.lt(value)) {
              _payload7 = _payload7.log(base);
              _estimate = _estimate - 1;
            }
          }
          var _fracheight = 0;
          var _tested = 0;
          var _step_size = 0.5;
          var _towertop = _slogzero;
          var _guess2 = Decimal.dZero;
          while (_step_size > 1e-16) {
            _tested = _fracheight + _step_size;
            _towertop = _slogzero.pow(1 - _tested).mul(_slogone.pow(_tested));
            _guess2 = Decimal.iteratedexp(base, _estimate, _towertop);
            if (_guess2.eq(value)) return [new Decimal(_estimate + _tested), 1];else if (_guess2.gt(value)) _fracheight += _step_size;
            _step_size /= 2;
          }
          if (_guess2.neq_tolerance(value, 1e-7)) return [new Decimal(Decimal.dNaN), 0];
          return [new Decimal(_estimate + _fracheight), 1];
        }
        throw new Error("Unhandled behavior in excess_slog");
      }
    }, {
      key: "increasingInverse",
      value: function increasingInverse(func) {
        var decreasing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var iterations = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 120;
        var minX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Decimal.dLayerMax.neg();
        var maxX = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Decimal.dLayerMax;
        var minY = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : Decimal.dLayerMax.neg();
        var maxY = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : Decimal.dLayerMax;
        return function (value) {
          value = new Decimal(value);
          minX = new Decimal(minX);
          maxX = new Decimal(maxX);
          minY = new Decimal(minY);
          maxY = new Decimal(maxY);
          if (value.isNan() || maxX.lt(minX) || value.lt(minY) || value.gt(maxY)) return new Decimal(Decimal.dNaN);
          var rangeApply = function rangeApply(value) {
            return new Decimal(value);
          };
          var currentCheck = true;
          if (maxX.lt(0)) currentCheck = false;else if (minX.gt(0)) currentCheck = true;else {
            var valCheck = func(Decimal.dZero);
            if (valCheck.eq(value)) return FC_NN(0, 0, 0);
            currentCheck = value.gt(valCheck);
            if (decreasing) currentCheck = !currentCheck;
          }
          var positive = currentCheck;
          var reciprocal;
          if (currentCheck) {
            if (maxX.lt(FIRST_NEG_LAYER)) currentCheck = true;else if (minX.gt(FIRST_NEG_LAYER)) currentCheck = false;else {
              var _valCheck = func(new Decimal(FIRST_NEG_LAYER));
              currentCheck = value.lt(_valCheck);
              if (decreasing) currentCheck = !currentCheck;
            }
            if (currentCheck) {
              reciprocal = true;
              var limit = Decimal.pow(10, EXP_LIMIT).recip();
              if (maxX.lt(limit)) currentCheck = false;else if (minX.gt(limit)) currentCheck = true;else {
                var _valCheck2 = func(new Decimal(limit));
                currentCheck = value.gt(_valCheck2);
                if (decreasing) currentCheck = !currentCheck;
              }
              if (currentCheck) rangeApply = function rangeApply(value) {
                return Decimal.pow(10, value).recip();
              };else {
                var _limit = Decimal.tetrate(10, EXP_LIMIT);
                if (maxX.lt(_limit)) currentCheck = false;else if (minX.gt(_limit)) currentCheck = true;else {
                  var _valCheck3 = func(new Decimal(_limit));
                  currentCheck = value.gt(_valCheck3);
                  if (decreasing) currentCheck = !currentCheck;
                }
                if (currentCheck) rangeApply = function rangeApply(value) {
                  return Decimal.tetrate(10, new Decimal(value).toNumber()).recip();
                };
                else rangeApply = function rangeApply(value) {
                  return new Decimal(value).gt(Math.log10(Number.MAX_VALUE)) ? Decimal.dZero : Decimal.tetrate(10, Decimal.pow(10, value).toNumber()).recip();
                };
              }
            } else {
              reciprocal = false;
              if (maxX.lt(EXP_LIMIT)) currentCheck = true;else if (minX.gt(EXP_LIMIT)) currentCheck = false;else {
                var _valCheck4 = func(new Decimal(EXP_LIMIT));
                currentCheck = value.lt(_valCheck4);
                if (decreasing) currentCheck = !currentCheck;
              }
              if (currentCheck) rangeApply = function rangeApply(value) {
                return new Decimal(value);
              };else {
                var _limit2 = Decimal.pow(10, EXP_LIMIT);
                if (maxX.lt(_limit2)) currentCheck = true;else if (minX.gt(_limit2)) currentCheck = false;else {
                  var _valCheck5 = func(new Decimal(_limit2));
                  currentCheck = value.lt(_valCheck5);
                  if (decreasing) currentCheck = !currentCheck;
                }
                if (currentCheck) rangeApply = function rangeApply(value) {
                  return Decimal.pow(10, value);
                };else {
                  var _limit3 = Decimal.tetrate(10, EXP_LIMIT);
                  if (maxX.lt(_limit3)) currentCheck = true;else if (minX.gt(_limit3)) currentCheck = false;else {
                    var _valCheck6 = func(new Decimal(_limit3));
                    currentCheck = value.lt(_valCheck6);
                    if (decreasing) currentCheck = !currentCheck;
                  }
                  if (currentCheck) rangeApply = function rangeApply(value) {
                    return Decimal.tetrate(10, new Decimal(value).toNumber());
                  };
                  else rangeApply = function rangeApply(value) {
                    return new Decimal(value).gt(Math.log10(Number.MAX_VALUE)) ? Decimal.dInf : Decimal.tetrate(10, Decimal.pow(10, value).toNumber());
                  };
                }
              }
            }
          } else {
            reciprocal = true;
            if (maxX.lt(-FIRST_NEG_LAYER)) currentCheck = false;else if (minX.gt(-FIRST_NEG_LAYER)) currentCheck = true;else {
              var _valCheck7 = func(new Decimal(-FIRST_NEG_LAYER));
              currentCheck = value.gt(_valCheck7);
              if (decreasing) currentCheck = !currentCheck;
            }
            if (currentCheck) {
              var _limit4 = Decimal.pow(10, EXP_LIMIT).recip().neg();
              if (maxX.lt(_limit4)) currentCheck = true;else if (minX.gt(_limit4)) currentCheck = false;else {
                var _valCheck8 = func(new Decimal(_limit4));
                currentCheck = value.lt(_valCheck8);
                if (decreasing) currentCheck = !currentCheck;
              }
              if (currentCheck) rangeApply = function rangeApply(value) {
                return Decimal.pow(10, value).recip().neg();
              };else {
                var _limit5 = Decimal.tetrate(10, EXP_LIMIT).neg();
                if (maxX.lt(_limit5)) currentCheck = true;else if (minX.gt(_limit5)) currentCheck = false;else {
                  var _valCheck9 = func(new Decimal(_limit5));
                  currentCheck = value.lt(_valCheck9);
                  if (decreasing) currentCheck = !currentCheck;
                }
                if (currentCheck) rangeApply = function rangeApply(value) {
                  return Decimal.tetrate(10, new Decimal(value).toNumber()).recip().neg();
                };
                else rangeApply = function rangeApply(value) {
                  return new Decimal(value).gt(Math.log10(Number.MAX_VALUE)) ? Decimal.dZero : Decimal.tetrate(10, Decimal.pow(10, value).toNumber()).recip().neg();
                };
              }
            } else {
              reciprocal = false;
              if (maxX.lt(-EXP_LIMIT)) currentCheck = false;else if (minX.gt(-EXP_LIMIT)) currentCheck = true;else {
                var _valCheck10 = func(new Decimal(-EXP_LIMIT));
                currentCheck = value.gt(_valCheck10);
                if (decreasing) currentCheck = !currentCheck;
              }
              if (currentCheck) rangeApply = function rangeApply(value) {
                return Decimal.neg(value);
              };else {
                var _limit6 = Decimal.pow(10, EXP_LIMIT).neg();
                if (maxX.lt(_limit6)) currentCheck = false;else if (minX.gt(_limit6)) currentCheck = true;else {
                  var _valCheck11 = func(new Decimal(_limit6));
                  currentCheck = value.gt(_valCheck11);
                  if (decreasing) currentCheck = !currentCheck;
                }
                if (currentCheck) rangeApply = function rangeApply(value) {
                  return Decimal.pow(10, value).neg();
                };else {
                  var _limit7 = Decimal.tetrate(10, EXP_LIMIT).neg();
                  if (maxX.lt(_limit7)) currentCheck = false;else if (minX.gt(_limit7)) currentCheck = true;else {
                    var _valCheck12 = func(new Decimal(_limit7));
                    currentCheck = value.gt(_valCheck12);
                    if (decreasing) currentCheck = !currentCheck;
                  }
                  if (currentCheck) rangeApply = function rangeApply(value) {
                    return Decimal.tetrate(10, new Decimal(value).toNumber()).neg();
                  };
                  else rangeApply = function rangeApply(value) {
                    return new Decimal(value).gt(Math.log10(Number.MAX_VALUE)) ? Decimal.dNegInf : Decimal.tetrate(10, Decimal.pow(10, value).toNumber()).neg();
                  };
                }
              }
            }
          }
          var searchIncreasing = positive != reciprocal != decreasing;
          var comparative = searchIncreasing ? function (a, b) {
            return Decimal.gt(a, b);
          } : function (a, b) {
            return Decimal.lt(a, b);
          };
          var step_size = 0.001;
          var has_changed_directions_once = false;
          var previously_rose = false;
          var result = 1;
          var appliedResult = Decimal.dOne;
          var oldresult = 0;
          var critical = false;
          for (var i = 1; i < iterations; ++i) {
            critical = false;
            oldresult = result;
            appliedResult = rangeApply(result);
            if (appliedResult.gt(maxX)) {
              appliedResult = maxX;
              critical = true;
            }
            if (appliedResult.lt(minX)) {
              appliedResult = minX;
              critical = true;
            }
            var new_decimal = func(appliedResult);
            if (new_decimal.eq(value) && !critical) {
              break;
            }
            var currently_rose = comparative(new_decimal, value);
            if (i > 1) {
              if (previously_rose != currently_rose) {
                has_changed_directions_once = true;
              }
            }
            previously_rose = currently_rose;
            if (has_changed_directions_once) {
              step_size /= 2;
            } else {
              step_size *= 2;
            }
            if (currently_rose != searchIncreasing && appliedResult.eq(maxX) || currently_rose == searchIncreasing && appliedResult.eq(minX)) return new Decimal(Decimal.dNaN);
            step_size = Math.abs(step_size) * (currently_rose ? -1 : 1);
            result += step_size;
            if (step_size === 0 || oldresult == result) {
              break;
            }
          }
          return rangeApply(result);
        };
      }
    }]);
    return Decimal;
  }();
  Decimal.dZero = FC_NN(0, 0, 0);
  Decimal.dOne = FC_NN(1, 0, 1);
  Decimal.dNegOne = FC_NN(-1, 0, 1);
  Decimal.dTwo = FC_NN(1, 0, 2);
  Decimal.dTen = FC_NN(1, 0, 10);
  Decimal.dNaN = FC_NN(Number.NaN, Number.NaN, Number.NaN);
  Decimal.dInf = FC_NN(1, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  Decimal.dNegInf = FC_NN(-1, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  Decimal.dNumberMax = FC(1, 0, Number.MAX_VALUE);
  Decimal.dNumberMin = FC(1, 0, Number.MIN_VALUE);
  Decimal.dLayerSafeMax = FC(1, Number.MAX_SAFE_INTEGER, EXP_LIMIT - 1);
  Decimal.dLayerSafeMin = FC(1, Number.MAX_SAFE_INTEGER, -(EXP_LIMIT - 1));
  Decimal.dLayerMax = FC(1, Number.MAX_VALUE, EXP_LIMIT - 1);
  Decimal.dLayerMin = FC(1, Number.MAX_VALUE, -(EXP_LIMIT - 1));
  Decimal.fromStringCache = new LRUCache(DEFAULT_FROM_STRING_CACHE_SIZE);
  D = Decimal.fromValue_noAlloc;
  FC = Decimal.fromComponents;
  FC_NN = Decimal.fromComponents_noNormalize;
  Decimal.fromMantissaExponent;
  Decimal.fromMantissaExponent_noNormalize;
  return Decimal;
}));
