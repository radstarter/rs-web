var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/netlify/entry.js
__export(exports, {
  handler: () => handler
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset2 = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset2);
      offset2 += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object2) {
    return object2 && typeof object2 === "object" && typeof object2.stream === "function" && object2.stream.length === 0 && typeof object2.constructor === "function" && /^(Blob|File)$/.test(object2[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object2) => {
  return typeof object2 === "object" && typeof object2.append === "function" && typeof object2.delete === "function" && typeof object2.get === "function" && typeof object2.getAll === "function" && typeof object2.has === "function" && typeof object2.set === "function" && typeof object2.sort === "function" && object2[NAME] === "URLSearchParams";
};
var isBlob = (object2) => {
  return typeof object2 === "object" && typeof object2.arrayBuffer === "function" && typeof object2.type === "string" && typeof object2.stream === "function" && typeof object2.constructor === "function" && /^(Blob|File)$/.test(object2[NAME]);
};
function isFormData(object2) {
  return typeof object2 === "object" && typeof object2.append === "function" && typeof object2.set === "function" && typeof object2.get === "function" && typeof object2.getAll === "function" && typeof object2.delete === "function" && typeof object2.keys === "function" && typeof object2.values === "function" && typeof object2.entries === "function" && typeof object2.constructor === "function" && object2[NAME] === "FormData";
}
var isAbortSignal = (object2) => {
  return typeof object2 === "object" && object2[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error2;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array2) => {
    if (index2 % 2 === 0) {
      result.push(array2.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object2) => {
  return typeof object2 === "object" && typeof object2[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// .svelte-kit/output/server/app.js
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error$1(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler2 = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler2) {
    return;
  }
  const params = route.params(match);
  const response = await handler2({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error$1(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error$1(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop$1() {
}
function safe_not_equal$1(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue$1 = [];
function writable$1(value, start = noop$1) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal$1(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue$1.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue$1.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue$1.length; i += 2) {
            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
          }
          subscriber_queue$1.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop$1;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable$1($session);
    const props = {
      stores: {
        page: writable$1(null),
        navigating: writable$1(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page && page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page && page.path)},
						query: new URLSearchParams(${page ? s$1(page.query.toString()) : ""}),
						params: ${page && s$1(page.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize$1(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  const page_proxy = new Proxy(page, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape$1(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize$1(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped$2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape$1(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path2) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path2);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path2.slice(path_match[0].length).split("/") : path2.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            });
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    });
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map2 = new Map();
  return {
    append(key, value) {
      if (map2.has(key)) {
        (map2.get(key) || []).push(value);
      } else {
        map2.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map2)
  };
}
var ReadOnlyFormData = class {
  constructor(map2) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map2);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path2 = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path2 + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(request2.path);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function compute_rest_props(props, keys) {
  const rest = {};
  keys = new Set(keys);
  for (const k in props)
    if (!keys.has(k) && k[0] !== "$")
      rest[k] = props[k];
  return rest;
}
function compute_slots(slots) {
  const result = {};
  for (const key in slots) {
    result[key] = true;
  }
  return result;
}
function listen(node, event, handler2, options2) {
  node.addEventListener(event, handler2, options2);
  return () => node.removeEventListener(event, handler2, options2);
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    callbacks.slice().forEach((fn) => fn.call(this, event));
  }
}
Promise.resolve();
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function spread(args, classes_to_add) {
  const attributes = Object.assign({}, ...args);
  if (classes_to_add) {
    if (attributes.class == null) {
      attributes.class = classes_to_add;
    } else {
      attributes.class += " " + classes_to_add;
    }
  }
  let str = "";
  Object.keys(attributes).forEach((name) => {
    if (invalid_attribute_name_character.test(name))
      return;
    const value = attributes[name];
    if (value === true)
      str += " " + name;
    else if (boolean_attributes.has(name.toLowerCase())) {
      if (value)
        str += " " + name;
    } else if (value != null) {
      str += ` ${name}="${value}"`;
    }
  });
  return str;
}
var escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function escape_attribute_value(value) {
  return typeof value === "string" ? escape(value) : value;
}
function escape_object(obj) {
  const result = {};
  for (const key in obj) {
    result[key] = escape_attribute_value(obj[key]);
  }
  return result;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var css$7 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$7);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-0bf24fd1.js",
      css: [assets + "/_app/assets/start-61d1577b.css", assets + "/_app/assets/vendor-2a24d4dd.css"],
      js: [assets + "/_app/start-0bf24fd1.js", assets + "/_app/chunks/vendor-eebe8c25.js", assets + "/_app/chunks/preload-helper-ec9aa979.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var empty = () => ({});
var manifest = {
  assets: [{ "file": "favicon.png", "size": 1571, "type": "image/png" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/apply\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/apply.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/learn\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/learn.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/apply.svelte": () => Promise.resolve().then(function() {
    return apply;
  }),
  "src/routes/learn.svelte": () => Promise.resolve().then(function() {
    return learn;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-e716f165.js", "css": ["assets/pages/__layout.svelte-4a5309c7.css", "assets/vendor-2a24d4dd.css"], "js": ["pages/__layout.svelte-e716f165.js", "chunks/vendor-eebe8c25.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-b02060e8.js", "css": ["assets/vendor-2a24d4dd.css"], "js": ["error.svelte-b02060e8.js", "chunks/vendor-eebe8c25.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-b6a626e1.js", "css": ["assets/vendor-2a24d4dd.css"], "js": ["pages/index.svelte-b6a626e1.js", "chunks/vendor-eebe8c25.js"], "styles": [] }, "src/routes/apply.svelte": { "entry": "pages/apply.svelte-95e38d08.js", "css": ["assets/pages/apply.svelte-405a57be.css", "assets/vendor-2a24d4dd.css"], "js": ["pages/apply.svelte-95e38d08.js", "chunks/vendor-eebe8c25.js", "chunks/preload-helper-ec9aa979.js"], "styles": [] }, "src/routes/learn.svelte": { "entry": "pages/learn.svelte-44f442be.js", "css": ["assets/vendor-2a24d4dd.css"], "js": ["pages/learn.svelte-44f442be.js", "chunks/vendor-eebe8c25.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
function getEventsAction() {
  const component = get_current_component();
  return (node) => {
    const events = Object.keys(component.$$.callbacks);
    const listeners = [];
    events.forEach((event) => listeners.push(listen(node, event, (e) => bubble(component, e))));
    return {
      destroy: () => {
        listeners.forEach((listener) => listener());
      }
    };
  };
}
var Container = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  getEventsAction();
  return `<div${spread([escape_object($$restProps)], "container")}>${slots.default ? slots.default({}) : ``}</div>`;
});
var css$6 = {
  code: "nav.svelte-a8gbht{width:100%;flex-direction:row}.nav-left{justify-content:flex-start\n	}.nav-right{justify-content:flex-end\n	}",
  map: `{"version":3,"file":"Nav.svelte","sources":["Nav.svelte"],"sourcesContent":["<script>\\n\\timport {getEventsAction} from './utils';\\n\\n\\tconst events = getEventsAction();\\n<\/script>\\n\\n<nav class:nav={1} use:events {...$$restProps}>\\n{#if $$slots.left}\\n\\t<div class=\\"nav-left\\">\\n\\t\\t<slot name=\\"left\\"></slot>\\n\\t</div>\\n{/if}\\n{#if $$slots.center}\\n\\t<div class=\\"nav-center\\">\\n\\t\\t<slot name=\\"center\\"></slot>\\n\\t</div>\\n{/if}\\n{#if $$slots.right}\\n\\t<div class=\\"nav-right\\">\\n\\t\\t<slot name=\\"right\\"></slot>\\n\\t</div>\\n{/if}\\n</nav>\\n\\n<style>\\n\\tnav{\\n\\t\\twidth:100%;\\n\\t\\tflex-direction: row;\\n\\t}\\n\\n\\t:global(.nav-left) {\\n\\t\\tjustify-content: flex-start\\n\\t}\\n\\t:global(.nav-right) {\\n\\t\\tjustify-content: flex-end\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAyBC,iBAAG,CAAC,AACH,MAAM,IAAI,CACV,cAAc,CAAE,GAAG,AACpB,CAAC,AAEO,SAAS,AAAE,CAAC,AACnB,eAAe,CAAE,UAAU;CAC5B,CAAC,AACO,UAAU,AAAE,CAAC,AACpB,eAAe,CAAE,QAAQ;CAC1B,CAAC"}`
};
var Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  let $$slots = compute_slots(slots);
  getEventsAction();
  $$result.css.add(css$6);
  return `<nav${spread([escape_object($$restProps)], "nav svelte-a8gbht")}>${$$slots.left ? `<div class="${"nav-left"}">${slots.left ? slots.left({}) : ``}</div>` : ``}
${$$slots.center ? `<div class="${"nav-center"}">${slots.center ? slots.center({}) : ``}</div>` : ``}
${$$slots.right ? `<div class="${"nav-right"}">${slots.right ? slots.right({}) : ``}</div>` : ``}
</nav>`;
});
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
var Tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["active", "full"]);
  let $active_tab, $$unsubscribe_active_tab;
  let { active = 0 } = $$props;
  let { full = false } = $$props;
  getEventsAction();
  const active_tab = writable(active);
  $$unsubscribe_active_tab = subscribe(active_tab, (value) => $active_tab = value);
  let num = 0;
  setContext("tabs:getid", () => num++);
  setContext("tabs:active", active_tab);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.full === void 0 && $$bindings.full && full !== void 0)
    $$bindings.full(full);
  active = $active_tab;
  $$unsubscribe_active_tab();
  return `<nav${spread([escape_object($$restProps)], "tabs " + (full ? "is-full" : ""))}>${slots.default ? slots.default({}) : ``}</nav>`;
});
var css$5 = {
  code: "span.svelte-3bldsl{padding:1rem 2rem;flex:0 1 auto;color:var(--color-darkGrey);border-bottom:2px solid var(--color-lightGrey);text-align:center;cursor:pointer}span.active.svelte-3bldsl{opacity:1;border-bottom:2px solid var(--color-darkGrey);border-color:var(--color-primary)}.tabs.is-full span.svelte-3bldsl{flex:1 1 auto}",
  map: `{"version":3,"file":"Tab.svelte","sources":["Tab.svelte"],"sourcesContent":["<script>\\n  import { getEventsAction } from './utils';\\n  import { getContext } from 'svelte';\\n  \\n  export let tabid = false;\\n\\n  const events = getEventsAction();\\n\\n  const active_tab = getContext('tabs:active');\\n  const id = getContext('tabs:getid')();\\n\\n  $: active = ($active_tab === tabid || $active_tab === id);\\n<\/script>\\n\\n<span class:active use:events {...$$restProps} on:click|preventDefault={()=>active_tab.set( (tabid === false) ? id : tabid)}>\\n  <slot></slot>\\n</span>\\n\\n<style>\\n  span {\\n      padding: 1rem 2rem;\\n      flex: 0 1 auto;\\n      color: var(--color-darkGrey);\\n      border-bottom: 2px solid var(--color-lightGrey);\\n      text-align: center;\\n      cursor: pointer;\\n  }\\n\\n  span.active {\\n      opacity: 1;\\n      border-bottom: 2px solid var(--color-darkGrey);\\n      border-color: var(--color-primary);\\n  }\\n\\n\\n  :global(.tabs.is-full) span {\\n      flex: 1 1 auto;\\n  }\\n</style>"],"names":[],"mappings":"AAmBE,IAAI,cAAC,CAAC,AACF,OAAO,CAAE,IAAI,CAAC,IAAI,CAClB,IAAI,CAAE,CAAC,CAAC,CAAC,CAAC,IAAI,CACd,KAAK,CAAE,IAAI,gBAAgB,CAAC,CAC5B,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,iBAAiB,CAAC,CAC/C,UAAU,CAAE,MAAM,CAClB,MAAM,CAAE,OAAO,AACnB,CAAC,AAED,IAAI,OAAO,cAAC,CAAC,AACT,OAAO,CAAE,CAAC,CACV,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,gBAAgB,CAAC,CAC9C,YAAY,CAAE,IAAI,eAAe,CAAC,AACtC,CAAC,AAGO,aAAa,AAAC,CAAC,IAAI,cAAC,CAAC,AACzB,IAAI,CAAE,CAAC,CAAC,CAAC,CAAC,IAAI,AAClB,CAAC"}`
};
var Tab = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let active;
  let $$restProps = compute_rest_props($$props, ["tabid"]);
  let $active_tab, $$unsubscribe_active_tab;
  let { tabid = false } = $$props;
  getEventsAction();
  const active_tab = getContext("tabs:active");
  $$unsubscribe_active_tab = subscribe(active_tab, (value) => $active_tab = value);
  const id = getContext("tabs:getid")();
  if ($$props.tabid === void 0 && $$bindings.tabid && tabid !== void 0)
    $$bindings.tabid(tabid);
  $$result.css.add(css$5);
  active = $active_tab === tabid || $active_tab === id;
  $$unsubscribe_active_tab();
  return `<span${spread([escape_object($$restProps)], (active ? "active" : "") + " svelte-3bldsl")}>${slots.default ? slots.default({}) : ``}
</span>`;
});
var Nav_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Nav, "Nav").$$render($$result, {}, {}, {
    right: () => `<a href="${"/learn"}">Learn</a>
    <a href="${"/governance"}">Governance</a>
    <a href="${"/apply"}">Apply</a>
    <a href="${"/community"}">Community</a>
  `,
    left: () => `<a slot="${"left"}" href="${"/"}">LOGO</a>`
  })}`;
});
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Nav_1, "Nav").$$render($$result, {}, {}, {})}
${slots.default ? slots.default({}) : ``}`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error2 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
});
var error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>RadPad - The Radix Launchpad</title>`, ""}`, ""}
${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => `<div class="${"intro-main"}"><h1>The Radix Launchpad</h1>
    <p>RadPad is leveraging swarm knowledge, to bring
      you the best investment opportunities on Radix.
      We do raises and incubate new projects with the collective.
    </p></div>
  <label>Get notified about the release</label>
  <input type="${"email"}" placeholder="${"email"}">
  <button>Join</button>
  <h3>Featured Ventures</h3>`
  })}`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
function ascending(a, b) {
  return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
function bisector(f) {
  let delta = f;
  let compare1 = f;
  let compare2 = f;
  if (f.length === 1) {
    delta = (d, x2) => f(d) - x2;
    compare1 = ascending;
    compare2 = (d, x2) => ascending(f(d), x2);
  }
  function left(a, x2, lo = 0, hi = a.length) {
    if (lo < hi) {
      if (compare1(x2, x2) !== 0)
        return hi;
      do {
        const mid = lo + hi >>> 1;
        if (compare2(a[mid], x2) < 0)
          lo = mid + 1;
        else
          hi = mid;
      } while (lo < hi);
    }
    return lo;
  }
  function right(a, x2, lo = 0, hi = a.length) {
    if (lo < hi) {
      if (compare1(x2, x2) !== 0)
        return hi;
      do {
        const mid = lo + hi >>> 1;
        if (compare2(a[mid], x2) <= 0)
          lo = mid + 1;
        else
          hi = mid;
      } while (lo < hi);
    }
    return lo;
  }
  function center(a, x2, lo = 0, hi = a.length) {
    const i = left(a, x2, lo, hi - 1);
    return i > lo && delta(a[i - 1], x2) > -delta(a[i], x2) ? i - 1 : i;
  }
  return { left, center, right };
}
function number$1(x2) {
  return x2 === null ? NaN : +x2;
}
var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;
bisector(number$1).center;
var bisect = bisectRight;
var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);
function ticks(start, stop, count) {
  var reverse, i = -1, n, ticks2, step;
  stop = +stop, start = +start, count = +count;
  if (start === stop && count > 0)
    return [start];
  if (reverse = stop < start)
    n = start, start = stop, stop = n;
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step))
    return [];
  if (step > 0) {
    let r0 = Math.round(start / step), r1 = Math.round(stop / step);
    if (r0 * step < start)
      ++r0;
    if (r1 * step > stop)
      --r1;
    ticks2 = new Array(n = r1 - r0 + 1);
    while (++i < n)
      ticks2[i] = (r0 + i) * step;
  } else {
    step = -step;
    let r0 = Math.round(start * step), r1 = Math.round(stop * step);
    if (r0 / step < start)
      ++r0;
    if (r1 / step > stop)
      --r1;
    ticks2 = new Array(n = r1 - r0 + 1);
    while (++i < n)
      ticks2[i] = (r0 + i) / step;
  }
  if (reverse)
    ticks2.reverse();
  return ticks2;
}
function tickIncrement(start, stop, count) {
  var step = (stop - start) / Math.max(0, count), power = Math.floor(Math.log(step) / Math.LN10), error2 = step / Math.pow(10, power);
  return power >= 0 ? (error2 >= e10 ? 10 : error2 >= e5 ? 5 : error2 >= e2 ? 2 : 1) * Math.pow(10, power) : -Math.pow(10, -power) / (error2 >= e10 ? 10 : error2 >= e5 ? 5 : error2 >= e2 ? 2 : 1);
}
function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count), step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)), error2 = step0 / step1;
  if (error2 >= e10)
    step1 *= 10;
  else if (error2 >= e5)
    step1 *= 5;
  else if (error2 >= e2)
    step1 *= 2;
  return stop < start ? -step1 : step1;
}
function initRange(domain, range2) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(domain);
      break;
    default:
      this.range(range2).domain(domain);
      break;
  }
  return this;
}
function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition)
    prototype[key] = definition[key];
  return prototype;
}
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex = /^#([0-9a-f]{3,8})$/;
var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
var named = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
define(Color, color, {
  copy: function(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  formatHex: color_formatHex,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format22) {
  var m, l;
  format22 = (format22 + "").trim().toLowerCase();
  return (m = reHex.exec(format22)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format22)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format22)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format22)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format22)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format22)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format22)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format22) ? rgbn(named[format22]) : format22 === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
  return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a) {
  if (a <= 0)
    r = g = b = NaN;
  return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb$1(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
define(Rgb, rgb$1, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  formatHex: rgb_formatHex,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}
function rgb_formatRgb() {
  var a = this.opacity;
  a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
  return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
}
function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s2, l, a) {
  if (a <= 0)
    h = s2 = l = NaN;
  else if (l <= 0 || l >= 1)
    h = s2 = NaN;
  else if (s2 <= 0)
    h = NaN;
  return new Hsl(h, s2, l, a);
}
function hslConvert(o) {
  if (o instanceof Hsl)
    return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Hsl();
  if (o instanceof Hsl)
    return o;
  o = o.rgb();
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h = NaN, s2 = max - min, l = (max + min) / 2;
  if (s2) {
    if (r === max)
      h = (g - b) / s2 + (g < b) * 6;
    else if (g === max)
      h = (b - r) / s2 + 2;
    else
      h = (r - g) / s2 + 4;
    s2 /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s2 = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s2, l, o.opacity);
}
function hsl(h, s2, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s2, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s2, l, opacity) {
  this.h = +h;
  this.s = +s2;
  this.l = +l;
  this.opacity = +opacity;
}
define(Hsl, hsl, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = this.h % 360 + (this.h < 0) * 360, s2 = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s2, m1 = 2 * l - m2;
    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl: function() {
    var a = this.opacity;
    a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "hsl(" : "hsla(") + (this.h || 0) + ", " + (this.s || 0) * 100 + "%, " + (this.l || 0) * 100 + "%" + (a === 1 ? ")" : ", " + a + ")");
  }
}));
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}
function constant$1(x2) {
  return function() {
    return x2;
  };
}
function linear$1(a, d) {
  return function(t) {
    return a + t * d;
  };
}
function exponential(a, b, y2) {
  return a = Math.pow(a, y2), b = Math.pow(b, y2) - a, y2 = 1 / y2, function(t) {
    return Math.pow(a + t * b, y2);
  };
}
function gamma(y2) {
  return (y2 = +y2) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y2) : constant$1(isNaN(a) ? b : a);
  };
}
function nogamma(a, b) {
  var d = b - a;
  return d ? linear$1(a, d) : constant$1(isNaN(a) ? b : a);
}
var rgb = function rgbGamma(y2) {
  var color2 = gamma(y2);
  function rgb2(start, end) {
    var r = color2((start = rgb$1(start)).r, (end = rgb$1(end)).r), g = color2(start.g, end.g), b = color2(start.b, end.b), opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }
  rgb2.gamma = rgbGamma;
  return rgb2;
}(1);
function numberArray(a, b) {
  if (!b)
    b = [];
  var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i;
  return function(t) {
    for (i = 0; i < n; ++i)
      c[i] = a[i] * (1 - t) + b[i] * t;
    return c;
  };
}
function isNumberArray(x2) {
  return ArrayBuffer.isView(x2) && !(x2 instanceof DataView);
}
function genericArray(a, b) {
  var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x2 = new Array(na), c = new Array(nb), i;
  for (i = 0; i < na; ++i)
    x2[i] = interpolate(a[i], b[i]);
  for (; i < nb; ++i)
    c[i] = b[i];
  return function(t) {
    for (i = 0; i < na; ++i)
      c[i] = x2[i](t);
    return c;
  };
}
function date(a, b) {
  var d = new Date();
  return a = +a, b = +b, function(t) {
    return d.setTime(a * (1 - t) + b * t), d;
  };
}
function interpolateNumber(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}
function object(a, b) {
  var i = {}, c = {}, k;
  if (a === null || typeof a !== "object")
    a = {};
  if (b === null || typeof b !== "object")
    b = {};
  for (k in b) {
    if (k in a) {
      i[k] = interpolate(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }
  return function(t) {
    for (k in i)
      c[k] = i[k](t);
    return c;
  };
}
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");
function zero(b) {
  return function() {
    return b;
  };
}
function one(b) {
  return function(t) {
    return b(t) + "";
  };
}
function string(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s2 = [], q = [];
  a = a + "", b = b + "";
  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      bs = b.slice(bi, bs);
      if (s2[i])
        s2[i] += bs;
      else
        s2[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s2[i])
        s2[i] += bm;
      else
        s2[++i] = bm;
    } else {
      s2[++i] = null;
      q.push({ i, x: interpolateNumber(am, bm) });
    }
    bi = reB.lastIndex;
  }
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s2[i])
      s2[i] += bs;
    else
      s2[++i] = bs;
  }
  return s2.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
    for (var i2 = 0, o; i2 < b; ++i2)
      s2[(o = q[i2]).i] = o.x(t);
    return s2.join("");
  });
}
function interpolate(a, b) {
  var t = typeof b, c;
  return b == null || t === "boolean" ? constant$1(b) : (t === "number" ? interpolateNumber : t === "string" ? (c = color(b)) ? (b = c, rgb) : string : b instanceof color ? rgb : b instanceof Date ? date : isNumberArray(b) ? numberArray : Array.isArray(b) ? genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object : interpolateNumber)(a, b);
}
function interpolateRound(a, b) {
  return a = +a, b = +b, function(t) {
    return Math.round(a * (1 - t) + b * t);
  };
}
function constants(x2) {
  return function() {
    return x2;
  };
}
function number(x2) {
  return +x2;
}
var unit = [0, 1];
function identity$1(x2) {
  return x2;
}
function normalize(a, b) {
  return (b -= a = +a) ? function(x2) {
    return (x2 - a) / b;
  } : constants(isNaN(b) ? NaN : 0.5);
}
function clamper(a, b) {
  var t;
  if (a > b)
    t = a, a = b, b = t;
  return function(x2) {
    return Math.max(a, Math.min(b, x2));
  };
}
function bimap(domain, range2, interpolate2) {
  var d0 = domain[0], d1 = domain[1], r0 = range2[0], r1 = range2[1];
  if (d1 < d0)
    d0 = normalize(d1, d0), r0 = interpolate2(r1, r0);
  else
    d0 = normalize(d0, d1), r0 = interpolate2(r0, r1);
  return function(x2) {
    return r0(d0(x2));
  };
}
function polymap(domain, range2, interpolate2) {
  var j = Math.min(domain.length, range2.length) - 1, d = new Array(j), r = new Array(j), i = -1;
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range2 = range2.slice().reverse();
  }
  while (++i < j) {
    d[i] = normalize(domain[i], domain[i + 1]);
    r[i] = interpolate2(range2[i], range2[i + 1]);
  }
  return function(x2) {
    var i2 = bisect(domain, x2, 1, j) - 1;
    return r[i2](d[i2](x2));
  };
}
function copy(source, target) {
  return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp()).unknown(source.unknown());
}
function transformer() {
  var domain = unit, range2 = unit, interpolate$1 = interpolate, transform, untransform, unknown, clamp = identity$1, piecewise, output, input;
  function rescale() {
    var n = Math.min(domain.length, range2.length);
    if (clamp !== identity$1)
      clamp = clamper(domain[0], domain[n - 1]);
    piecewise = n > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }
  function scale(x2) {
    return x2 == null || isNaN(x2 = +x2) ? unknown : (output || (output = piecewise(domain.map(transform), range2, interpolate$1)))(transform(clamp(x2)));
  }
  scale.invert = function(y2) {
    return clamp(untransform((input || (input = piecewise(range2, domain.map(transform), interpolateNumber)))(y2)));
  };
  scale.domain = function(_) {
    return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
  };
  scale.range = function(_) {
    return arguments.length ? (range2 = Array.from(_), rescale()) : range2.slice();
  };
  scale.rangeRound = function(_) {
    return range2 = Array.from(_), interpolate$1 = interpolateRound, rescale();
  };
  scale.clamp = function(_) {
    return arguments.length ? (clamp = _ ? true : identity$1, rescale()) : clamp !== identity$1;
  };
  scale.interpolate = function(_) {
    return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  return function(t, u) {
    transform = t, untransform = u;
    return rescale();
  };
}
function continuous() {
  return transformer()(identity$1, identity$1);
}
function formatDecimal(x2) {
  return Math.abs(x2 = Math.round(x2)) >= 1e21 ? x2.toLocaleString("en").replace(/,/g, "") : x2.toString(10);
}
function formatDecimalParts(x2, p) {
  if ((i = (x2 = p ? x2.toExponential(p - 1) : x2.toExponential()).indexOf("e")) < 0)
    return null;
  var i, coefficient = x2.slice(0, i);
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x2.slice(i + 1)
  ];
}
function exponent(x2) {
  return x2 = formatDecimalParts(Math.abs(x2)), x2 ? x2[1] : NaN;
}
function formatGroup(grouping, thousands) {
  return function(value, width) {
    var i = value.length, t = [], j = 0, g = grouping[0], length = 0;
    while (i > 0 && g > 0) {
      if (length + g + 1 > width)
        g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width)
        break;
      g = grouping[j = (j + 1) % grouping.length];
    }
    return t.reverse().join(thousands);
  };
}
function formatNumerals(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
}
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier)))
    throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}
formatSpecifier.prototype = FormatSpecifier.prototype;
function FormatSpecifier(specifier) {
  this.fill = specifier.fill === void 0 ? " " : specifier.fill + "";
  this.align = specifier.align === void 0 ? ">" : specifier.align + "";
  this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === void 0 ? void 0 : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === void 0 ? "" : specifier.type + "";
}
FormatSpecifier.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function formatTrim(s2) {
  out:
    for (var n = s2.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (s2[i]) {
        case ".":
          i0 = i1 = i;
          break;
        case "0":
          if (i0 === 0)
            i0 = i;
          i1 = i;
          break;
        default:
          if (!+s2[i])
            break out;
          if (i0 > 0)
            i0 = 0;
          break;
      }
    }
  return i0 > 0 ? s2.slice(0, i0) + s2.slice(i1 + 1) : s2;
}
var prefixExponent;
function formatPrefixAuto(x2, p) {
  var d = formatDecimalParts(x2, p);
  if (!d)
    return x2 + "";
  var coefficient = d[0], exponent2 = d[1], i = exponent2 - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent2 / 3))) * 3) + 1, n = coefficient.length;
  return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimalParts(x2, Math.max(0, p + i - 1))[0];
}
function formatRounded(x2, p) {
  var d = formatDecimalParts(x2, p);
  if (!d)
    return x2 + "";
  var coefficient = d[0], exponent2 = d[1];
  return exponent2 < 0 ? "0." + new Array(-exponent2).join("0") + coefficient : coefficient.length > exponent2 + 1 ? coefficient.slice(0, exponent2 + 1) + "." + coefficient.slice(exponent2 + 1) : coefficient + new Array(exponent2 - coefficient.length + 2).join("0");
}
var formatTypes = {
  "%": (x2, p) => (x2 * 100).toFixed(p),
  "b": (x2) => Math.round(x2).toString(2),
  "c": (x2) => x2 + "",
  "d": formatDecimal,
  "e": (x2, p) => x2.toExponential(p),
  "f": (x2, p) => x2.toFixed(p),
  "g": (x2, p) => x2.toPrecision(p),
  "o": (x2) => Math.round(x2).toString(8),
  "p": (x2, p) => formatRounded(x2 * 100, p),
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": (x2) => Math.round(x2).toString(16).toUpperCase(),
  "x": (x2) => Math.round(x2).toString(16)
};
function identity(x2) {
  return x2;
}
var map = Array.prototype.map;
var prefixes = ["y", "z", "a", "f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function formatLocale(locale2) {
  var group = locale2.grouping === void 0 || locale2.thousands === void 0 ? identity : formatGroup(map.call(locale2.grouping, Number), locale2.thousands + ""), currencyPrefix = locale2.currency === void 0 ? "" : locale2.currency[0] + "", currencySuffix = locale2.currency === void 0 ? "" : locale2.currency[1] + "", decimal = locale2.decimal === void 0 ? "." : locale2.decimal + "", numerals = locale2.numerals === void 0 ? identity : formatNumerals(map.call(locale2.numerals, String)), percent = locale2.percent === void 0 ? "%" : locale2.percent + "", minus = locale2.minus === void 0 ? "\u2212" : locale2.minus + "", nan = locale2.nan === void 0 ? "NaN" : locale2.nan + "";
  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);
    var fill = specifier.fill, align = specifier.align, sign = specifier.sign, symbol = specifier.symbol, zero2 = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type = specifier.type;
    if (type === "n")
      comma = true, type = "g";
    else if (!formatTypes[type])
      precision === void 0 && (precision = 12), trim = true, type = "g";
    if (zero2 || fill === "0" && align === "=")
      zero2 = true, fill = "0", align = "=";
    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";
    var formatType = formatTypes[type], maybeSuffix = /[defgprs%]/.test(type);
    precision = precision === void 0 ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
    function format22(value) {
      var valuePrefix = prefix, valueSuffix = suffix, i, n, c;
      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;
        var valueNegative = value < 0 || 1 / value < 0;
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
        if (trim)
          value = formatTrim(value);
        if (valueNegative && +value === 0 && sign !== "+")
          valueNegative = false;
        valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");
        if (maybeSuffix) {
          i = -1, n = value.length;
          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }
      if (comma && !zero2)
        value = group(value, Infinity);
      var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
      if (comma && zero2)
        value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
      switch (align) {
        case "<":
          value = valuePrefix + value + valueSuffix + padding;
          break;
        case "=":
          value = valuePrefix + padding + value + valueSuffix;
          break;
        case "^":
          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
          break;
        default:
          value = padding + valuePrefix + value + valueSuffix;
          break;
      }
      return numerals(value);
    }
    format22.toString = function() {
      return specifier + "";
    };
    return format22;
  }
  function formatPrefix2(specifier, value) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)), e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3, k = Math.pow(10, -e), prefix = prefixes[8 + e / 3];
    return function(value2) {
      return f(k * value2) + prefix;
    };
  }
  return {
    format: newFormat,
    formatPrefix: formatPrefix2
  };
}
var locale;
var format2;
var formatPrefix;
defaultLocale({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function defaultLocale(definition) {
  locale = formatLocale(definition);
  format2 = locale.format;
  formatPrefix = locale.formatPrefix;
  return locale;
}
function precisionFixed(step) {
  return Math.max(0, -exponent(Math.abs(step)));
}
function precisionPrefix(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
}
function precisionRound(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent(max) - exponent(step)) + 1;
}
function tickFormat(start, stop, count, specifier) {
  var step = tickStep(start, stop, count), precision;
  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start), Math.abs(stop));
      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value)))
        specifier.precision = precision;
      return formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop)))))
        specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null && !isNaN(precision = precisionFixed(step)))
        specifier.precision = precision - (specifier.type === "%") * 2;
      break;
    }
  }
  return format2(specifier);
}
function linearish(scale) {
  var domain = scale.domain;
  scale.ticks = function(count) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
  };
  scale.tickFormat = function(count, specifier) {
    var d = domain();
    return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
  };
  scale.nice = function(count) {
    if (count == null)
      count = 10;
    var d = domain();
    var i0 = 0;
    var i1 = d.length - 1;
    var start = d[i0];
    var stop = d[i1];
    var prestep;
    var step;
    var maxIter = 10;
    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }
    while (maxIter-- > 0) {
      step = tickIncrement(start, stop, count);
      if (step === prestep) {
        d[i0] = start;
        d[i1] = stop;
        return domain(d);
      } else if (step > 0) {
        start = Math.floor(start / step) * step;
        stop = Math.ceil(stop / step) * step;
      } else if (step < 0) {
        start = Math.ceil(start * step) / step;
        stop = Math.floor(stop * step) / step;
      } else {
        break;
      }
      prestep = step;
    }
    return scale;
  };
  return scale;
}
function linear() {
  var scale = continuous();
  scale.copy = function() {
    return copy(scale, linear());
  };
  initRange.apply(scale, arguments);
  return linearish(scale);
}
var pi = Math.PI;
var tau = 2 * pi;
var epsilon = 1e-6;
var tauEpsilon = tau - epsilon;
function Path() {
  this._x0 = this._y0 = this._x1 = this._y1 = null;
  this._ = "";
}
function path() {
  return new Path();
}
Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function(x2, y2) {
    this._ += "M" + (this._x0 = this._x1 = +x2) + "," + (this._y0 = this._y1 = +y2);
  },
  closePath: function() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function(x2, y2) {
    this._ += "L" + (this._x1 = +x2) + "," + (this._y1 = +y2);
  },
  quadraticCurveTo: function(x1, y1, x2, y2) {
    this._ += "Q" + +x1 + "," + +y1 + "," + (this._x1 = +x2) + "," + (this._y1 = +y2);
  },
  bezierCurveTo: function(x1, y1, x2, y2, x3, y3) {
    this._ += "C" + +x1 + "," + +y1 + "," + +x2 + "," + +y2 + "," + (this._x1 = +x3) + "," + (this._y1 = +y3);
  },
  arcTo: function(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    var x0 = this._x1, y0 = this._y1, x21 = x2 - x1, y21 = y2 - y1, x01 = x0 - x1, y01 = y0 - y1, l01_2 = x01 * x01 + y01 * y01;
    if (r < 0)
      throw new Error("negative radius: " + r);
    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    } else if (!(l01_2 > epsilon))
      ;
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
    } else {
      var x20 = x2 - x0, y20 = y2 - y0, l21_2 = x21 * x21 + y21 * y21, l20_2 = x20 * x20 + y20 * y20, l21 = Math.sqrt(l21_2), l01 = Math.sqrt(l01_2), l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2), t01 = l / l01, t21 = l / l21;
      if (Math.abs(t01 - 1) > epsilon) {
        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
      }
      this._ += "A" + r + "," + r + ",0,0," + +(y01 * x20 > x01 * y20) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
    }
  },
  arc: function(x2, y2, r, a0, a1, ccw) {
    x2 = +x2, y2 = +y2, r = +r, ccw = !!ccw;
    var dx = r * Math.cos(a0), dy = r * Math.sin(a0), x0 = x2 + dx, y0 = y2 + dy, cw = 1 ^ ccw, da = ccw ? a0 - a1 : a1 - a0;
    if (r < 0)
      throw new Error("negative radius: " + r);
    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    } else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
      this._ += "L" + x0 + "," + y0;
    }
    if (!r)
      return;
    if (da < 0)
      da = da % tau + tau;
    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x2 - dx) + "," + (y2 - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    } else if (da > epsilon) {
      this._ += "A" + r + "," + r + ",0," + +(da >= pi) + "," + cw + "," + (this._x1 = x2 + r * Math.cos(a1)) + "," + (this._y1 = y2 + r * Math.sin(a1));
    }
  },
  rect: function(x2, y2, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x2) + "," + (this._y0 = this._y1 = +y2) + "h" + +w + "v" + +h + "h" + -w + "Z";
  },
  toString: function() {
    return this._;
  }
};
function constant(x2) {
  return function constant2() {
    return x2;
  };
}
function array(x2) {
  return typeof x2 === "object" && "length" in x2 ? x2 : Array.from(x2);
}
function Linear(context) {
  this._context = context;
}
Linear.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
        break;
      case 1:
        this._point = 2;
      default:
        this._context.lineTo(x2, y2);
        break;
    }
  }
};
function curveLinear(context) {
  return new Linear(context);
}
function x(p) {
  return p[0];
}
function y(p) {
  return p[1];
}
function line(x$1, y$1) {
  var defined = constant(true), context = null, curve = curveLinear, output = null;
  x$1 = typeof x$1 === "function" ? x$1 : x$1 === void 0 ? x : constant(x$1);
  y$1 = typeof y$1 === "function" ? y$1 : y$1 === void 0 ? y : constant(y$1);
  function line2(data) {
    var i, n = (data = array(data)).length, d, defined0 = false, buffer;
    if (context == null)
      output = curve(buffer = path());
    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0)
          output.lineStart();
        else
          output.lineEnd();
      }
      if (defined0)
        output.point(+x$1(d, i, data), +y$1(d, i, data));
    }
    if (buffer)
      return output = null, buffer + "" || null;
  }
  line2.x = function(_) {
    return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant(+_), line2) : x$1;
  };
  line2.y = function(_) {
    return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant(+_), line2) : y$1;
  };
  line2.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant(!!_), line2) : defined;
  };
  line2.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line2) : curve;
  };
  line2.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line2) : context;
  };
  return line2;
}
function point(that, x2, y2) {
  that._context.bezierCurveTo((2 * that._x0 + that._x1) / 3, (2 * that._y0 + that._y1) / 3, (that._x0 + 2 * that._x1) / 3, (that._y0 + 2 * that._y1) / 3, (that._x0 + 4 * that._x1 + x2) / 6, (that._y0 + 4 * that._y1 + y2) / 6);
}
function Basis(context) {
  this._context = context;
}
Basis.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3:
        point(this, this._x1, this._y1);
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
      default:
        point(this, x2, y2);
        break;
    }
    this._x0 = this._x1, this._x1 = x2;
    this._y0 = this._y1, this._y1 = y2;
  }
};
function curveBasis(context) {
  return new Basis(context);
}
var organizationName = writable("");
var organizationType = writable("");
var shortDesc = writable("");
var tokenAddress = writable("");
var website = writable("");
var telegram = writable("");
var discord = writable("");
var twitter = writable("");
var deepdive = writable([{ insert: "" }]);
var logo = writable();
var deepdiveTemplatePrivate = readable([
  { insert: "1. PROJECT OVERVIEW" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "2. GO-TO-MARKET STRATEGY" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "3. PRODUCT VIABILITY" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "4. PRODUCT ROADMAP" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "5. REVENUE STREAMS" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "6. PRODUCT DIVE" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "7. TECHNOLOGIES USED AND CREATED BY THE PROJECT" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "8. TEAM & ADVISORS" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "9. INVESTORS & PARTNERS" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "10. TOKEN ECONOMY" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "11. PREVIOUS RAISES" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "12. TOKEN DISTRIBUTION" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "13. TOKEN RELEASE SCHEDULE" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" }
]);
var deepdiveTemplateDao = readable([
  { insert: "1. PROJECT OVERVIEW" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "2. GO-TO-MARKET STRATEGY" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "3. DAO VIABILITY" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "4. DAO ROADMAP" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "5. REVENUE STREAMS" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "6. PRODUCT(S) DIVE" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "7. TECHNOLOGIES USED AND CREATED BY THE DAO" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "8. FOUNDING MEMBERS" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "9. INVESTORS & PARTNERS" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "10. TOKEN ECONOMY" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "11. PREVIOUS RAISES" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "12. TOKEN AND OR REPUTATION DISTRIBUTION" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" },
  { insert: "13. TOKEN RELEASE SCHEDULE" },
  { insert: "\n", attributes: { header: 2 } },
  { insert: "\n" }
]);
var mode = writable("exp");
var totalSupply = writable(1e6);
var range = writable(10);
var offset = writable(0.5);
var factorExp = writable(0);
var factorLin = writable(0);
var css$4 = {
  code: "path.svelte-1udjkcc{stroke:pink;stroke-width:2;fill:none;stroke-linecap:round}.point.svelte-1udjkcc{fill:#000}",
  map: `{"version":3,"file":"limited-curve-creator.svelte","sources":["limited-curve-creator.svelte"],"sourcesContent":["<script>\\n\\timport { scaleLinear } from 'd3-scale';\\n\\timport { line, curveBasis } from 'd3-shape';\\n\\timport { bisector} from 'd3-array';\\n\\timport { onMount } from 'svelte';\\n\\n\\timport Axis from './Axis.svelte';\\n\\timport {\\n\\t\\tmode,\\n\\t\\ttotalSupply,\\n\\t\\trange,\\n\\t\\toffset,\\n\\t\\tfactorExp,\\n\\t\\tfactorLin\\n\\t} from '../stores/apply-store.js'\\n\\n\\tconst height = 400;\\n\\tconst margin = 40;\\n\\tlet width;\\n\\n\\tlet x = margin;\\n\\tlet y = height - margin;\\n\\tlet data = [{x: 0, y:0}];\\n\\tlet point = data[0];\\n\\tlet m = { x:0, y:0};\\n\\tvar bisect = bisector((d) => d.x).right;\\n\\n\\tlet price;\\n\\tlet profitTilPoint;\\n\\tlet profitTilPointDisplay;\\n\\n\\t$: xScale = scaleLinear()\\n\\t\\t.domain([0, $totalSupply])\\n\\t\\t.range([margin, width - margin]);\\n\\n\\t$: yScale = scaleLinear()\\n\\t\\t.domain([0, $range])\\n\\t\\t.range([height - margin, margin]);\\n\\n\\t$: factorExpLocal = ($range - $offset) / Math.pow($totalSupply, 2);\\n\\t$: minStepExp =  ($range - $offset) / (Math.pow($totalSupply, 2) * 100) ;\\n\\t$: limitExp = ($range - $offset) / Math.pow($totalSupply, 2);\\n\\t$: factorLinLocal = ($range - $offset) / $totalSupply;\\n\\t$: minStep = ($range - $offset) / ($totalSupply * 100);\\n\\t$: limit = ($range - $offset) / $totalSupply;\\n\\n\\n\\tlet pathLine = line()\\n\\t\\t.x(d => xScale(d.x))\\n\\t\\t.y(d => yScale(d.y))\\n\\t\\t.curve(curveBasis);\\n\\t\\n\\t$: step = $totalSupply / width;\\n\\n\\tlet funcLin = function(x) {\\n\\t\\treturn x * factorLinLocal + $offset;\\n\\t}\\n\\n\\tlet funcExp = function(x) {\\n\\t\\treturn Math.pow(x,2) * factorExpLocal + $offset;\\n\\t}\\n\\n\\tfunction calculatePoint(){\\n\\t\\tlet i = bisect(data, xScale.invert(m.x));\\n\\n\\t\\tif (i < data.length) {\\n\\t\\t\\tpoint = data[i];\\n\\t\\t}\\n\\t\\t\\n\\t\\tx = xScale(point.x);\\n\\t\\ty = yScale(point.y);\\n\\t\\t\\n\\t\\tprice = Number(point.y.toFixed(2));\\n\\n\\t\\tif ($mode == 'exp'){\\n\\t\\t\\tprofitTilPoint = (point.x * (point.x + 1) * (2 * point.x + 1)) / 6 * factorExpLocal + $offset * point.x;\\n\\t\\t}\\n\\t\\tif ($mode == 'lin') {\\n\\t\\t\\tprofitTilPoint = (point.x * ( point.x + 1) / 2) * factorLinLocal + $offset * point.x;\\n\\t\\t}\\n\\t\\tprofitTilPointDisplay = Number(profitTilPoint).toLocaleString();\\n\\t}\\n\\n\\tfunction resample()  {\\n\\t\\twhile(data.length) {\\n\\t\\t\\tdata.pop()\\n\\t\\t}\\n\\t\\tif($offset < 0) { $offset = 0 }\\n\\t\\tfor (let i = 0; i < $totalSupply; i += step) {\\n\\t\\t\\tlet z;\\n\\t\\t\\t\\tif ($mode == 'lin'){\\n\\t\\t\\t\\t\\tz = funcLin(i);\\n\\t\\t\\t\\t} else {\\n\\t\\t\\t\\t\\tz = funcExp(i);\\n\\t\\t\\t\\t}\\n\\t\\t\\t\\tdata.push({\\n\\t\\t\\t\\t\\tx: i,\\n\\t\\t\\t\\t\\ty: z\\n\\t\\t\\t\\t})\\n\\t\\t}\\n\\t\\t//Force trigger path update \\n\\t\\tpathLine = pathLine;\\n\\t\\tcalculatePoint();\\n\\t}\\n\\n\\tfunction handleMousemove(event) {\\n\\t\\tm.x = event.offsetX;\\n\\t\\tm.y = event.offsetY;\\n\\t\\t\\n\\t\\tcalculatePoint();\\n\\t}\\n\\n\\tfunction setStore() {\\n\\t\\t$factorExp = factorExpLocal;\\n\\t\\t$factorLin = factorLinLocal;\\n\\t}\\n\\t\\n\\t//Count for not updating before width is set\\n\\tlet count = 0;\\n\\t$: {\\n\\t\\t//Redraw pathLine and tooltip when width updates\\n\\t\\tpathLine = pathLine;\\n\\t\\tif (count > 0) {\\n\\t\\t\\tx = xScale(point.x);\\n\\t\\t\\ty = yScale(point.y);\\n\\t\\t}\\n\\t\\tcount++;\\n\\t}\\n\\t\\n\\tonMount(async () => {\\n\\t\\tfactorExpLocal = $factorExp;\\n\\t\\tfactorLinLocal = $factorLin;\\n\\t\\tconst sleep = ms => new Promise(f => setTimeout(f, ms));\\n\\t\\tawait sleep(10);\\n\\t\\tresample();\\n\\t\\tpathLine = pathLine;\\n\\n\\t});\\n\\n<\/script>\\n<p></p>\\n<div class='navigation'>\\n\\t<p>\\n\\t\\t<label for=\\"mode\\">Mode</label>\\n\\t\\t<select bind:value={$mode} on:change={resample}>\\n\\t\\t\\t<option value=\\"lin\\">Linear</option>\\n\\t\\t\\t<option value=\\"exp\\">Exponential</option>\\n\\t\\t</select>\\n\\t</p>\\n\\t<p>\\n\\t\\t<label for=\\"tokens-loaded\\">Total tokens for sale</label>\\n\\t\\t<input type=\\"number\\" bind:value={$totalSupply} on:input={resample}>\\n\\t</p>\\n\\t\\n\\t<p>\\n\\t\\t<label for=\\"$range\\">Range</label>\\n\\t\\t<input type =\\"range\\" min=1 max=33 bind:value={$range} on:input={resample}>\\n\\t</p>\\n\\n\\t<p>\\n\\t<label for=\\"multiplier\\">Factor</label>\\n\\t\\t{#if $mode == 'lin'}\\n\\t\\t\\t<input type=range step={minStep} max={limit} bind:value={factorLinLocal} on:input={resample} on:change={setStore}>\\n\\t\\t{/if}\\n\\t\\t{#if $mode == 'exp'}\\n\\t\\t\\t<input type=\\"range\\" step={minStepExp} max={limitExp} bind:value={factorExpLocal} on:input={resample} on:change={setStore}>\\n\\t\\t{/if}\\n\\t</p>\\n\\t<p>\\n\\t\\t<label for=\\"offset\\" >offset</label>\\n\\t\\t<input type=\\"number\\" step=0.1 bind:value={$offset} on:change={resample}>\\n\\t</p>\\n</div>\\n\\n<div class='limited-curve' bind:clientWidth={width} >\\n\\t{#if width}\\n\\t\\t<svg width={width} height={height} on:mousemove={handleMousemove}>\\n\\t\\t\\t<Axis {width} {height} {margin} scale={xScale} position='bottom' />\\n\\t\\t\\t<Axis {width} {height} {margin} scale={yScale} position='left' />\\n\\t\\t\\t<path d={pathLine(data)}/>\\n\\t\\t\\t<circle class=\\"point\\" cx={x} cy={y} r=\\"4\\" />\\n\\t\\t</svg>\\n\\t{/if}\\n</div>\\n<div class=\\"output-point\\">\\n\\tToken price: {price} XRD\\n\\tTotal earnings: {profitTilPointDisplay} XRD\\n</div>\\n\\n<style>\\n\\tpath {\\n\\t\\tstroke: pink;\\n\\t\\tstroke-width: 2;\\n\\t\\tfill: none;\\n\\t\\tstroke-linecap: round;\\n\\t}\\n\\t.point {\\n\\t\\tfill: #000;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AA8LC,IAAI,eAAC,CAAC,AACL,MAAM,CAAE,IAAI,CACZ,YAAY,CAAE,CAAC,CACf,IAAI,CAAE,IAAI,CACV,cAAc,CAAE,KAAK,AACtB,CAAC,AACD,MAAM,eAAC,CAAC,AACP,IAAI,CAAE,IAAI,AACX,CAAC"}`
};
var height = 400;
var margin = 40;
var Limited_curve_creator = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let xScale;
  let yScale;
  let factorExpLocal;
  let minStepExp;
  let limitExp;
  let factorLinLocal;
  let minStep;
  let limit;
  let $$unsubscribe_factorLin;
  let $$unsubscribe_factorExp;
  let $mode, $$unsubscribe_mode;
  let $totalSupply, $$unsubscribe_totalSupply;
  let $offset, $$unsubscribe_offset;
  let $range, $$unsubscribe_range;
  $$unsubscribe_factorLin = subscribe(factorLin, (value) => value);
  $$unsubscribe_factorExp = subscribe(factorExp, (value) => value);
  $$unsubscribe_mode = subscribe(mode, (value) => $mode = value);
  $$unsubscribe_totalSupply = subscribe(totalSupply, (value) => $totalSupply = value);
  $$unsubscribe_offset = subscribe(offset, (value) => $offset = value);
  $$unsubscribe_range = subscribe(range, (value) => $range = value);
  let width;
  let data = [{ x: 0, y: 0 }];
  let point2 = data[0];
  bisector((d) => d.x).right;
  let price;
  let profitTilPointDisplay;
  line().x((d) => xScale(d.x)).y((d) => yScale(d.y)).curve(curveBasis);
  let count = 0;
  $$result.css.add(css$4);
  xScale = linear().domain([0, $totalSupply]).range([margin, width - margin]);
  yScale = linear().domain([0, $range]).range([height - margin, margin]);
  factorExpLocal = ($range - $offset) / Math.pow($totalSupply, 2);
  minStepExp = ($range - $offset) / (Math.pow($totalSupply, 2) * 100);
  limitExp = ($range - $offset) / Math.pow($totalSupply, 2);
  factorLinLocal = ($range - $offset) / $totalSupply;
  minStep = ($range - $offset) / ($totalSupply * 100);
  limit = ($range - $offset) / $totalSupply;
  {
    {
      if (count > 0) {
        xScale(point2.x);
        yScale(point2.y);
      }
      count++;
    }
  }
  $$unsubscribe_factorLin();
  $$unsubscribe_factorExp();
  $$unsubscribe_mode();
  $$unsubscribe_totalSupply();
  $$unsubscribe_offset();
  $$unsubscribe_range();
  return `<p></p>
<div class="${"navigation"}"><p><label for="${"mode"}">Mode</label>
		<select><option value="${"lin"}">Linear</option><option value="${"exp"}">Exponential</option></select></p>
	<p><label for="${"tokens-loaded"}">Total tokens for sale</label>
		<input type="${"number"}"${add_attribute("value", $totalSupply, 0)}></p>
	
	<p><label for="${"$range"}">Range</label>
		<input type="${"range"}" min="${"1"}" max="${"33"}"${add_attribute("value", $range, 0)}></p>

	<p><label for="${"multiplier"}">Factor</label>
		${$mode == "lin" ? `<input type="${"range"}"${add_attribute("step", minStep, 0)}${add_attribute("max", limit, 0)}${add_attribute("value", factorLinLocal, 0)}>` : ``}
		${$mode == "exp" ? `<input type="${"range"}"${add_attribute("step", minStepExp, 0)}${add_attribute("max", limitExp, 0)}${add_attribute("value", factorExpLocal, 0)}>` : ``}</p>
	<p><label for="${"offset"}">offset</label>
		<input type="${"number"}" step="${"0.1"}"${add_attribute("value", $offset, 0)}></p></div>

<div class="${"limited-curve"}">${``}</div>
<div class="${"output-point"}">Token price: ${escape(price)} XRD
	Total earnings: ${escape(profitTilPointDisplay)} XRD
</div>`;
});
var css$3 = {
  code: ".logo.svelte-b16l4i{display:flex;height:200px;width:200px}",
  map: `{"version":3,"file":"basics-form.svelte","sources":["basics-form.svelte"],"sourcesContent":["<script>\\n  import {\\n    organizationName,\\n    organizationType,\\n    shortDesc,\\n    tokenAddress,\\n    website,\\n    telegram,\\n    discord,\\n    twitter,\\n    deepdive,\\n    deepdiveTemplateDao,\\n    deepdiveTemplatePrivate,\\n    logo\\n  } from '../stores/apply-store.js';\\n\\n  //Mechanics for changing the template of the deepdive \\n  function handleOrgChange() {\\n    if ($organizationType == \\"DAO\\") {\\n      $deepdive = $deepdiveTemplateDao;\\n    }\\n    if ($organizationType == \\"Private Company\\"){\\n      $deepdive = $deepdiveTemplatePrivate;    \\n    }\\n  }\\n\\n  //Mechanics for displaying the logo\\n  let  fileinput;\\n\\t\\n\\tconst onFileSelected =(e)=>{\\n  let image = e.target.files[0];\\n            let reader = new FileReader();\\n            reader.readAsDataURL(image);\\n            reader.onload = e => {\\n                 $logo = e.target.result\\n            };\\n  }\\n<\/script>\\n\\n<div id=\\"input-container\\">\\n  <p></p>\\n  <p>\\n    <label for=\\"orgname\\">Organisation name</label>\\n    <input type=\\"text\\" bind:value={$organizationName}>\\n  </p>\\n\\n  <p>\\n    <label for=\\"organization\\">Organisation Type</label>\\n    <select id=\\"organization\\" bind:value={$organizationType} on:change={handleOrgChange}>\\n      <option value=\\"DAO\\">DAO</option>\\n      <option value=\\"Private Company\\">Private Company</option>\\n    </select>\\n  </p>\\n  \\n  <p>\\n    <label for=\\"shortdesc\\">Describe the project in one sentence</label>\\n    <input type=\\"text\\" bind:value={$shortDesc}>\\n  </p>\\n\\n  \\n  <p>\\n    <label for=\\"tokenaddress\\">Token Address</label>\\n    <input type=\\"url\\" bind:value={$tokenAddress}>\\n  </p>\\n\\n  <p>\\n    <label for=\\"website\\">Website</label>\\n    <input type=\\"url\\" bind:value={$website}>\\n  </p>\\n\\n  <p>\\n    <label for=\\"telegram\\">Telegram</label>\\n    <input type=\\"url\\" bind:value={$telegram}>\\n  </p>\\n  <p>\\n    <label for=\\"discord\\">Discord</label>\\n    <input type=\\"url\\" bind:value={$discord}>\\n  </p>\\n\\n  <p>\\n    <label for=\\"twitter\\">Twitter</label>\\n    <input type=\\"url\\" bind:value={$twitter}>\\n  </p>\\n  <p>\\n    {#if $logo}\\n      <img class=\\"logo\\" src=\\"{$logo}\\" alt=\\"d\\" />\\n    {:else}\\n      <img class=\\"logo\\" src=\\"https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png\\" alt=\\"\\" /> \\n    {/if}\\n    <button class=\\"upload\\" on:click={()=>{fileinput.click();}}>Upload logo</button>\\n    <input style=\\"display:none\\" type=\\"file\\" accept=\\".png\\"\\n      on:change={(e)=>onFileSelected(e)} bind:this={fileinput}\\n    >\\n  </p>\\n</div>\\n<style>\\n  .logo{\\n\\t\\tdisplay:flex;\\n\\t\\theight:200px;\\n\\t\\twidth:200px;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAgGE,mBAAK,CAAC,AACN,QAAQ,IAAI,CACZ,OAAO,KAAK,CACZ,MAAM,KAAK,AACZ,CAAC"}`
};
var Basics_form = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $logo, $$unsubscribe_logo;
  let $$unsubscribe_deepdiveTemplatePrivate;
  let $$unsubscribe_deepdive;
  let $$unsubscribe_organizationType;
  let $$unsubscribe_deepdiveTemplateDao;
  let $organizationName, $$unsubscribe_organizationName;
  let $shortDesc, $$unsubscribe_shortDesc;
  let $tokenAddress, $$unsubscribe_tokenAddress;
  let $website, $$unsubscribe_website;
  let $telegram, $$unsubscribe_telegram;
  let $discord, $$unsubscribe_discord;
  let $twitter, $$unsubscribe_twitter;
  $$unsubscribe_logo = subscribe(logo, (value) => $logo = value);
  $$unsubscribe_deepdiveTemplatePrivate = subscribe(deepdiveTemplatePrivate, (value) => value);
  $$unsubscribe_deepdive = subscribe(deepdive, (value) => value);
  $$unsubscribe_organizationType = subscribe(organizationType, (value) => value);
  $$unsubscribe_deepdiveTemplateDao = subscribe(deepdiveTemplateDao, (value) => value);
  $$unsubscribe_organizationName = subscribe(organizationName, (value) => $organizationName = value);
  $$unsubscribe_shortDesc = subscribe(shortDesc, (value) => $shortDesc = value);
  $$unsubscribe_tokenAddress = subscribe(tokenAddress, (value) => $tokenAddress = value);
  $$unsubscribe_website = subscribe(website, (value) => $website = value);
  $$unsubscribe_telegram = subscribe(telegram, (value) => $telegram = value);
  $$unsubscribe_discord = subscribe(discord, (value) => $discord = value);
  $$unsubscribe_twitter = subscribe(twitter, (value) => $twitter = value);
  $$result.css.add(css$3);
  $$unsubscribe_logo();
  $$unsubscribe_deepdiveTemplatePrivate();
  $$unsubscribe_deepdive();
  $$unsubscribe_organizationType();
  $$unsubscribe_deepdiveTemplateDao();
  $$unsubscribe_organizationName();
  $$unsubscribe_shortDesc();
  $$unsubscribe_tokenAddress();
  $$unsubscribe_website();
  $$unsubscribe_telegram();
  $$unsubscribe_discord();
  $$unsubscribe_twitter();
  return `<div id="${"input-container"}"><p></p>
  <p><label for="${"orgname"}">Organisation name</label>
    <input type="${"text"}"${add_attribute("value", $organizationName, 0)}></p>

  <p><label for="${"organization"}">Organisation Type</label>
    <select id="${"organization"}"><option value="${"DAO"}">DAO</option><option value="${"Private Company"}">Private Company</option></select></p>
  
  <p><label for="${"shortdesc"}">Describe the project in one sentence</label>
    <input type="${"text"}"${add_attribute("value", $shortDesc, 0)}></p>

  
  <p><label for="${"tokenaddress"}">Token Address</label>
    <input type="${"url"}"${add_attribute("value", $tokenAddress, 0)}></p>

  <p><label for="${"website"}">Website</label>
    <input type="${"url"}"${add_attribute("value", $website, 0)}></p>

  <p><label for="${"telegram"}">Telegram</label>
    <input type="${"url"}"${add_attribute("value", $telegram, 0)}></p>
  <p><label for="${"discord"}">Discord</label>
    <input type="${"url"}"${add_attribute("value", $discord, 0)}></p>

  <p><label for="${"twitter"}">Twitter</label>
    <input type="${"url"}"${add_attribute("value", $twitter, 0)}></p>
  <p>${$logo ? `<img class="${"logo svelte-b16l4i"}"${add_attribute("src", $logo, 0)} alt="${"d"}">` : `<img class="${"logo svelte-b16l4i"}" src="${"https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"}" alt="${""}">`}
    <button class="${"upload"}">Upload logo</button>
    <input style="${"display:none"}" type="${"file"}" accept="${".png"}"></p>
</div>`;
});
var css$2 = {
  code: ".logo.svelte-15lvnr2{display:flex;height:200px;width:200px}",
  map: '{"version":3,"file":"intro.svelte","sources":["intro.svelte"],"sourcesContent":["<script>\\n\\texport let organizationName;\\n\\texport let organizationType;\\n\\texport let shortDesc;\\n\\texport let tokenAddress;\\n\\texport let website;\\n\\texport let telegram;\\n\\texport let discord;\\n\\texport let twitter;\\n\\texport let logo;\\n<\/script>\\n<div class=\\"intro\\">\\n\\t<h1>\\t{organizationName} </h1>\\n\\t{#if logo}\\n    <img class=\\"logo\\" src=\\"{logo}\\" alt=\\"d\\" />\\n  {:else}\\n    <img class=\\"logo\\" src=\\"https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png\\" alt=\\"\\" /> \\n\\t{/if}\\n\\t{shortDesc}\\n\\t{tokenAddress}\\n\\n</div>\\n\\n<style>\\n  .logo{\\n\\t\\tdisplay: flex;\\n\\t\\theight:200px;\\n\\t\\twidth:200px;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAwBE,oBAAK,CAAC,AACN,OAAO,CAAE,IAAI,CACb,OAAO,KAAK,CACZ,MAAM,KAAK,AACZ,CAAC"}'
};
var Intro = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { organizationName: organizationName2 } = $$props;
  let { organizationType: organizationType2 } = $$props;
  let { shortDesc: shortDesc2 } = $$props;
  let { tokenAddress: tokenAddress2 } = $$props;
  let { website: website2 } = $$props;
  let { telegram: telegram2 } = $$props;
  let { discord: discord2 } = $$props;
  let { twitter: twitter2 } = $$props;
  let { logo: logo2 } = $$props;
  if ($$props.organizationName === void 0 && $$bindings.organizationName && organizationName2 !== void 0)
    $$bindings.organizationName(organizationName2);
  if ($$props.organizationType === void 0 && $$bindings.organizationType && organizationType2 !== void 0)
    $$bindings.organizationType(organizationType2);
  if ($$props.shortDesc === void 0 && $$bindings.shortDesc && shortDesc2 !== void 0)
    $$bindings.shortDesc(shortDesc2);
  if ($$props.tokenAddress === void 0 && $$bindings.tokenAddress && tokenAddress2 !== void 0)
    $$bindings.tokenAddress(tokenAddress2);
  if ($$props.website === void 0 && $$bindings.website && website2 !== void 0)
    $$bindings.website(website2);
  if ($$props.telegram === void 0 && $$bindings.telegram && telegram2 !== void 0)
    $$bindings.telegram(telegram2);
  if ($$props.discord === void 0 && $$bindings.discord && discord2 !== void 0)
    $$bindings.discord(discord2);
  if ($$props.twitter === void 0 && $$bindings.twitter && twitter2 !== void 0)
    $$bindings.twitter(twitter2);
  if ($$props.logo === void 0 && $$bindings.logo && logo2 !== void 0)
    $$bindings.logo(logo2);
  $$result.css.add(css$2);
  return `<div class="${"intro"}"><h1>${escape(organizationName2)}</h1>
	${logo2 ? `<img class="${"logo svelte-15lvnr2"}"${add_attribute("src", logo2, 0)} alt="${"d"}">` : `<img class="${"logo svelte-15lvnr2"}" src="${"https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"}" alt="${""}">`}
	${escape(shortDesc2)}
	${escape(tokenAddress2)}

</div>`;
});
var Preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $organizationName, $$unsubscribe_organizationName;
  let $organizationType, $$unsubscribe_organizationType;
  let $shortDesc, $$unsubscribe_shortDesc;
  let $tokenAddress, $$unsubscribe_tokenAddress;
  let $website, $$unsubscribe_website;
  let $telegram, $$unsubscribe_telegram;
  let $discord, $$unsubscribe_discord;
  let $twitter, $$unsubscribe_twitter;
  let $logo, $$unsubscribe_logo;
  $$unsubscribe_organizationName = subscribe(organizationName, (value) => $organizationName = value);
  $$unsubscribe_organizationType = subscribe(organizationType, (value) => $organizationType = value);
  $$unsubscribe_shortDesc = subscribe(shortDesc, (value) => $shortDesc = value);
  $$unsubscribe_tokenAddress = subscribe(tokenAddress, (value) => $tokenAddress = value);
  $$unsubscribe_website = subscribe(website, (value) => $website = value);
  $$unsubscribe_telegram = subscribe(telegram, (value) => $telegram = value);
  $$unsubscribe_discord = subscribe(discord, (value) => $discord = value);
  $$unsubscribe_twitter = subscribe(twitter, (value) => $twitter = value);
  $$unsubscribe_logo = subscribe(logo, (value) => $logo = value);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Intro, "Intro").$$render($$result, {
      organizationName: $organizationName,
      organizationType: $organizationType,
      shortDesc: $shortDesc,
      tokenAddress: $tokenAddress,
      website: $website,
      telegram: $telegram,
      discord: $discord,
      twitter: $twitter,
      logo: $logo
    }, {
      organizationName: ($$value) => {
        $organizationName = $$value;
        $$settled = false;
      },
      organizationType: ($$value) => {
        $organizationType = $$value;
        $$settled = false;
      },
      shortDesc: ($$value) => {
        $shortDesc = $$value;
        $$settled = false;
      },
      tokenAddress: ($$value) => {
        $tokenAddress = $$value;
        $$settled = false;
      },
      website: ($$value) => {
        $website = $$value;
        $$settled = false;
      },
      telegram: ($$value) => {
        $telegram = $$value;
        $$settled = false;
      },
      discord: ($$value) => {
        $discord = $$value;
        $$settled = false;
      },
      twitter: ($$value) => {
        $twitter = $$value;
        $$settled = false;
      },
      logo: ($$value) => {
        $logo = $$value;
        $$settled = false;
      }
    }, {})}`;
  } while (!$$settled);
  $$unsubscribe_organizationName();
  $$unsubscribe_organizationType();
  $$unsubscribe_shortDesc();
  $$unsubscribe_tokenAddress();
  $$unsubscribe_website();
  $$unsubscribe_telegram();
  $$unsubscribe_discord();
  $$unsubscribe_twitter();
  $$unsubscribe_logo();
  return $$rendered;
});
var css$1 = {
  code: "@import 'https://cdn.quilljs.com/1.3.7/quill.snow.css';.editor-wrapper.svelte-1g01mcq{height:calc(100vh - 25rem)}",
  map: `{"version":3,"file":"quill-editor.svelte","sources":["quill-editor.svelte"],"sourcesContent":["<script>\\n\\n\\texport const prerender = true;\\n\\timport { onMount } from 'svelte';\\n\\n  export let setDelta = \\"\\";\\n  export let placeholder = \\"\\";\\n  export let outputHTML = \\"\\";\\n\\n\\tlet editor;\\n\\n\\texport let toolbarOptions = [\\n\\t\\t[{ header: 2 },  \\"blockquote\\", \\"link\\", \\"image\\", \\"video\\"],\\n\\t\\t[\\"bold\\", \\"italic\\", \\"underline\\", \\"strike\\"],\\n\\t\\t[{ list: \\"ordered\\" }, { list: \\"bullet\\" }],\\n\\t\\t[{ align: [] }],\\n    [\\"clean\\"],\\n\\t];\\n\\t\\n  onMount(async () => {\\n    try {\\n    const { default: Quill } = await import('quill');\\n    const { default: ImageCompress }  = await  import('quill-image-compress');\\n\\n    Quill.register('modules/imageCompress', ImageCompress);\\n    let quill = new Quill(editor, {\\n      modules: {\\n        toolbar: toolbarOptions,\\n        imageCompress: {\\n          quality: 0.9,\\n          maxWidth: 1024,\\n          maxHeight: 768,\\n          debug: false,\\n          imageType: 'image/jpeg'\\n        }\\n      },\\n      theme: \\"snow\\",\\n      placeholder: placeholder\\n    });\\n\\n    quill.setContents(setDelta);\\n\\n    const container = editor.getElementsByClassName(\\"ql-editor\\")[0];\\n\\n    quill.on(\\"text-change\\", function(delta, oldDelta, source) {\\n      outputHTML = container.innerHTML;\\n      setDelta = quill.getContents();\\n    }); } catch (e) {\\n      console.log(e);\\n    }\\n  });\\n\\n<\/script>\\n\\n<style>\\n  @import 'https://cdn.quilljs.com/1.3.7/quill.snow.css';\\n  .editor-wrapper {\\n    height:calc(100vh - 25rem);\\n  }\\n</style>\\n\\n<p></p>\\n<div class=\\"editor-wrapper\\">\\n  <div bind:this={editor} />\\n</div>\\n"],"names":[],"mappings":"AAuDE,QAAQ,8CAA8C,CAAC,AACvD,eAAe,eAAC,CAAC,AACf,OAAO,KAAK,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,AAC5B,CAAC"}`
};
var Quill_editor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const prerender = true;
  let { setDelta = "" } = $$props;
  let { placeholder = "" } = $$props;
  let { outputHTML = "" } = $$props;
  let editor;
  let { toolbarOptions = [
    [{ header: 2 }, "blockquote", "link", "image", "video"],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["clean"]
  ] } = $$props;
  if ($$props.prerender === void 0 && $$bindings.prerender && prerender !== void 0)
    $$bindings.prerender(prerender);
  if ($$props.setDelta === void 0 && $$bindings.setDelta && setDelta !== void 0)
    $$bindings.setDelta(setDelta);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.outputHTML === void 0 && $$bindings.outputHTML && outputHTML !== void 0)
    $$bindings.outputHTML(outputHTML);
  if ($$props.toolbarOptions === void 0 && $$bindings.toolbarOptions && toolbarOptions !== void 0)
    $$bindings.toolbarOptions(toolbarOptions);
  $$result.css.add(css$1);
  return `<p></p>
<div class="${"editor-wrapper svelte-1g01mcq"}"><div${add_attribute("this", editor, 0)}></div></div>`;
});
var css = {
  code: ".btn-left.svelte-qspcvp{display:flex;justify-content:center;align-items:center}",
  map: `{"version":3,"file":"apply.svelte","sources":["apply.svelte"],"sourcesContent":["<script>\\n  import { Tabs, Tab, Container } from 'svelte-chota';\\n  import LimitedCurveCreator from '../components/limited-curve-creator.svelte'\\n  import BasicsForm from '../components/basics-form.svelte';\\n  import Preview from '../components/preview.svelte';\\n  import QuillEditor from '../components/quill-editor.svelte';\\n  import { deepdive } from '../stores/apply-store.js';\\n  let tab = 0;\\n  let text = \\"\\"\\n  let outputHTML = \\"\\";\\n  function handleNext() {\\n    if(tab < 3) {\\n      tab++;\\n    } else {\\n      tab = 0;\\n    }\\n  }\\n  function handleSubmit() {\\n  }\\n<\/script>\\n\\n<Container>\\n  <h1> Create a proposal to submit your project </h1>\\n  <Tabs full bind:active={tab} >\\n    <Tab>Basic information</Tab>\\n    <Tab>Deep Dive</Tab>\\n    <Tab>Set Price</Tab>\\n    <Tab>Preview</Tab>\\n  </Tabs>\\n  {#if tab == 0}\\n    <BasicsForm />\\n  {/if}\\n\\n  {#if tab == 1}\\n    <QuillEditor \\n      bind:setDelta = {$deepdive}\\n      placeholder={\\"Write an in depth review of the project\\"}\\n      bind:outputHTML\\n    />\\n  {/if}\\n  \\n  {#if tab == 2}\\n    <LimitedCurveCreator />\\n  {/if}\\n\\n  <div class=\\"btn-left\\">\\n  {#if tab == 3}\\n    <Preview />\\n    <button class=\\"btn-left\\" on:click={handleSubmit}>Submit</button>\\n  {:else}\\n    <button class=\\"btn-left\\" on:click={handleNext}>Next</button>\\n  {/if}\\n  </div>\\n  \\n</Container>\\n<style>\\n  .btn-left {\\n    display: flex;\\n    justify-content: center;\\n    align-items: center;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAwDE,SAAS,cAAC,CAAC,AACT,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,AACrB,CAAC"}`
};
var Apply = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $deepdive, $$unsubscribe_deepdive;
  $$unsubscribe_deepdive = subscribe(deepdive, (value) => $deepdive = value);
  let tab = 0;
  let outputHTML = "";
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Container, "Container").$$render($$result, {}, {}, {
      default: () => `<h1>Create a proposal to submit your project </h1>
  ${validate_component(Tabs, "Tabs").$$render($$result, { full: true, active: tab }, {
        active: ($$value) => {
          tab = $$value;
          $$settled = false;
        }
      }, {
        default: () => `${validate_component(Tab, "Tab").$$render($$result, {}, {}, { default: () => `Basic information` })}
    ${validate_component(Tab, "Tab").$$render($$result, {}, {}, { default: () => `Deep Dive` })}
    ${validate_component(Tab, "Tab").$$render($$result, {}, {}, { default: () => `Set Price` })}
    ${validate_component(Tab, "Tab").$$render($$result, {}, {}, { default: () => `Preview` })}`
      })}
  ${tab == 0 ? `${validate_component(Basics_form, "BasicsForm").$$render($$result, {}, {}, {})}` : ``}

  ${tab == 1 ? `${validate_component(Quill_editor, "QuillEditor").$$render($$result, {
        placeholder: "Write an in depth review of the project",
        setDelta: $deepdive,
        outputHTML
      }, {
        setDelta: ($$value) => {
          $deepdive = $$value;
          $$settled = false;
        },
        outputHTML: ($$value) => {
          outputHTML = $$value;
          $$settled = false;
        }
      }, {})}` : ``}
  
  ${tab == 2 ? `${validate_component(Limited_curve_creator, "LimitedCurveCreator").$$render($$result, {}, {}, {})}` : ``}

  <div class="${"btn-left svelte-qspcvp"}">${tab == 3 ? `${validate_component(Preview, "Preview").$$render($$result, {}, {}, {})}
    <button class="${"btn-left svelte-qspcvp"}">Submit</button>` : `<button class="${"btn-left svelte-qspcvp"}">Next</button>`}</div>`
    })}`;
  } while (!$$settled);
  $$unsubscribe_deepdive();
  return $$rendered;
});
var apply = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Apply
});
var Learn = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => `<h1>Investment funding on Radix</h1>
<p>RadPad is a community curated launchpad for startups, daos and platforms
  built on radix. It&#39;s a platform where projects can raise money, launch
  their tokens and build a community. It&#39;s a place for investors to find 
  new Radix projects to join. 
