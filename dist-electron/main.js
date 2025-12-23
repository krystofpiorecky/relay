import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import require$$0$1 from "http";
import require$$1$2 from "https";
import require$$1 from "util";
import url$2 from "url";
import require$$3 from "stream";
import require$$4 from "assert";
import require$$1$1 from "tty";
import require$$0 from "os";
import { promises } from "fs";
import { join } from "path";
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var httpProxy$3 = { exports: {} };
var eventemitter3 = { exports: {} };
(function(module) {
  var has = Object.prototype.hasOwnProperty, prefix = "~";
  function Events() {
  }
  if (Object.create) {
    Events.prototype = /* @__PURE__ */ Object.create(null);
    if (!new Events().__proto__) prefix = false;
  }
  function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
  }
  function addListener(emitter, event, fn, context, once) {
    if (typeof fn !== "function") {
      throw new TypeError("The listener must be a function");
    }
    var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
    if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
    else emitter._events[evt] = [emitter._events[evt], listener];
    return emitter;
  }
  function clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0) emitter._events = new Events();
    else delete emitter._events[evt];
  }
  function EventEmitter() {
    this._events = new Events();
    this._eventsCount = 0;
  }
  EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events2, name;
    if (this._eventsCount === 0) return names;
    for (name in events2 = this._events) {
      if (has.call(events2, name)) names.push(prefix ? name.slice(1) : name);
    }
    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events2));
    }
    return names;
  };
  EventEmitter.prototype.listeners = function listeners(event) {
    var evt = prefix ? prefix + event : event, handlers = this._events[evt];
    if (!handlers) return [];
    if (handlers.fn) return [handlers.fn];
    for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
      ee[i] = handlers[i].fn;
    }
    return ee;
  };
  EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = prefix ? prefix + event : event, listeners = this._events[evt];
    if (!listeners) return 0;
    if (listeners.fn) return 1;
    return listeners.length;
  };
  EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
      if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
      switch (len) {
        case 1:
          return listeners.fn.call(listeners.context), true;
        case 2:
          return listeners.fn.call(listeners.context, a1), true;
        case 3:
          return listeners.fn.call(listeners.context, a1, a2), true;
        case 4:
          return listeners.fn.call(listeners.context, a1, a2, a3), true;
        case 5:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
        case 6:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
      }
      for (i = 1, args = new Array(len - 1); i < len; i++) {
        args[i - 1] = arguments[i];
      }
      listeners.fn.apply(listeners.context, args);
    } else {
      var length = listeners.length, j;
      for (i = 0; i < length; i++) {
        if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
        switch (len) {
          case 1:
            listeners[i].fn.call(listeners[i].context);
            break;
          case 2:
            listeners[i].fn.call(listeners[i].context, a1);
            break;
          case 3:
            listeners[i].fn.call(listeners[i].context, a1, a2);
            break;
          case 4:
            listeners[i].fn.call(listeners[i].context, a1, a2, a3);
            break;
          default:
            if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
              args[j - 1] = arguments[j];
            }
            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }
    return true;
  };
  EventEmitter.prototype.on = function on(event, fn, context) {
    return addListener(this, event, fn, context, false);
  };
  EventEmitter.prototype.once = function once(event, fn, context) {
    return addListener(this, event, fn, context, true);
  };
  EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return this;
    if (!fn) {
      clearEvent(this, evt);
      return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
      if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
        clearEvent(this, evt);
      }
    } else {
      for (var i = 0, events2 = [], length = listeners.length; i < length; i++) {
        if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
          events2.push(listeners[i]);
        }
      }
      if (events2.length) this._events[evt] = events2.length === 1 ? events2[0] : events2;
      else clearEvent(this, evt);
    }
    return this;
  };
  EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
      evt = prefix ? prefix + event : event;
      if (this._events[evt]) clearEvent(this, evt);
    } else {
      this._events = new Events();
      this._eventsCount = 0;
    }
    return this;
  };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  EventEmitter.prototype.addListener = EventEmitter.prototype.on;
  EventEmitter.prefixed = prefix;
  EventEmitter.EventEmitter = EventEmitter;
  {
    module.exports = EventEmitter;
  }
})(eventemitter3);
var eventemitter3Exports = eventemitter3.exports;
var common$4 = {};
var requiresPort = function required(port, protocol) {
  protocol = protocol.split(":")[0];
  port = +port;
  if (!port) return false;
  switch (protocol) {
    case "http":
    case "ws":
      return port !== 80;
    case "https":
    case "wss":
      return port !== 443;
    case "ftp":
      return port !== 21;
    case "gopher":
      return port !== 70;
    case "file":
      return false;
  }
  return port !== 0;
};
(function(exports$1) {
  var common2 = exports$1, url2 = url$2, extend = require$$1._extend, required2 = requiresPort;
  var upgradeHeader = /(^|,)\s*upgrade\s*($|,)/i, isSSL = /^https|wss/;
  common2.isSSL = isSSL;
  common2.setupOutgoing = function(outgoing, options, req, forward) {
    outgoing.port = options[forward || "target"].port || (isSSL.test(options[forward || "target"].protocol) ? 443 : 80);
    [
      "host",
      "hostname",
      "socketPath",
      "pfx",
      "key",
      "passphrase",
      "cert",
      "ca",
      "ciphers",
      "secureProtocol"
    ].forEach(
      function(e) {
        outgoing[e] = options[forward || "target"][e];
      }
    );
    outgoing.method = options.method || req.method;
    outgoing.headers = extend({}, req.headers);
    if (options.headers) {
      extend(outgoing.headers, options.headers);
    }
    if (options.auth) {
      outgoing.auth = options.auth;
    }
    if (options.ca) {
      outgoing.ca = options.ca;
    }
    if (isSSL.test(options[forward || "target"].protocol)) {
      outgoing.rejectUnauthorized = typeof options.secure === "undefined" ? true : options.secure;
    }
    outgoing.agent = options.agent || false;
    outgoing.localAddress = options.localAddress;
    if (!outgoing.agent) {
      outgoing.headers = outgoing.headers || {};
      if (typeof outgoing.headers.connection !== "string" || !upgradeHeader.test(outgoing.headers.connection)) {
        outgoing.headers.connection = "close";
      }
    }
    var target = options[forward || "target"];
    var targetPath = target && options.prependPath !== false ? target.path || "" : "";
    var outgoingPath = !options.toProxy ? url2.parse(req.url).path || "" : req.url;
    outgoingPath = !options.ignorePath ? outgoingPath : "";
    outgoing.path = common2.urlJoin(targetPath, outgoingPath);
    if (options.changeOrigin) {
      outgoing.headers.host = required2(outgoing.port, options[forward || "target"].protocol) && !hasPort(outgoing.host) ? outgoing.host + ":" + outgoing.port : outgoing.host;
    }
    return outgoing;
  };
  common2.setupSocket = function(socket) {
    socket.setTimeout(0);
    socket.setNoDelay(true);
    socket.setKeepAlive(true, 0);
    return socket;
  };
  common2.getPort = function(req) {
    var res = req.headers.host ? req.headers.host.match(/:(\d+)/) : "";
    return res ? res[1] : common2.hasEncryptedConnection(req) ? "443" : "80";
  };
  common2.hasEncryptedConnection = function(req) {
    return Boolean(req.connection.encrypted || req.connection.pair);
  };
  common2.urlJoin = function() {
    var args = Array.prototype.slice.call(arguments), lastIndex = args.length - 1, last = args[lastIndex], lastSegs = last.split("?"), retSegs;
    args[lastIndex] = lastSegs.shift();
    retSegs = [
      args.filter(Boolean).join("/").replace(/\/+/g, "/").replace("http:/", "http://").replace("https:/", "https://")
    ];
    retSegs.push.apply(retSegs, lastSegs);
    return retSegs.join("?");
  };
  common2.rewriteCookieProperty = function rewriteCookieProperty(header, config2, property) {
    if (Array.isArray(header)) {
      return header.map(function(headerElement) {
        return rewriteCookieProperty(headerElement, config2, property);
      });
    }
    return header.replace(new RegExp("(;\\s*" + property + "=)([^;]+)", "i"), function(match, prefix, previousValue) {
      var newValue;
      if (previousValue in config2) {
        newValue = config2[previousValue];
      } else if ("*" in config2) {
        newValue = config2["*"];
      } else {
        return match;
      }
      if (newValue) {
        return prefix + newValue;
      } else {
        return "";
      }
    });
  };
  function hasPort(host) {
    return !!~host.indexOf(":");
  }
})(common$4);
var url$1 = url$2, common$3 = common$4;
var redirectRegex = /^201|30(1|2|7|8)$/;
/*!
 * Array of passes.
 *
 * A `pass` is just a function that is executed on `req, res, options`
 * so that you can easily add new checks while still keeping the base
 * flexible.
 */
