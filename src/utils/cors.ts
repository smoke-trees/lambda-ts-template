/*!
* cors
* (The MIT License)

* Copyright (c) 2013 Troy Goode <troygoode@gmail.com>

* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* 'Software'), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*/

/*!
 * vary
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */

// Type definitions for cors 2.8
// Project: https://github.com/expressjs/cors/
// Definitions by: Alan Plum <https://github.com/pluma>
//                 Gaurav Sharma <https://github.com/gtpan77>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3


import { APIGatewayProxyEvent } from "aws-lambda";

import { IncomingHttpHeaders } from "http";
type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];

type CustomOrigin = (requestOrigin: string | undefined, callback: (err: Error | null, origin?: StaticOrigin) => void) => void;

interface CorsRequest {
  method?: string | undefined;
  headers: IncomingHttpHeaders;
}
interface CorsOptions {
  /**
   * @default '*''
   */
  origin?: StaticOrigin | CustomOrigin | undefined;
  /**
   * @default 'GET,HEAD,PUT,PATCH,POST,DELETE'
   */
  methods?: string | string[] | undefined;
  allowedHeaders?: string | string[] | undefined;
  exposedHeaders?: string | string[] | undefined;
  credentials?: boolean | undefined;
  maxAge?: number | undefined;
  /**
   * @default false
   */
  preflightContinue?: boolean | undefined;
  /**
   * @default 204
   */
  optionsSuccessStatus?: number | undefined;
}

var defaults: CorsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

var FIELD_NAME_REGEXP = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/

/**
 * Append a field to a vary header.
 *
 * @param {String} header
 * @param {String|Array} field
 * @return {String}
 * @public
 */
function append(header: string, field: string | Array<string>) {
  if (typeof header !== 'string') {
    throw new TypeError('header argument is required')
  }

  if (!field) {
    throw new TypeError('field argument is required')
  }

  // get fields array
  var fields = !Array.isArray(field)
    ? parse(String(field))
    : field

  // assert on invalid field names
  for (var j = 0; j < fields.length; j++) {
    if (!FIELD_NAME_REGEXP.test(fields[j])) {
      throw new TypeError('field argument contains an invalid header name')
    }
  }

  // existing, unspecified vary
  if (header === '*') {
    return header
  }

  // enumerate current values
  var val = header
  var vals = parse(header.toLowerCase())

  // unspecified vary
  if (fields.indexOf('*') !== -1 || vals.indexOf('*') !== -1) {
    return '*'
  }

  for (var i = 0; i < fields.length; i++) {
    var fld = fields[i].toLowerCase()

    // append value (case-preserving)
    if (vals.indexOf(fld) === -1) {
      vals.push(fld)
      val = val
        ? val + ', ' + fields[i]
        : fields[i]
    }
  }

  return val
}

/**
 * Parse a vary header into an array.
 *
 * @param {String} header
 * @return {Array}
 * @private
 */
function parse(header: string): Array<any> {
  var end = 0
  var list = []
  var start = 0

  // gather tokens
  for (var i = 0, len = header.length; i < len; i++) {
    switch (header.charCodeAt(i)) {
      case 0x20: /*   */
        if (start === end) {
          start = end = i + 1
        }
        break
      case 0x2c: /* , */
        list.push(header.substring(start, end))
        start = end = i + 1
        break
      default:
        end = i + 1
        break
    }
  }

  // final token
  list.push(header.substring(start, end))

  return list
}

/**
 * Mark that a request is varied on a header field.
 *
 * @param {Object} res
 * @param {String|Array} field
 * @public
 */

function vary(event: APIGatewayProxyEvent, field: string | Array<any>) {
  // get existing header
  var val = event.headers['Vary'] || event.headers['VARY'] || event.headers['vary'] || ''
  var header = Array.isArray(val)
    ? val.join(', ')
    : String(val)

  // set new header
  if ((val = append(header, field))) {
    event.headers['Vary'] = val
  }
}

function isString(s: any) {
  return typeof s === 'string' || s instanceof String;
}

function isOriginAllowed(origin: string, allowedOrigin: string | boolean | RegExp | any[] | CustomOrigin) {
  if (Array.isArray(allowedOrigin)) {
    for (var i = 0; i < allowedOrigin.length; ++i) {
      if (isOriginAllowed(origin, allowedOrigin[i])) {
        return true;
      }
    }
    return false;
  } else if (isString(allowedOrigin)) {
    return origin === allowedOrigin;
  } else if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin);
  } else {
    return !!allowedOrigin;
  }
}

function configureOrigin(options: CorsOptions, event: APIGatewayProxyEvent) {
  var requestOrigin = event.headers['origin'] || event.headers['Origin'] || event.headers['ORIGIN'],
    headers = [],
    isAllowed;

  if (!options.origin || options.origin === '*') {
    // allow any origin
    headers.push([{
      key: 'Access-Control-Allow-Origin',
      value: '*'
    }]);
  } else if (isString(options.origin)) {
    // fixed origin
    headers.push([{
      key: 'Access-Control-Allow-Origin',
      value: options.origin
    }]);
    headers.push([{
      key: 'Vary',
      value: 'Origin'
    }]);
  } else {
    isAllowed = isOriginAllowed(requestOrigin, options.origin);
    // reflect origin
    headers.push([{
      key: 'Access-Control-Allow-Origin',
      value: isAllowed ? requestOrigin : false
    }]);
    headers.push([{
      key: 'Vary',
      value: 'Origin'
    }]);
  }

  return headers;
}

function configureCredentials(options: CorsOptions) {
  if (options.credentials === true) {
    return {
      key: 'Access-Control-Allow-Credentials',
      value: 'true'
    };
  }
  return null;
}


function configureExposedHeaders(options: CorsOptions) {
  var headers = options.exposedHeaders;
  if (!headers) {
    return null;
  } else if (typeof headers !== 'string' && headers.join) {
    headers = headers.join(','); // .headers is an array, so turn it into a string
  }
  if (headers && headers.length) {
    return {
      key: 'Access-Control-Expose-Headers',
      value: headers
    };
  }
  return null;
}

function applyHeaders(headers, event: APIGatewayProxyEvent) {
  for (var i = 0, n = headers.length; i < n; i++) {
    var header = headers[i];
    if (header) {
      if (Array.isArray(header)) {
        applyHeaders(header, event);
      } else if (header.key === 'Vary' && header.value) {
        vary(event, header.value);
      } else if (header.value) {
        event.headers[header.key] = header.value
      }
    }
  }
}

export function cors(event: APIGatewayProxyEvent, options: CorsOptions) {
  const headers: any[] = []
  headers.push(configureOrigin(options, event));
  headers.push(configureCredentials(options));
  headers.push(configureExposedHeaders(options));
  applyHeaders(headers, event);
}