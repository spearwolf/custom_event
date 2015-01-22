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
(function(_global) {
    "use strict";
    // module.exports, commonjs, amd ---------------------------------------------------- {{{
    var _exports;
    if (typeof exports === "undefined") {
        if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
            _exports = {};
            define(function() {
                // amd
                return _exports;
            });
        } else {
            _exports = (typeof window !== "undefined" ? window : _global)._e = {};
        }
    } else {
        _exports = exports;
    }
    // ---------------------------------------------------------------------------------- }}}
    (function(api) {
        _definePublicPropertyRO(api, "VERSION", "0.9.0");
        // eventize( obj ) ------------------------------------------------------------------ {{{
        api.eventize = function _eEventize(obj, globalCtx) {
            if ("object" === typeof obj._e) return obj;
            _defineHiddenPropertyRO(obj, "_e", Object.create(null));
            obj._e.connections = [];
            obj.on = function _eOn(name, slot) {
                if (typeof name === "string" && name.length > 0 && typeof slot !== "undefined") {
                    return new CustomEventConnection(name, this, slot);
                }
            };
            obj.emit = function _eEmit() {
                var len = this._e.connections.length;
                var name = arguments[0];
                var args = Array.prototype.slice.call(arguments, 1);
                var connect, i;
                if (typeof name === "string") {
                    for (i = 0; i < len; i++) {
                        connect = this._e.connections[i];
                        if (connect && connect.name === name) {
                            connect.pipe(name, args, globalCtx || this);
                        }
                    }
                }
            };
            obj.connect = function _eObjConnect(name, receiver) {
                if (this === receiver) {
                    throw new CustomEventError("can't connect object with oneself!");
                }
                api.eventize(receiver);
                return this.on(name, receiver);
            };
            if (obj instanceof CustomEventSlot) {
                // eventize a slot
                _defineHiddenPropertyRO(obj, "_signal", obj.signal);
                _definePublicPropertyRO(obj, "signal", function(name, args, ctx) {
                    this._signal(name, args, ctx);
                    this.emit("signal", this, name, args, ctx);
                });
            } else if (obj instanceof CustomEventConnection) {
                // eventize a connection
                _defineHiddenPropertyRO(obj, "_pipe", obj.pipe);
                _definePublicPropertyRO(obj, "pipe", function(name, args) {
                    this._pipe(name, args);
                    if (!this._pause) {
                        this.emit("pipe", this, name, args);
                    }
                });
            }
            return obj;
        };
        // end of eventize()
        // ---------------------------------------------------------------------------------- }}}
        api.slot = function _eSlot(obj, propName, eventize) {
            var slot = new CustomEventSlot(obj, propName);
            return eventize ? api.eventize(slot) : slot;
        };
        _defineHiddenPropertyRO(api, "_topics", Object.create(null));
        api.topic = function _eTopic(name) {
            if (name == null) {
                name = "_e";
            }
            var topic = api._topics[name];
            if (typeof topic !== "object") {
                topic = new CustomEventTopic(name);
                api._topics[name] = topic;
            }
            return topic;
        };
        api.emit = function() {
            var global_topic = api.topic();
            global_topic.emit.apply(global_topic, arguments);
        };
        api.on = function() {
            var global_topic = api.topic();
            global_topic.on.apply(global_topic, arguments);
        };
        api.connect = function _eConnect(name, sender, receiver) {
            if (arguments.length === 2) {
                var global_topic = api.topic();
                return global_topic.connect(name, sender);
            } else {
                if (sender === receiver) {
                    throw new CustomEventError("can't connect object with oneself!");
                }
                api.eventize(sender);
                return sender.on(name, receiver);
            }
        };
        // CustomEventTopic ----------------------------------------------------------------- {{{
        function CustomEventTopic(name) {
            _definePublicPropertyRO(this, "name", name);
            this.pause = false;
            api.eventize(this);
        }
        Object.defineProperties(CustomEventTopic.prototype, {
            pause: {
                enumerable: true,
                get: function() {
                    return this._pause;
                },
                set: function(pause) {
                    _definePublicPropertyRO(this, "pause", !!pause);
                }
            }
        });
        // ---------------------------------------------------------------------------------- }}}
        // CustomEventSlot ------------------------------------------------------------------ {{{
        function CustomEventSlot(obj, prop) {
            //api.eventize(this);
            this.pause = false;
            _definePublicPropertiesRO(this, {
                object: obj,
                isDestroyed: false,
                isTopic: obj instanceof CustomEventTopic
            });
            if (obj instanceof CustomEventConnection) {
                prop = "pipe";
            }
            if (typeof obj === "function") {
                _definePublicPropertiesRO(this, {
                    isFunction: true,
                    signal: function _eCustomEventSlot_functionSignal(name, args, ctx) {
                        this.object.apply(ctx, args);
                    },
                    equals: function _eCustomEventSlot_functionEquals(other) {
                        return other === this || other.object === this.object && other.isFunction === true;
                    }
                });
            } else {
                _definePublicPropertyRO(this, "isFunction", false);
                prop = typeof prop === "string" ? prop : "emit";
                if (prop === "emit" || prop === "on") {
                    _definePublicPropertiesRO(this, {
                        property: "emit",
                        signal: function _eCustomEventSlot_emitSignal(name, args) {
                            var _prop = this.object[this.property];
                            if ("function" === typeof _prop) {
                                _prop.apply(this.object, [ name ].concat(args));
                            }
                        }
                    });
                } else if (prop === "pipe") {
                    _definePublicPropertiesRO(this, {
                        property: "pipe",
                        signal: function _eCustomEventSlot_pipeSignal(name, args) {
                            this.object.pipe(name, args);
                        }
                    });
                } else if (obj instanceof CustomEventSlot) {
                    _definePublicPropertiesRO(this, {
                        property: "signal",
                        signal: function _eCustomEventSlot_signalSignal(name, args) {
                            var _prop = this.object[this.property];
                            if ("function" === typeof _prop) {
                                _prop.call(this.object, [ name ].concat(args));
                            }
                        }
                    });
                } else {
                    _definePublicPropertiesRO(this, {
                        property: prop,
                        signal: function _eCustomEventSlot_signal(name, args) {
                            var _prop = this.object[this.property];
                            if ("function" === typeof _prop) {
                                _prop.apply(this.object, args);
                            }
                        }
                    });
                }
                this.equals = function _eCustomEventSlot_equals(other) {
                    return other === this || other.object === this.object && other.property === this.property;
                };
            }
        }
        CustomEventSlot.prototype.destroy = function _eCustomEventSlot_destroy() {
            this.pause = true;
            _definePublicPropertiesRO(this, {
                isDestroyed: true,
                signal: function() {},
                equals: function() {
                    return false;
                }
            });
            delete this.object;
            delete this._signal;
        };
        Object.defineProperties(CustomEventSlot.prototype, {
            pause: {
                enumerable: true,
                get: function() {
                    if (this.isTopic) {
                        return this._pause || this.object && this.object.pause;
                    } else {
                        return this._pause;
                    }
                },
                set: function(pause) {
                    _defineHiddenPropertyRO(this, "_pause", !!pause);
                }
            }
        });
        // ---------------------------------------------------------------------------------- }}}
        // CustomEventConnection ------------------------------------------------------------ {{{
        function CustomEventConnection(name, sender, receiver) {
            _definePublicPropertyRO(this, "name", name);
            this.receiver = receiver;
            // its important here to set receiver before sender! (why(obsolete)?)
            // receiver is a CustomEventSlot
            this.sender = sender;
            // sender is an eventize(sender)'d object
            this.pause = false;
        }
        CustomEventConnection.prototype.pipe = function _eCustomEventConnection_pipe(name, args, ctx) {
            if (!this.pause && this._receiver != null) {
                if (this._receiver.isDestroyed) {
                    this.receiver = null;
                } else {
                    this._receiver.signal(name, args, ctx);
                }
            }
        };
        CustomEventConnection.prototype.eventize = function _eCustomEventConnection_eventize() {
            return api.eventize(this);
        };
        Object.defineProperties(CustomEventConnection.prototype, {
            receiver: {
                enumerable: true,
                get: function() {
                    return this._receiver;
                },
                set: function(receiver) {
                    _defineHiddenPropertyRO(this, "_receiver", receiver == null ? null : receiver instanceof CustomEventSlot ? receiver : new CustomEventSlot(receiver));
                    if (this._receiver != null && this._receiver.isDestroyed) {
                        throw new CustomEventError("can't create a connection to destroyed slot (receiver)!");
                    }
                }
            },
            sender: {
                enumerable: true,
                get: function() {
                    return this._sender;
                },
                set: function(sender) {
                    var prevSender = this._sender;
                    _defineHiddenPropertyRO(this, "_sender", sender);
                    if (sender != null) {
                        api.eventize(sender);
                        if (prevSender !== sender) {
                            if (prevSender != null) _unbind(this, prevSender);
                            _bind(this, sender);
                        }
                    } else if (prevSender != null) {
                        _unbind(this, prevSender);
                    }
                }
            },
            pause: {
                enumerable: true,
                get: function() {
                    return this._pause;
                },
                set: function(pause) {
                    _defineHiddenPropertyRO(this, "_pause", !!pause);
                }
            }
        });
        // ---------------------------------------------------------------------------------- }}}
        // CustomEventError ----------------------------------------------------------------- {{{
        function CustomEventError(message) {
            this.name = "CustomEventError";
            this.message = message;
        }
        CustomEventError.prototype = new Error();
        CustomEventError.prototype.constructor = CustomEventError;
        // ---------------------------------------------------------------------------------- }}}
        // private helpers ------------------------------------------------------------------ {{{
        function _indexOfConnectionTarget(arr, ec) {
            if (arr && ec && ec.receiver) {
                for (var i = arr.length; i--; ) {
                    if (ec.name === arr[i].name && ec.receiver.equals(arr[i].receiver)) return i;
                }
            }
            return -1;
        }
        function _bind(eventConnection, obj) {
            // obj should be eventized
            if (obj && obj._e && _indexOfConnectionTarget(obj._e.connections, eventConnection) === -1) {
                obj._e.connections.push(eventConnection);
            }
        }
        function _unbind(eventConnection, obj) {
            // obj should be eventized
            if (obj && obj._e && Array.isArray(obj._e.connections)) {
                var i = _indexOfConnectionTarget(obj._e.connections, eventConnection);
                if (i >= 0) obj._e.connections.splice(i, 1);
            }
        }
        function _definePublicPropertyRO(obj, name, value) {
            Object.defineProperty(obj, name, {
                value: value,
                configurable: true,
                enumerable: true
            });
        }
        function _definePublicPropertiesRO(obj, attrs) {
            var i, keys = Object.keys(attrs);
            for (i = keys.length; i--; ) {
                _definePublicPropertyRO(obj, keys[i], attrs[keys[i]]);
            }
        }
        function _defineHiddenPropertyRO(obj, name, value) {
            Object.defineProperty(obj, name, {
                value: value,
                configurable: true
            });
        }
    })(_exports);
})(this);