var webOutgoing = {
  // <--
  /**
   * If is a HTTP 1.0 request, remove chunk headers
   *
   * @param {ClientRequest} Req Request object
   * @param {IncomingMessage} Res Response object
   * @param {proxyResponse} Res Response object from the proxy request
   *
   * @api private
   */
  removeChunked: function removeChunked(req, res, proxyRes) {
    if (req.httpVersion === "1.0") {
      delete proxyRes.headers["transfer-encoding"];
    }
  },
  /**
   * If is a HTTP 1.0 request, set the correct connection header
   * or if connection header not present, then use `keep-alive`
   *
   * @param {ClientRequest} Req Request object
   * @param {IncomingMessage} Res Response object
   * @param {proxyResponse} Res Response object from the proxy request
   *
   * @api private
   */
  setConnection: function setConnection(req, res, proxyRes) {
    if (req.httpVersion === "1.0") {
      proxyRes.headers.connection = req.headers.connection || "close";
    } else if (req.httpVersion !== "2.0" && !proxyRes.headers.connection) {
      proxyRes.headers.connection = req.headers.connection || "keep-alive";
    }
  },
  setRedirectHostRewrite: function setRedirectHostRewrite(req, res, proxyRes, options) {
    if ((options.hostRewrite || options.autoRewrite || options.protocolRewrite) && proxyRes.headers["location"] && redirectRegex.test(proxyRes.statusCode)) {
      var target = url$1.parse(options.target);
      var u = url$1.parse(proxyRes.headers["location"]);
      if (target.host != u.host) {
        return;
      }
      if (options.hostRewrite) {
        u.host = options.hostRewrite;
      } else if (options.autoRewrite) {
        u.host = req.headers["host"];
      }
      if (options.protocolRewrite) {
        u.protocol = options.protocolRewrite;
      }
      proxyRes.headers["location"] = u.format();
    }
  },
  /**
   * Copy headers from proxyResponse to response
   * set each header in response object.
   *
   * @param {ClientRequest} Req Request object
   * @param {IncomingMessage} Res Response object
   * @param {proxyResponse} Res Response object from the proxy request
   * @param {Object} Options options.cookieDomainRewrite: Config to rewrite cookie domain
   *
   * @api private
   */
  writeHeaders: function writeHeaders(req, res, proxyRes, options) {
    var rewriteCookieDomainConfig = options.cookieDomainRewrite, rewriteCookiePathConfig = options.cookiePathRewrite, preserveHeaderKeyCase = options.preserveHeaderKeyCase, rawHeaderKeyMap, setHeader = function(key2, header) {
      if (header == void 0) return;
      if (rewriteCookieDomainConfig && key2.toLowerCase() === "set-cookie") {
        header = common$3.rewriteCookieProperty(header, rewriteCookieDomainConfig, "domain");
      }
      if (rewriteCookiePathConfig && key2.toLowerCase() === "set-cookie") {
        header = common$3.rewriteCookieProperty(header, rewriteCookiePathConfig, "path");
      }
      res.setHeader(String(key2).trim(), header);
    };
    if (typeof rewriteCookieDomainConfig === "string") {
      rewriteCookieDomainConfig = { "*": rewriteCookieDomainConfig };
    }
    if (typeof rewriteCookiePathConfig === "string") {
      rewriteCookiePathConfig = { "*": rewriteCookiePathConfig };
    }
    if (preserveHeaderKeyCase && proxyRes.rawHeaders != void 0) {
      rawHeaderKeyMap = {};
      for (var i = 0; i < proxyRes.rawHeaders.length; i += 2) {
        var key = proxyRes.rawHeaders[i];
        rawHeaderKeyMap[key.toLowerCase()] = key;
      }
    }
    Object.keys(proxyRes.headers).forEach(function(key2) {
      var header = proxyRes.headers[key2];
      if (preserveHeaderKeyCase && rawHeaderKeyMap) {
        key2 = rawHeaderKeyMap[key2] || key2;
      }
      setHeader(key2, header);
    });
  },
  /**
   * Set the statusCode from the proxyResponse
   *
   * @param {ClientRequest} Req Request object
   * @param {IncomingMessage} Res Response object
   * @param {proxyResponse} Res Response object from the proxy request
   *
   * @api private
   */
  writeStatusCode: function writeStatusCode(req, res, proxyRes) {
    if (proxyRes.statusMessage) {
      res.statusCode = proxyRes.statusCode;
      res.statusMessage = proxyRes.statusMessage;
    } else {
      res.statusCode = proxyRes.statusCode;
    }
  }
};
var followRedirects$1 = { exports: {} };
var src = { exports: {} };
var browser = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return plural(ms2, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms2, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms2, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms2, msAbs, s, "second");
    }
    return ms2 + " ms";
  }
  function plural(ms2, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
  }
  return ms;
}
var common$2;
var hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon) return common$2;
  hasRequiredCommon = 1;
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = requireMs();
    createDebug.destroy = destroy2;
    Object.keys(env).forEach((key) => {
      createDebug[key] = env[key];
    });
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime;
      let enableOverride = null;
      let namespacesCache;
      let enabledCache;
      function debug2(...args) {
        if (!debug2.enabled) {
          return;
        }
        const self = debug2;
        const curr = Number(/* @__PURE__ */ new Date());
        const ms2 = curr - (prevTime || curr);
        self.diff = ms2;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
          if (match === "%%") {
            return "%";
          }
          index++;
          const formatter = createDebug.formatters[format];
          if (typeof formatter === "function") {
            const val = args[index];
            match = formatter.call(self, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self, args);
        const logFn = self.log || createDebug.log;
        logFn.apply(self, args);
      }
      debug2.namespace = namespace;
      debug2.useColors = createDebug.useColors();
      debug2.color = createDebug.selectColor(namespace);
      debug2.extend = extend;
      debug2.destroy = createDebug.destroy;
      Object.defineProperty(debug2, "enabled", {
        enumerable: true,
        configurable: false,
        get: () => {
          if (enableOverride !== null) {
            return enableOverride;
          }
          if (namespacesCache !== createDebug.namespaces) {
            namespacesCache = createDebug.namespaces;
            enabledCache = createDebug.enabled(namespace);
          }
          return enabledCache;
        },
        set: (v) => {
          enableOverride = v;
        }
      });
      if (typeof createDebug.init === "function") {
        createDebug.init(debug2);
      }
      return debug2;
    }
    function extend(namespace, delimiter) {
      const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.namespaces = namespaces;
      createDebug.names = [];
      createDebug.skips = [];
      const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const ns of split) {
        if (ns[0] === "-") {
          createDebug.skips.push(ns.slice(1));
        } else {
          createDebug.names.push(ns);
        }
      }
    }
    function matchesTemplate(search, template) {
      let searchIndex = 0;
      let templateIndex = 0;
      let starIndex = -1;
      let matchIndex = 0;
      while (searchIndex < search.length) {
        if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
          if (template[templateIndex] === "*") {
            starIndex = templateIndex;
            matchIndex = searchIndex;
            templateIndex++;
          } else {
            searchIndex++;
            templateIndex++;
          }
        } else if (starIndex !== -1) {
          templateIndex = starIndex + 1;
          matchIndex++;
          searchIndex = matchIndex;
        } else {
          return false;
        }
      }
      while (templateIndex < template.length && template[templateIndex] === "*") {
        templateIndex++;
      }
      return templateIndex === template.length;
    }
    function disable() {
      const namespaces = [
        ...createDebug.names,
        ...createDebug.skips.map((namespace) => "-" + namespace)
      ].join(",");
      createDebug.enable("");
      return namespaces;
    }
    function enabled(name) {
      for (const skip of createDebug.skips) {
        if (matchesTemplate(name, skip)) {
          return false;
        }
      }
      for (const ns of createDebug.names) {
        if (matchesTemplate(name, ns)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    function destroy2() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  common$2 = setup;
  return common$2;
}
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser.exports;
  hasRequiredBrowser = 1;
  (function(module, exports$1) {
    exports$1.formatArgs = formatArgs;
    exports$1.save = save;
    exports$1.load = load;
    exports$1.useColors = useColors;
    exports$1.storage = localstorage();
    exports$1.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports$1.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports$1.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports$1.storage.setItem("debug", namespaces);
        } else {
          exports$1.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports$1.storage.getItem("debug") || exports$1.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = requireCommon()(exports$1);
    const { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  })(browser, browser.exports);
  return browser.exports;
}
var node = { exports: {} };
var hasFlag;
var hasRequiredHasFlag;
function requireHasFlag() {
  if (hasRequiredHasFlag) return hasFlag;
  hasRequiredHasFlag = 1;
  hasFlag = (flag, argv = process.argv) => {
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf("--");
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
  };
  return hasFlag;
}
var supportsColor_1;
var hasRequiredSupportsColor;
function requireSupportsColor() {
  if (hasRequiredSupportsColor) return supportsColor_1;
  hasRequiredSupportsColor = 1;
  const os = require$$0;
  const tty = require$$1$1;
  const hasFlag2 = requireHasFlag();
  const { env } = process;
  let forceColor;
  if (hasFlag2("no-color") || hasFlag2("no-colors") || hasFlag2("color=false") || hasFlag2("color=never")) {
    forceColor = 0;
  } else if (hasFlag2("color") || hasFlag2("colors") || hasFlag2("color=true") || hasFlag2("color=always")) {
    forceColor = 1;
  }
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      forceColor = 1;
    } else if (env.FORCE_COLOR === "false") {
      forceColor = 0;
    } else {
      forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
    }
  }
  function translateLevel(level) {
    if (level === 0) {
      return false;
    }
    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3
    };
  }
  function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
      return 0;
    }
    if (hasFlag2("color=16m") || hasFlag2("color=full") || hasFlag2("color=truecolor")) {
      return 3;
    }
    if (hasFlag2("color=256")) {
      return 2;
    }
    if (haveStream && !streamIsTTY && forceColor === void 0) {
      return 0;
    }
    const min = forceColor || 0;
    if (env.TERM === "dumb") {
      return min;
    }
    if (process.platform === "win32") {
      const osRelease = os.release().split(".");
      if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2;
      }
      return 1;
    }
    if ("CI" in env) {
      if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
        return 1;
      }
      return min;
    }
    if ("TEAMCITY_VERSION" in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
      return 3;
    }
    if ("TERM_PROGRAM" in env) {
      const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (env.TERM_PROGRAM) {
        case "iTerm.app":
          return version >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
      return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
      return 1;
    }
    if ("COLORTERM" in env) {
      return 1;
    }
    return min;
  }
  function getSupportLevel(stream3) {
    const level = supportsColor(stream3, stream3 && stream3.isTTY);
    return translateLevel(level);
  }
  supportsColor_1 = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty.isatty(2)))
  };
  return supportsColor_1;
}
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node.exports;
  hasRequiredNode = 1;
  (function(module, exports$1) {
    const tty = require$$1$1;
    const util = require$$1;
    exports$1.init = init;
    exports$1.log = log;
    exports$1.formatArgs = formatArgs;
    exports$1.save = save;
    exports$1.load = load;
    exports$1.useColors = useColors;
    exports$1.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports$1.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = requireSupportsColor();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports$1.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports$1.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports$1.inspectOpts ? Boolean(exports$1.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports$1.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.formatWithOptions(exports$1.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      const keys = Object.keys(exports$1.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug2.inspectOpts[keys[i]] = exports$1.inspectOpts[keys[i]];
      }
    }
    module.exports = requireCommon()(exports$1);
    const { formatters } = module.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  })(node, node.exports);
  return node.exports;
}
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src.exports;
  hasRequiredSrc = 1;
  if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
    src.exports = requireBrowser();
  } else {
    src.exports = requireNode();
  }
  return src.exports;
}
var debug$1;
var debug_1 = function() {
  if (!debug$1) {
    try {
      debug$1 = requireSrc()("follow-redirects");
    } catch (error) {
    }
    if (typeof debug$1 !== "function") {
      debug$1 = function() {
      };
    }
  }
  debug$1.apply(null, arguments);
};
var url = url$2;
var URL$1 = url.URL;
var http$1 = require$$0$1;
var https$1 = require$$1$2;
var Writable = require$$3.Writable;
var assert = require$$4;
var debug = debug_1;
(function detectUnsupportedEnvironment() {
  var looksLikeNode = typeof process !== "undefined";
  var looksLikeBrowser = typeof window !== "undefined" && typeof document !== "undefined";
  var looksLikeV8 = isFunction(Error.captureStackTrace);
  if (!looksLikeNode && (looksLikeBrowser || !looksLikeV8)) {
    console.warn("The follow-redirects package should be excluded from browser builds.");
  }
})();
var useNativeURL = false;
try {
  assert(new URL$1(""));
} catch (error) {
  useNativeURL = error.code === "ERR_INVALID_URL";
}
var preservedUrlFields = [
  "auth",
  "host",
  "hostname",
  "href",
  "path",
  "pathname",
  "port",
  "protocol",
  "query",
  "search",
  "hash"
];
var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
var eventHandlers = /* @__PURE__ */ Object.create(null);
events.forEach(function(event) {
  eventHandlers[event] = function(arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
});
var InvalidUrlError = createErrorType(
  "ERR_INVALID_URL",
  "Invalid URL",
  TypeError
);
var RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
);
var TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded",
  RedirectionError
);
var MaxBodyLengthExceededError = createErrorType(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
);
var WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);
var destroy = Writable.prototype.destroy || noop;
function RedirectableRequest(options, responseCallback) {
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];
  if (responseCallback) {
    this.on("response", responseCallback);
  }
  var self = this;
  this._onNativeResponse = function(response) {
    try {
      self._processResponse(response);
    } catch (cause) {
      self.emit("error", cause instanceof RedirectionError ? cause : new RedirectionError({ cause }));
    }
  };
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);
RedirectableRequest.prototype.abort = function() {
  destroyRequest(this._currentRequest);
  this._currentRequest.abort();
  this.emit("abort");
};
RedirectableRequest.prototype.destroy = function(error) {
  destroyRequest(this._currentRequest, error);
  destroy.call(this, error);
  return this;
};
RedirectableRequest.prototype.write = function(data, encoding, callback) {
  if (this._ending) {
    throw new WriteAfterEndError();
  }
  if (!isString(data) && !isBuffer(data)) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }
  if (isFunction(encoding)) {
    callback = encoding;
    encoding = null;
  }
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data, encoding });
    this._currentRequest.write(data, encoding, callback);
  } else {
    this.emit("error", new MaxBodyLengthExceededError());
    this.abort();
  }
};
RedirectableRequest.prototype.end = function(data, encoding, callback) {
  if (isFunction(data)) {
    callback = data;
    data = encoding = null;
  } else if (isFunction(encoding)) {
    callback = encoding;
    encoding = null;
  }
  if (!data) {
    this._ended = this._ending = true;
    this._currentRequest.end(null, null, callback);
  } else {
    var self = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function() {
      self._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
};
RedirectableRequest.prototype.setHeader = function(name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};
RedirectableRequest.prototype.removeHeader = function(name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};
RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
  var self = this;
  function destroyOnTimeout(socket) {
    socket.setTimeout(msecs);
    socket.removeListener("timeout", socket.destroy);
    socket.addListener("timeout", socket.destroy);
  }
  function startTimer(socket) {
    if (self._timeout) {
      clearTimeout(self._timeout);
    }
    self._timeout = setTimeout(function() {
      self.emit("timeout");
      clearTimer();
    }, msecs);
    destroyOnTimeout(socket);
  }
  function clearTimer() {
    if (self._timeout) {
      clearTimeout(self._timeout);
      self._timeout = null;
    }
    self.removeListener("abort", clearTimer);
    self.removeListener("error", clearTimer);
    self.removeListener("response", clearTimer);
    self.removeListener("close", clearTimer);
    if (callback) {
      self.removeListener("timeout", callback);
    }
    if (!self.socket) {
      self._currentRequest.removeListener("socket", startTimer);
    }
  }
  if (callback) {
    this.on("timeout", callback);
  }
  if (this.socket) {
    startTimer(this.socket);
  } else {
    this._currentRequest.once("socket", startTimer);
  }
  this.on("socket", destroyOnTimeout);
  this.on("abort", clearTimer);
  this.on("error", clearTimer);
  this.on("response", clearTimer);
  this.on("close", clearTimer);
  return this;
};
[
  "flushHeaders",
  "getHeader",
  "setNoDelay",
  "setSocketKeepAlive"
].forEach(function(method) {
  RedirectableRequest.prototype[method] = function(a, b) {
    return this._currentRequest[method](a, b);
  };
});
["aborted", "connection", "socket"].forEach(function(property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function() {
      return this._currentRequest[property];
    }
  });
});
RedirectableRequest.prototype._sanitizeOptions = function(options) {
  if (!options.headers) {
    options.headers = {};
  }
  if (options.host) {
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    } else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};
RedirectableRequest.prototype._performRequest = function() {
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    throw new TypeError("Unsupported protocol " + protocol);
  }
  if (this._options.agents) {
    var scheme = protocol.slice(0, -1);
    this._options.agent = this._options.agents[scheme];
  }
  var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
  request._redirectable = this;
  for (var event of events) {
    request.on(event, eventHandlers[event]);
  }
  this._currentUrl = /^\//.test(this._options.path) ? url.format(this._options) : (
    // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path
  );
  if (this._isRedirect) {
    var i = 0;
    var self = this;
    var buffers = this._requestBodyBuffers;
    (function writeNext(error) {
      if (request === self._currentRequest) {
        if (error) {
          self.emit("error", error);
        } else if (i < buffers.length) {
          var buffer = buffers[i++];
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        } else if (self._ended) {
          request.end();
        }
      }
    })();
  }
};
RedirectableRequest.prototype._processResponse = function(response) {
  var statusCode = response.statusCode;
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode
    });
  }
  var location = response.headers.location;
  if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);
    this._requestBodyBuffers = [];
    return;
  }
  destroyRequest(this._currentRequest);
  response.destroy();
  if (++this._redirectCount > this._options.maxRedirects) {
    throw new TooManyRedirectsError();
  }
  var requestHeaders;
  var beforeRedirect = this._options.beforeRedirect;
  if (beforeRedirect) {
    requestHeaders = Object.assign({
      // The Host header was set by nativeProtocol.request
      Host: response.req.getHeader("host")
    }, this._options.headers);
  }
  var method = this._options.method;
  if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
  // the server is redirecting the user agent to a different resource […]
  // A user agent can perform a retrieval request targeting that URI
  // (a GET or HEAD request if using HTTP) […]
  statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
    this._options.method = "GET";
    this._requestBodyBuffers = [];
    removeMatchingHeaders(/^content-/i, this._options.headers);
  }
  var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
  var currentUrlParts = parseUrl(this._currentUrl);
  var currentHost = currentHostHeader || currentUrlParts.host;
  var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url.format(Object.assign(currentUrlParts, { host: currentHost }));
  var redirectUrl = resolveUrl(location, currentUrl);
  debug("redirecting to", redirectUrl.href);
  this._isRedirect = true;
  spreadUrlObject(redirectUrl, this._options);
  if (redirectUrl.protocol !== currentUrlParts.protocol && redirectUrl.protocol !== "https:" || redirectUrl.host !== currentHost && !isSubdomain(redirectUrl.host, currentHost)) {
    removeMatchingHeaders(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers);
  }
  if (isFunction(beforeRedirect)) {
    var responseDetails = {
      headers: response.headers,
      statusCode
    };
    var requestDetails = {
      url: currentUrl,
      method,
      headers: requestHeaders
    };
    beforeRedirect(this._options, responseDetails, requestDetails);
    this._sanitizeOptions(this._options);
  }
  this._performRequest();
};
function wrap(protocols) {
  var exports$1 = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024
  };
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function(scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports$1[scheme] = Object.create(nativeProtocol);
    function request(input, options, callback) {
      if (isURL(input)) {
        input = spreadUrlObject(input);
      } else if (isString(input)) {
        input = spreadUrlObject(parseUrl(input));
      } else {
        callback = options;
        options = validateUrl(input);
        input = { protocol };
      }
      if (isFunction(options)) {
        callback = options;
        options = null;
      }
      options = Object.assign({
        maxRedirects: exports$1.maxRedirects,
        maxBodyLength: exports$1.maxBodyLength
      }, input, options);
      options.nativeProtocols = nativeProtocols;
      if (!isString(options.host) && !isString(options.hostname)) {
        options.hostname = "::1";
      }
      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    }
    function get(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    }
    Object.defineProperties(wrappedProtocol, {
      request: { value: request, configurable: true, enumerable: true, writable: true },
      get: { value: get, configurable: true, enumerable: true, writable: true }
    });
  });
  return exports$1;
}
function noop() {
}
function parseUrl(input) {
  var parsed;
  if (useNativeURL) {
    parsed = new URL$1(input);
  } else {
    parsed = validateUrl(url.parse(input));
    if (!isString(parsed.protocol)) {
      throw new InvalidUrlError({ input });
    }
  }
  return parsed;
}
function resolveUrl(relative, base) {
  return useNativeURL ? new URL$1(relative, base) : parseUrl(url.resolve(base, relative));
}
function validateUrl(input) {
  if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) {
    throw new InvalidUrlError({ input: input.href || input });
  }
  if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) {
    throw new InvalidUrlError({ input: input.href || input });
  }
  return input;
}
function spreadUrlObject(urlObject, target) {
  var spread = target || {};
  for (var key of preservedUrlFields) {
    spread[key] = urlObject[key];
  }
  if (spread.hostname.startsWith("[")) {
    spread.hostname = spread.hostname.slice(1, -1);
  }
  if (spread.port !== "") {
    spread.port = Number(spread.port);
  }
  spread.path = spread.search ? spread.pathname + spread.search : spread.pathname;
  return spread;
}
function removeMatchingHeaders(regex, headers) {
  var lastValue;
  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }
  return lastValue === null || typeof lastValue === "undefined" ? void 0 : String(lastValue).trim();
}
function createErrorType(code, message, baseClass) {
  function CustomError(properties) {
    if (isFunction(Error.captureStackTrace)) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.assign(this, properties || {});
    this.code = code;
    this.message = this.cause ? message + ": " + this.cause.message : message;
  }
  CustomError.prototype = new (baseClass || Error)();
  Object.defineProperties(CustomError.prototype, {
    constructor: {
      value: CustomError,
      enumerable: false
    },
    name: {
      value: "Error [" + code + "]",
      enumerable: false
    }
  });
  return CustomError;
}
function destroyRequest(request, error) {
  for (var event of events) {
    request.removeListener(event, eventHandlers[event]);
  }
  request.on("error", noop);
  request.destroy(error);
}
function isSubdomain(subdomain, domain) {
  assert(isString(subdomain) && isString(domain));
  var dot = subdomain.length - domain.length - 1;
  return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}
