(function(_global) {
    "use strict";

    var _exports;
    if (typeof exports === 'undefined') {
        if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
            _exports = {};
            define(function() {  // amd
                return _exports;
            });
        } else {
            _exports = (typeof window !== 'undefined' ? window : _global)._e = {}; // browser
        }
    } else {
        _exports = exports;  // commonjs
    }

    (function(api) {

        _definePublicPropertyRO(api, 'VERSION', "0.9.0");


        api.eventize = function _eEventize(obj, globalCtx) {

            if ('object' === typeof obj._e) return;

            _defineHiddenPropertyRO(obj, "_e", Object.create(null));
            obj._e.connections = [];


            obj.on = function _eOn(name, slot) {

                if (typeof name === 'string' && name.length > 0 && typeof slot !== 'undefined') {
                    return new CustomEventConnection(name, this, slot);
                }

            };


            obj.emit = function _eEmit() {

                var len  = this._e.connections.length;
                var name = arguments[0];
                var args = Array.prototype.slice.call(arguments, 1);

                var connect, i;

                if (typeof name === 'string') {
                    for (i = 0; i < len; i++) {
                        connect = this._e.connections[i];
                        if (connect.name === name) {
                            connect.receiver.signal(name, args, globalCtx || this);
                        }
                    }
                }

            };

            return obj;

        };  // eventize()


        api.slot = function _eSlot(obj, propName) {
            return new CustomEventSlot(obj, propName);
        };


        _defineHiddenPropertyRO(api, "_topics", Object.create(null));

        api.topic = function _eTopic(name) {

            var topic = api._topics[name];

            if (typeof topic !== 'object') {
                topic = Object.create(null);
                api.eventize(topic);
                api._topics[name] = topic;
            }

            return topic;
        };


        function CustomEventSlot(obj, prop) {

            _definePublicPropertyRO(this, 'obj', obj);

            if (obj instanceof CustomEventConnection) {
                prop = "pipe";
            }

            if (typeof obj === 'function') {

                _definePublicPropertiesRO(this, {

                    isFunction: true,

                    signal: function _eCustomEventSlot_functionSignal(name, args, ctx) {
                        this.obj.apply(ctx, args);
                    },

                    equals: function _eCustomEventSlot_functionEquals(other) {
                        return other === this || ( other.obj === this.obj && other.isFunction === true );
                    }

                });

            } else {

                _definePublicPropertyRO(this, 'isFunction', false);

                prop = typeof prop === 'string' ? prop : "emit";

                if (prop === "emit" || prop === "on") {

                    _definePublicPropertiesRO(this, {

                        prop: "emit",

                        signal: function _eCustomEventSlot_emitSignal(name, args) {
                            var _prop = this.obj[this.prop];
                            if ('function' === typeof _prop) {
                                _prop.apply(this.obj, [name].concat(args));
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
                            if ('function' === typeof _prop) {
                                _prop.call(this.obj, [name].concat(args));
                            }
                        }

                    });

                } else {

                    _definePublicPropertiesRO(this, {

                        prop: prop,

                        signal: function _eCustomEventSlot_signal(name, args) {
                            var _prop = this.obj[this.prop];
                            if ('function' === typeof _prop) {
                                _prop.apply(this.obj, args);
                            }
                        }

                    });

                }


                this.equals = function _eCustomEventSlot_equals(other) {
                    return other === this || ( other.obj === this.obj && other.prop === this.prop );
                };

            }
        }


        function CustomEventConnection(name, sender, receiver) {

            _definePublicPropertyRO(this, "name", name);

            this.receiver = receiver;  // its important here to set receiver before sender!
            this.sender   = sender;
        }

        CustomEventConnection.prototype.pipe = function _eCustomEventConnection_pipe(name, args) {
            this._receiver.signal(name, args);
        };

        Object.defineProperties(CustomEventConnection.prototype, {

            'receiver': {

                enumerable: true,

                get: function() { return this._receiver; },

                set: function(receiver) {
                    _defineHiddenPropertyRO(this, '_receiver',
                        (receiver instanceof CustomEventSlot ? receiver : new CustomEventSlot(receiver)) );
                }
            },

            'sender': {

                enumerable: true,

                get: function() { return this._sender; },

                set: function(sender) {
                    var prevSender = this._sender;
                    _defineHiddenPropertyRO(this, '_sender', sender);
                    if (sender != null) {
                        api.eventize(sender);
                        if (prevSender !== sender) {
                            if (prevSender != null) _unbind(this, prevSender, this._receiver);
                            _bind(this, sender, this._receiver);
                        }
                    }
                }
            }

        });



        function _indexOfConnectionTarget(arr, ec) {
            for (var i = arr.length; i--;) {
                if (ec.name === arr[i].name && ec.receiver.equals(arr[i].receiver)) return i;
            }
            return -1;
        }


        function _bind(eventConnection, obj) { // assumes that obj is eventized
            if (_indexOfConnectionTarget(obj._e.connections, eventConnection) === -1) {
                obj._e.connections.push(eventConnection);
            }
        }

        function _unbind(eventConnection, obj) { // assumes that obj is eventized
            if (Array.isArray(obj._e.connections)) {
                var i = _indexOfConnectionTarget(obj._e.connections, eventConnection);
                if (i >= 0) obj._e.connections.splice(i, 1);
            }
        }


        function _definePublicPropertyRO(obj, name, value) {
            Object.defineProperty(obj, name, {
                value        : value,
                configurable : true,
                enumerable   : true
            });
        }

        function _definePublicPropertiesRO(obj, attrs) {
            var i, keys = Object.keys(attrs);
            for (i = keys.length; i--;) {
                _definePublicPropertyRO(obj, keys[i], attrs[keys[i]]);
            }
        }

        function _defineHiddenPropertyRO(obj, name, value) {
            Object.defineProperty(obj, name, {
                value        : value,
                configurable : true
            });
        }


    })(_exports);

})(this);