</p>
<h2>FAQ</h2>
<h3>How does it work?</h3>
<p>The platform is governed by a dao (Decentralised Autonomous Organisation)
  this means that every project that raises with us is approved by community
  voting. Stakeholders get to decide where capital flows, which projects to 
  invest in and the percentage we take. If a project wants to raise with us,
  they have to create a public proposal with all the details and submit it
  to the voting platform. Then the collective can vote for or against.
</p>
<p>All profit from raises is divided between stakeholders in the dao. The dao has the option to
  buy tokens from projects we launch with capital from the vault. So we are 
  not only a launchpad but also an incubator for innovative platforms on radix.
</p>

<h3>How do I become a stakeholder?</h3>
<p>All you need to do is buy tokens, and you can participate in voting and earn 
  dividends. Tokens can be bought on the open market, or on the limited
  curve.
</p>

<h3>What is a limited curve?</h3>
<p>It is a curve that decides the price of the current token. You can see it as
  a gumball machine that sells tokens, but every token that is bought increases
  the price of the next token. This is to reward early investors and believers
  in the project. When more people believe in the project, it becomes more
  expensive. Bonding curves are usually unlimited, but our limited 
  curves have a fixed supply of tokens.
</p>
<h3>When will governance be completely implemented?</h3>
<p>We are currently working together with the radix programmer guild to build 
  the backbone of our governance platform. We will roll it out piece by piece
  and slowly take off the training wheels. First we will roll out voting for
  the curation of projects, after that voting to control the vault. We will
  start moving more and more funds into the dao controlled vault until security
  is optimal, then all the funds will be controlled by the dao.