function isString(value) {
  return typeof value === "string" || value instanceof String;
}
function isFunction(value) {
  return typeof value === "function";
}
function isBuffer(value) {
  return typeof value === "object" && "length" in value;
}
function isURL(value) {
  return URL$1 && value instanceof URL$1;
}
followRedirects$1.exports = wrap({ http: http$1, https: https$1 });
followRedirects$1.exports.wrap = wrap;
var followRedirectsExports = followRedirects$1.exports;
var httpNative = require$$0$1, httpsNative = require$$1$2, web_o = webOutgoing, common$1 = common$4, followRedirects = followRedirectsExports;
web_o = Object.keys(web_o).map(function(pass) {
  return web_o[pass];
});
var nativeAgents = { http: httpNative, https: httpsNative };
/*!
 * Array of passes.
 *
 * A `pass` is just a function that is executed on `req, res, options`
 * so that you can easily add new checks while still keeping the base
 * flexible.
 */
var webIncoming = {
  /**
   * Sets `content-length` to '0' if request is of DELETE type.
   *
   * @param {ClientRequest} Req Request object
   * @param {IncomingMessage} Res Response object
   * @param {Object} Options Config object passed to the proxy
   *
   * @api private
   */
  deleteLength: function deleteLength(req, res, options) {
    if ((req.method === "DELETE" || req.method === "OPTIONS") && !req.headers["content-length"]) {
      req.headers["content-length"] = "0";
      delete req.headers["transfer-encoding"];
    }
  },
  /**
   * Sets timeout in request socket if it was specified in options.
   *
   * @param {ClientRequest} Req Request object
   * @param {IncomingMessage} Res Response object
   * @param {Object} Options Config object passed to the proxy
   *
   * @api private
   */
  timeout: function timeout(req, res, options) {
    if (options.timeout) {
      req.socket.setTimeout(options.timeout);
    }
  },
  /**
   * Sets `x-forwarded-*` headers if specified in config.
   *
   * @param {ClientRequest} Req Request object
   * @param {IncomingMessage} Res Response object
   * @param {Object} Options Config object passed to the proxy
   *
   * @api private
   */
  XHeaders: function XHeaders(req, res, options) {
    if (!options.xfwd) return;
    var encrypted = req.isSpdy || common$1.hasEncryptedConnection(req);
    var values = {
      for: req.connection.remoteAddress || req.socket.remoteAddress,
      port: common$1.getPort(req),
      proto: encrypted ? "https" : "http"
    };
    ["for", "port", "proto"].forEach(function(header) {
      req.headers["x-forwarded-" + header] = (req.headers["x-forwarded-" + header] || "") + (req.headers["x-forwarded-" + header] ? "," : "") + values[header];
    });
    req.headers["x-forwarded-host"] = req.headers["x-forwarded-host"] || req.headers["host"] || "";
  },
  /**
   * Does the actual proxying. If `forward` is enabled fires up
   * a ForwardStream, same happens for ProxyStream. The request
   * just dies otherwise.
   *
   * @param {ClientRequest} Req Request object
   * @param {IncomingMessage} Res Response object
   * @param {Object} Options Config object passed to the proxy
   *
   * @api private
   */
  stream: function stream(req, res, options, _, server, clb) {
    server.emit("start", req, res, options.target || options.forward);
    var agents = options.followRedirects ? followRedirects : nativeAgents;
    var http2 = agents.http;
    var https2 = agents.https;
    if (options.forward) {
      var forwardReq = (options.forward.protocol === "https:" ? https2 : http2).request(
        common$1.setupOutgoing(options.ssl || {}, options, req, "forward")
      );
      var forwardError = createErrorHandler(forwardReq, options.forward);
      req.on("error", forwardError);
      forwardReq.on("error", forwardError);
      (options.buffer || req).pipe(forwardReq);
      if (!options.target) {
        return res.end();
      }
    }
    var proxyReq = (options.target.protocol === "https:" ? https2 : http2).request(
      common$1.setupOutgoing(options.ssl || {}, options, req)
    );
    proxyReq.on("socket", function(socket) {
      if (server && !proxyReq.getHeader("expect")) {
        server.emit("proxyReq", proxyReq, req, res, options);
      }
    });
    if (options.proxyTimeout) {
      proxyReq.setTimeout(options.proxyTimeout, function() {
        proxyReq.abort();
      });
    }
    req.on("aborted", function() {
      proxyReq.abort();
    });
    var proxyError = createErrorHandler(proxyReq, options.target);
    req.on("error", proxyError);
    proxyReq.on("error", proxyError);
    function createErrorHandler(proxyReq2, url2) {
      return function proxyError2(err) {
        if (req.socket.destroyed && err.code === "ECONNRESET") {
          server.emit("econnreset", err, req, res, url2);
          return proxyReq2.abort();
        }
        if (clb) {
          clb(err, req, res, url2);
        } else {
          server.emit("error", err, req, res, url2);
        }
      };
    }
    (options.buffer || req).pipe(proxyReq);
    proxyReq.on("response", function(proxyRes) {
      if (server) {
        server.emit("proxyRes", proxyRes, req, res);
      }
      if (!res.headersSent && !options.selfHandleResponse) {
        for (var i = 0; i < web_o.length; i++) {
          if (web_o[i](req, res, proxyRes, options)) {
            break;
          }
        }
      }
      if (!res.finished) {
        proxyRes.on("end", function() {
          if (server) server.emit("end", req, res, proxyRes);
        });
        if (!options.selfHandleResponse) proxyRes.pipe(res);
      } else {
        if (server) server.emit("end", req, res, proxyRes);
      }
    });
  }
};
var http = require$$0$1, https = require$$1$2, common = common$4;
/*!
 * Array of passes.
 *
 * A `pass` is just a function that is executed on `req, socket, options`
 * so that you can easily add new checks while still keeping the base
 * flexible.
 */
