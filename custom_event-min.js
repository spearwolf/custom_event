// custom_event.js
// Created 2010/05/07 by Wolfger Schramm <wolfger@spearwolf.de>
(function(){function v(){typeof l.console!=="undefined"&&console.error(Array.prototype.slice.call(arguments).join(" "))}function h(b,a){this.name=b;this.parentNode=a;this.children=[];this.greedyChildren=[];this.insatiableChildren=[];this.callbacks=[]}function s(e,a,c){c=c||{};c.name=e;var f=m.findOrCreateNode(e).addCallback(a,c);return{id:f.id,name:f.name,unbind:function(){b.unbind(f.id)},emit:function(){b.emit.apply(l,[f.name].concat(Array.prototype.slice.call(arguments)))},pause:function(a){if(typeof a===
"boolean")f.paused=a;return f.paused}}}function r(b,a){a=a||m;if(typeof b==="number")if(a.destroyCallbacks([b])>0)return!0;else{var c;for(c=0;c<a.children.length;c++)if(r(b,a.children[c]))return!0;for(c=0;c<a.greedyChildren.length;c++)if(r(b,a.greedyChildren[c]))return!0;for(c=0;c<a.insatiableChildren.length;c++)if(r(b,a.insatiableChildren[c]))return!0;return!1}}function t(e,a){e=e.replace(/\/+$/,"");var c=[],f=[],g;b.options.debug&&console.group("_E.Module ->",e);"_init"in a&&(b.options.debug&&console.log("constructor",
e+b.options.pathSeparator+b.options.insatiableSequence),c.push(b.once(e+b.options.pathSeparator+b.options.insatiableSequence,a._init,{binding:a})));for(var d in a)if(a.hasOwnProperty(d)&&(g=d.match(/^(on|module) (.+)$/)))g[1]==="on"&&typeof a[d]==="function"&&d!=="_init"&&(g=g[2].split(" "),g.length===1?(b.options.debug&&console.log("on",e+b.options.pathSeparator+g[0]),c.push(b.on(e+b.options.pathSeparator+g[0],a[d],{binding:a}))):g[1]===".."&&(b.options.debug&&console.log("on",e+b.options.pathSeparator+
g[0]+b.options.pathSeparator+b.options.insatiableSequence),c.push(b.on(e+b.options.pathSeparator+g[0]+b.options.pathSeparator+b.options.insatiableSequence,a[d],{binding:a})))),g[1]==="module"&&typeof a[d]==="object"&&f.push(t(e+b.options.pathSeparator+g[2],a[d]));b.options.debug&&console.groupEnd();a.destroy=function(){var a;for(a=0;a<c.length;++a)c[a].unbind();for(a=0;a<f.length;++a)f[a].destroy()};var u=!1;a.pause=function(a){if(typeof a==="boolean"){u=a;var b;for(b=0;b<c.length;++b)c[b].pause(a);
for(b=0;b<f.length;++b)f[b].pause(a)}return u};return a}var l=this,b={VERSION:"0.6.6"};typeof module!=="undefined"&&module.exports?module.exports=b:l._E=b;var m=new h,w=1;h.prototype.fullPathName=function(){return typeof this.name==="undefined"?b.options.pathSeparator:this._fullPathName()};h.prototype._fullPathName=function(){return typeof this.name==="undefined"?"":this.parentNode._fullPathName()+b.options.pathSeparator+this.name};h.prototype.addChild=function(e){var a=new h(e,this);e===b.options.greedyChar?
this.greedyChildren.push(a):e===b.options.insatiableSequence?this.insatiableChildren.push(a):this.children.push(a);return a};h.prototype.splitPath=function(e){e=e.split(b.options.pathSeparator);for(var a=null;a===null||a.length===0;)a=e.shift();if(a===b.options.insatiableSequence)return[a,""];for(var c=[],f=0;f<e.length;f++)if(c.push(e[f]),e[f]===b.options.insatiableSequence)break;return[a,c.length===0?"":c.join(b.options.pathSeparator)]};h.prototype.matchNodes=function(e,a){var c=this.splitPath(e),
f=c[0];c=c[1];var g,d;for(d=0;d<this.insatiableChildren.length;d++)a(this.insatiableChildren[d],e);if(c.length>0){for(d=0;d<this.children.length;d++)g=this.children[d],(f===b.options.greedyChar||f===g.name)&&g.matchNodes(c,a);for(d=0;d<this.greedyChildren.length;d++)this.greedyChildren[d].matchNodes(c,a)}else{for(d=0;d<this.children.length;d++)g=this.children[d],(f===b.options.greedyChar||f===g.name)&&a(g);for(d=0;d<this.greedyChildren.length;d++)a(this.greedyChildren[d])}};h.prototype.findOrCreateNode=
function(b){var a=this.splitPath(b);b=a[0];a=a[1];var c=function(a){return function(b){var c,e;for(c=0;c<a.children.length;c++)if(e=a.children[c],b===e.name)return e;for(c=0;c<a.greedyChildren.length;c++)if(e=a.greedyChildren[c],b===e.name)return e;return null}}(this)(b);c===null&&(c=this.addChild(b));return a.length>0?c.findOrCreateNode(a):c};h.prototype.addCallback=function(b,a){var c={id:w++,name:a.name,fn:b,once:!!a.once,binding:a.binding,paused:!1};this.callbacks.push(c);return c};h.prototype.destroyCallbacks=
function(b){var a=[],c,f,g,d=0;for(c=0;c<this.callbacks.length;c++){g=!1;for(f=0;f<b.length;f++)if(this.callbacks[c].id==b[f]){g=!0;++d;break}g||a.push(this.callbacks[c])}this.callbacks=a;return d};b.on=s;b.onIdle=function(b,a,c,f){function g(){n&&clearTimeout(n);n=void 0}function d(){g();n=setTimeout(h,a)}function h(){n=void 0;k.pause(!0);c.apply(p);p.pause()||(d(),k.pause(!1))}var n,k,o=!1,p={unbind:function(){g();k.unbind()},pause:function(a){if(typeof a==="undefined")return o;(o=a)?(g(),k.pause(!0)):
n||(d(),k.pause(!1))},start:function(){this.pause(!1)},stop:function(){this.pause(!0)},touch:function(){k.emit()}};k=s(b,d,f);d();return p};b.once=function(b,a,c){c=c||{};c.once=!0;return s(b,a,c)};b.emit=function(e){b.options.debug&&console.group("_E.emit ->",e);var a=[],c=[],f,g,d;g=1;for(d=arguments.length;g<d;++g)g===d-1&&typeof arguments[g]==="function"?f=arguments[g]:a.push(arguments[g]);var h;typeof b._emitStackTrace!=="object"?b._emitStackTrace={currentLevel:1}:++b._emitStackTrace.currentLevel;
h=b._emitStackTrace;m.matchNodes(e,function(d,f){try{var o=[],p=function(a){return function(){o.push(a)}},l=function(a){return function(){a.paused=!0}},q,j,i;for(g=0;g<d.callbacks.length;g++)if(i=d.callbacks[g],!i.paused&&!(i.id in b._emitStackTrace)){h[i.id]=1;j=i.binding||{};j.name=e;j.unbind=p(i.id);if(typeof j.pause!=="function")j.pause=l(i);typeof f!=="undefined"?(j.pathArgs=f.split(b.options.pathSeparator),q=i.fn.apply(j,j.pathArgs.concat(a))):q=i.fn.apply(j,a);i.once&&o.push(i.id);q!==null&&
typeof q!=="undefined"&&c.push(q)}d.destroyCallbacks(o)}catch(m){v(m)}});--b._emitStackTrace.currentLevel;if(b._emitStackTrace.currentLevel===0)b._emitStackTrace={currentLevel:0};f&&c.length>0&&f.apply(l,c);b.options.debug&&console.groupEnd()};b.connect=function(){var e=Array.prototype.slice.call(arguments),a=e.shift();return b.on(a,function(){for(var a=Array.prototype.slice.call(arguments),f=0;f<e.length;++f)b.emit.apply(this,[e[f]].concat(a))})};b.unbind=r;b.Module=t;b.options={pathSeparator:"/",
greedyChar:"*",insatiableSequence:"**",debug:!1};b._rootNode=m})();