</p>
<h3>How do dividends work?</h3>
<p>Dividends will be payed out automatically to all token holders twice a year.
  Dividends will be payed out in XRD, until there is a stablecoin on radix.
  The gas cost will be substracted from your earnings (~ 5 cents).
</p>
<p>There are two vaults one that holds the funds of the dao, the dao-vault. 
  One that holds the earnings, the dividend-vault. The profits from raises
  automatically go to the dividend-vault. And it gets triggered twice a year
  to pay out the profits. The dao-vault generates it&#39;s profits from holding 
  NAME tokens. There will be token buybacks.
</p>`
  })}`;
});
var learn = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Learn
});

// .svelte-kit/netlify/entry.js
init();
async function handler(event) {
  const { path: path2, httpMethod, headers, rawQuery, body, isBase64Encoded } = event;
  const query = new URLSearchParams(rawQuery);
  const encoding = isBase64Encoded ? "base64" : headers["content-encoding"] || "utf-8";
  const rawBody = typeof body === "string" ? Buffer.from(body, encoding) : body;
  const rendered = await render({
    method: httpMethod,
    headers,
    path: path2,
    query,
    rawBody
  });
  if (rendered) {
    return {
      isBase64Encoded: false,
      statusCode: rendered.status,
      ...splitHeaders(rendered.headers),
      body: rendered.body
    };
  }
  return {
    statusCode: 404,
    body: "Not found"
  };
}
function splitHeaders(headers) {
  const h = {};
  const m = {};
  for (const key in headers) {
    const value = headers[key];
    const target = Array.isArray(value) ? m : h;
    target[key] = value;
  }
  return {
    headers: h,
    multiValueHeaders: m
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});