var wsIncoming = {
  /**
   * WebSocket requests must have the `GET` method and
   * the `upgrade:websocket` header
   *
   * @param {ClientRequest} Req Request object
   * @param {Socket} Websocket
   *
   * @api private
   */
  checkMethodAndHeader: function checkMethodAndHeader(req, socket) {
    if (req.method !== "GET" || !req.headers.upgrade) {
      socket.destroy();
      return true;
    }
    if (req.headers.upgrade.toLowerCase() !== "websocket") {
      socket.destroy();
      return true;
    }
  },
  /**
   * Sets `x-forwarded-*` headers if specified in config.
   *
   * @param {ClientRequest} Req Request object
   * @param {Socket} Websocket
   * @param {Object} Options Config object passed to the proxy
   *
   * @api private
   */
  XHeaders: function XHeaders2(req, socket, options) {
    if (!options.xfwd) return;
    var values = {
      for: req.connection.remoteAddress || req.socket.remoteAddress,
      port: common.getPort(req),
      proto: common.hasEncryptedConnection(req) ? "wss" : "ws"
    };
    ["for", "port", "proto"].forEach(function(header) {
      req.headers["x-forwarded-" + header] = (req.headers["x-forwarded-" + header] || "") + (req.headers["x-forwarded-" + header] ? "," : "") + values[header];
    });
  },
  /**
   * Does the actual proxying. Make the request and upgrade it
   * send the Switching Protocols request and pipe the sockets.
   *
   * @param {ClientRequest} Req Request object
   * @param {Socket} Websocket
   * @param {Object} Options Config object passed to the proxy
   *
   * @api private
   */
  stream: function stream2(req, socket, options, head, server, clb) {
    var createHttpHeader = function(line, headers) {
      return Object.keys(headers).reduce(function(head2, key) {
        var value = headers[key];
        if (!Array.isArray(value)) {
          head2.push(key + ": " + value);
          return head2;
        }
        for (var i = 0; i < value.length; i++) {
          head2.push(key + ": " + value[i]);
        }
        return head2;
      }, [line]).join("\r\n") + "\r\n\r\n";
    };
    common.setupSocket(socket);
    if (head && head.length) socket.unshift(head);
    var proxyReq = (common.isSSL.test(options.target.protocol) ? https : http).request(
      common.setupOutgoing(options.ssl || {}, options, req)
    );
    if (server) {
      server.emit("proxyReqWs", proxyReq, req, socket, options, head);
    }
    proxyReq.on("error", onOutgoingError);
    proxyReq.on("response", function(res) {
      if (!res.upgrade) {
        socket.write(createHttpHeader("HTTP/" + res.httpVersion + " " + res.statusCode + " " + res.statusMessage, res.headers));
        res.pipe(socket);
      }
    });
    proxyReq.on("upgrade", function(proxyRes, proxySocket, proxyHead) {
      proxySocket.on("error", onOutgoingError);
      proxySocket.on("end", function() {
        server.emit("close", proxyRes, proxySocket, proxyHead);
      });
      socket.on("error", function() {
        proxySocket.end();
      });
      common.setupSocket(proxySocket);
      if (proxyHead && proxyHead.length) proxySocket.unshift(proxyHead);
      socket.write(createHttpHeader("HTTP/1.1 101 Switching Protocols", proxyRes.headers));
      proxySocket.pipe(socket).pipe(proxySocket);
      server.emit("open", proxySocket);
      server.emit("proxySocket", proxySocket);
    });
    return proxyReq.end();
    function onOutgoingError(err) {
      if (clb) {
        clb(err, req, socket);
      } else {
        server.emit("error", err, req, socket);
      }
      socket.end();
    }
  }
};
(function(module) {
  var httpProxy2 = module.exports, extend = require$$1._extend, parse_url = url$2.parse, EE3 = eventemitter3Exports, http2 = require$$0$1, https2 = require$$1$2, web = webIncoming, ws = wsIncoming;
  httpProxy2.Server = ProxyServer2;
  function createRightProxy(type) {
    return function(options) {
      return function(req, res) {
        var passes = type === "ws" ? this.wsPasses : this.webPasses, args = [].slice.call(arguments), cntr = args.length - 1, head, cbl;
        if (typeof args[cntr] === "function") {
          cbl = args[cntr];
          cntr--;
        }
        var requestOptions = options;
        if (!(args[cntr] instanceof Buffer) && args[cntr] !== res) {
          requestOptions = extend({}, options);
          extend(requestOptions, args[cntr]);
          cntr--;
        }
        if (args[cntr] instanceof Buffer) {
          head = args[cntr];
        }
        ["target", "forward"].forEach(function(e) {
          if (typeof requestOptions[e] === "string")
            requestOptions[e] = parse_url(requestOptions[e]);
        });
        if (!requestOptions.target && !requestOptions.forward) {
          return this.emit("error", new Error("Must provide a proper URL as target"));
        }
        for (var i = 0; i < passes.length; i++) {
          if (passes[i](req, res, requestOptions, head, this, cbl)) {
            break;
          }
        }
      };
    };
  }
  httpProxy2.createRightProxy = createRightProxy;
  function ProxyServer2(options) {
    EE3.call(this);
    options = options || {};
    options.prependPath = options.prependPath === false ? false : true;
    this.web = this.proxyRequest = createRightProxy("web")(options);
    this.ws = this.proxyWebsocketRequest = createRightProxy("ws")(options);
    this.options = options;
    this.webPasses = Object.keys(web).map(function(pass) {
      return web[pass];
    });
    this.wsPasses = Object.keys(ws).map(function(pass) {
      return ws[pass];
    });
    this.on("error", this.onError, this);
  }
  require$$1.inherits(ProxyServer2, EE3);
  ProxyServer2.prototype.onError = function(err) {
    if (this.listeners("error").length === 1) {
      throw err;
    }
  };
  ProxyServer2.prototype.listen = function(port, hostname) {
    var self = this, closure = function(req, res) {
      self.web(req, res);
    };
    this._server = this.options.ssl ? https2.createServer(this.options.ssl, closure) : http2.createServer(closure);
    if (this.options.ws) {
      this._server.on("upgrade", function(req, socket, head) {
        self.ws(req, socket, head);
      });
    }
    this._server.listen(port, hostname);
    return this;
  };
  ProxyServer2.prototype.close = function(callback) {
    var self = this;
    if (this._server) {
      this._server.close(done);
    }
    function done() {
      self._server = null;
      if (callback) {
        callback.apply(null, arguments);
      }
    }
  };
  ProxyServer2.prototype.before = function(type, passName, callback) {
    if (type !== "ws" && type !== "web") {
      throw new Error("type must be `web` or `ws`");
    }
    var passes = type === "ws" ? this.wsPasses : this.webPasses, i = false;
    passes.forEach(function(v, idx) {
      if (v.name === passName) i = idx;
    });
    if (i === false) throw new Error("No such pass");
    passes.splice(i, 0, callback);
  };
  ProxyServer2.prototype.after = function(type, passName, callback) {
    if (type !== "ws" && type !== "web") {
      throw new Error("type must be `web` or `ws`");
    }
    var passes = type === "ws" ? this.wsPasses : this.webPasses, i = false;
    passes.forEach(function(v, idx) {
      if (v.name === passName) i = idx;
    });
    if (i === false) throw new Error("No such pass");
    passes.splice(i++, 0, callback);
  };
})(httpProxy$3);
var httpProxyExports = httpProxy$3.exports;
var ProxyServer = httpProxyExports.Server;
function createProxyServer(options) {
  return new ProxyServer(options);
}
ProxyServer.createProxyServer = createProxyServer;
ProxyServer.createServer = createProxyServer;
ProxyServer.createProxy = createProxyServer;
var httpProxy$2 = ProxyServer;
/*!
 * Caron dimonio, con occhi di bragia
 * loro accennando, tutte le raccoglie;
 * batte col remo qualunque s’adagia 
 *
 * Charon the demon, with the eyes of glede,
 * Beckoning to them, collects them all together,
 * Beats with his oar whoever lags behind
 *          
 *          Dante - The Divine Comedy (Canto III)
 */
