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
!function(a){"use strict";var b;"undefined"==typeof exports?"function"==typeof define&&"object"==typeof define.amd&&define.amd?(b={},define(function(){return b})):b=("undefined"!=typeof window?window:a)._e={}:b=exports,function(a){function b(b){h(this,"name",b),this.pause=!1,a.eventize(this)}function c(a,e){this.pause=!1,h(this,"obj",a),j(this,"isTopic",a instanceof b),a instanceof d&&(e="pipe"),"function"==typeof a?i(this,{isFunction:!0,signal:function(a,b,c){this.obj.apply(c,b)},equals:function(a){return a===this||a.obj===this.obj&&a.isFunction===!0}}):(h(this,"isFunction",!1),e="string"==typeof e?e:"emit","emit"===e||"on"===e?i(this,{prop:"emit",signal:function(a,b){var c=this.obj[this.prop];"function"==typeof c&&c.apply(this.obj,[a].concat(b))}}):"pipe"===e?i(this,{prop:"pipe",signal:function(a,b){this.obj.pipe(a,b)}}):a instanceof c?i(this,{prop:"signal",signal:function(a,b){var c=this.obj[this.prop];"function"==typeof c&&c.call(this.obj,[a].concat(b))}}):i(this,{prop:e,signal:function(a,b){var c=this.obj[this.prop];"function"==typeof c&&c.apply(this.obj,b)}}),this.equals=function(a){return a===this||a.obj===this.obj&&a.prop===this.prop})}function d(a,b,c){h(this,"name",a),this.receiver=c,this.sender=b,this.pause=!1}function e(a,b){for(var c=a.length;c--;)if(b.name===a[c].name&&b.receiver.equals(a[c].receiver))return c;return-1}function f(a,b){b._e&&-1===e(b._e.connections,a)&&b._e.connections.push(a)}function g(a,b){if(b._e&&Array.isArray(b._e.connections)){var c=e(b._e.connections,a);c>=0&&b._e.connections.splice(c,1)}}function h(a,b,c){Object.defineProperty(a,b,{value:c,configurable:!0,enumerable:!0})}function i(a,b){var c,d=Object.keys(b);for(c=d.length;c--;)h(a,d[c],b[d[c]])}function j(a,b,c){Object.defineProperty(a,b,{value:c,configurable:!0})}h(a,"VERSION","0.9.0"),a.eventize=function(a,b){return"object"!=typeof a._e?(j(a,"_e",Object.create(null)),a._e.connections=[],a.on=function(a,b){return"string"==typeof a&&a.length>0&&"undefined"!=typeof b?new d(a,this,b):void 0},a.emit=function(){var a,c,d=this._e.connections.length,e=arguments[0],f=Array.prototype.slice.call(arguments,1);if("string"==typeof e)for(c=0;d>c;c++)a=this._e.connections[c],a.pause||a.name!==e||a.receiver.pause||a.receiver.signal(e,f,b||this)},a):void 0},a.slot=function(a,b){return new c(a,b)},j(a,"_topics",Object.create(null)),a.topic=function(c){var d=a._topics[c];return"object"!=typeof d&&(d=new b(c),a._topics[c]=d),d},Object.defineProperties(b.prototype,{pause:{enumerable:!0,get:function(){return this._pause},set:function(a){this._pause=!!a}}}),Object.defineProperties(c.prototype,{pause:{enumerable:!0,get:function(){return this.isTopic?this._pause||this.obj.pause:this._pause},set:function(a){this._pause=!!a}}}),d.prototype.pipe=function(a,b){this.pause||this._receiver.signal(a,b)},Object.defineProperties(d.prototype,{receiver:{enumerable:!0,get:function(){return this._receiver},set:function(a){j(this,"_receiver",a instanceof c?a:new c(a))}},sender:{enumerable:!0,get:function(){return this._sender},set:function(b){var c=this._sender;j(this,"_sender",b),null!=b?(a.eventize(b),c!==b&&(null!=c&&g(this,c),f(this,b))):null!=c&&g(this,c)}},pause:{enumerable:!0,get:function(){return this._pause},set:function(a){this._pause=!!a}}})}(b)}(this);