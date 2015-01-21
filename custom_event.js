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
    (function(api) {
        _definePublicPropertyRO(api, "VERSION", "0.9.0");
        api.eventize = function _eEventize(obj, globalCtx) {
            if ("object" === typeof obj._e) return;
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
                        if (!connect.pause && connect.name === name && !connect.receiver.pause) {
                            connect.receiver.signal(name, args, globalCtx || this);
                        }
                    }
                }
            };
            obj.connect = function _eObjConnect(name, receiver) {
                api.eventize(receiver);
                return this.on(name, receiver);
            };
            return obj;
        };
        // eventize()
        api.slot = function _eSlot(obj, propName) {
            return new CustomEventSlot(obj, propName);
        };
        api.connect = function _eConnect(name, sender, receiver) {
            api.eventize(sender);
            return sender.on(name, receiver);
        };
        _defineHiddenPropertyRO(api, "_topics", Object.create(null));
        api.topic = function _eTopic(name) {
            var topic = api._topics[name];
            if (typeof topic !== "object") {
                //topic = Object.create(null);
                //api.eventize(topic);
                //_definePublicPropertyRO(topic, "name", name);
                topic = new CustomEventTopic(name);
                api._topics[name] = topic;
            }
            return topic;
        };
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
                    this._pause = !!pause;
                }
            }
        });
        function CustomEventSlot(obj, prop) {
            this.pause = false;
            _definePublicPropertyRO(this, "obj", obj);
            _defineHiddenPropertyRO(this, "isTopic", obj instanceof CustomEventTopic);
            if (obj instanceof CustomEventConnection) {
                prop = "pipe";
            }
            if (typeof obj === "function") {
                _definePublicPropertiesRO(this, {
                    isFunction: true,
                    signal: function _eCustomEventSlot_functionSignal(name, args, ctx) {
                        this.obj.apply(ctx, args);
                    },
                    equals: function _eCustomEventSlot_functionEquals(other) {
                        return other === this || other.obj === this.obj && other.isFunction === true;
                    }
                });
            } else {
                _definePublicPropertyRO(this, "isFunction", false);
                prop = typeof prop === "string" ? prop : "emit";
                if (prop === "emit" || prop === "on") {
                    _definePublicPropertiesRO(this, {
                        prop: "emit",
                        signal: function _eCustomEventSlot_emitSignal(name, args) {
                            var _prop = this.obj[this.prop];
                            if ("function" === typeof _prop) {
                                _prop.apply(this.obj, [ name ].concat(args));
                            }
                        }
                    });
                } else if (prop === "pipe") {
                    _definePublicPropertiesRO(this, {
                        prop: "pipe",
                        signal: function _eCustomEventSlot_pipeSignal(name, args) {
                            this.obj.pipe(name, args);
                        }
                    });
                } else if (obj instanceof CustomEventSlot) {
                    _definePublicPropertiesRO(this, {
                        prop: "signal",
                        signal: function _eCustomEventSlot_signalSignal(name, args) {
                            var _prop = this.obj[this.prop];
                            if ("function" === typeof _prop) {
                                _prop.call(this.obj, [ name ].concat(args));
                            }
                        }
                    });
                } else {
                    _definePublicPropertiesRO(this, {
                        prop: prop,
                        signal: function _eCustomEventSlot_signal(name, args) {
                            var _prop = this.obj[this.prop];
                            if ("function" === typeof _prop) {
                                _prop.apply(this.obj, args);
                            }
                        }
                    });
                }
                this.equals = function _eCustomEventSlot_equals(other) {
                    return other === this || other.obj === this.obj && other.prop === this.prop;
                };
            }
        }
        Object.defineProperties(CustomEventSlot.prototype, {
            pause: {
                enumerable: true,
                get: function() {
                    if (this.isTopic) {
                        return this._pause || this.obj.pause;
                    } else {
                        return this._pause;
                    }
                },
                set: function(pause) {
                    this._pause = !!pause;
                }
            }
        });
        function CustomEventConnection(name, sender, receiver) {
            _definePublicPropertyRO(this, "name", name);
            this.receiver = receiver;
            // its important here to set receiver before sender!
            // receiver is a CustomEventSlot
            this.sender = sender;
            // sender is an eventize(sender)'d object
            this.pause = false;
        }
        CustomEventConnection.prototype.pipe = function _eCustomEventConnection_pipe(name, args) {
            if (!this.pause) {
                this._receiver.signal(name, args);
            }
        };
        Object.defineProperties(CustomEventConnection.prototype, {
            receiver: {
                enumerable: true,
                get: function() {
                    return this._receiver;
                },
                set: function(receiver) {
                    _defineHiddenPropertyRO(this, "_receiver", receiver instanceof CustomEventSlot ? receiver : new CustomEventSlot(receiver));
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
                    this._pause = !!pause;
                }
            }
        });
        function _indexOfConnectionTarget(arr, ec) {
            for (var i = arr.length; i--; ) {
                if (ec.name === arr[i].name && ec.receiver.equals(arr[i].receiver)) return i;
            }
            return -1;
        }
        function _bind(eventConnection, obj) {
            // obj should be eventized
            if (obj._e && _indexOfConnectionTarget(obj._e.connections, eventConnection) === -1) {
                obj._e.connections.push(eventConnection);
            }
        }
        function _unbind(eventConnection, obj) {
            // obj should be eventized
            if (obj._e && Array.isArray(obj._e.connections)) {
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