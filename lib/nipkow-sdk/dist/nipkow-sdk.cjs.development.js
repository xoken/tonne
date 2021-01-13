'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var https = _interopDefault(require('https'));
var axios = _interopDefault(require('axios'));
var bitcoinjsLib = require('bitcoinjs-lib');
var AES = _interopDefault(require('crypto-js/aes'));
var coinSelect = _interopDefault(require('coinselect'));
var faker = _interopDefault(require('faker'));
var bip39 = require('bip39');
var _ = require('lodash');
var dateFns = require('date-fns');
var CBOR = _interopDefault(require('cbor-js'));
var PouchDB = _interopDefault(require('pouchdb-browser'));
var MemoryAdapter = _interopDefault(require('pouchdb-adapter-memory'));
var pouchdbFind = _interopDefault(require('pouchdb-find'));
var CryptoJS = _interopDefault(require('crypto-js'));
var Qs = _interopDefault(require('qs'));
var sha256 = _interopDefault(require('crypto-js/sha256'));

var network = {
  BITCOIN_SV: {
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    bech32: '',
    messagePrefix: 'unused',
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  },
  BITCOIN_SV_REGTEST: {
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    bech32: 'bcrt',
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    p2wpkh: {
      baseNetwork: 'regtest',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'bcrt',
      bip32: {
        public: 0x045f1cf6,
        private: 0x045f18bc
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef
    },
    p2wpkhInP2sh: {
      baseNetwork: 'regtest',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'bcrt',
      bip32: {
        public: 0x044a5262,
        private: 0x044a4e28
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef
    },
    p2wsh: {
      baseNetwork: 'regtest',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'bcrt',
      bip32: {
        public: 0x02575483,
        private: 0x02575048
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef
    },
    p2wshInP2sh: {
      baseNetwork: 'regtest',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'bcrt',
      bip32: {
        public: 0x024289ef,
        private: 0x024285b5
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef
    }
  },
  BITCOIN_SV_TESTNET: {
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    bech32: 'tb',
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    p2wpkh: {
      baseNetwork: 'testnet',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'tb',
      bip32: {
        public: 0x045f1cf6,
        private: 0x045f18bc
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef
    },
    p2wsh: {
      baseNetwork: 'testnet',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'tb',
      bip32: {
        public: 0x02575483,
        private: 0x02575048
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef
    },
    p2wpkhInP2sh: {
      baseNetwork: 'testnet',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'tb',
      bip32: {
        public: 0x044a5262,
        private: 0x044a4e28
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef
    },
    p2wshInP2sh: {
      baseNetwork: 'testnet',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'tb',
      bip32: {
        public: 0x024289ef,
        private: 0x024285b5
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef
    }
  }
};

var network$1 = {
  __proto__: null,
  'default': network
};

var derivationPaths = {
  BITCOIN_SV: {
    BIP32: {
      derivationPath: 'm/0'
    },
    BIP44: {
      purpose: 44,
      coin: 236,
      account: 0,
      change: 0,
      derivationPath: "m/44'/236'/0'/0",
      nUTXODerivationPath: "m/44'/236'/1'/0"
    }
  },
  BITCOIN_SV_TESTNET: {
    BIP32: {
      derivationPath: 'm/0'
    },
    BIP44: {
      purpose: 44,
      coin: 1,
      account: 0,
      change: 0,
      derivationPath: 'm/44/1/0/0',
      nUTXODerivationPath: 'm/44/1/1/0'
    }
  },
  BITCOIN_SV_REGTEST: {
    BIP32: {
      derivationPath: 'm/0'
    },
    BIP44: {
      purpose: 44,
      coin: 1,
      account: 0,
      change: 0,
      derivationPath: 'm/44/1/0/0',
      nUTXODerivationPath: 'm/44/1/1/0'
    }
  }
};

var derivationPaths$1 = {
  __proto__: null,
  'default': derivationPaths
};

// A type of promise-like that resolves synchronously and supports only one observer
const _Pact = /*#__PURE__*/(function() {
	function _Pact() {}
	_Pact.prototype.then = function(onFulfilled, onRejected) {
		const result = new _Pact();
		const state = this.s;
		if (state) {
			const callback = state & 1 ? onFulfilled : onRejected;
			if (callback) {
				try {
					_settle(result, 1, callback(this.v));
				} catch (e) {
					_settle(result, 2, e);
				}
				return result;
			} else {
				return this;
			}
		}
		this.o = function(_this) {
			try {
				const value = _this.v;
				if (_this.s & 1) {
					_settle(result, 1, onFulfilled ? onFulfilled(value) : value);
				} else if (onRejected) {
					_settle(result, 1, onRejected(value));
				} else {
					_settle(result, 2, value);
				}
			} catch (e) {
				_settle(result, 2, e);
			}
		};
		return result;
	};
	return _Pact;
})();

// Settles a pact synchronously
function _settle(pact, state, value) {
	if (!pact.s) {
		if (value instanceof _Pact) {
			if (value.s) {
				if (state & 1) {
					state = value.s;
				}
				value = value.v;
			} else {
				value.o = _settle.bind(null, pact, state);
				return;
			}
		}
		if (value && value.then) {
			value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
			return;
		}
		pact.s = state;
		pact.v = value;
		const observer = pact.o;
		if (observer) {
			observer(pact);
		}
	}
}

function _isSettledPact(thenable) {
	return thenable instanceof _Pact && thenable.s & 1;
}

// Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)
function _forTo(array, body, check) {
	var i = -1, pact, reject;
	function _cycle(result) {
		try {
			while (++i < array.length && (!check || !check())) {
				result = body(i);
				if (result && result.then) {
					if (_isSettledPact(result)) {
						result = result.v;
					} else {
						result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
						return;
					}
				}
			}
			if (pact) {
				_settle(pact, 1, result);
			} else {
				pact = result;
			}
		} catch (e) {
			_settle(pact || (pact = new _Pact()), 2, e);
		}
	}
	_cycle();
	return pact;
}

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously implement a generic for loop
function _for(test, update, body) {
	var stage;
	for (;;) {
		var shouldContinue = test();
		if (_isSettledPact(shouldContinue)) {
			shouldContinue = shouldContinue.v;
		}
		if (!shouldContinue) {
			return result;
		}
		if (shouldContinue.then) {
			stage = 0;
			break;
		}
		var result = body();
		if (result && result.then) {
			if (_isSettledPact(result)) {
				result = result.s;
			} else {
				stage = 1;
				break;
			}
		}
		if (update) {
			var updateValue = update();
			if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
				stage = 2;
				break;
			}
		}
	}
	var pact = new _Pact();
	var reject = _settle.bind(null, pact, 2);
	(stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
	return pact;
	function _resumeAfterBody(value) {
		result = value;
		do {
			if (update) {
				updateValue = update();
				if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
					updateValue.then(_resumeAfterUpdate).then(void 0, reject);
					return;
				}
			}
			shouldContinue = test();
			if (!shouldContinue || (_isSettledPact(shouldContinue) && !shouldContinue.v)) {
				_settle(pact, 1, result);
				return;
			}
			if (shouldContinue.then) {
				shouldContinue.then(_resumeAfterTest).then(void 0, reject);
				return;
			}
			result = body();
			if (_isSettledPact(result)) {
				result = result.v;
			}
		} while (!result || !result.then);
		result.then(_resumeAfterBody).then(void 0, reject);
	}
	function _resumeAfterTest(shouldContinue) {
		if (shouldContinue) {
			result = body();
			if (result && result.then) {
				result.then(_resumeAfterBody).then(void 0, reject);
			} else {
				_resumeAfterBody(result);
			}
		} else {
			_settle(pact, 1, result);
		}
	}
	function _resumeAfterUpdate() {
		if (shouldContinue = test()) {
			if (shouldContinue.then) {
				shouldContinue.then(_resumeAfterTest).then(void 0, reject);
			} else {
				_resumeAfterTest(shouldContinue);
			}
		} else {
			_settle(pact, 1, result);
		}
	}
}

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var httpReq;
var init = function init(host, port) {
  httpReq = axios.create({
    baseURL: "https://" + host + ":" + port + "/v1",
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  httpReq.interceptors.request.use(function (config) {
    var token = localStorage.getItem('sessionKey');
    config.headers.Authorization = token ? "Bearer " + token : '';
    return config;
  }, function (error) {
    console.log(error);
    return Promise.reject(error);
  });
  httpReq.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    try {
      return Promise.resolve(function () {
        if (error && error.response && error.response.status === 403) {
          return _catch(function () {
            var userName = localStorage.getItem('userName');
            var password = localStorage.getItem('password');
            return Promise.resolve(post('auth', {
              userName: userName,
              password: password
            })).then(function (_ref) {
              var sessionKey = _ref.data.auth.sessionKey;

              if (sessionKey) {
                localStorage.setItem('sessionKey', sessionKey);
                Promise.resolve();
              } else {
                throw new Error('Invalid sessionKey');
              }
            });
          }, function (error) {
            return Promise.reject(error);
          });
        } else {
          return new Promise(function (resolve, reject) {
            reject(error);
          });
        }
      }());
    } catch (e) {
      return Promise.reject(e);
    }
  });
};
var get = function get(url, config) {
  try {
    return Promise.resolve(_catch(function () {
      return Promise.resolve(httpReq.get(url, config));
    }, function (error) {
      throw error;
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};
var post = function post(url, data, config) {
  try {
    return Promise.resolve(_catch(function () {
      return Promise.resolve(httpReq.post(url, data, config));
    }, function (error) {
      throw error;
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};
var put = function put(url, data, config) {
  try {
    return Promise.resolve(_catch(function () {
      return Promise.resolve(httpReq.put(url, data, config));
    }, function (error) {
      throw error;
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};
var deleteR = function deleteR(url, config) {
  try {
    return Promise.resolve(_catch(function () {
      return Promise.resolve(httpReq.delete(url, config));
    }, function (error) {
      throw error;
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};

var httpClient = {
  __proto__: null,
  init: init,
  get: get,
  post: post,
  put: put,
  deleteR: deleteR
};

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
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var Allegory = /*#__PURE__*/function () {
  function Allegory() {}

  _createClass(Allegory, [{
    key: "version",
    get: function get() {
      return this._version;
    },
    set: function set(value) {
      this._version = value;
    }
  }, {
    key: "name",
    get: function get() {
      return this._name;
    },
    set: function set(value) {
      this._name = value;
    }
  }, {
    key: "action",
    get: function get() {
      return this._action;
    },
    set: function set(value) {
      this._action = value;
    }
  }]);

  return Allegory;
}();

var ProducerAction = /*#__PURE__*/function () {
  function ProducerAction() {}

  _createClass(ProducerAction, [{
    key: "producerInput",
    get: function get() {
      return this._producerInput;
    },
    set: function set(value) {
      this._producerInput = value;
    }
  }, {
    key: "producerOutput",
    get: function get() {
      return this._producerOutput;
    },
    set: function set(value) {
      this._producerOutput = value;
    }
  }, {
    key: "pOwnerOutput",
    get: function get() {
      return this._pOwnerOutput;
    },
    set: function set(value) {
      this._pOwnerOutput = value;
    }
  }, {
    key: "extensions",
    get: function get() {
      return this._extensions;
    },
    set: function set(value) {
      this._extensions = value;
    }
  }]);

  return ProducerAction;
}();
var OwnerAction = /*#__PURE__*/function () {
  function OwnerAction() {}

  _createClass(OwnerAction, [{
    key: "ownerInput",
    get: function get() {
      return this._ownerInput;
    },
    set: function set(value) {
      this._ownerInput = value;
    }
  }, {
    key: "ownerOutput",
    get: function get() {
      return this._ownerOutput;
    },
    set: function set(value) {
      this._ownerOutput = value;
    }
  }, {
    key: "oProxyProviders",
    get: function get() {
      return this._oProxyProviders;
    },
    set: function set(value) {
      this._oProxyProviders = value;
    }
  }]);

  return OwnerAction;
}();

var Index = /*#__PURE__*/function () {
  function Index() {}

  _createClass(Index, [{
    key: "index",
    get: function get() {
      return this._index;
    },
    set: function set(value) {
      this._index = value;
    }
  }]);

  return Index;
}();

var ProducerOutput = /*#__PURE__*/function () {
  function ProducerOutput() {}

  _createClass(ProducerOutput, [{
    key: "producer",
    get: function get() {
      return this._producer;
    },
    set: function set(value) {
      this._producer = value;
    }
  }, {
    key: "pVendorEndpoint",
    get: function get() {
      return this._pVendorEndpoint;
    },
    set: function set(value) {
      this._pVendorEndpoint = value;
    }
  }]);

  return ProducerOutput;
}();

var OwnerOutput = /*#__PURE__*/function () {
  function OwnerOutput() {}

  _createClass(OwnerOutput, [{
    key: "owner",
    get: function get() {
      return this._owner;
    },
    set: function set(value) {
      this._owner = value;
    }
  }, {
    key: "oVendorEndpoint",
    get: function get() {
      return this._oVendorEndpoint;
    },
    set: function set(value) {
      this._oVendorEndpoint = value;
    }
  }]);

  return OwnerOutput;
}();

var OwnerExtension = /*#__PURE__*/function () {
  function OwnerExtension() {}

  _createClass(OwnerExtension, [{
    key: "ownerOutputEx",
    get: function get() {
      return this._ownerOutputEx;
    },
    set: function set(value) {
      this._ownerOutputEx = value;
    }
  }, {
    key: "codePoint",
    get: function get() {
      return this._codePoint;
    },
    set: function set(value) {
      this._codePoint = value;
    }
  }]);

  return OwnerExtension;
}();
var ProducerExtension = /*#__PURE__*/function () {
  function ProducerExtension() {}

  _createClass(ProducerExtension, [{
    key: "producerOutputEx",
    get: function get() {
      return this._producerOutputEx;
    },
    set: function set(value) {
      this._producerOutputEx = value;
    }
  }, {
    key: "codePoint",
    get: function get() {
      return this._codePoint;
    },
    set: function set(value) {
      this._codePoint = value;
    }
  }]);

  return ProducerExtension;
}();

var Endpoint = /*#__PURE__*/function () {
  function Endpoint() {}

  _createClass(Endpoint, [{
    key: "protocol",
    get: function get() {
      return this._protocol;
    },
    set: function set(value) {
      this._protocol = value;
    }
  }, {
    key: "uri",
    get: function get() {
      return this._uri;
    },
    set: function set(value) {
      this._uri = value;
    }
  }]);

  return Endpoint;
}();

var ProxyProvider = /*#__PURE__*/function () {
  function ProxyProvider() {}

  _createClass(ProxyProvider, [{
    key: "service",
    get: function get() {
      return this._service;
    },
    set: function set(value) {
      this._service = value;
    }
  }, {
    key: "mode",
    get: function get() {
      return this._mode;
    },
    set: function set(value) {
      this._mode = value;
    }
  }, {
    key: "endpoint",
    get: function get() {
      return this._endpoint;
    },
    set: function set(value) {
      this._endpoint = value;
    }
  }, {
    key: "registration",
    get: function get() {
      return this._registration;
    },
    set: function set(value) {
      this._registration = value;
    }
  }]);

  return ProxyProvider;
}();

var Registration = /*#__PURE__*/function () {
  function Registration() {}

  _createClass(Registration, [{
    key: "addressCommitment",
    get: function get() {
      return this._addressCommitment;
    },
    set: function set(value) {
      this._addressCommitment = value;
    }
  }, {
    key: "utxoCommitment",
    get: function get() {
      return this._utxoCommitment;
    },
    set: function set(value) {
      this._utxoCommitment = value;
    }
  }, {
    key: "signature",
    get: function get() {
      return this._signature;
    },
    set: function set(value) {
      this._signature = value;
    }
  }, {
    key: "expiry",
    get: function get() {
      return this._expiry;
    },
    set: function set(value) {
      this._expiry = value;
    }
  }]);

  return Registration;
}();

function getAllegoryType(decodedCBOR) {
  var allegory = new Allegory();

  if (decodedCBOR.length >= 2) {
    allegory.version = decodedCBOR[1];
    allegory.name = decodedCBOR[2];

    if (decodedCBOR[3].length === 4) {
      allegory.action = _getOwnerAction(decodedCBOR[3]);
    }

    if (decodedCBOR[3].length === 5) {
      allegory.action = _getProducerAction(decodedCBOR[3]);
    }
  }

  return allegory;
}

function _getOwnerAction(data) {
  var ownerAction = new OwnerAction();
  ownerAction.ownerInput = _getIndex(data[1]);
  ownerAction.ownerOutput = _getOwnerOutput(data[2]);
  ownerAction.oProxyProviders = _getProxyProviders(data[3]);
  return ownerAction;
}

function _getIndex(data) {
  var index = new Index();
  index.index = data[1];
  return index;
}

function _getOwnerOutput(data) {
  var ownerOutput = new OwnerOutput();
  ownerOutput.owner = _getIndex(data[1]);
  ownerOutput.oVendorEndpoint = _getVendorEndpoint(data[2]);
  return ownerOutput;
}

function _getVendorEndpoint(data) {
  return _getEndPoint(data[0]);
}

function _getProxyProviders(datas) {
  var proxyProviders = datas.map(function (data) {
    var proxyProvider = new ProxyProvider();
    proxyProvider.service = data[1];
    proxyProvider.mode = data[2];
    proxyProvider.endpoint = _getEndPoint(data[3]);
    proxyProvider.registration = _getRegistration(data[4]);
    return proxyProvider;
  });
  return proxyProviders;
}

function _getRegistration(data) {
  var registration = new Registration();
  registration.addressCommitment = data[1];
  registration.utxoCommitment = data[2];
  registration.signature = data[3];
  registration.expiry = data[4];
  return registration;
}

function _getProducerAction(data) {
  var producerAction = new ProducerAction();
  producerAction.producerInput = _getIndex(data[1]);
  producerAction.producerOutput = _getProducerOutput(data[2]);

  if (data[3].length > 0) {
    producerAction.pOwnerOutput = _getPOwnerOutput(data[3]);
  }

  producerAction.extensions = _getExtensions(data[4]);
  return producerAction;
}

function _getProducerOutput(data) {
  var producerOutput = new ProducerOutput();
  producerOutput.producer = _getIndex(data[1]);
  producerOutput.pVendorEndpoint = _getEndPoint(data[2][0]);
  return producerOutput;
}

function _getPOwnerOutput(data) {
  var ownerOutput = new OwnerOutput();
  ownerOutput.owner = _getIndex(data[1]);
  ownerOutput.oVendorEndpoint = _getVendorEndpoint(data[2]);
  return ownerOutput;
}

function _getExtensions(datas) {
  var extensions = datas.map(function (data) {
    if (data[0] === 0) {
      return _getOwnerExtension(data);
    } else {
      return _getProducerExtension(data);
    }
  });
  return extensions;
}

function _getOwnerExtension(data) {
  var ownerExtension = new OwnerExtension();
  ownerExtension.ownerOutputEx = _getOwnerOutput(data[1]);
  ownerExtension.codePoint = data[2];
  return ownerExtension;
}

function _getProducerExtension(data) {
  var producerExtension = new ProducerExtension();
  producerExtension.producerOutputEx = _getProducerOutput(data[1]);
  producerExtension.codePoint = data[2];
  return producerExtension;
}

function _getEndPoint(data) {
  var endpoint = new Endpoint();
  endpoint.protocol = data[1];
  endpoint.uri = data[2];
  return endpoint;
}

function removeOpReturn(data) {
  var prefixRemoved = data.substring(36);
  var opcode = parseInt(prefixRemoved.substring(0, 2), 16);

  if (opcode <= 0x4b) {
    return prefixRemoved.substring(2); // remaining
  } else if (opcode === 0x4c) {
    return prefixRemoved.substring(4); // take 2
  } else if (opcode === 0x4d) {
    return prefixRemoved.substring(6); // take 4
  } else if (opcode === 0x4e) {
    return prefixRemoved.substring(10); // take 8
  } else if (opcode === 0x99) {
    throw new Error('Incorrect data');
  }

  throw new Error('Incorrect data');
}
function decodeCBORData(data) {
  var hexData = removeOpReturn(data);
  var allegoryDataBuffer = Buffer.from(hexData, 'hex');
  var allegoryDataArrayBuffer = allegoryDataBuffer.buffer.slice(allegoryDataBuffer.byteOffset, allegoryDataBuffer.byteOffset + allegoryDataBuffer.byteLength);

  try {
    return CBOR.decode(allegoryDataArrayBuffer);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

var Allegory$1 = {
  __proto__: null,
  ProducerAction: ProducerAction,
  OwnerAction: OwnerAction,
  OwnerExtension: OwnerExtension,
  ProducerExtension: ProducerExtension,
  getAllegoryType: getAllegoryType,
  removeOpReturn: removeOpReturn,
  decodeCBORData: decodeCBORData
};

PouchDB.plugin(MemoryAdapter);
PouchDB.plugin(pouchdbFind);
var profiles;
var db;
var credentials;
var BIP32_EXTENDED_KEY = 'bip32ExtendedKey';
var NUTXO_EXTENDED_KEY = 'nUTXOExtendedKey';
/* Revisit all fn for try-catch error handling */

var get$1 = function get(db, key) {
  try {
    return Promise.resolve(db.get(key));
  } catch (e) {
    return Promise.reject(e);
  }
};

var set = function set(db, key, value) {
  try {
    return Promise.resolve(db.get(key)).then(function (doc) {
      for (var prop in value) {
        doc[prop] = value[prop];
      }

      return Promise.resolve(db.put(doc)).then(function () {});
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var init$1 = function init(dbName) {
  try {
    db = new PouchDB("" + dbName, {
      revs_limit: 1,
      auto_compaction: true
    });
    credentials = new PouchDB('credentials', {
      revs_limit: 1,
      auto_compaction: true
    });
    return Promise.resolve(credentials.bulkDocs([{
      _id: BIP32_EXTENDED_KEY,
      value: null
    }, {
      _id: NUTXO_EXTENDED_KEY,
      value: null
    }])).then(function () {});
  } catch (e) {
    return Promise.reject(e);
  }
};
/* Revisit required */

var createProfile = function createProfile(cryptedMnemonic, profileName) {
  try {
    var newProfile = {
      cryptedMnemonic: cryptedMnemonic,
      name: profileName
    };

    var _temp3 = _catch(function () {
      return Promise.resolve(profiles.get('profiles')).then(function (existingProfiles) {
        var _temp = function () {
          if (existingProfiles && existingProfiles.value && existingProfiles.value instanceof Array) {
            existingProfiles.value = [].concat(existingProfiles.value, [newProfile]);
            return Promise.resolve(profiles.put(existingProfiles)).then(function () {});
          } else {
            return Promise.resolve(profiles.put({
              _id: 'profiles',
              value: [newProfile]
            })).then(function () {});
          }
        }();

        if (_temp && _temp.then) return _temp.then(function () {});
      });
    }, function () {
      return Promise.resolve(profiles.put({
        _id: 'profiles',
        value: [newProfile]
      })).then(function () {});
    });

    return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
  } catch (e) {
    return Promise.reject(e);
  }
};
/* Revisit required */

var updateProfile = function updateProfile(currentProfileName, newProfileName) {
  try {
    return Promise.resolve(_catch(function () {
      return Promise.resolve(profiles.get('profiles', {
        revs: true
      })).then(function (existingProfiles) {
        var profileIndex = existingProfiles.value.findIndex(function (profile) {
          return profile.name === currentProfileName;
        });
        var profilesArray = existingProfiles.value;
        profilesArray[profileIndex].name = newProfileName;
        return Promise.resolve(profiles.put({
          _id: 'profiles',
          _rev: existingProfiles._rev,
          value: profilesArray
        })).then(function () {});
      });
    }, function (error) {
      throw error;
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};
/* Revisit required */

var getProfiles = function getProfiles() {
  return Promise.resolve(_catch(function () {
    profiles = new PouchDB('Profiles', {
      revs_limit: 1,
      auto_compaction: true
    });
    return Promise.resolve(profiles.get('profiles')).then(function (existingProfiles) {
      if (existingProfiles && existingProfiles.value && existingProfiles.value instanceof Array) {
        var profileNames = existingProfiles.value.map(function (existingProfile) {
          return existingProfile;
        });
        return profileNames;
      } else {
        return [];
      }
    });
  }, function () {
    return [];
  }));
};
/* Revisit required */

var login = function login(profile, password) {
  try {
    return Promise.resolve(getProfiles()).then(function (existingProfiles) {
      var selectedProfile = existingProfiles.find(function (existingProfile) {
        return existingProfile.name === profile;
      });

      if (selectedProfile) {
        var bip39Mnemonic = AES.decrypt(selectedProfile.cryptedMnemonic, password).toString(CryptoJS.enc.Utf8);

        if (bip39Mnemonic) {
          return bip39Mnemonic;
        } else {
          throw new Error('Login error');
        }
      } else {
        throw new Error("Account Doesn't exist");
      }
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var getBip32ExtendedKey = function getBip32ExtendedKey() {
  try {
    return Promise.resolve(get$1(credentials, BIP32_EXTENDED_KEY)).then(function (bip32ExtendedKeyDoc) {
      return bip32ExtendedKeyDoc.value;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var setBip32ExtendedKey = function setBip32ExtendedKey(value) {
  return Promise.resolve(set(credentials, BIP32_EXTENDED_KEY, {
    value: value
  }));
};
var getNUTXOExtendedKey = function getNUTXOExtendedKey() {
  try {
    return Promise.resolve(get$1(credentials, NUTXO_EXTENDED_KEY)).then(function (nUTXOExtendedKeyDoc) {
      return nUTXOExtendedKeyDoc.value;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var setNUTXOExtendedKey = function setNUTXOExtendedKey(value) {
  return Promise.resolve(set(credentials, NUTXO_EXTENDED_KEY, {
    value: value
  }));
};
var getNUTXODerivedKeys = function getNUTXODerivedKeys() {
  try {
    return Promise.resolve(db.allDocs({
      include_docs: true,
      startkey: 'nUTXOKey',
      endkey: "nUTXOKey\uFFF0"
    })).then(function (response) {
      if (response && response.rows.length > 0) {
        var existingNUTXODerivedKeys = response.rows.map(function (row) {
          return row.doc;
        });
        return {
          existingNUTXODerivedKeys: existingNUTXODerivedKeys
        };
      } else {
        return {
          existingNUTXODerivedKeys: []
        };
      }
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var upsertNUTXODerivedKeys = function upsertNUTXODerivedKeys(keys) {
  try {
    var _temp5 = function () {
      if (keys.length > 0) {
        return Promise.resolve(getNUTXODerivedKeys()).then(function (_ref) {
          var existingNUTXODerivedKeys = _ref.existingNUTXODerivedKeys;
          var keyId = existingNUTXODerivedKeys.length - 1;
          var docs = keys.map(function (key, index) {
            if (!key._id) {
              keyId = keyId + 1;
            }

            return _extends({}, key, {
              _id: key._id ? key._id : "nUTXOKey-" + String(keyId).padStart(20, '0')
            });
          });
          return Promise.resolve(db.bulkDocs(docs)).then(function () {});
        });
      }
    }();

    return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(function () {}) : void 0);
  } catch (e) {
    return Promise.reject(e);
  }
};
var getDerivedKeys = function getDerivedKeys() {
  try {
    return Promise.resolve(db.allDocs({
      include_docs: true,
      startkey: 'key',
      endkey: "key\uFFF0"
    })).then(function (response) {
      if (response && response.rows.length > 0) {
        var existingDerivedKeys = response.rows.map(function (row) {
          return row.doc;
        });
        return {
          existingDerivedKeys: existingDerivedKeys
        };
      } else {
        return {
          existingDerivedKeys: []
        };
      }
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var upsertDerivedKeys = function upsertDerivedKeys(keys) {
  try {
    var _temp7 = function () {
      if (keys.length > 0) {
        return Promise.resolve(getDerivedKeys()).then(function (_ref2) {
          var existingDerivedKeys = _ref2.existingDerivedKeys;
          var keyId = existingDerivedKeys.length - 1;
          var docs = keys.map(function (key, index) {
            if (!key._id) {
              keyId = keyId + 1;
            }

            return _extends({}, key, {
              _id: key._id ? key._id : "key-" + String(keyId).padStart(20, '0')
            });
          });
          return Promise.resolve(db.bulkDocs(docs)).then(function () {});
        });
      }
    }();

    return Promise.resolve(_temp7 && _temp7.then ? _temp7.then(function () {}) : void 0);
  } catch (e) {
    return Promise.reject(e);
  }
};
var getOutputs = function getOutputs(options) {
  try {
    return Promise.resolve(db.allDocs(_extends({
      include_docs: true
    }, options, {
      startkey: (options === null || options === void 0 ? void 0 : options.startkey) || 'output',
      endkey: "output\uFFF0",
      skip: options !== null && options !== void 0 && options.startkey ? 1 : false
    }))).then(function (response) {
      if (response && response.rows.length > 0) {
        var nextOutputsCursor = response.rows[response.rows.length - 1].id;
        var outputs = response.rows.map(function (row) {
          return row.doc;
        });
        return {
          nextOutputsCursor: nextOutputsCursor,
          outputs: outputs
        };
      } else {
        return {
          nextOutputsCursor: null,
          outputs: []
        };
      }
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var markOutputAsUnspent = function markOutputAsUnspent(inputs) {
  try {
    var _temp9 = function _temp9() {
      return Promise.resolve(db.bulkDocs(markAsUnspentOutputs)).then(function () {});
    };

    var markAsUnspentOutputs = [];

    var _temp10 = _forTo(inputs, function (index) {
      var input = inputs[index];
      return Promise.resolve(db.createIndex({
        index: {
          fields: ['outputTxHash', 'outputIndex']
        }
      })).then(function () {
        return Promise.resolve(db.find({
          selector: {
            outputTxHash: {
              $eq: input.outputTxHash
            },
            outputIndex: {
              $eq: input.outputIndex
            }
          }
        })).then(function (outputDoc) {
          if (outputDoc.docs.length > 0) {
            var unspentOutputs = outputDoc.docs.map(function (output) {
              return _extends({}, output, {
                isSpent: false
              });
            });
            markAsUnspentOutputs.push.apply(markAsUnspentOutputs, unspentOutputs);
          }
        });
      });
    });

    return Promise.resolve(_temp10 && _temp10.then ? _temp10.then(_temp9) : _temp9(_temp10));
  } catch (e) {
    return Promise.reject(e);
  }
};
var upsertOutputs = function upsertOutputs(outputs) {
  try {
    var _temp12 = function () {
      if (outputs.length > 0) {
        return Promise.resolve(getOutputs()).then(function (_ref3) {
          var existingOutputs = _ref3.outputs;

          if (existingOutputs.length > 0) {} else {}

          var outputId = existingOutputs.length - 1;
          var docs = outputs.map(function (output, index) {
            if (!output._id) {
              outputId = outputId + 1;
            }

            return _extends({}, output, {
              isSpent: output.isSpent ? output.isSpent : output.spendInfo ? true : false,
              _id: output._id ? output._id : "output-" + String(outputId).padStart(20, '0')
            });
          });
          return Promise.resolve(db.bulkDocs(docs)).then(function () {});
        });
      }
    }();

    return Promise.resolve(_temp12 && _temp12.then ? _temp12.then(function () {}) : void 0);
  } catch (e) {
    return Promise.reject(e);
  }
};
/* _rev change case */

var updateOutputs = function updateOutputs(outputs) {
  try {
    var _temp14 = function _temp14() {
      return _catch(function () {
        return Promise.resolve(db.bulkDocs(updateDoc)).then(function (results) {
          results.forEach(function (result) {
            if (result.error) {
              throw new Error('Error in updating outputs');
            }
          });
        });
      }, function (error) {
        throw error;
      });
    };

    var updateDoc = [];

    var _temp15 = _forTo(outputs, function (index) {
      var element = outputs[index];
      return Promise.resolve(db.get(element._id)).then(function (outputDoc) {
        updateDoc.push(_extends({}, element, {
          _rev: outputDoc._rev
        }));
      });
    });

    return Promise.resolve(_temp15 && _temp15.then ? _temp15.then(_temp14) : _temp14(_temp15));
  } catch (e) {
    return Promise.reject(e);
  }
};
/* No _id, _rev change case */

var deleteOutputs = function deleteOutputs(outputs) {
  try {
    var _temp17 = function _temp17() {
      return Promise.resolve(db.bulkDocs(deletedOutputs)).then(function () {});
    };

    var deletedOutputs = [];

    var _temp18 = _forTo(outputs, function (index) {
      var output = outputs[index];
      return Promise.resolve(db.createIndex({
        index: {
          fields: ['outputTxHash', 'outputIndex']
        }
      })).then(function () {
        return Promise.resolve(db.find({
          selector: {
            outputTxHash: {
              $eq: output.outputTxHash
            },
            outputIndex: {
              $eq: output.outputIndex
            }
          }
        })).then(function (outputDoc) {
          if (outputDoc.docs.length > 0) {
            var deletedOutput = outputDoc.docs.map(function (output) {
              return _extends({}, output, {
                _deleted: true
              });
            });
            deletedOutputs.push.apply(deletedOutputs, deletedOutput);
          }
        });
      });
    });

    return Promise.resolve(_temp18 && _temp18.then ? _temp18.then(_temp17) : _temp17(_temp18));
  } catch (e) {
    return Promise.reject(e);
  }
};
var isInOutputs = function isInOutputs(output) {
  try {
    return Promise.resolve(db.createIndex({
      index: {
        fields: ['outputTxHash', 'outputIndex']
      }
    })).then(function () {
      return Promise.resolve(db.find({
        selector: {
          outputTxHash: {
            $eq: output.outputTxHash
          },
          outputIndex: {
            $eq: output.outputIndex
          }
        }
      })).then(function (outputDoc) {
        return outputDoc.docs.length > 0 ? true : false;
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var getTransactions = function getTransactions(options) {
  try {
    return Promise.resolve(db.allDocs(_extends({
      include_docs: true
    }, options, {
      descending: true,
      endkey: 'transaction',
      // endkey: 'transaction\ufff0',
      startkey: (options === null || options === void 0 ? void 0 : options.startkey) || "transaction\uFFF0",
      skip: options !== null && options !== void 0 && options.startkey ? 1 : false
    }))).then(function (response) {
      if (response && response.rows.length > 0) {
        var nextTransactionCursor;

        if (response.rows.length === (options === null || options === void 0 ? void 0 : options.limit)) {
          nextTransactionCursor = response.rows[response.rows.length - 1].id;
        } else {
          nextTransactionCursor = null;
        }

        var transactions = response.rows.map(function (row) {
          return row.doc;
        });
        return {
          nextTransactionCursor: nextTransactionCursor,
          transactions: transactions
        };
      } else {
        return {
          nextTransactionCursor: null,
          transactions: []
        };
      }
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var getTransactionsByConfirmations = function getTransactionsByConfirmations(options) {
  try {
    return Promise.resolve(db.createIndex({
      index: {
        fields: ['confirmation']
      }
    })).then(function () {
      return Promise.resolve(db.find({
        selector: {
          $and: [{
            confirmation: {
              $lte: 10
            }
          }, {
            confirmation: {
              $exists: true
            }
          }]
        }
      })).then(function (transactionDocs) {
        return transactionDocs.docs.length > 0 ? {
          transactions: transactionDocs.docs
        } : {
          transactions: []
        };
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var upsertTransactions = function upsertTransactions(transactions) {
  try {
    var _temp20 = function () {
      if (transactions.length > 0) {
        return Promise.resolve(getTransactions()).then(function (_ref4) {
          var existingTransactions = _ref4.transactions;
          var txId = existingTransactions.length - 1;
          var docs = transactions.reverse().map(function (transaction, index) {
            if (!transaction._id) {
              txId = txId + 1;
            }

            return _extends({}, transaction, {
              _id: transaction._id ? transaction._id : "transaction-" + String(txId).padStart(20, '0')
            });
          });
          return Promise.resolve(db.bulkDocs(docs)).then(function () {});
        });
      }
    }();

    return Promise.resolve(_temp20 && _temp20.then ? _temp20.then(function () {}) : void 0);
  } catch (e) {
    return Promise.reject(e);
  }
};
/* No _rev case */

var deleteTransactions = function deleteTransactions(transactions) {
  try {
    var _temp22 = function _temp22() {
      return _catch(function () {
        return Promise.resolve(db.bulkDocs(updatedDoc)).then(function (results) {
          results.forEach(function (result) {
            if (result.error) {
              throw new Error('Error in updating transactions');
            }
          });
        });
      }, function (error) {
        throw error;
      });
    };

    var updatedDoc = [];

    var _temp23 = _forTo(transactions, function (index) {
      var transaction = transactions[index];
      return Promise.resolve(db.get(transaction._id)).then(function (transactionDoc) {
        updatedDoc.push(_extends({}, transaction, {
          _rev: transactionDoc._rev,
          _deleted: true
        }));
      });
    });

    return Promise.resolve(_temp23 && _temp23.then ? _temp23.then(_temp22) : _temp22(_temp23));
  } catch (e) {
    return Promise.reject(e);
  }
};
var markAddressesUsed = function markAddressesUsed(addresses) {
  try {
    var _temp25 = function () {
      if (addresses.length > 0) {
        return Promise.resolve(getDerivedKeys()).then(function (_ref5) {
          var existingDerivedKeys = _ref5.existingDerivedKeys;
          var matchedDerivedKeys = existingDerivedKeys.filter(function (key, index) {
            return addresses.includes(key.address);
          });
          var docs = matchedDerivedKeys.map(function (key, index) {
            return _extends({}, key, {
              isUsed: true
            });
          });
          return Promise.resolve(db.bulkDocs(docs)).then(function () {});
        });
      }
    }();

    return Promise.resolve(_temp25 && _temp25.then ? _temp25.then(function () {}) : void 0);
  } catch (e) {
    return Promise.reject(e);
  }
};
var getUTXOs = function getUTXOs(options) {
  try {
    return Promise.resolve(db.createIndex({
      index: {
        fields: ['isSpent', 'isNameOutpoint']
      }
    })).then(function () {
      return Promise.resolve(db.find({
        selector: {
          isSpent: {
            $eq: false
          },
          isNameOutpoint: {
            $exists: false
          }
        }
      })).then(function (outputDoc) {
        return outputDoc.docs.length > 0 ? {
          utxos: outputDoc.docs
        } : {
          utxos: []
        };
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var getNUtxo = function getNUtxo(name) {
  try {
    return Promise.resolve(db.createIndex({
      index: {
        fields: ['isSpent', 'name']
      }
    })).then(function () {
      return Promise.resolve(db.find({
        selector: {
          // isSpent: { $eq: false },
          name: name
        }
      })).then(function (outputDoc) {
        return outputDoc.docs.length > 0 ? {
          nUTXOs: outputDoc.docs[0]
        } : {
          nUTXOs: null
        };
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var getUnregisteredName = function getUnregisteredName() {
  try {
    return Promise.resolve(db.createIndex({
      index: {
        fields: ['isSpent', 'isNameOutpoint']
      }
    })).then(function () {
      return Promise.resolve(db.find({
        selector: {
          isSpent: {
            $eq: false
          },
          isNameOutpoint: {
            $exists: true
          }
        }
      })).then(function (outputDoc) {
        return outputDoc.docs.length > 0 ? {
          names: outputDoc.docs.map(function (doc) {
            return doc.name;
          })
        } : {
          names: []
        };
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var destroy = function destroy() {
  try {
    return Promise.resolve(_catch(function () {
      return Promise.resolve(db.viewCleanup()).then(function () {
        return Promise.resolve(credentials.destroy()).then(function () {
          db = null;
          credentials = null;
          return true;
        });
      });
    }, function (error) {
      throw error;
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};

var Persist = {
  __proto__: null,
  BIP32_EXTENDED_KEY: BIP32_EXTENDED_KEY,
  NUTXO_EXTENDED_KEY: NUTXO_EXTENDED_KEY,
  init: init$1,
  createProfile: createProfile,
  updateProfile: updateProfile,
  getProfiles: getProfiles,
  login: login,
  getBip32ExtendedKey: getBip32ExtendedKey,
  setBip32ExtendedKey: setBip32ExtendedKey,
  getNUTXOExtendedKey: getNUTXOExtendedKey,
  setNUTXOExtendedKey: setNUTXOExtendedKey,
  getNUTXODerivedKeys: getNUTXODerivedKeys,
  upsertNUTXODerivedKeys: upsertNUTXODerivedKeys,
  getDerivedKeys: getDerivedKeys,
  upsertDerivedKeys: upsertDerivedKeys,
  getOutputs: getOutputs,
  markOutputAsUnspent: markOutputAsUnspent,
  upsertOutputs: upsertOutputs,
  updateOutputs: updateOutputs,
  deleteOutputs: deleteOutputs,
  isInOutputs: isInOutputs,
  getTransactions: getTransactions,
  getTransactionsByConfirmations: getTransactionsByConfirmations,
  upsertTransactions: upsertTransactions,
  deleteTransactions: deleteTransactions,
  markAddressesUsed: markAddressesUsed,
  getUTXOs: getUTXOs,
  getNUtxo: getNUtxo,
  getUnregisteredName: getUnregisteredName,
  destroy: destroy
};

var AddressAPI = function AddressAPI() {
  this.getOutputsByAddress = function (address, pagesize, cursor) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("address/" + address + "/outputs", {
          params: {
            pagesize: pagesize,
            cursor: cursor
          }
        })).then(function (_ref) {
          var data = _ref.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getOutputsByAddresses = function (addresses, pagesize, cursor) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("addresses/outputs", {
          params: {
            address: addresses,
            pagesize: pagesize,
            cursor: cursor
          },
          paramsSerializer: function paramsSerializer(params) {
            return Qs.stringify(params, {
              arrayFormat: 'repeat'
            });
          }
        })).then(function (_ref2) {
          var data = _ref2.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getUTXOsByAddress = function (address, pagesize, cursor) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("address/" + address + "/utxos", {
          params: {
            pagesize: pagesize,
            cursor: cursor
          }
        })).then(function (_ref3) {
          var data = _ref3.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getUTXOsByAddresses = function (addresses, pagesize, cursor) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("addresses/utxos", {
          params: {
            address: addresses,
            pagesize: pagesize,
            cursor: cursor
          },
          paramsSerializer: function paramsSerializer(params) {
            return Qs.stringify(params, {
              arrayFormat: 'repeat'
            });
          }
        })).then(function (_ref4) {
          var data = _ref4.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

var addressAPI = /*#__PURE__*/new AddressAPI();

var TransactionAPI = function TransactionAPI() {
  this.getTransactionByTxID = function (txId) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("transaction/" + txId)).then(function (_ref) {
          var data = _ref.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getTransactionsByTxIDs = function (txIDs) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("transactions", {
          params: {
            id: txIDs
          },
          paramsSerializer: function paramsSerializer(params) {
            return Qs.stringify(params, {
              arrayFormat: 'repeat'
            });
          }
        })).then(function (_ref2) {
          var data = _ref2.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getRawTransactionByTxID = function (txID) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("rawtransaction/" + txID)).then(function (_ref3) {
          var data = _ref3.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getRawTransactionsByTxIDs = function (txIDs) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("rawtransactions", {
          params: {
            id: txIDs
          },
          paramsSerializer: function paramsSerializer(params) {
            return Qs.stringify(params, {
              arrayFormat: 'repeat'
            });
          }
        })).then(function (_ref4) {
          var data = _ref4.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.broadcastRawTransaction = function (hash) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(post("relaytx", {
          rawTx: hash
        })).then(function (_ref5) {
          var data = _ref5.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getSpendStatusByOutpoint = function (outpoint) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("transaction/" + outpoint + "/index/0")).then(function (_ref6) {
          var data = _ref6.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

var transactionAPI = /*#__PURE__*/new TransactionAPI();

var ChainAPI = function ChainAPI() {
  this.getChainInfo = function () {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("chain/info")).then(function (_ref) {
          var data = _ref.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getBlockHeaders = function (startBlockHeight, pagesize) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("chain/headers", {
          params: {
            startBlockHeight: startBlockHeight,
            pagesize: pagesize
          }
        })).then(function (_ref2) {
          var data = _ref2.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

var chainAPI = /*#__PURE__*/new ChainAPI();

var Utils = /*#__PURE__*/function () {
  function Utils() {
    this.mnemonicToSeed = function (bip39Mnemonic, password) {
      try {
        return Promise.resolve(bip39.mnemonicToSeed(bip39Mnemonic, password));
      } catch (e) {
        return Promise.reject(e);
      }
    };

    this.getSeedHex = function (seed) {
      return seed.toString('hex');
    };

    this.getBIP32RootKeyFromSeedHex = function (seed, network) {
      return bitcoinjsLib.bip32.fromBase58(seed, network);
    };

    this.getBIP32RootKeyBase58 = function (bip32RootKey) {
      return bip32RootKey.toBase58();
    };

    this.getAccountExtendedPrivKey = function (bip32ExtendedKey) {
      return bip32ExtendedKey.toBase58();
    };

    this.getAccountExtendedPubKey = function (bip32ExtendedKey) {
      return bip32ExtendedKey.neutered().toBase58();
    };

    this.getDerivationPathAccount = function () {
      var _derivationPaths$BITC = derivationPaths.BITCOIN_SV.BIP44,
          purpose = _derivationPaths$BITC.purpose,
          coin = _derivationPaths$BITC.coin,
          account = _derivationPaths$BITC.account;
      var path = 'm/';
      path += purpose + "'/";
      path += coin + "'/";
      path += account + "'/";
      return path;
    };

    this.codePointToName = function (codePoints) {
      if (codePoints && codePoints.length > 0) {
        var name = '';

        for (var i = 0; i < codePoints.length; i++) {
          name += String.fromCodePoint(codePoints[i]);
        }

        return name;
      }

      return null;
    };

    this.satoshiToBSV = function (satoshi) {
      if (satoshi) return satoshi / 100000000;
      return 0;
    };
  }

  var _proto = Utils.prototype;

  _proto.getCodePoint = function getCodePoint(name) {
    var nameCodePoints = [];

    for (var i = 0; i < name.length; i++) {
      nameCodePoints.push(name.codePointAt(i));
    }

    return nameCodePoints;
  } // unique = (array, col) => [...new Set(array.map(() => col))];
  // groupBy = (arr, col) => {
  //   return arr.reduce((finalOutput, currVal) => {
  //     if (!finalOutput[currVal[col]]) {
  //       finalOutput[currVal[col]] = [];
  //     }
  //     finalOutput[currVal[col]].push(currVal);
  //     return finalOutput;
  //   }, {});
  // };
  // chunk = () => {};
  ;

  _proto.arraysEqual = function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false; // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }

    return true;
  };

  return Utils;
}();

var utils = /*#__PURE__*/new Utils();

var Wallet = /*#__PURE__*/function () {
  function Wallet() {
    this.getBIP32ExtendedPrivKey = function (bip32ExtendedKey) {
      var bip32Interface = bitcoinjsLib.bip32.fromBase58(bip32ExtendedKey, network.BITCOIN_SV_REGTEST);
      var xprvkeyB58 = 'NA';

      if (!bip32Interface.isNeutered()) {
        xprvkeyB58 = bip32Interface.toBase58();
      }

      return xprvkeyB58;
    };

    this.getBIP32ExtendedPubKey = function (bip32ExtendedKey) {
      var bip32Interface = bitcoinjsLib.bip32.fromBase58(bip32ExtendedKey, network.BITCOIN_SV_REGTEST);
      return bip32Interface.neutered().toBase58();
    };
  }

  var _proto = Wallet.prototype;

  _proto._initWallet = function _initWallet(bip39Mnemonic, password) {
    try {
      var _this2 = this;

      var seed = _this2._mnemonicToSeedSync(bip39Mnemonic, password);

      var bip32RootKey = _this2._getBIP32RootKeyFromSeed(seed, network.BITCOIN_SV_REGTEST);

      var bip32ExtendedKey = _this2._getBIP32ExtendedKey(derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath, bip32RootKey);

      var nUTXOExtendedKey = _this2._getBIP32ExtendedKey(derivationPaths.BITCOIN_SV_REGTEST.BIP44.nUTXODerivationPath, bip32RootKey);

      return Promise.resolve(setBip32ExtendedKey(bip32ExtendedKey)).then(function () {
        return Promise.resolve(setNUTXOExtendedKey(nUTXOExtendedKey)).then(function () {
          return Promise.resolve(getDerivedKeys()).then(function (_ref) {
            var existingDerivedKeys = _ref.existingDerivedKeys;

            function _temp3() {
              return Promise.resolve(getNUTXODerivedKeys()).then(function (_ref2) {
                var existingNUTXODerivedKeys = _ref2.existingNUTXODerivedKeys;

                var countOfUnusedNUTXOKeys = _this2._countOfUnusedKeys(existingNUTXODerivedKeys);

                var _temp = function () {
                  if (countOfUnusedNUTXOKeys < 20) {
                    var lastKeyIndex = -1;

                    if (existingNUTXODerivedKeys.length > 0) {
                      lastKeyIndex = existingNUTXODerivedKeys[existingNUTXODerivedKeys.length - 1].indexText.split('/').pop();
                    }

                    return Promise.resolve(_this2.generateDerivedKeys(nUTXOExtendedKey, derivationPaths.BITCOIN_SV_REGTEST.BIP44.nUTXODerivationPath, Number(lastKeyIndex) + 1, 20 - countOfUnusedNUTXOKeys, false)).then(function (_ref3) {
                      var newDerivedKeys = _ref3.derivedKeys;
                      return Promise.resolve(upsertNUTXODerivedKeys(newDerivedKeys)).then(function () {});
                    });
                  }
                }();

                if (_temp && _temp.then) return _temp.then(function () {});
              });
            }

            var countOfUnusedKeys = _this2._countOfUnusedKeys(existingDerivedKeys);

            var _temp2 = function () {
              if (countOfUnusedKeys < 20) {
                var lastKeyIndex = -1;

                if (existingDerivedKeys.length > 0) {
                  lastKeyIndex = existingDerivedKeys[existingDerivedKeys.length - 1].indexText.split('/').pop();
                }

                return Promise.resolve(_this2.generateDerivedKeys(bip32ExtendedKey, derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath, Number(lastKeyIndex) + 1, 20 - countOfUnusedKeys, false)).then(function (_ref4) {
                  var newDerivedKeys = _ref4.derivedKeys;
                  return Promise.resolve(upsertDerivedKeys(newDerivedKeys)).then(function () {});
                });
              }
            }();

            return _temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2);
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto._mnemonicToSeedSync = function _mnemonicToSeedSync(bip39Mnemonic, password) {
    return bip39.mnemonicToSeedSync(bip39Mnemonic, password);
  };

  _proto._getBIP32RootKeyFromSeed = function _getBIP32RootKeyFromSeed(seed, network) {
    return bitcoinjsLib.bip32.fromSeed(seed, network).toBase58();
  };

  _proto._getBIP32ExtendedKey = function _getBIP32ExtendedKey(path, bip32RootKey) {
    if (!bip32RootKey) {
      return bip32RootKey;
    }

    var extendedKey = bitcoinjsLib.bip32.fromBase58(bip32RootKey, network.BITCOIN_SV_REGTEST);
    var pathBits = path.split('/');

    for (var i = 0; i < pathBits.length; i++) {
      var bit = pathBits[i];
      var index = parseInt(bit);

      if (isNaN(index)) {
        continue;
      }

      var hardened = bit[bit.length - 1] === "'";

      if (hardened) {
        extendedKey = extendedKey.deriveHardened(index);
      } else {
        extendedKey = extendedKey.derive(index);
      }
    }

    return extendedKey.toBase58();
  };

  _proto._generateDerivedKeys = function _generateDerivedKeys(bip32ExtendedKey, derivationPath, index, useBip38, bip38password, useHardenedAddresses) {

    var bip32Interface = bitcoinjsLib.bip32.fromBase58(bip32ExtendedKey, network.BITCOIN_SV_REGTEST);
    var key;

    if (useHardenedAddresses) {
      key = bip32Interface.deriveHardened(index);
    } else {
      key = bip32Interface.derive(index);
    }

    var useUncompressed = useBip38;
    var keyPair = bitcoinjsLib.ECPair.fromPrivateKey(key.privateKey, {
      network: network.BITCOIN_SV_REGTEST
    });

    if (useUncompressed) {
      keyPair = bitcoinjsLib.ECPair.fromPrivateKey(key.privateKey, {
        compressed: false,
        network: network.BITCOIN_SV_REGTEST
      });
    }

    var address = bitcoinjsLib.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: network.BITCOIN_SV_REGTEST
    }).address;
    var indexText = derivationPath + '/' + index;

    if (useHardenedAddresses) {
      indexText = indexText + "'";
    }

    return {
      indexText: indexText,
      address: address
    };
  };

  _proto._getPrivKey = function _getPrivKey(bip32ExtendedKey, index, useBip38, bip38password, useHardenedAddresses) {

    var bip32Interface = bitcoinjsLib.bip32.fromBase58(bip32ExtendedKey, network.BITCOIN_SV_REGTEST);
    var key;

    if (useHardenedAddresses) {
      key = bip32Interface.deriveHardened(index);
    } else {
      key = bip32Interface.derive(index);
    }

    var useUncompressed = useBip38;
    var keyPair = bitcoinjsLib.ECPair.fromPrivateKey(key.privateKey, {
      network: network.BITCOIN_SV_REGTEST
    });

    if (useUncompressed) {
      keyPair = bitcoinjsLib.ECPair.fromPrivateKey(key.privateKey, {
        compressed: false,
        network: network.BITCOIN_SV_REGTEST
      });
    } // const address = payments.p2pkh({
    //   pubkey: keyPair.publicKey,
    //   network: network.BITCOIN_SV_REGTEST,
    // }).address!;


    var hasPrivkey = !key.isNeutered();
    var privkey = '';

    if (hasPrivkey) {
      privkey = keyPair.toWIF(); // if (useBip38) {
      //   privkey = bip38.encrypt(keyPair.privateKey!, false, bip38password);
      // }
    } // const pubkey = keyPair.publicKey.toString('hex');
    // let indexText =
    //   derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath + '/' + index;
    // if (useHardenedAddresses) {
    //   indexText = indexText + "'";
    // }
    // if (index === 0) {
    //   return {
    //     privkey: 'cQmNC5DxFdWhEqmzeWZ1Gk62hmLTai8vs9fvRVz2KsxKd9fYJTWH',
    //   };
    // }


    return {
      privkey: privkey
    };
  };

  _proto.generateDerivedKeys = function generateDerivedKeys(bip32ExtendedKey, derivationPath, indexStart, count, useBip38, bip38password, useHardenedAddresses) {
    try {
      var _this4 = this;

      var derivedKeys = [];

      for (var i = indexStart; i < indexStart + count; i++) {
        // if (i === 0) {
        //   const derivedKey = { address: '', indexText: 'm/44/1/0/0/0' };
        //   derivedKey.address = 'msWHgqiPB4dDe7MK455MvkNkixhCZsNKdy';
        //   derivedKeys.push({ ...derivedKey, isUsed: false });
        // } else {
        var derivedKey = _this4._generateDerivedKeys(bip32ExtendedKey, derivationPath, i, useBip38, bip38password, useHardenedAddresses);

        derivedKeys.push(_extends({}, derivedKey, {
          isUsed: false
        })); // }
      }

      return Promise.resolve({
        derivedKeys: derivedKeys
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto._getAddressesFromKeys = function _getAddressesFromKeys(derivedKeys) {
    return derivedKeys.map(function (key) {
      return key.address;
    });
  };

  _proto._countOfUnusedKeys = function _countOfUnusedKeys(keys) {
    return keys.reduce(function (acc, currKey) {
      if (!currKey.isUsed) {
        acc = acc + 1;
      }

      return acc;
    }, 0);
  };

  _proto._removeDuplicate = function _removeDuplicate(outputs) {
    var sortedOutputs = outputs.sort(function (output1, output2) {
      var a = output1.blockHeight !== null ? output1.blockHeight : 999999999;
      var b = output2.blockHeight !== null ? output2.blockHeight : 999999999;
      return b - a;
    });
    var unconfirmedOutputs = [];

    for (var index = 0; index < sortedOutputs.length; index++) {
      var output = sortedOutputs[index];

      if (output.txIndex === null) {
        unconfirmedOutputs.push(output);
      } else {
        break;
      }
    }

    if (unconfirmedOutputs.length > 0) {
      var duplicateOutputs = sortedOutputs.splice(0, unconfirmedOutputs.length * 2);
      var uniqueOutputs = duplicateOutputs.filter(function (element, index, self) {
        return index === self.findIndex(function (t) {
          return t.outputTxHash === element.outputTxHash && t.outputIndex === element.outputIndex;
        });
      });
      return [].concat(uniqueOutputs, sortedOutputs);
    }

    return sortedOutputs;
  };

  _proto.processAllegoryTransactions = function processAllegoryTransactions(outputs, transactions) {
    try {
      var _temp7 = function _temp7() {
        var updatedOutputs = outputs.map(function (output) {
          var nameOutput = validConfirmedNamePurchaseTxs.find(function (validConfirmedNamePurchaseTx) {
            return output.outputTxHash === validConfirmedNamePurchaseTx.tx.txId && output.outputIndex === validConfirmedNamePurchaseTx.index;
          });

          if (nameOutput) {
            return _extends({}, output, {
              name: nameOutput.name,
              isNameOutpoint: true
            });
          } else {
            return output;
          }
        });
        return {
          outputs: updatedOutputs
        };
      };

      var allegoryTransactions = transactions.filter(function (transaction) {
        if (transaction.outputs.length > 0 && transaction.outputs[0].lockingScript.startsWith('006a0f416c6c65676f72792f416c6c506179')) {
          return true;
        }

        return false;
      });
      var confirmedNamePurchaseTxs = [];
      allegoryTransactions.forEach(function (allegoryTransaction) {
        var _producerExtensions;

        var allegoryData = decodeCBORData(allegoryTransaction.outputs[0].lockingScript);
        var allegory = getAllegoryType(allegoryData);
        var name = allegory.name,
            action = allegory.action;
        var producerExtensions = [];

        if (action instanceof ProducerAction) {
          var producerAction = action;

          if (producerAction.extensions.length > 0) {
            producerExtensions = producerAction.extensions.map(function (extension) {
              if (extension instanceof ProducerExtension) {
                return {
                  codePoint: extension.codePoint,
                  index: extension.producerOutputEx.producer.index
                };
              } else {
                return {
                  codePoint: extension.codePoint,
                  index: extension.ownerOutputEx.owner.index
                };
              }
            });
          }
        }

        var producerCodePoints = (_producerExtensions = producerExtensions) === null || _producerExtensions === void 0 ? void 0 : _producerExtensions.map(function (_ref5) {
          var codePoint = _ref5.codePoint;
          return codePoint;
        });
        confirmedNamePurchaseTxs.push({
          name: utils.codePointToName([].concat(name, producerCodePoints)),
          index: producerExtensions.length > 0 ? producerExtensions[0].index : null,
          tx: allegoryTransaction
        });
      });
      var validConfirmedNamePurchaseTxs = [];

      var _temp8 = _forTo(confirmedNamePurchaseTxs, function (index) {
        var confirmedNamePurchaseTx = confirmedNamePurchaseTxs[index];
        var name = confirmedNamePurchaseTx.name,
            txId = confirmedNamePurchaseTx.tx.txId;

        var _temp5 = function () {
          if (name) {
            var _temp9 = _catch(function () {
              return Promise.resolve(post('allegory/name-outpoint', {
                name: utils.getCodePoint(name),
                isProducer: false
              })).then(function (_ref6) {
                var data = _ref6.data;
                var forName = data.forName,
                    isProducer = data.isProducer,
                    _data$outPoint = data.outPoint,
                    opIndex = _data$outPoint.opIndex,
                    opTxHash = _data$outPoint.opTxHash,
                    script = data.script;

                if (utils.codePointToName(forName) === name && txId === opTxHash) {
                  validConfirmedNamePurchaseTxs.push(confirmedNamePurchaseTx);
                }
              });
            }, function () {});

            if (_temp9 && _temp9.then) return _temp9.then(function () {});
          }
        }();

        if (_temp5 && _temp5.then) return _temp5.then(function () {});
      });

      return Promise.resolve(_temp8 && _temp8.then ? _temp8.then(_temp7) : _temp7(_temp8));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getTransactions = function getTransactions$1(options) {
    try {
      var _this6 = this;

      return Promise.resolve(getDerivedKeys()).then(function (_ref7) {
        var existingDerivedKeys = _ref7.existingDerivedKeys;
        return Promise.resolve(getNUTXODerivedKeys()).then(function (_ref8) {
          var _exit = false;
          var existingNUTXODerivedKeys = _ref8.existingNUTXODerivedKeys;

          function _temp11(_result) {
            return _exit ? _result : {
              transactions: []
            };
          }

          var keys = [].concat(existingDerivedKeys, existingNUTXODerivedKeys);

          var _temp10 = function () {
            if (keys.length > 0) {
              return Promise.resolve(_this6._getOutputs(keys)).then(function (_ref9) {
                var newDerivedKeys = _ref9.derivedKeys,
                    newNUTXODerivedKeys = _ref9.nUTXODerivedKeys,
                    diffOutputsWithDuplicate = _ref9.diffOutputs;

                if (diffOutputsWithDuplicate.length > 0) {
                  var diffOutputs = _this6._removeDuplicate(diffOutputsWithDuplicate);

                  var newKeys = [].concat(newDerivedKeys, newNUTXODerivedKeys);
                  /* FIX: A Tx can be in spendInfo, and it may not appear in getOutputs API */

                  var spentOutputs = diffOutputs.filter(function (output) {
                    if (output.spendInfo) return true;
                    return false;
                  });
                  var outgoingTxIds = Array.from(new Set(spentOutputs.map(function (output) {
                    return output.spendInfo.spendingTxId;
                  })));
                  var incomingTxIds = Array.from(new Set(diffOutputs.map(function (output) {
                    return output.outputTxHash;
                  })));
                  var txIds = Array.from(new Set([].concat(incomingTxIds, outgoingTxIds)));
                  return Promise.resolve(_this6._getTransactions(txIds)).then(function (_ref10) {
                    var txs = _ref10.txs;
                    return Promise.resolve(chainAPI.getChainInfo()).then(function (_ref11) {
                      var chainInfo = _ref11.chainInfo;

                      if (chainInfo) {
                        var chainTip = chainInfo.chainTip;

                        if (txs.length > 0) {
                          var sortedTx = txs.sort(function (tx1, tx2) {
                            return tx2.blockHeight - tx1.blockHeight;
                          });
                          var transactions = sortedTx.map(function (transaction) {
                            var _transaction$tx = transaction.tx,
                                txInps = _transaction$tx.txInps,
                                txOuts = _transaction$tx.txOuts,
                                blockHeight = transaction.blockHeight;
                            var newTxInps = txInps.map(function (input) {
                              var isMineAddress = newKeys.find(function (derivedKey) {
                                return derivedKey.address === input.address;
                              });
                              var isNUTXOAddress = newNUTXODerivedKeys.find(function (derivedKey) {
                                return derivedKey.address === input.address;
                              });
                              return {
                                address: input.address,
                                txInputIndex: input.txInputIndex,
                                value: input.value,
                                isMine: isMineAddress ? true : false,
                                isNUTXO: isNUTXOAddress ? true : false
                              };
                            });
                            var newTxOuts = txOuts.map(function (output) {
                              var isMineAddress = newKeys.find(function (derivedKey) {
                                return derivedKey.address === output.address;
                              });
                              var isNUTXOAddress = newNUTXODerivedKeys.find(function (derivedKey) {
                                return derivedKey.address === output.address;
                              });
                              return {
                                address: output.address,
                                lockingScript: output.lockingScript,
                                outputIndex: output.outputIndex,
                                value: output.value,
                                isMine: isMineAddress ? true : false,
                                isNUTXO: isNUTXOAddress ? true : false
                              };
                            });
                            var newTransaction = {
                              txId: transaction.txId,
                              inputs: newTxInps,
                              outputs: newTxOuts
                            };
                            return _extends({}, newTransaction, {
                              confirmation: blockHeight ? chainTip - blockHeight : null
                            });
                          });
                          return Promise.resolve(_this6.processAllegoryTransactions(diffOutputs, transactions)).then(function (_ref12) {
                            var newDiffOutputs = _ref12.outputs;
                            return Promise.resolve(upsertOutputs(newDiffOutputs)).then(function () {
                              return Promise.resolve(upsertTransactions(transactions)).then(function () {
                                return Promise.resolve(upsertDerivedKeys(newDerivedKeys)).then(function () {
                                  return Promise.resolve(upsertNUTXODerivedKeys(newNUTXODerivedKeys)).then(function () {
                                    if (options !== null && options !== void 0 && options.diff) {
                                      _exit = true;
                                      return {
                                        transactions: transactions
                                      };
                                    } else {
                                      _exit = true;
                                      return Promise.resolve(getTransactions(options));
                                    }
                                  });
                                });
                              });
                            });
                          });
                        } else {
                          throw new Error('Error in fetching transactions');
                        }
                      } else {
                        throw new Error('Error in fetching transactions');
                      }
                    });
                  });
                } else {
                  if (options !== null && options !== void 0 && options.diff) {
                    _exit = true;
                    return {
                      transactions: []
                    };
                  } else {
                    _exit = true;
                    return Promise.resolve(getTransactions(options));
                  }
                }
              });
            }
          }();

          return _temp10 && _temp10.then ? _temp10.then(_temp11) : _temp11(_temp10);
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto._getTransactions = function _getTransactions(txIds) {
    try {
      var chunkedTxIds = _.chunk(txIds, 20);

      return Promise.resolve(Promise.all(chunkedTxIds.map(function (chunkedTxId) {
        try {
          return Promise.resolve(transactionAPI.getTransactionsByTxIDs(chunkedTxId));
        } catch (e) {
          return Promise.reject(e);
        }
      }))).then(function (data) {
        var transactions = data.map(function (element) {
          return element.txs;
        }).flat();
        return {
          txs: transactions
        };
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto._getOutputs = function _getOutputs(derivedKeys, prevDiffOutputs, prevKeys) {
    if (prevDiffOutputs === void 0) {
      prevDiffOutputs = [];
    }

    if (prevKeys === void 0) {
      prevKeys = [];
    }

    try {
      var _this8 = this;

      var chunkedUsedDerivedKeys = _.chunk(derivedKeys, 20);

      return Promise.resolve(Promise.all(chunkedUsedDerivedKeys.map(function (chunkedUsedDerivedKey) {
        try {
          return Promise.resolve(_this8._getOutputsByAddresses(chunkedUsedDerivedKey));
        } catch (e) {
          return Promise.reject(e);
        }
      }))).then(function (outputsByAddresses) {
        var diffOutputs = outputsByAddresses.flat();
        var updatedKeys = derivedKeys.map(function (key) {
          if (!key.isUsed) {
            var found = diffOutputs.some(function (output) {
              return output.address === key.address;
            });
            return _extends({}, key, {
              isUsed: found
            });
          }

          return key;
        });
        var newDiffOutputs = [].concat(prevDiffOutputs, diffOutputs);
        var newKeys = [].concat(prevKeys, updatedKeys);
        var walletKeys = newKeys.filter(function (key) {
          return key.indexText.startsWith(derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath);
        });
        var nUTXOKeys = newKeys.filter(function (key) {
          return key.indexText.startsWith(derivationPaths.BITCOIN_SV_REGTEST.BIP44.nUTXODerivationPath);
        });

        var countOfUnusedKeys = _this8._countOfUnusedKeys(walletKeys);

        var countOfUnusedNUTXOKeys = _this8._countOfUnusedKeys(nUTXOKeys);

        if (countOfUnusedKeys < 20 || countOfUnusedNUTXOKeys < 20) {
          return Promise.resolve(getBip32ExtendedKey()).then(function (bip32ExtendedKey) {
            var lastKeyIndex = walletKeys[walletKeys.length - 1].indexText.split('/').pop();
            return Promise.resolve(_this8.generateDerivedKeys(bip32ExtendedKey, derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath, Number(lastKeyIndex) + 1, 20 - countOfUnusedKeys, false)).then(function (_ref13) {
              var nextDerivedKeys = _ref13.derivedKeys;
              return Promise.resolve(getNUTXOExtendedKey()).then(function (nUTXOExtendedKey) {
                var lastNUTXOKeyIndex = nUTXOKeys[nUTXOKeys.length - 1].indexText.split('/').pop();
                return Promise.resolve(_this8.generateDerivedKeys(nUTXOExtendedKey, derivationPaths.BITCOIN_SV_REGTEST.BIP44.nUTXODerivationPath, Number(lastNUTXOKeyIndex) + 1, 20 - countOfUnusedNUTXOKeys, false)).then(function (_ref14) {
                  var nextNUTXODerivedKeys = _ref14.derivedKeys;
                  var nextKeys = [].concat(nextDerivedKeys, nextNUTXODerivedKeys);
                  return Promise.resolve(_this8._getOutputs(nextKeys, newDiffOutputs, newKeys));
                });
              });
            });
          });
        } else {
          return {
            diffOutputs: newDiffOutputs,
            derivedKeys: walletKeys,
            nUTXODerivedKeys: nUTXOKeys
          };
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto._getOutputsByAddresses = function _getOutputsByAddresses(keys, prevOutputs, nextCursor) {
    if (prevOutputs === void 0) {
      prevOutputs = [];
    }

    try {
      var _this10 = this;

      var addresses = _this10._getAddressesFromKeys(keys);

      return Promise.resolve(addressAPI.getOutputsByAddresses(addresses, 100, nextCursor)).then(function (data) {
        return Promise.resolve(getOutputs()).then(function (_ref15) {
          var outputs = _ref15.outputs;

          if (outputs.length > 0) {
            return Promise.resolve(_this10._getDiffOutputs(data.outputs)).then(function (diffOutputs) {
              if (diffOutputs.length === data.outputs.length) {
                var _outputs = [].concat(prevOutputs, diffOutputs);

                if (data.nextCursor) {
                  return Promise.resolve(_this10._getOutputsByAddresses(keys, _outputs, data.nextCursor));
                } else {
                  return _outputs;
                }
              } else {
                return [].concat(prevOutputs, diffOutputs);
              }
            });
          } else {
            var _outputs2 = [].concat(prevOutputs, data.outputs);

            if (data.nextCursor) {
              return Promise.resolve(_this10._getOutputsByAddresses(keys, _outputs2, data.nextCursor));
            } else {
              return _outputs2;
            }
          }
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto._getDiffOutputs = function _getDiffOutputs(outputs) {
    try {
      var _exit3 = false;
      var newOutputs = [];

      var _temp13 = _forTo(outputs, function (index) {
        return Promise.resolve(isInOutputs(outputs[index])).then(function (_Persist$isInOutputs) {
          if (!_Persist$isInOutputs) {
            newOutputs.push(outputs[index]);
          } else {
            _exit3 = true;
            return newOutputs;
          }
        });
      }, function () {
        return _exit3;
      });

      return Promise.resolve(_temp13 && _temp13.then ? _temp13.then(function (_result2) {
        return _exit3 ? _result2 : newOutputs;
      }) : _exit3 ? _temp13 : newOutputs);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getUnusedNUTXOAddress = function getUnusedNUTXOAddress() {
    try {
      return Promise.resolve(getNUTXODerivedKeys()).then(function (_ref16) {
        var existingNUTXODerivedKeys = _ref16.existingNUTXODerivedKeys;
        var unusedNUTXODerivedKeys = existingNUTXODerivedKeys.filter(function (existingDerivedKey) {
          return existingDerivedKey.isUsed === false;
        }).map(function (_ref17) {
          var indexText = _ref17.indexText,
              address = _ref17.address;
          return address;
        });
        return unusedNUTXODerivedKeys.find(Boolean);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto._getKeys = function _getKeys(addresses) {
    try {
      var _this12 = this;

      return Promise.resolve(getDerivedKeys()).then(function (_ref18) {
        var existingDerivedKeys = _ref18.existingDerivedKeys;
        return Promise.resolve(getNUTXODerivedKeys()).then(function (_ref19) {
          var existingNUTXODerivedKeys = _ref19.existingNUTXODerivedKeys;
          var keys = [].concat(existingDerivedKeys, existingNUTXODerivedKeys);
          return Promise.resolve(getBip32ExtendedKey()).then(function (bip32ExtendedKey) {
            return Promise.resolve(getNUTXOExtendedKey()).then(function (nUTXOExtendedKey) {
              return addresses.map(function (address) {
                var derivedKey = keys.find(function (derivedKey) {
                  return derivedKey.address === address;
                });
                var extendedKey;

                if (derivedKey.indexText.startsWith(derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath)) {
                  extendedKey = bip32ExtendedKey;
                } else {
                  extendedKey = nUTXOExtendedKey;
                }

                var KeyIndex = derivedKey.indexText.split('/').pop();

                var _this12$_getPrivKey = _this12._getPrivKey(extendedKey, Number(KeyIndex), false),
                    privkey = _this12$_getPrivKey.privkey;

                return bitcoinjsLib.ECPair.fromWIF(privkey, bitcoinjsLib.networks.regtest);
              });
            });
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.updateTransactionsConfirmations = function updateTransactionsConfirmations() {
    try {
      var _this14 = this;

      return Promise.resolve(getTransactionsByConfirmations()).then(function (_ref20) {
        var _exit4 = false;
        var transactions = _ref20.transactions;

        function _temp20(_result3) {
          return _exit4 ? _result3 : {
            updatedTransactions: [],
            deletedTransactions: []
          };
        }

        var txIds = transactions.map(function (tx) {
          return tx.txId;
        });

        var _temp19 = function () {
          if (txIds.length > 0) {
            return Promise.resolve(_this14._getTransactions(txIds)).then(function (_ref21) {
              var txs = _ref21.txs;
              return function () {
                if (txs.length > 0) {
                  return Promise.resolve(chainAPI.getChainInfo()).then(function (_ref22) {
                    var chainInfo = _ref22.chainInfo;
                    return function () {
                      if (chainInfo) {
                        var chainTip = chainInfo.chainTip;
                        var txsWithConfirmation = txs.map(function (transaction) {
                          var blockHeight = transaction.blockHeight;
                          return _extends({}, transaction, {
                            confirmation: blockHeight ? chainTip - blockHeight : null
                          });
                        });
                        var updatedTransactions = [];
                        var deletedTransactions = [];
                        var unconfirmedTransactions = [];
                        transactions.forEach(function (transaction) {
                          var matchedTxWithConfirmation = txsWithConfirmation.find(function (tx) {
                            return tx.txId === transaction.txId;
                          });

                          if (matchedTxWithConfirmation && matchedTxWithConfirmation.confirmation !== transaction.confirmation) {
                            updatedTransactions.push(_extends({}, transaction, {
                              confirmation: matchedTxWithConfirmation.confirmation
                            }));
                          } else if (transaction.confirmation === null) {
                            unconfirmedTransactions.push(_extends({}, transaction));
                          }
                        });
                        return Promise.resolve(upsertTransactions(updatedTransactions)).then(function () {
                          var _exit5 = false;

                          function _temp18(_result5) {
                            if (_exit5) return _result5;
                            _exit4 = true;
                            return {
                              updatedTransactions: updatedTransactions,
                              deletedTransactions: deletedTransactions
                            };
                          }

                          var _temp17 = function () {
                            if (unconfirmedTransactions.length > 0) {
                              var _temp16 = function _temp16() {
                                _exit4 = true;
                                return {
                                  updatedTransactions: updatedTransactions,
                                  deletedTransactions: deletedTransactions
                                };
                              };

                              var _temp21 = _forTo(unconfirmedTransactions, function (index) {
                                var unconfirmedTransaction = unconfirmedTransactions[index];
                                var diffInMinutes = dateFns.differenceInMinutes(new Date(), Date.parse(unconfirmedTransaction.createdAt));

                                var _temp14 = function () {
                                  if (diffInMinutes > 30) {
                                    // make inputs of the tx as unspent
                                    var unspentOutputs = unconfirmedTransaction.inputs.map(function (input) {
                                      return {
                                        outputTxHash: input.outputTxHash,
                                        outputIndex: input.txInputIndex
                                      };
                                    });
                                    return Promise.resolve(markOutputAsUnspent(unspentOutputs)).then(function () {
                                      // delete own outputs of this tx
                                      var ownOutputs = unconfirmedTransaction.outputs.filter(function (output) {
                                        return output.isMine === true;
                                      });
                                      var deletedOutputs = ownOutputs.map(function (output) {
                                        return {
                                          outputTxHash: unconfirmedTransaction.txId,
                                          outputIndex: output.outputIndex
                                        };
                                      });
                                      return Promise.resolve(deleteOutputs(deletedOutputs)).then(function () {
                                        // delete transaction
                                        deletedTransactions.push(unconfirmedTransaction);
                                        return Promise.resolve(deleteTransactions([unconfirmedTransaction])).then(function () {});
                                      });
                                    });
                                  }
                                }();

                                if (_temp14 && _temp14.then) return _temp14.then(function () {});
                              });

                              return _temp21 && _temp21.then ? _temp21.then(_temp16) : _temp16(_temp21);
                            }
                          }();

                          return _temp17 && _temp17.then ? _temp17.then(_temp18) : _temp18(_temp17);
                        });
                      }
                    }();
                  });
                }
              }();
            });
          }
        }();

        return _temp19 && _temp19.then ? _temp19.then(_temp20) : _temp20(_temp19);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.relayTx = function relayTx(psbt, transaction, inputs, ownOutputs) {
    try {
      var _this16 = this;

      var transactionHex = transaction.toHex();
      var base64 = Buffer.from(transactionHex, 'hex').toString('base64');
      return Promise.resolve(transactionAPI.broadcastRawTransaction(base64)).then(function (_ref23) {
        var _exit6 = false;
        var txBroadcast = _ref23.txBroadcast;

        function _temp23(_result7) {
          if (_exit6) return _result7;
          throw new Error('Broadcast failed');
        }

        var _temp22 = function () {
          if (txBroadcast) {
            var spentUtxos = inputs.map(function (input) {
              return _extends({}, input, {
                isSpent: true
              });
            });
            var changeOutputs = ownOutputs.map(function (ownOutput, index) {
              var transactionOutput = transaction.outs.find(function (output, index) {
                if (!Buffer.from(output.script).toString('hex').startsWith('006a0f416c6c65676f72792f416c6c506179')) {
                  var p2pkh = bitcoinjsLib.payments.p2pkh({
                    output: output.script,
                    network: network.BITCOIN_SV_REGTEST
                  });
                  return ownOutput.address === p2pkh.address;
                }

                return false;
              });
              var transactionIndex = transaction.outs.findIndex(function (output, index) {
                if (!Buffer.from(output.script).toString('hex').startsWith('006a0f416c6c65676f72792f416c6c506179')) {
                  var p2pkh = bitcoinjsLib.payments.p2pkh({
                    output: output.script,
                    network: network.BITCOIN_SV_REGTEST
                  });
                  return ownOutput.address === p2pkh.address;
                }

                return false;
              });
              return {
                address: ownOutput.address,
                isSpent: false,
                outputIndex: transactionIndex,
                outputTxHash: transaction.getId(),
                value: transactionOutput === null || transactionOutput === void 0 ? void 0 : transactionOutput.value
              };
            });
            var unconfirmedTransaction = {
              txId: transaction.getId(),
              inputs: transaction.ins.map(function (input, index) {
                var _psbt$data$inputs$ind;

                var p2pkh = bitcoinjsLib.payments.p2pkh({
                  input: input.script,
                  network: network.BITCOIN_SV_REGTEST
                });
                var isMineInput = inputs.find(function (inp) {
                  return inp.outputTxHash === Buffer.from(input.hash).reverse().toString('hex') && inp.outputIndex === input.index;
                });
                return {
                  address: p2pkh.address,
                  isMine: isMineInput ? true : false,
                  isNUTXO: isMineInput && isMineInput.isNameOutpoint ? true : false,
                  txInputIndex: input.index,
                  outputTxHash: Buffer.from(input.hash).reverse().toString('hex'),
                  value: (_psbt$data$inputs$ind = psbt.data.inputs[index].witnessUtxo) === null || _psbt$data$inputs$ind === void 0 ? void 0 : _psbt$data$inputs$ind.value
                };
              }),
              outputs: transaction.outs.map(function (output, index) {
                if (!Buffer.from(output.script).toString('hex').startsWith('006a0f416c6c65676f72792f416c6c506179')) {
                  var p2pkh = bitcoinjsLib.payments.p2pkh({
                    output: output.script,
                    network: network.BITCOIN_SV_REGTEST
                  });
                  var isMineOutput = ownOutputs.find(function (ownOutput) {
                    return ownOutput.address === p2pkh.address;
                  });
                  return {
                    address: p2pkh.address,
                    isMine: isMineOutput ? true : false,
                    isNUTXO: isMineOutput && isMineOutput.type === 'nUTXO' ? true : false,
                    lockingScript: Buffer.from(output.script).toString('hex'),
                    outputIndex: index,
                    value: output.value
                  };
                } else {
                  return {
                    address: null,
                    isMine: false,
                    isNUTXO: false,
                    lockingScript: Buffer.from(output.script).toString('hex'),
                    outputIndex: index,
                    value: output.value
                  };
                }
              }),
              confirmation: null,
              createdAt: new Date()
            };
            return Promise.resolve(_this16.processAllegoryTransactions(changeOutputs, [unconfirmedTransaction])).then(function (_ref24) {
              var outputs = _ref24.outputs;
              return Promise.resolve(_this16.markAddressesUsed(ownOutputs.map(function (_ref25) {
                var address = _ref25.address;
                return address;
              }))).then(function () {
                return Promise.resolve(upsertOutputs(spentUtxos)).then(function () {
                  return Promise.resolve(upsertOutputs(outputs)).then(function () {
                    return Promise.resolve(upsertTransactions([unconfirmedTransaction])).then(function () {
                      _exit6 = true;
                      return {
                        transaction: unconfirmedTransaction,
                        txBroadcast: txBroadcast
                      };
                    });
                  });
                });
              });
            });
          }
        }();

        return _temp22 && _temp22.then ? _temp22.then(_temp23) : _temp23(_temp22);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto._createSendTransaction = function _createSendTransaction(utxos, targets, feeRate) {
    try {
      var _this18 = this;

      return Promise.resolve(_catch(function () {
        function _temp27() {
          var addresses = inputs.map(function (input) {
            return input.address;
          });
          return Promise.resolve(_this18._getKeys(addresses)).then(function (keys) {
            keys.forEach(function (key, i) {
              psbt.signInput(i, key);
            });
            psbt.validateSignaturesOfAllInputs();
            psbt.finalizeAllInputs();
            var transaction = psbt.extractTransaction(true);
            return Promise.resolve(_this18.relayTx(psbt, transaction, inputs, usedAddresses));
          });
        }

        // let feeRate = 5; // satoshis per byte
        // if (transactionFee === 0) {
        //   feeRate = 0;
        // }
        var _coinSelect = coinSelect(utxos, targets, feeRate),
            inputs = _coinSelect.inputs,
            outputs = _coinSelect.outputs;

        if (!inputs || !outputs) throw new Error('Empty inputs or outputs'); // if (transactionFee !== fee) {
        //   const changeOutputs = outputs.filter((output: { address: any }) => {
        //     if (!output.address) return true;
        //     return false;
        //   });
        //   const diffFee = fee - transactionFee;
        //   if (changeOutputs.length > 0) {
        //     changeOutputs[0].value = Number(changeOutputs[0].value) + diffFee;
        //   }
        // }

        var psbt = new bitcoinjsLib.Psbt({
          network: network.BITCOIN_SV_REGTEST,
          forkCoin: 'bch'
        });
        psbt.setVersion(1);
        inputs.forEach(function (input) {
          var p2pkh = bitcoinjsLib.payments.p2pkh({
            address: input.address,
            network: network.BITCOIN_SV_REGTEST
          });
          psbt.addInput({
            hash: input.outputTxHash,
            index: input.outputIndex,
            witnessUtxo: {
              script: p2pkh.output,
              value: input.value
            }
          });
        });
        var usedAddresses = [];

        var _temp26 = _forTo(outputs, function (index) {
          function _temp25() {
            psbt.addOutput({
              address: output.address,
              value: output.value
            });
          }

          var output = outputs[index];

          var _temp24 = function () {
            if (!output.address) {
              return Promise.resolve(_this18.getUnusedAddresses({
                excludeAddresses: usedAddresses
              })).then(function (_ref26) {
                var unusedAddresses = _ref26.unusedAddresses;
                var address = unusedAddresses[0];
                usedAddresses.push({
                  type: '',
                  title: '',
                  address: address
                });
                output.address = address;
              });
            }
          }();

          return _temp24 && _temp24.then ? _temp24.then(_temp25) : _temp25(_temp24);
        });

        return _temp26 && _temp26.then ? _temp26.then(_temp27) : _temp27(_temp26);
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.createSendTransaction = function createSendTransaction(receiverAddress, amountInSatoshi, feeRate) {
    try {
      var _this20 = this;

      return Promise.resolve(getUTXOs()).then(function (_ref27) {
        var utxos = _ref27.utxos;
        var targets = [{
          address: receiverAddress,
          value: Number(amountInSatoshi)
        }];
        return Promise.resolve(_this20._createSendTransaction(utxos, targets, feeRate));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getTransactionFee = function getTransactionFee(receiverAddress, amountInSatoshi, feeRate) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(getUTXOs()).then(function (_ref28) {
          var utxos = _ref28.utxos;
          var targets = [{
            address: receiverAddress,
            value: Number(amountInSatoshi)
          }];

          var _coinSelect2 = coinSelect(utxos, targets, feeRate),
              fee = _coinSelect2.fee; // if (!inputs) throw new Error('Not sufficient funds');
          // if (!outputs) throw new Error('No Receiver specified');


          return fee;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getBalance = function getBalance() {
    try {
      return Promise.resolve(getOutputs()).then(function (_ref29) {
        var outputs = _ref29.outputs;
        var balance = outputs.reduce(function (acc, currOutput) {
          if (!currOutput.isSpent) {
            acc = acc + currOutput.value;
          }

          return acc;
        }, 0);
        return {
          balance: balance
        };
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.generateMnemonic = function generateMnemonic(strength, rng, wordlist) {
    return bip39.generateMnemonic(strength, rng, wordlist);
  };

  _proto.getUsedAddresses = function getUsedAddresses() {
    try {
      return Promise.resolve(getOutputs()).then(function (_ref30) {
        var outputs = _ref30.outputs;

        var outputsGroupedByAddress = _.groupBy(outputs, function (output) {
          return output.address;
        });

        var usedAddresses = [];

        var _loop = function _loop() {
          var _Object$entries$_i = _Object$entries[_i],
              address = _Object$entries$_i[0],
              outputs = _Object$entries$_i[1];
          var currentBalance = outputs.reduce(function (acc, currOutput) {
            if (!currOutput.spendInfo) {
              acc = acc + currOutput.value;
            }

            return acc;
          }, 0);
          var incomingBalance = 0;
          var outgoingBalance = 0;
          outputs.forEach(function (output) {
            if (output.spendInfo) {
              outgoingBalance = outgoingBalance + output.value;
            }

            incomingBalance = incomingBalance + output.value;
          });
          usedAddresses.push({
            address: address,
            incomingBalance: incomingBalance,
            outgoingBalance: outgoingBalance,
            currentBalance: currentBalance,
            lastTransaction: outputs[0].address
          });
        };

        for (var _i = 0, _Object$entries = Object.entries(outputsGroupedByAddress); _i < _Object$entries.length; _i++) {
          _loop();
        }

        return {
          usedAddresses: usedAddresses
        };
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getUnusedAddresses = function getUnusedAddresses(options) {
    try {
      return Promise.resolve(getDerivedKeys()).then(function (_ref31) {
        var existingDerivedKeys = _ref31.existingDerivedKeys;
        var unusedAddresses = existingDerivedKeys.filter(function (existingDerivedKey) {
          return existingDerivedKey.isUsed === false;
        }).map(function (_ref32) {
          var address = _ref32.address;
          return address;
        });

        if (options !== null && options !== void 0 && options.excludeAddresses) {
          var filteredUnusedAddresses = unusedAddresses.filter(function (unusedAddress) {
            var _options$excludeAddre;

            return !((_options$excludeAddre = options.excludeAddresses) !== null && _options$excludeAddre !== void 0 && _options$excludeAddre.includes(unusedAddress));
          });

          if (options !== null && options !== void 0 && options.count) {
            return {
              unusedAddresses: filteredUnusedAddresses.slice(0, options.count)
            };
          } else {
            return {
              unusedAddresses: filteredUnusedAddresses.slice(0, 1)
            };
          }
        }

        return options !== null && options !== void 0 && options.count ? {
          unusedAddresses: unusedAddresses.slice(0, options.count)
        } : {
          unusedAddresses: unusedAddresses.slice(0, 1)
        };
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.markAddressesUsed = function markAddressesUsed$1(addresses) {
    try {
      return Promise.resolve(markAddressesUsed(addresses)).then(function () {});
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.login = function login$1(profileId, password) {
    try {
      var _this22 = this;

      return Promise.resolve(_catch(function () {
        return Promise.resolve(login(profileId, password)).then(function (bip39Mnemonic) {
          return Promise.resolve(init$1(profileId)).then(function () {
            return Promise.resolve(_this22._initWallet(bip39Mnemonic)).then(function () {
              return {
                profile: profileId
              };
            });
          });
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.createProfile = function createProfile$1(bip39Mnemonic, password) {
    try {
      var cryptedText = AES.encrypt(bip39Mnemonic, password).toString();
      var profileName = faker.name.firstName();
      localStorage.setItem('currentprofile', profileName);
      return Promise.resolve(_catch(function () {
        return Promise.resolve(createProfile(cryptedText, profileName)).then(function () {
          return {
            profile: profileName
          };
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.updateProfileName = function updateProfileName(currentProfileName, newProfileName) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(updateProfile(currentProfileName, newProfileName)).then(function () {
          return {
            profile: newProfileName
          };
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getProfiles = function getProfiles$1() {
    try {
      return Promise.resolve(getProfiles()).then(function (_Persist$getProfiles) {
        return {
          profiles: _Persist$getProfiles
        };
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getUnregisteredName = function getUnregisteredName$1() {
    try {
      return Promise.resolve(getUnregisteredName());
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.logout = function logout() {
    try {
      return Promise.resolve(destroy());
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.runScript = function runScript() {
    try {
      var _this24 = this;

      var targets = [{
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }, {
        address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx',
        value: 500
      }]; // const { utxos } = await Persist.getUTXOs();
      // const feeRate = 5;
      // await this._createSendTransaction(utxos, targets, feeRate);

      return Promise.resolve(_this24._getKeys(['mmFXRtUtKN9znnF9DFgQqvKP5TBHZmgmym'])).then(function (keys) {
        console.log(keys[0].privateKey.toString('hex')); // const { utxos } = await Persist.getUTXOs();
        // const balance = utxos.reduce((acc: number, currOutput: any) => {
        //   if (!currOutput.isSpent) {
        //     acc = acc + currOutput.value;
        //   }
        //   return acc;
        // }, 0);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return Wallet;
}();

var wallet = /*#__PURE__*/new Wallet();

var allegoryRootNode = "e862d04ac63afa7d3e8118b37d5af0450fab1528016cd39a37cf61c888a198ee";
var Config = {
	allegoryRootNode: allegoryRootNode
};

var Allpay = /*#__PURE__*/function () {
  function Allpay() {}

  var _proto = Allpay.prototype;

  _proto.buyName = function buyName(data) {
    try {
      var _this2 = this;

      return Promise.resolve(_catch(function () {
        var host = data.host,
            port = data.port,
            name = data.name,
            isProducer = data.isProducer;
        var priceInSatoshi = 1000000;
        var feeRate = 0;
        return Promise.resolve(getUTXOs()).then(function (_ref) {
          var utxos = _ref.utxos;
          var targets = [{
            value: Number(priceInSatoshi)
          }];

          var _coinSelect = coinSelect(utxos, targets, feeRate),
              inputs = _coinSelect.inputs,
              outputs = _coinSelect.outputs;

          if (!inputs || !outputs) throw new Error('Empty inputs or outputs');
          var paymentInputs = inputs.map(function (input) {
            return [{
              opTxHash: input.outputTxHash,
              opIndex: input.outputIndex
            }, input.value];
          });
          return Promise.resolve(wallet.getUnusedNUTXOAddress()).then(function (outputOwner) {
            return Promise.resolve(wallet.getUnusedAddresses()).then(function (_ref2) {
              var unusedAddresses = _ref2.unusedAddresses;
              var outputChange = unusedAddresses[0];

              if (outputOwner && outputChange) {
                return Promise.resolve(post('partialsign', {
                  paymentInputs: paymentInputs,
                  name: [name, isProducer],
                  outputOwner: outputOwner,
                  outputChange: outputChange
                }, {
                  baseURL: "https://" + host + ":" + port + "/v1"
                })).then(function (_ref3) {
                  var psaBase64 = _ref3.data.psaTx;
                  return Promise.resolve(_this2.decodeTransaction(psaBase64, inputs)).then(function (_ref4) {
                    var psbt = _ref4.psbt;
                    // const snv = await this.verifyRootTx({ psbt });
                    var ownOutputs = [{
                      type: 'nUTXO',
                      title: 'Name UTXO',
                      address: outputOwner
                    }, {
                      type: '',
                      title: '',
                      address: outputChange
                    }];
                    return {
                      psbt: psbt,
                      outpoint: {
                        name: name,
                        isProducer: isProducer
                      },
                      inputs: inputs,
                      ownOutputs: ownOutputs,
                      snv: true
                    };
                  });
                });
              } else {
                throw new Error('Error configuring input params');
              }
            });
          });
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.decodeTransaction = function decodeTransaction(psaBase64, inputs, addFunding) {
    try {
      var partiallySignTransaction = JSON.parse(Buffer.from(psaBase64, 'base64').toString());
      return Promise.resolve(_catch(function () {
        function _temp5() {
          partiallySignTransaction.ins.forEach(function (input, index) {
            if (input.script) {
              var p2pkh = bitcoinjsLib.payments.p2pkh({
                input: Buffer.from(input.script, 'hex'),
                network: network.BITCOIN_SV_REGTEST
              });
              psbt.updateInput(index, {
                partialSig: [{
                  pubkey: p2pkh.pubkey,
                  signature: p2pkh.signature
                }]
              });
            }
          });
          return {
            psbt: psbt,
            fundingInputs: fundingInputs,
            ownOutputs: ownOutputs
          };
        }

        var psbt = new bitcoinjsLib.Psbt({
          network: network.BITCOIN_SV_REGTEST,
          forkCoin: 'bch'
        });
        psbt.setVersion(1);
        partiallySignTransaction.ins.forEach(function (input) {
          if (input.script) {
            var p2pkh = bitcoinjsLib.payments.p2pkh({
              input: Buffer.from(input.script, 'hex'),
              network: network.BITCOIN_SV_REGTEST
            });
            psbt.addInput({
              hash: input.outpoint.hash,
              index: input.outpoint.index,
              sequence: input.sequence,
              witnessUtxo: {
                script: p2pkh.output,
                value: input.value
              }
            });
          } else {
            var utxoInput = inputs.find(function (inp) {
              return inp.outputTxHash === input.outpoint.hash && inp.outputIndex === input.outpoint.index;
            });

            if (utxoInput) {
              var _p2pkh = bitcoinjsLib.payments.p2pkh({
                address: utxoInput.address,
                network: network.BITCOIN_SV_REGTEST
              });

              psbt.addInput({
                hash: input.outpoint.hash,
                index: input.outpoint.index,
                sequence: input.sequence,
                witnessUtxo: {
                  script: _p2pkh.output,
                  value: utxoInput.value
                }
              });
            } else {
              throw new Error('Error in setting psbt inputs');
            }
          }
        });
        var fundingInputs = [];
        var ownOutputs = [];

        var _temp4 = function () {
          if (addFunding) {
            return Promise.resolve(getUTXOs()).then(function (_ref5) {
              var utxos = _ref5.utxos;
              var feeRate = 5000;
              var amountInSatoshi = 10000;
              var targets = [{
                value: Number(amountInSatoshi)
              }];

              var _coinSelect2 = coinSelect(utxos, targets, feeRate),
                  inputs = _coinSelect2.inputs,
                  outputs = _coinSelect2.outputs;

              fundingInputs = inputs;
              inputs.forEach(function (input) {
                var p2pkh = bitcoinjsLib.payments.p2pkh({
                  address: input.address,
                  network: network.BITCOIN_SV_REGTEST
                });
                psbt.addInput({
                  hash: input.outputTxHash,
                  index: input.outputIndex,
                  witnessUtxo: {
                    script: p2pkh.output,
                    value: input.value
                  }
                });
              });
              partiallySignTransaction.outs.forEach(function (output, index) {
                psbt.addOutput({
                  script: Buffer.from(output.script, 'hex'),
                  value: output.value
                });
              });
              var usedAddresses = [];

              var _temp3 = _forTo(outputs, function (index) {
                function _temp2() {
                  psbt.addOutput({
                    address: output.address,
                    value: output.value
                  });
                }

                var output = outputs[index];

                var _temp = function () {
                  if (!output.address) {
                    return Promise.resolve(wallet.getUnusedAddresses({
                      excludeAddresses: usedAddresses
                    })).then(function (_ref6) {
                      var unusedAddresses = _ref6.unusedAddresses;
                      var address = unusedAddresses[0];
                      usedAddresses.push(address);
                      output.address = address;
                      ownOutputs.push({
                        type: '',
                        title: '',
                        address: address
                      });
                    });
                  }
                }();

                return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
              });

              if (_temp3 && _temp3.then) return _temp3.then(function () {});
            });
          } else {
            partiallySignTransaction.outs.forEach(function (output, index) {
              psbt.addOutput({
                script: Buffer.from(output.script, 'hex'),
                value: output.value
              });
            });
          }
        }();

        return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4);
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.signRelayTransaction = function signRelayTransaction(_ref7) {
    var psbtHex = _ref7.psbtHex,
        inputs = _ref7.inputs,
        ownOutputs = _ref7.ownOutputs;

    try {
      var _exit2 = false;

      var _temp7 = function _temp7(_result3) {
        if (_exit2) return _result3;
        psbt.validateSignaturesOfAllInputs();
        psbt.finalizeAllInputs();
        var transaction = psbt.extractTransaction(true);
        return Promise.resolve(wallet.relayTx(psbt, transaction, inputs, ownOutputs));
      };

      var psbt = bitcoinjsLib.Psbt.fromHex(psbtHex, {
        network: network.BITCOIN_SV_REGTEST,
        forkCoin: 'bch'
      });
      var _index = 0;

      var _temp8 = _for(function () {
        return !_exit2 && _index < psbt.data.inputs.length;
      }, function () {
        return _index++;
      }, function () {
        var input = psbt.data.inputs[_index];
        return function () {
          if (!input.partialSig) {
            var txInput = psbt.txInputs[_index];
            var utxo = inputs.find(function (input) {
              return input.outputTxHash === Buffer.from(txInput.hash).reverse().toString('hex') && input.outputIndex === txInput.index;
            });
            return function () {
              if (utxo) {
                return Promise.resolve(wallet._getKeys([utxo.address])).then(function (keys) {
                  if (keys.length > 0) {
                    var key = keys[0];
                    psbt.signInput(_index, key);
                  }
                });
              } else {
                throw new Error('Error in signing transaction');
              }
            }();
          }
        }();
      });

      return Promise.resolve(_temp8 && _temp8.then ? _temp8.then(_temp7) : _temp7(_temp8));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.verifyRootTx = function verifyRootTx(args) {
    try {
      var _exit4 = false;

      var _this4 = this;

      var psbt = args.psbt,
          transaction = args.transaction;
      var inputHash;

      var _temp10 = function () {
        if (psbt || transaction) {
          if (psbt) {
            inputHash = Buffer.from(psbt.txInputs[0].hash).reverse().toString('hex');
          }

          if (transaction) {
            var txInps = transaction.txInps;
            inputHash = txInps[0].outpointTxID;
          }

          if (inputHash === '0000000000000000000000000000000000000000000000000000000000000000') {
            _exit4 = true;
            return false;
          } else if (inputHash === Config.allegoryRootNode) {
            _exit4 = true;
            return true;
          } else {
            return Promise.resolve(transactionAPI.getTransactionByTxID(inputHash)).then(function (_ref8) {
              var tx = _ref8.tx.tx;
              _exit4 = true;
              return Promise.resolve(_this4.verifyRootTx({
                transaction: tx
              }));
            });
          }
        }
      }();

      return Promise.resolve(_temp10 && _temp10.then ? _temp10.then(function (_result4) {
        return _exit4 ? _result4 : false;
      }) : _exit4 ? _temp10 : false);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.verifyMerkelRoot = function verifyMerkelRoot(args) {
    var leafNode = args.leafNode,
        merkelRoot = args.merkelRoot,
        proof = args.proof;
    var merkelProof = proof;
    var finalHash = leafNode;

    while (merkelProof.length > 0) {
      finalHash = sha256(sha256(finalHash).toString()).toString();
      var secondLeafHash = merkelProof.shift();
      finalHash = finalHash.concat(secondLeafHash);
    }

    return merkelRoot === finalHash;
  };

  _proto.getOutpointForName = function getOutpointForName(name) {
    try {
      if (name && name.length) {
        return Promise.resolve(_catch(function () {
          return Promise.resolve(post('allegory/name-outpoint', {
            name: name,
            isProducer: false
          })).then(function (_ref9) {
            var data = _ref9.data;
            return data;
          });
        }, function (error) {
          throw error;
        }));
      } else {
        throw new Error('Invalid name error');
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getResellerURI = function getResellerURI(name) {
    try {
      if (name && name.length) {
        return Promise.resolve(_catch(function () {
          return Promise.resolve(post('allegory/reseller-uri', {
            name: name,
            isProducer: true
          })).then(function (_ref10) {
            var _ref10$data = _ref10.data,
                forName = _ref10$data.forName,
                uri = _ref10$data.uri,
                protocol = _ref10$data.protocol,
                isProducer = _ref10$data.isProducer;

            if (utils.arraysEqual(name, forName) && isProducer === true) {
              return {
                isAvailable: false,
                name: name
              };
            } else {
              return {
                isAvailable: true,
                name: name,
                uri: uri,
                protocol: protocol
              };
            }
          });
        }, function (error) {
          throw error;
        }));
      } else {
        throw new Error('Invalid name error');
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.createTransaction = function createTransaction(args) {
    try {
      var _this6 = this;

      var allpayName = args.allpayName,
          amountInSatoshi = args.amountInSatoshi,
          feeRate = args.feeRate;
      return Promise.resolve(_this6.getOutpointForName(utils.getCodePoint(allpayName))).then(function (_ref11) {
        var forName = _ref11.forName,
            isProducer = _ref11.isProducer,
            _ref11$outPoint = _ref11.outPoint,
            opTxHash = _ref11$outPoint.opTxHash,
            opIndex = _ref11$outPoint.opIndex,
            script = _ref11.script;
        return Promise.resolve(transactionAPI.getTransactionByTxID(opTxHash)).then(function (_ref12) {
          var txOuts = _ref12.tx.tx.txOuts;
          var OP_RETURN_OUTPUT = txOuts[0];
          var lockingScript = OP_RETURN_OUTPUT.lockingScript;
          var allegoryData = decodeCBORData(lockingScript);
          var allegory = getAllegoryType(allegoryData);
          var proxyHost = '127.0.0.1';
          var proxyPort = 8000;
          var recipient = sha256(lockingScript).toString();
          return Promise.resolve(wallet.getUnusedAddresses()).then(function (_ref13) {
            var unusedAddresses = _ref13.unusedAddresses;
            var changeAddress = unusedAddresses[0];
            return Promise.resolve(getUTXOs()).then(function (_ref14) {
              var utxos = _ref14.utxos;
              var targets = [{
                value: Number(amountInSatoshi)
              }];

              var _coinSelect3 = coinSelect(utxos, targets, feeRate),
                  inputs = _coinSelect3.inputs,
                  outputs = _coinSelect3.outputs;

              if (!inputs || !outputs) throw new Error('Empty inputs or outputs');
              return Promise.resolve(_this6._createTransaction({
                proxyHost: proxyHost,
                proxyPort: proxyPort,
                recipient: recipient,
                amountInSatoshi: amountInSatoshi,
                changeAddress: changeAddress,
                utxos: inputs
              })).then(function (_ref15) {
                var psaBase64 = _ref15.psaBase64,
                    addressProof = _ref15.addressProof,
                    utxoProof = _ref15.utxoProof;
                return Promise.resolve(_this6.decodeTransaction(psaBase64, inputs)).then(function (_ref16) {
                  var psbt = _ref16.psbt;

                  if (allegory && allegory.action instanceof OwnerAction) {
                    var ownerAction = allegory.action;

                    if (ownerAction.oProxyProviders.length > 0) {
                      var utxoLeafNode = Buffer.from(psbt.txInputs[0].hash).reverse().toString('hex').concat(':').concat(String(psbt.txInputs[0].index));
                      var addressLeafNode = psbt.txOutputs[0].address;
                      var addressMerkelRoot = ownerAction.oProxyProviders[0].registration.addressCommitment;
                      var utxoMerkelRoot = ownerAction.oProxyProviders[0].registration.utxoCommitment;

                      var addressCommitment_ = _this6.verifyMerkelRoot({
                        leafNode: addressLeafNode,
                        merkelRoot: addressMerkelRoot,
                        proof: addressProof
                      });

                      var utxoCommitment_ = _this6.verifyMerkelRoot({
                        leafNode: utxoLeafNode,
                        merkelRoot: utxoMerkelRoot,
                        proof: utxoProof
                      });

                      var addressCommitment = true;
                      var utxoCommitment = true;
                      return {
                        psbt: psbt,
                        inputs: inputs,
                        ownOutputs: [{
                          type: '',
                          title: '',
                          address: changeAddress
                        }],
                        addressCommitment: addressCommitment,
                        utxoCommitment: utxoCommitment
                      };
                    }
                  }

                  throw Error('Error in drafting Allegory Transaction');
                });
              });
            });
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto._createTransaction = function _createTransaction(data) {
    try {
      var proxyHost = data.proxyHost,
          proxyPort = data.proxyPort,
          recipient = data.recipient,
          amountInSatoshi = data.amountInSatoshi,
          changeAddress = data.changeAddress,
          utxos = data.utxos;
      var inputs = utxos.map(function (utxo) {
        return [{
          txid: utxo.outputTxHash,
          index: utxo.outputIndex
        }, Number(utxo.value)];
      });
      return Promise.resolve(post('ps-allpay-tx', {
        inputs: inputs,
        recipient: recipient,
        amount: Number(amountInSatoshi),
        change: changeAddress
      }, {
        baseURL: "http://" + proxyHost + ":" + proxyPort + "/v1"
      })).then(function (_ref17) {
        var _ref17$data = _ref17.data,
            psaBase64 = _ref17$data.tx,
            addressProof = _ref17$data.addressProof,
            utxoProof = _ref17$data.utxoProof;
        return {
          psaBase64: psaBase64,
          addressProof: addressProof,
          utxoProof: utxoProof
        };
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.registerName = function registerName(data) {
    try {
      var _this8 = this;

      return Promise.resolve(_catch(function () {
        var proxyHost = data.proxyHost,
            proxyPort = data.proxyPort,
            name = data.name,
            addressCount = data.addressCount;
        var nameCodePoint = utils.getCodePoint(name);
        return Promise.resolve(getBip32ExtendedKey()).then(function (bip32ExtendedKey) {
          var xpubKey = wallet.getBIP32ExtendedPubKey(bip32ExtendedKey);
          return Promise.resolve(wallet.getUnusedNUTXOAddress()).then(function (returnAddress) {
            return Promise.resolve(getNUtxo(name)).then(function (_ref18) {
              var nUTXOs = _ref18.nUTXOs;

              if (nUTXOs) {
                return Promise.resolve(_this8._registerName({
                  proxyHost: proxyHost,
                  proxyPort: proxyPort,
                  name: nameCodePoint,
                  xpubKey: xpubKey,
                  returnAddress: returnAddress,
                  addressCount: addressCount,
                  nutxo: nUTXOs
                })).then(function (psaBase64) {
                  return Promise.resolve(_this8.decodeTransaction(psaBase64, [nUTXOs], true)).then(function (_ref19) {
                    var psbt = _ref19.psbt,
                        fundingInputs = _ref19.fundingInputs,
                        ownOutputs = _ref19.ownOutputs;
                    return {
                      psbt: psbt,
                      inputs: [].concat(nUTXOs, fundingInputs),
                      ownOutputs: [{
                        type: 'nUTXO',
                        title: 'Name UTXO',
                        address: returnAddress
                      }].concat(ownOutputs)
                    };
                  });
                });
              } else {
                throw new Error("Couldn't find utxo for selected name");
              }
            });
          });
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto._registerName = function _registerName(data) {
    try {
      var proxyHost = data.proxyHost,
          proxyPort = data.proxyPort,
          name = data.name,
          xpubKey = data.xpubKey,
          nutxo = data.nutxo,
          returnAddress = data.returnAddress,
          addressCount = data.addressCount;
      var nameUtxo = [{
        txid: nutxo.outputTxHash,
        index: nutxo.outputIndex
      }, nutxo.value];
      return Promise.resolve(post('register', {
        name: name,
        xpubKey: xpubKey,
        nutxo: nameUtxo,
        return: returnAddress,
        addressCount: Number(addressCount)
      }, {
        baseURL: "http://" + proxyHost + ":" + proxyPort + "/v1"
      })).then(function (_ref20) {
        var psaBase64 = _ref20.data.tx;
        return psaBase64;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return Allpay;
}();

var allPay = /*#__PURE__*/new Allpay();

var AuthAPI = function AuthAPI() {
  this.login = function (username, password) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(post('auth', {
          username: username,
          password: password
        })).then(function (_ref) {
          var data = _ref.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

var authAPI = /*#__PURE__*/new AuthAPI();

var BlockAPI = function BlockAPI() {
  this.getBlockByBlockHeight = function (height) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("block/height/" + height)).then(function (_ref) {
          var data = _ref.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getBlocksByBlockHeights = function (heights) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("block/heights", {
          params: {
            height: heights
          },
          paramsSerializer: function paramsSerializer(params) {
            return Qs.stringify(params, {
              arrayFormat: 'repeat'
            });
          }
        })).then(function (_ref2) {
          var data = _ref2.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getBlockByBlockHash = function (blockHash) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("block/hash/" + blockHash)).then(function (_ref3) {
          var data = _ref3.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getBlocksByBlockHashes = function (blockHashes) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("block/hashes", {
          params: {
            hash: blockHashes
          },
          paramsSerializer: function paramsSerializer(params) {
            return Qs.stringify(params, {
              arrayFormat: 'repeat'
            });
          }
        })).then(function (_ref4) {
          var data = _ref4.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getTXIDByHash = function (blockHash, pagenumber, pagesize) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("block/txids/" + blockHash, {
          params: {
            pagenumber: pagenumber,
            pagesize: pagesize
          }
        })).then(function (_ref5) {
          var data = _ref5.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

var blockAPI = /*#__PURE__*/new BlockAPI();

var MerkleBranchAPI = function MerkleBranchAPI() {
  this.getMerkleBranchByTXID = function (txId) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("merklebranch/" + txId)).then(function (_ref) {
          var data = _ref.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

var merkleBranchAPI = /*#__PURE__*/new MerkleBranchAPI();

var ScriptHashAPI = function ScriptHashAPI() {
  this.getOutputsByScriptHash = function (scriptHash, pagesize) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("scripthash/" + scriptHash + "/outputs", {
          params: {
            pagesize: pagesize
          }
        })).then(function (_ref) {
          var data = _ref.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getOutputsByScriptHashes = function (scriptHashes) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("scripthashes/outputs/", {
          params: {
            scripthash: scriptHashes
          },
          paramsSerializer: function paramsSerializer(params) {
            return Qs.stringify(params, {
              arrayFormat: 'repeat'
            });
          }
        })).then(function (_ref2) {
          var data = _ref2.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getUTXOsByScriptHash = function (scriptHash, pagesize) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("scripthash/" + scriptHash + "/utxos", {
          params: {
            pagesize: pagesize
          }
        })).then(function (_ref3) {
          var data = _ref3.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getUTXOsByScriptHashes = function (scriptHashes) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("scripthashes/utxos", {
          params: {
            scripthash: scriptHashes
          },
          paramsSerializer: function paramsSerializer(params) {
            return Qs.stringify(params, {
              arrayFormat: 'repeat'
            });
          }
        })).then(function (_ref4) {
          var data = _ref4.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

var scriptHashAPI = /*#__PURE__*/new ScriptHashAPI();

var UserAPI = function UserAPI() {
  this.addUser = function (username, firstName, lastName, email) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(post('user', {
          username: username,
          firstName: firstName,
          lastName: lastName,
          email: email
        })).then(function (_ref) {
          var data = _ref.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getUser = function (username) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get("user/" + username)).then(function (_ref2) {
          var data = _ref2.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.getCurrentUser = function () {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(get('user')).then(function (_ref3) {
          var data = _ref3.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.updateUser = function (username, password, firstName, lastName, email, apiQuota, apiExpiryTime) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(put("user/" + username, {
          data: {
            password: password,
            firstName: firstName,
            lastName: lastName,
            email: email,
            apiQuota: apiQuota,
            apiExpiryTime: apiExpiryTime.getUTCDate()
          }
        })).then(function (_ref4) {
          var data = _ref4.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  this.deleteUser = function (username) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(deleteR("user/" + username)).then(function (_ref5) {
          var data = _ref5.data;
          return data;
        });
      }, function (error) {
        throw error;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

var userAPI = /*#__PURE__*/new UserAPI();

exports.addressAPI = addressAPI;
exports.allPay = allPay;
exports.allegory = Allegory$1;
exports.authAPI = authAPI;
exports.blockAPI = blockAPI;
exports.chainAPI = chainAPI;
exports.derivationPaths = derivationPaths$1;
exports.httpClient = httpClient;
exports.merkleBranchAPI = merkleBranchAPI;
exports.network = network$1;
exports.persist = Persist;
exports.scriptHashAPI = scriptHashAPI;
exports.transactionAPI = transactionAPI;
exports.userAPI = userAPI;
exports.utils = utils;
exports.wallet = wallet;
//# sourceMappingURL=nipkow-sdk.cjs.development.js.map