var httpProxy = httpProxy$2;
const httpProxy$1 = /* @__PURE__ */ getDefaultExportFromCjs(httpProxy);
const globToRegex = (pattern) => {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  const regex = "^" + escaped.replace(/\*/g, ".*") + "$";
  return new RegExp(regex);
};
const objectEntries = (obj) => Object.entries(obj);
const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
function deepMerge(original, overwrite) {
  for (const key in overwrite) {
    const newValue = overwrite[key];
    const oldValue = original[key];
    if (isObject(newValue) && isObject(oldValue)) {
      deepMerge(oldValue, newValue);
    } else {
      original[key] = newValue;
    }
  }
  return original;
}
const config = { "default": { "target": "skinsearch.dev", "cache": { "write": true, "read": false } }, "main": { "port": 9991, "log": true, "endpoints": [{ "paths": "/feed, /api/feed, /api/ac", "cache": false }, { "paths": "/api/item/*", "cache": { "read": false } }, { "paths": "/api/inventory/" }] }, "s3": { "target": "s3.skinsearch.com", "port": 9992, "cache": false }, "status": { "prefix": "status", "port": 9993 }, "watchlist": { "prefix": "watchlist", "port": 9994, "log": true } };
const defaultConfig = {
  target: "skinsearch.dev",
  delay: 0,
  log: false,
  cache: {
    write: false,
    read: false
  }
};
const defaultPort = 9991;
const getSetupConfig = () => {
  var _a;
  if (!config)
    return {
      loginTarget: defaultConfig.target,
      instances: []
    };
  let c = defaultConfig;
  if (config.default)
    c = deepMerge(c, config.default);
  let port = defaultPort;
  const instances = objectEntries(config).filter(([key]) => key !== "default");
  const interpretedInstances = instances.map(([key, value]) => ({
    key,
    target: value.target ? value.target : value.prefix ? `${value.prefix}.${c.target}` : c.target,
    port: value.port ?? port++,
    log: value.log ?? c.log
  }));
  return {
    loginTarget: ((_a = interpretedInstances.find((i) => i.key === "main")) == null ? void 0 : _a.target) ?? defaultConfig.target,
    instances: interpretedInstances
  };
};
const getConfig = (instanceKey, path2) => {
  if (!config)
    return defaultConfig;
  let c = JSON.parse(JSON.stringify(defaultConfig));
  if (config.default)
    c = deepMerge(c, config.default);
  if (!path2)
    return c;
  const { port, endpoints, ...instanceConfig } = config[instanceKey];
  c = deepMerge(c, instanceConfig);
  if (endpoints) {
    const matches = endpoints.filter((item) => {
      const paths = item.paths.split(", ");
      return paths.includes(path2) || !!paths.find((p) => {
        return globToRegex(p).test(path2);
      });
    });
    for (const match of matches) {
      const interpretedConfig = interpretConfig(match);
      c = deepMerge(c, interpretedConfig);
    }
  }
  return c;
};
const interpretCacheConfig = (config2) => {
  if (!config2)
    return {};
  if (typeof config2 === "boolean")
    return { write: config2, read: config2 };
  return config2;
};
const interpretConfig = (config2) => {
  const {
    cache,
    paths,
    ...other
  } = config2;
  return {
    cache: interpretCacheConfig(cache),
    ...other
  };
};
const ALL_HTTP_METHODS = "GET, POST, PUT, DELETE, OPTIONS, HEAD";
const setFullHeaders = (req, res) => {
  res.setHeader("Access-Control-Expose-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "3600");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", req.headers["access-control-request-method"] || "GET");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Request-Method", "POST");
  res.setHeader("Allow", ALL_HTTP_METHODS);
  res.setHeader("Allowed", ALL_HTTP_METHODS);
  if (req.headers.origin)
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
};
const setCookieHeaders = (cookies, proxyRes, res) => {
  console.log(proxyRes.headers["set-cookie"]);
  const headers = cookies.map((cookie) => {
    const parts = [
      `${cookie.name}=${cookie.value}`,
      `Path=/`,
      cookie.httpOnly ? "HttpOnly" : null,
      "Secure",
      cookie.expires ? `Expires=${new Date(cookie.expires * 1e3).toUTCString()}` : null,
      "SameSite=None"
    ].filter(Boolean);
    return parts.join("; ");
  });
  res.setHeader("Set-Cookie", headers);
};
const setResponseHeaders = (proxyRes, req, res) => {
  delete proxyRes.headers["access-control-allow-origin"];
  delete proxyRes.headers["access-control-allow-credentials"];
  delete proxyRes.headers["access-control-allow-methods"];
  delete proxyRes.headers["access-control-allow-headers"];
  if (req.headers["access-control-request-method"])
    res.setHeader("access-control-allow-methods", req.headers["access-control-request-method"]);
  if (req.headers["access-control-request-headers"])
    res.setHeader("access-control-allow-headers", req.headers["access-control-request-headers"]);
  if (req.headers.origin) {
    res.setHeader("access-control-allow-origin", req.headers.origin);
    res.setHeader("access-control-allow-credentials", "true");
  }
};
const copyHeaders = (proxyRes, res) => {
  Object.entries(proxyRes.headers).forEach(([key, value]) => {
    if (key.toLowerCase() === "content-length") return;
    res.setHeader(key, value);
  });
};
const handleOptions = (req, res) => {
  const method = String(req.method || "").toUpperCase();
  if (method !== "OPTIONS")
    return false;
  setFullHeaders(req, res);
  res.setHeader("Content-Length", "0");
  res.writeHead(200);
  res.end();
  return true;
};
const handleRedirect = (instance, req, res) => {
  if (instance.key !== "main")
    return false;
  const requestUrl = url$2.parse(req.url || "", true).pathname;
  if (requestUrl === "/api/r") {
    const targetUrl = url$2.parse(req.url || "", true).query.url;
    res.writeHead(302, { Location: targetUrl });
    res.end();
    return true;
  }
  return false;
};
const readJSON = async (filepath) => {
  try {
    const data = await promises.readFile(filepath, "utf-8");
    return safeParse(data);
  } catch (e) {
    return null;
  }
};
const safeParse = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};
const cacheDir = join(process.cwd(), "remote", "proxy", "cache");
const cachePath = (instanceKey, url2) => {
  let parts = url2.split("/").filter((x) => !!x).map((x) => encodeURIComponent(x));
  if (parts.length === 0)
    parts = ["__index"];
  return join(
    cacheDir,
    instanceKey,
    parts.join("/") + ".json"
  );
};
const handleCacheRead = async (instance, config2, req, res) => {
  if (!config2.cache.read)
    return false;
  const requestUrl = url$2.parse(req.url || "", true).pathname;
  const data = await readJSON(cachePath(instance.key, requestUrl));
  if (!data)
    return false;
  setFullHeaders(req, res);
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(JSON.stringify(data));
  return true;
};
const collectResponse = (proxyRes, req, res, callback, redirectCallback, nonJsonCallback) => {
  const status = proxyRes.statusCode ?? 200;
  if ([301, 302, 307, 308].includes(status)) {
    setFullHeaders(req, res);
    res.writeHead(status, proxyRes.headers);
    res.end();
    redirectCallback(proxyRes, req);
    return;
  }
  const chunks = [];
  proxyRes.on("data", (chunk) => chunks.push(chunk));
  proxyRes.on("end", async () => {
    const contentType = proxyRes.headers["content-type"] || "";
    if (!contentType.includes("application/json")) {
      copyHeaders(proxyRes, res);
      setResponseHeaders(proxyRes, req, res);
      res.writeHead(proxyRes.statusCode ?? 200);
      res.end(Buffer.concat(chunks));
      nonJsonCallback(proxyRes, req);
      return;
    }
    const content = Buffer.concat(chunks).toString("utf8");
    callback(safeParse(content));
  });
};
const CONFIG = getSetupConfig();
const REQUEST_LIST = [];
const COOKIES = [{
  "name": "cf_clearance",
  "value": "NeHtWi8OumdFncpPWjEfs3IrhTfSNEl1s6M_dLMZCps-1760533096-1.2.1.1-2.8i97vJ3yIi0BabnfudDj6aJdoECsnTigMjnMs73_ayHCHmmqvvo6uPxMe.guotlhIn1ASkb.d02GblJc4ORHN1YaEADuPjHbfK_0O50H.WfVmBCPBcT_3v7Qem4N29XAAS5LegrqvLyebagT5U7Bu.6nIDpnbKrTu0tqwU61zvKgA_XWlsc9NKUEwWPmRlpXZ3xYHo_CXDbmdbcQ8AhcJiRhHpozDO6v0uiAYbbc8",
  "domain": ".skinsearch.com",
  "path": "/",
  "httpOnly": true,
  "secure": true,
  "sameSite": "None",
  "expires": 1792069097565749e-6
}, {
  "name": "identity",
  "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNzY1NjExOTgwOTk0NTI2OTUifSwiaXNzIjoic2tpbnNlYXJjaCIsInN1YiI6ImlkZW50aXR5In0.1GUmVVlxxS4u9--R1pzf-om9cb9q9Mgi7mnjWIwmr74",
  "domain": "skinsearch.com",
  "path": "/",
  "httpOnly": true,
  "secure": true,
  "expires": 1766927315920051e-6
}, {
  "name": "content",
  "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImF2YXRhciI6IjlmMjYzODhlMmUyNTQyNTRhMmMyMGI4YzRlZTA1YzBlYmUyY2VhNzEiLCJpZCI6Ijc2NTYxMTk4MDk5NDUyNjk1IiwibmFtZSI6InZ5aGxlZGF2YW0gZG9taW5hbnRuaSB6ZW55In0sImlzcyI6InNraW5zZWFyY2giLCJzdWIiOiJjb250ZW50In0.KTjR_z2rhFbwaL5-xu-3M9O1QTuRSZoGOoqfbWRDycM",
  "domain": "skinsearch.com",
  "path": "/",
  "httpOnly": false,
  "secure": true,
  "expires": 1766927315920097e-6
}, {
  "name": "discord",
  "value": "eyJpZCI6IjM5MzgwNTU3MjcxOTUwOTUyNSIsInVzZXJuYW1lIjoic2h0b29vZmkiLCJhdmF0YXIiOiJiYWI4N2Q2Nzc3N2U2N2QxZDAxNmM4N2I3YWQ5NzRkOCIsImFwcF9hZGRlZCI6dHJ1ZX0",
  "domain": "skinsearch.com",
  "path": "/",
  "httpOnly": false,
  "secure": true,
  "expires": 1766927315920097e-6
}];
let activeCookies = COOKIES.map((c) => c.name);
const setActiveCookies = (v) => activeCookies = v;
const getActiveCookies = () => COOKIES.map((c) => ({ ...c, active: activeCookies.includes(c.name) }));
const proxy = async (feed) => {
  const updateFeed = () => feed(REQUEST_LIST.map(({ req, res, ...item }) => item));
  for (const instance of CONFIG.instances) {
    console.log(`Launching proxy ${instance.target}::${instance.port}`);
    const proxy2 = httpProxy$1.createProxyServer({
      target: "https://" + instance.target,
      agent: require$$1$2.globalAgent,
      headers: {
        host: new URL("https://" + instance.target).host
      }
    });
    require$$0$1.createServer(async (req, res) => {
      if (handleOptions(req, res)) return;
      if (handleRedirect(instance, req, res)) return;
      const requestUrl = url$2.parse(req.url || "", true).pathname;
      const feedItem = {
        proxy: {
          name: instance.key,
          icon: "mingcute:cat-fill"
        },
        url: {
          pathname: url$2.parse(req.url || "", true).pathname,
          search: url$2.parse(req.url || "", true).search
        },
        configs: 4,
        request: {
          timestamp: Date.now()
        },
        req,
        res
      };
      REQUEST_LIST.push(feedItem);
      updateFeed();
      const config2 = getConfig(instance.key, requestUrl);
      if (config2.delay > 0)
        await new Promise((r) => setTimeout(r, config2.delay));
      if (instance.log) {
        console.log(`[${instance.key} > ${requestUrl}] ${config2.cache.read ? "CACHE-R" : ""}`);
      }
      if (await handleCacheRead(instance, config2, req, res)) {
        return;
      }
      proxy2.web(req, res, { selfHandleResponse: true });
    }).listen(instance.port);
    proxy2.on("proxyReq", (proxyReq, req) => {
      const target = "https://" + instance.target;
      proxyReq.setHeader("origin", target);
      proxyReq.setHeader("referer", target);
      proxyReq.removeHeader("accept-encoding");
      const feedItem = REQUEST_LIST.find((item) => item.req === req);
      if (feedItem) {
        feedItem.proxyResponse = {
          timestamp: Date.now()
        };
        updateFeed();
      } else {
        console.log("proxyReq, no request item found");
      }
    });
    proxy2.on("proxyRes", (proxyRes, req, res) => collectResponse(
      proxyRes,
      req,
      res,
      async (data) => {
        const requestUrl = url$2.parse(req.url || "", true).pathname;
        const config2 = getConfig(instance.key, requestUrl);
        const feedItem = REQUEST_LIST.find((item) => item.req === req);
        if (feedItem) {
          feedItem.proxyResponse = {
            timestamp: Date.now(),
            status: proxyRes.statusCode ?? 600,
            size: 1
          };
          updateFeed();
        } else {
          console.log("no request item found");
        }
        if (instance.log) {
          console.log(`[${instance.key} < ${requestUrl}] ${config2.cache.write ? "CACHE-W" : ""}`);
        }
        const sendBody = JSON.stringify(data);
        copyHeaders(proxyRes, res);
        setResponseHeaders(proxyRes, req, res);
        setCookieHeaders(COOKIES.filter((c) => activeCookies.includes(c.name)), proxyRes, res);
        res.setHeader("content-length", Buffer.byteLength(sendBody));
        res.writeHead(proxyRes.statusCode ?? 200);
        res.end(sendBody);
        if (feedItem) {
          feedItem.response = {
            timestamp: Date.now(),
            status: proxyRes.statusCode ?? 600,
            size: 1
          };
          updateFeed();
        } else {
          console.log("no request item found");
        }
      },
      async (proxyRes2, req2) => {
        const feedItem = REQUEST_LIST.find((item) => item.req === req2);
        if (feedItem) {
          feedItem.proxyResponse = {
            timestamp: Date.now(),
            status: proxyRes2.statusCode ?? 600,
            size: 1
          };
          feedItem.response = {
            timestamp: Date.now(),
            status: proxyRes2.statusCode ?? 600,
            size: 1
          };
          updateFeed();
        }
      },
      async (proxyRes2, req2) => {
        const feedItem = REQUEST_LIST.find((item) => item.req === req2);
        if (feedItem) {
          feedItem.proxyResponse = {
            timestamp: Date.now(),
            status: proxyRes2.statusCode ?? 600,
            size: 1
          };
          feedItem.response = {
            timestamp: Date.now(),
            status: proxyRes2.statusCode ?? 600,
            size: 1
          };
          updateFeed();
        }
      }
    ));
  }
};
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    transparent: true,
    titleBarStyle: "hidden",
    icon: path.join(process.env.VITE_PUBLIC, "transparent-logo.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.on("maximize", () => {
    win == null ? void 0 : win.setResizable(true);
    win == null ? void 0 : win.webContents.send("window:isMaximized", true);
  });
  win.on("unmaximize", () => {
    win == null ? void 0 : win.setResizable(true);
    win == null ? void 0 : win.webContents.send("window:isMaximized", false);
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.on("window:minimize", () => {
  win == null ? void 0 : win.minimize();
});
ipcMain.on("window:maximize", () => {
  win == null ? void 0 : win.maximize();
});
ipcMain.on("window:unmaximize", () => {
  if (win == null ? void 0 : win.isFullScreen()) win == null ? void 0 : win.setFullScreen(false);
  else if (win == null ? void 0 : win.isMaximized()) win == null ? void 0 : win.unmaximize();
  else win == null ? void 0 : win.restore();
});
ipcMain.on("window:close", () => {
  win == null ? void 0 : win.close();
});
ipcMain.handle("window:isMaximized", () => {
  return win == null ? void 0 : win.isMaximized();
});
ipcMain.handle("cookies:list", () => {
  return getActiveCookies();
});
ipcMain.on("cookies:set", (_, data) => {
  setActiveCookies(data);
  win == null ? void 0 : win.webContents.send("cookies:list", getActiveCookies());
});
app.whenReady().then(createWindow);
ipcMain.handle("proxy:feed", () => {
  return [];
});
proxy((data) => win == null ? void 0 : win.webContents.send("proxy:feed", data));
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
