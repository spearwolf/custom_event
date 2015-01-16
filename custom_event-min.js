// ============================================================
// custom_event.js -- https://github.com/spearwolf/custom_event
// ============================================================
//
// Created at 2010/05/07
// Copyright (c) 2010-2015 Wolfger Schramm <wolfger@spearwolf.de>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
!function(a){"use strict";var b;"undefined"==typeof exports?"function"==typeof define&&"object"==typeof define.amd&&define.amd?(b={},define(function(){return b})):b=("undefined"!=typeof window?window:a)._e={}:b=exports,function(a){function b(a,d){g(this,"obj",a),a instanceof c&&(d="pipe"),"function"==typeof a?h(this,{isFunction:!0,signal:function(a,b,c){this.obj.apply(c,b)},equals:function(a){return a===this||a.obj===this.obj&&a.isFunction===!0}}):(g(this,"isFunction",!1),d="string"==typeof d?d:"emit","emit"===d||"on"===d?h(this,{prop:"emit",signal:function(a,b){var c=this.obj[this.prop];"function"==typeof c&&c.apply(this.obj,[a].concat(b))}}):"pipe"===d?h(this,{prop:"pipe",signal:function(a,b){this.obj.pipe(a,b)}}):a instanceof b?h(this,{prop:"signal",signal:function(a,b){var c=this.obj[this.prop];"function"==typeof c&&c.call(this.obj,[a].concat(b))}}):h(this,{prop:d,signal:function(a,b){var c=this.obj[this.prop];"function"==typeof c&&c.apply(this.obj,b)}}),this.equals=function(a){return a===this||a.obj===this.obj&&a.prop===this.prop})}function c(a,b,c){g(this,"name",a),this.receiver=c,this.sender=b}function d(a,b){for(var c=a.length;c--;)if(b.name===a[c].name&&b.receiver.equals(a[c].receiver))return c;return-1}function e(a,b){-1===d(b._e.connections,a)&&b._e.connections.push(a)}function f(a,b){if(Array.isArray(b._e.connections)){var c=d(b._e.connections,a);c>=0&&b._e.connections.splice(c,1)}}function g(a,b,c){Object.defineProperty(a,b,{value:c,configurable:!0,enumerable:!0})}function h(a,b){var c,d=Object.keys(b);for(c=d.length;c--;)g(a,d[c],b[d[c]])}function i(a,b,c){Object.defineProperty(a,b,{value:c,configurable:!0})}g(a,"VERSION","0.9.0"),a.eventize=function(a,b){return"object"!=typeof a._e?(i(a,"_e",Object.create(null)),a._e.connections=[],a.on=function(a,b){return"string"==typeof a&&a.length>0&&"undefined"!=typeof b?new c(a,this,b):void 0},a.emit=function(){var a,c,d=this._e.connections.length,e=arguments[0],f=Array.prototype.slice.call(arguments,1);if("string"==typeof e)for(c=0;d>c;c++)a=this._e.connections[c],a.name===e&&a.receiver.signal(e,f,b||this)},a):void 0},a.slot=function(a,c){return new b(a,c)},i(a,"_topics",Object.create(null)),a.topic=function(b){var c=a._topics[b];return"object"!=typeof c&&(c=Object.create(null),a.eventize(c),a._topics[b]=c),c},c.prototype.pipe=function(a,b){this._receiver.signal(a,b)},Object.defineProperties(c.prototype,{receiver:{enumerable:!0,get:function(){return this._receiver},set:function(a){i(this,"_receiver",a instanceof b?a:new b(a))}},sender:{enumerable:!0,get:function(){return this._sender},set:function(b){var c=this._sender;i(this,"_sender",b),null!=b&&(a.eventize(b),c!==b&&(null!=c&&f(this,c,this._receiver),e(this,b,this._receiver)))}}})}(b)}(this);