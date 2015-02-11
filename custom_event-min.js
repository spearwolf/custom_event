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
"use strict";"use 6to5";!function(a){var b;"undefined"==typeof exports?"function"==typeof define&&"object"==typeof define.amd&&define.amd?(b={},define(function(){return b})):b=("undefined"!=typeof window?window:a)._e={}:b=exports,function(a){function b(a,b){if("object"!=typeof a)throw new c("CustomEventSlot(owner, name) constructor: insists on object value as :owner parameter, but is "+typeof object);if("string"!=typeof b)throw new c("CustomEventSlot(owner, name) constructor: insists on string value as :name parameter, but is "+typeof b);f(this,{owner:a,name:b}),g(this,"listeners",new Set),this.mute=!1}function c(a){this.name="CustomEventError",this.message=a}function d(){var a=Object.create(null);return a.slots=new Map,a.slotsFreezed=!1,a}function e(a,b,c){Object.defineProperty(a,b,{value:c,configurable:!0,enumerable:!0})}function f(a,b){var c,d=Object.keys(b);for(c=d.length;c--;)e(a,d[c],b[d[c]])}function g(a,b,c){Object.defineProperty(a,b,{value:c,configurable:!0})}e(a,"VERSION","0.10.0"),a.eventize=function(e){return"object"==typeof e._e?e:(g(e,"_e",d()),e.getSlot=function(a){return this._e.slots.get(a)},e.freezeSlots=function(){return this._e.slotsFreezed=!0,this},e.unfreezeSlots=function(){return this._e.slotsFreezed=!1,this},e.defineSlot=function(a){if(!this._e.slots.has(a)){if(this._e.slotsFreezed)throw new c("unknown slot: "+a);this._e.slots.set(a,new b(this,a))}return this._e.slots.get(a)},e.defineSlots=function(){for(var a=arguments.length;a--;)Array.isArray(arguments[a])?this.defineSlots(arguments[a]):this.defineSlot(arguments[a]);return this},e.on=function(a,b){return this.defineSlot(a).addEventListener(b),this},e.emit=function(){var a=Array.prototype.splice.call(arguments,0),b=a.shift();this._e.slots.has(b)&&this._e.slots.get(b).signal(a)},e.off=function(a){return this._e.slots.forEach(function(b){b.removeEventListener(a)}),"string"==typeof a&&this._e.slots.has(a)&&this._e.slots.get(a).removeAllEventListeners(),this},e.connect=function(b,c,d){return this.on(b,a.eventize(c).defineSlot(d)),this},e)},b.prototype.signal=function(a){var c=this;this.mute||this.listeners.forEach(function(d){d instanceof b?d.signal(a):("string"==typeof d&&(d=c.owner[d]),"function"==typeof d&&d.apply(c.owner,a))})},b.prototype.addEventListener=function(a){if(!("string"==typeof a||"function"==typeof a||a instanceof b))throw new c("CustomEventSlot#addEventListener(listener) insists on string value, function or instanceof CustomEventSlot as :listener parameter, but is "+typeof a);this.listeners.add(a)},b.prototype.removeEventListener=function(a){this.listeners["delete"](a)},b.prototype.removeAllEventListeners=function(){this.listeners.clear()},Object.defineProperties(b.prototype,{mute:{enumerable:!0,get:function(){return this._mute},set:function(a){g(this,"_mute",!!a)}}}),a.CustomEventError=c,c.prototype=new Error,c.prototype.constructor=c}(b)}(void 0);