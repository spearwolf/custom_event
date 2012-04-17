// custom_event.js
//
// Created at 2010/05/07
// Copyright (c) 2010-2012 Wolfger Schramm <wolfger@spearwolf.de>
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
(function(){function u(){"undefined"!==typeof h.console&&console.error(Array.prototype.slice.call(arguments).join(" "))}function j(b,a){this.eType="EventNode";this.name=b;this.parentNode=a;this.children=[];this.greedyChildren=[];this.insatiableChildren=[];this.callbacks=[]}function q(e,a,c){c=c||{};c.name=e;var g=l.findOrCreateNode(e).addCallback(a,c);return{eType:"EventListener",id:g.id,name:g.name,destroy:function(){b.destroy(g.id);delete this.eType;delete this.id;delete this.name;delete this.destroy;
delete this.emit;delete this.pause},emit:function(){b.emit.apply(h,[g.name].concat(Array.prototype.slice.call(arguments)))},pause:function(a){"boolean"===typeof a&&(g.paused=a);return g.paused}}}function s(e,a){var c=[],g=[],f,d,m,k=e,p=a;(m="object"===typeof k)?"function"===typeof k.collect&&(f=k.collect):(p=e,k={});for(d=m?2:1,m=arguments.length;d<m;++d)!0===k.collect&&d===m-1&&"function"===typeof arguments[d]?f=arguments[d]:c.push(arguments[d]);b.options.trace&&console.group("_e.emit ->",p);var j;
"object"!==typeof b._emitStackTrace?b._emitStackTrace={currentLevel:1,topicPath:[]}:++b._emitStackTrace.currentLevel;j=b._emitStackTrace;l.matchNodes(p,function(a,e){try{var f=[],k=function(a){return function(){f.push(a)}},m=function(a){return function(){a.paused=!0}},h,n,i,l;for(d=0;d<a.callbacks.length;d++)i=a.callbacks[d],i.paused?b.options.trace&&console.log("_e.on -> (paused)",i.name,"["+i.id+"]",i):0>j.topicPath.indexOf(i.id)?(j.topicPath.push(i.id),n=i.binding||{},n.name=p,n.destroy=k(i.id),
"undefined"===typeof n.eType&&(n.eType="EventListener"),"function"!==typeof n.pause&&(n.pause=m(i)),l=c,"undefined"!==typeof e&&(n.pathArgs=e.split(b.options.pathSeparator),l=n.pathArgs.concat(c)),b.options.trace&&console.log("_e.on ->",i.name,"["+i.id+"]",i,"args=",l),h=i.fn.apply(n,l),i.once&&f.push(i.id),null!==h&&"undefined"!==typeof h&&g.push(h),j.topicPath.pop()):b.options.trace&&console.log("_e.on -> (skipped/recursion)",i.name,"["+i.id+"]",i);a.destroyCallbacks(f)}catch(o){u(o)}});--b._emitStackTrace.currentLevel;
0===b._emitStackTrace.currentLevel&&(b._emitStackTrace={currentLevel:0,topicPath:[]});f&&0<g.length&&f.apply(h,g);b.options.trace&&console.groupEnd()}function o(b,a){a=a||l;if("number"===typeof b){if(0<a.destroyCallbacks([b]))return!0;var c;for(c=0;c<a.children.length;c++)if(o(b,a.children[c]))return!0;for(c=0;c<a.greedyChildren.length;c++)if(o(b,a.greedyChildren[c]))return!0;for(c=0;c<a.insatiableChildren.length;c++)if(o(b,a.insatiableChildren[c]))return!0;return!1}}function t(e,a){var e=e.replace(/\/+$/,
""),c=[],g=[],f;b.options.trace&&console.group("_e.Module ->",e);"_init"in a&&(b.options.trace&&console.log("constructor",e+b.options.pathSeparator+b.options.insatiableSequence),c.push(b.once(e+b.options.pathSeparator+b.options.insatiableSequence,a._init,{binding:a})));for(var d in a)if(a.hasOwnProperty(d)&&(f=d.match(/^(on|module) (.+)$/)))"on"===f[1]&&"function"===typeof a[d]&&"_init"!==d&&(f=f[2].split(" "),1===f.length?(b.options.trace&&console.log("on",e+b.options.pathSeparator+f[0]),c.push(b.on(e+
b.options.pathSeparator+f[0],a[d],{binding:a}))):".."===f[1]&&(b.options.trace&&console.log("on",e+b.options.pathSeparator+f[0]+b.options.pathSeparator+b.options.insatiableSequence),c.push(b.on(e+b.options.pathSeparator+f[0]+b.options.pathSeparator+b.options.insatiableSequence,a[d],{binding:a})))),"module"===f[1]&&"object"===typeof a[d]&&g.push(t(e+b.options.pathSeparator+f[2],a[d]));b.options.trace&&console.groupEnd();a.destroy=function(){var a;for(a=0;a<c.length;++a)c[a].destroy();for(a=0;a<g.length;++a)g[a].destroy()};
var m=!1;a.pause=function(a){if("boolean"===typeof a){m=a;var b;for(b=0;b<c.length;++b)c[b].pause(a);for(b=0;b<g.length;++b)g[b].pause(a)}return m};a.eType="eModule";return a}var h=this,b={VERSION:"0.7.0-pre"};"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(exports=module.exports=b),exports._e=b):"function"===typeof define&&define.amd?(define("custom_event",function(){return b}),define("custom_event/global",function(){return h._e=b})):h._e=b;var l=new j,v=1;j.prototype.fullPathName=
function(){return"undefined"===typeof this.name?b.options.pathSeparator:this._fullPathName()};j.prototype._fullPathName=function(){return"undefined"===typeof this.name?"":this.parentNode._fullPathName()+b.options.pathSeparator+this.name};j.prototype.addChild=function(e){var a=new j(e,this);e===b.options.greedyChar?this.greedyChildren.push(a):e===b.options.insatiableSequence?this.insatiableChildren.push(a):this.children.push(a);return a};j.prototype.splitPath=function(e){for(var e=e.split(b.options.pathSeparator),
a=null;null===a||0===a.length;)a=e.shift();if(a===b.options.insatiableSequence)return[a,""];for(var c=[],g=0;g<e.length&&!(c.push(e[g]),e[g]===b.options.insatiableSequence);g++);return[a,0===c.length?"":c.join(b.options.pathSeparator)]};j.prototype.matchNodes=function(e,a){var c=this.splitPath(e),g=c[0],c=c[1],f=this,d;for(d=0;d<f.insatiableChildren.length;d++)a(f.insatiableChildren[d],e);if(0<c.length){for(d=0;d<this.children.length;d++)f=this.children[d],(g===b.options.greedyChar||g===f.name)&&
f.matchNodes(c,a);for(d=0;d<this.greedyChildren.length;d++)this.greedyChildren[d].matchNodes(c,a)}else{for(d=0;d<this.children.length;d++)f=this.children[d],(g===b.options.greedyChar||g===f.name)&&a(f);for(d=0;d<this.greedyChildren.length;d++)a(this.greedyChildren[d])}};j.prototype.findOrCreateNode=function(b){var a=this.splitPath(b),b=a[0],a=a[1],c=function(a){return function(b){var c,e;for(c=0;c<a.children.length;c++)if(e=a.children[c],b===e.name)return e;for(c=0;c<a.greedyChildren.length;c++)if(e=
a.greedyChildren[c],b===e.name)return e;return null}}(this)(b);null===c&&(c=this.addChild(b));return 0<a.length?c.findOrCreateNode(a):c};j.prototype.addCallback=function(b,a){b={eType:"eCallback",id:v++,name:a.name,fn:b,once:!!a.once,binding:a.binding,paused:!1};this.callbacks.push(b);return b};j.prototype.destroyCallbacks=function(b){var a=[],c,g,f,d=0;for(c=0;c<this.callbacks.length;c++){f=!1;for(g=0;g<b.length;g++)if(this.callbacks[c].id==b[g]){f=!0;++d;break}f||a.push(this.callbacks[c])}this.callbacks=
a;return d};b.on=q;b.idle=function(b,a,c,g){function f(){k&&clearTimeout(k);k=void 0}function d(a){a&&(o=a);f();k=setTimeout(j,o)}function j(){k=void 0;h.pause(!0);c.apply(r);r.pause()||(d(),h.pause(!1))}var k,h,l=!1,o=a,r={eType:"IdleEventListener",destroy:function(){f();h.destroy()},pause:function(a,b){if("undefined"===typeof a)return l;(l=a)?(f(),h.pause(!0)):k||(d(b),h.pause(!1))},start:function(a){this.pause(!1,a)},stop:function(){this.pause(!0)},touch:function(){h.emit()}};h=q(b,d,g);d();return r};
b.once=function(b,a,c){c=c||{};c.once=!0;return q(b,a,c)};b.emit=s;b.collect=function(){s.apply(h,[{collect:!0}].concat(Array.prototype.slice.call(arguments)))};b.connect=function(){var e=Array.prototype.slice.call(arguments),a=e.shift();return b.on(a,function(){for(var a=Array.prototype.slice.call(arguments),g=0;g<e.length;++g)b.emit.apply(h,[e[g]].concat(a))})};b.destroy=o;b.Module=t;b.options={pathSeparator:"/",greedyChar:"*",insatiableSequence:"**",trace:!1};b._rootNode=l})();
