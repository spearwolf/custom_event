/* globals define */
"use 6to5";

(function(_global) {
    "use strict";

    // module.exports, commonjs, amd ---------------------------------------------------- {{{

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

    // ---------------------------------------------------------------------------------- }}}

    (function(api) {

        _definePublicPropertyRO(api, 'VERSION', "0.10.0");


        api.eventize = function _eEventize(obj) {

            if ('object' === typeof obj._e) return obj;

            _defineHiddenPropertyRO(obj, "_e", _createCustomEventMetaInfo());


            obj.getSlot = function _eGetSlot(name) {
                return this._e.slots.get(name);
            };


            obj.freezeSlots = function _eFreezeSlots() {
                this._e.slotsFreezed = true;
                return this;
            };


            obj.unfreezeSlots = function _eUnfreezeSlots() {
                this._e.slotsFreezed = false;
                return this;
            };


            obj.defineSlot = function _eDefineSlot(name) {
                if (!this._e.slots.has(name)) {
                    if (!this._e.slotsFreezed) {
                        this._e.slots.set(name, new CustomEventSlot(this, name));
                    } else {
                        throw new CustomEventError(`unknown slot: ${name}`);
                    }
                }
                return this._e.slots.get(name);
            };


            obj.defineSlots = function _eDefineSlots() {
                for (var i = arguments.length; i--;) {
                    if (Array.isArray(arguments[i])) {
                        this.defineSlots(arguments[i]);
                    } else {
                        this.defineSlot(arguments[i]);
                    }
                }
                return this;
            };


            obj.on = function _eOn(name, receiver) {
                this.defineSlot(name).addEventListener(receiver);
                return this;
            };


            obj.emit = function _eEmit() {
                var args = Array.prototype.splice.call(arguments, 0);
                var name = args.shift();
                if (this._e.slots.has(name)) {
                    this._e.slots.get(name).signal(args);
                }
            };


            obj.off = function _eOff(receiver) {
                this._e.slots.forEach(function(slot) {
                    slot.removeEventListener(receiver);
                });
                if (typeof receiver === 'string' && this._e.slots.has(receiver)) {
                    this._e.slots.get(receiver).removeAllEventListeners();
                }
                return this;
            };


            obj.connect = function _eConnect(name, receiver, slot) {
                // TODO create proxy slot
                this.on(name, api.eventize(receiver).defineSlot(slot));
                return this;
            };


            return obj;
        };



        function CustomEventSlot(owner, name) {

            if (typeof owner !== 'object') {
                throw new CustomEventError('CustomEventSlot(owner, name) constructor: insists on object value as :owner parameter, but is ' + (typeof object));
            }

            if (typeof name !== 'string') {
                throw new CustomEventError('CustomEventSlot(owner, name) constructor: insists on string value as :name parameter, but is ' + (typeof name));
            }

            _definePublicPropertiesRO(this, {
                'owner' : owner,
                'name'  : name
            });

            _defineHiddenPropertyRO(this, 'listeners', new Set());

            this.mute = false;
        }

        CustomEventSlot.prototype.signal = function(args) {
            var self = this;
            if (!this.mute) {
                this.listeners.forEach(function(listener) {
                    if (listener instanceof CustomEventSlot) {
                        // TODO use proxy slot .. find slot before signal
                        listener.signal(args);
                    } else {
                        if (typeof listener === 'string') {
                            listener = self.owner[listener];
                        }
                        if (typeof listener === 'function') {
                            listener.apply(self.owner, args);
                        }
                    }
                });
            }
        };

        CustomEventSlot.prototype.addEventListener = function(listener) {

            if (!(typeof listener === 'string' || typeof listener === 'function' || listener instanceof CustomEventSlot)) {
                throw new CustomEventError('CustomEventSlot#addEventListener(listener) insists on string value, function or instanceof CustomEventSlot as :listener parameter, but is ' + (typeof listener));
            }

            this.listeners.add(listener);
        };

        CustomEventSlot.prototype.removeEventListener = function(listener) {
            this.listeners.delete(listener);
        };

        CustomEventSlot.prototype.removeAllEventListeners = function() {
            this.listeners.clear();
        };

        Object.defineProperties(CustomEventSlot.prototype, {

            'mute': {

                enumerable: true,

                get: function() {
                    return this._mute;
                },

                set: function(mute) {
                    _defineHiddenPropertyRO(this, "_mute", !!mute);
                }
            }
        });



        function CustomEventError(message) {
            this.name    = "CustomEventError";
            this.message = message;
        }

        api.CustomEventError = CustomEventError;

        CustomEventError.prototype = new Error();
        CustomEventError.prototype.constructor = CustomEventError;



        function _createCustomEventMetaInfo() {

            var _e = Object.create(null);

            _e.slots = new Map();
            _e.slotsFreezed = false;

            return _e;
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
