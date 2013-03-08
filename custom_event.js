// ============================================================
// custom_event.js -- https://github.com/spearwolf/custom_event
// ============================================================
//
// Created at 2010/05/07
// Copyright (c) 2010-2013 Wolfger Schramm <wolfger@spearwolf.de>
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
(function() {
    var root = this, _e = {
        VERSION: "0.7.0-pre2"
    };
    if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = _e;
        }
        exports._e = _e;
    } else if (typeof define === "function" && define.amd) {
        define("custom_event", function() {
            return _e;
        });
        define("custom_event/global", function() {
            root._e = _e;
            return _e;
        });
    } else {
        root._e = _e;
    }
    var log = function() {
        var has_console = typeof root.console !== "undefined" && typeof Function === "function" && typeof Function.prototype.bind === "function", has_console_group = has_console && typeof root.console.group === "function", logPrefix = "custom_event.js:", log = {}, bindConsole = !has_console ? undefined : function(method) {
            return Function.prototype.bind.call(console[method], console);
        }, _error = has_console ? bindConsole("error") : null, _debug = has_console ? bindConsole("log") : null, _trace = has_console ? bindConsole("log") : null, _group = has_console_group ? bindConsole("group") : null, groupPrefix = "";
        if (has_console) {
            log.error = function() {
                _error.apply(console, [ groupPrefix + logPrefix ].concat(Array.prototype.slice.call(arguments)));
            };
            log.debug = function() {
                if (_e.options.debug) {
                    _debug.apply(console, [ groupPrefix + logPrefix ].concat(Array.prototype.slice.call(arguments)));
                }
            };
            log.trace = function() {
                if (_e.options.trace) {
                    _trace.apply(console, [ groupPrefix + logPrefix ].concat(Array.prototype.slice.call(arguments)));
                }
            };
            if (has_console_group) {
                log.debugGroup = function() {
                    if (_e.options.debug) {
                        _group.apply(console, [ groupPrefix + logPrefix ].concat(Array.prototype.slice.call(arguments)));
                    }
                };
                log.debugGroupEnd = function() {
                    if (_e.options.debug) {
                        console.groupEnd();
                    }
                };
                log.traceGroup = function() {
                    if (_e.options.trace) {
                        _group.apply(console, [ groupPrefix + logPrefix ].concat(Array.prototype.slice.call(arguments)));
                    }
                };
                log.traceGroupEnd = function() {
                    if (_e.options.trace) {
                        console.groupEnd();
                    }
                };
            } else {
                log.debugGroup = function() {
                    if (_e.options.debug) {
                        _debug.apply(root, [ groupPrefix + logPrefix ].concat(Array.prototype.slice.call(arguments)));
                        groupPrefix += "    ";
                    }
                };
                log.traceGroup = function() {
                    if (_e.options.trace) {
                        _trace.apply(root, [ groupPrefix + logPrefix ].concat(Array.prototype.slice.call(arguments)));
                        groupPrefix += "    ";
                    }
                };
                log.traceGroupEnd = log.debugGroupEnd = function() {
                    groupPrefix = groupPrefix.substr(0, groupPrefix.length - 4);
                };
            }
        } else {
            log.error = log.debug = log.trace = log.traceGroup = log.traceGroupEnd = function() {};
        }
        return log;
    }();
    var EType = {
        EventNode: "EventNode",
        Callback: "eCallback",
        ValueObject: "ValueObject",
        ValueFunction: "ValueFunction",
        ValueChangeListener: "ValueChangeListener",
        EventListener: "EventListener",
        IdleEventListener: "IdleEventListener"
    };
    var nextCallbackId = 1, callbackRefs = {};
    function createCallbackId(name, eType, node, options) {
        var id = nextCallbackId++, ref = {
            name: name,
            eType: eType,
            node: node
        };
        if (eType === EType.ValueChangeListener) {
            ref.callback = options.callback;
        }
        callbackRefs[id] = ref;
        return id;
    }
    function EventNode(name, parentNode) {
        this.eType = EType.EventNode;
        this.name = name;
        this.parentNode = parentNode;
        this.children = [];
        this.greedyChildren = [];
        this.insatiableChildren = [];
        this.callbacks = [];
    }
    var rootNode = new EventNode();
    EventNode.prototype.fullPathName = function() {
        return typeof this.name === "undefined" ? _e.options.pathSeparator : this._fullPathName();
    };
    EventNode.prototype._fullPathName = function() {
        return typeof this.name === "undefined" ? "" : this.parentNode._fullPathName() + _e.options.pathSeparator + this.name;
    };
    EventNode.prototype.addChild = function(name) {
        var node = new EventNode(name, this);
        if (name === _e.options.greedyChar) {
            this.greedyChildren.push(node);
        } else if (name === _e.options.insatiableSequence) {
            this.insatiableChildren.push(node);
        } else {
            this.children.push(node);
        }
        return node;
    };
    EventNode.prototype.splitPath = function(path) {
        var all_names = path.split(_e.options.pathSeparator), name = null;
        while (name === null || name.length === 0) {
            name = all_names.shift();
        }
        if (name === _e.options.insatiableSequence) {
            return [ name, "" ];
        }
        var rest = [];
        for (var i = 0; i < all_names.length; i++) {
            rest.push(all_names[i]);
            if (all_names[i] === _e.options.insatiableSequence) {
                break;
            }
        }
        return [ name, rest.length === 0 ? "" : rest.join(_e.options.pathSeparator) ];
    };
    EventNode.prototype.matchNodes = function(path, fn) {
        var split_path = this.splitPath(path), name = split_path[0], rest = split_path[1], node = this, i;
        for (i = 0; i < node.insatiableChildren.length; i++) {
            fn(node.insatiableChildren[i], path);
        }
        if (rest.length > 0) {
            for (i = 0; i < this.children.length; i++) {
                node = this.children[i];
                if (name === _e.options.greedyChar || name === node.name) {
                    node.matchNodes(rest, fn);
                }
            }
            for (i = 0; i < this.greedyChildren.length; i++) {
                this.greedyChildren[i].matchNodes(rest, fn);
            }
        } else {
            for (i = 0; i < this.children.length; i++) {
                node = this.children[i];
                if (name === _e.options.greedyChar || name === node.name) {
                    fn(node);
                }
            }
            for (i = 0; i < this.greedyChildren.length; i++) {
                fn(this.greedyChildren[i]);
            }
        }
    };
    EventNode.prototype.findOrCreateNode = function(path, findGreedy) {
        var split_path = this.splitPath(path), name = split_path[0], rest = split_path[1];
        findGreedy = typeof findGreedy === "undefined" ? true : findGreedy;
        var findChild = function(self) {
            return function(childName) {
                var i, child;
                for (i = 0; i < self.children.length; i++) {
                    child = self.children[i];
                    if (childName === child.name) {
                        return child;
                    }
                }
                if (findGreedy) {
                    for (i = 0; i < self.greedyChildren.length; i++) {
                        child = self.greedyChildren[i];
                        if (childName === child.name) {
                            return child;
                        }
                    }
                }
                return null;
            };
        }(this);
        var node = findChild(name);
        if (node === null) {
            node = this.addChild(name);
        }
        if (rest.length > 0) {
            return node.findOrCreateNode(rest);
        } else {
            return node;
        }
    };
    EventNode.prototype.addCallback = function(callback, options) {
        var _callback = {
            eType: EType.Callback,
            id: nextCallbackId++,
            name: options.name,
            fn: callback,
            once: !!options.once,
            binding: options.binding,
            paused: false
        };
        this.callbacks.push(_callback);
        return _callback;
    };
    EventNode.prototype.destroyCallbacks = function(ids) {
        var updated_callbacks = [], i, j, skip, count = 0;
        for (i = 0; i < this.callbacks.length; i++) {
            skip = false;
            for (j = 0; j < ids.length; j++) {
                if (this.callbacks[i].id === ids[j]) {
                    skip = true;
                    ++count;
                    break;
                }
            }
            if (!skip) {
                updated_callbacks.push(this.callbacks[i]);
            }
        }
        this.callbacks = updated_callbacks;
        return count;
    };
    function _reject(arr, val) {
        var i;
        for (i = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                arr.splice(i, 1);
                break;
            }
        }
    }
    function _destruct(obj, options) {
        var opts = options || {}, except = opts.except || [], attr;
        if (!(except instanceof Array)) {
            except = [ except ];
        }
        for (attr in obj) {
            if (obj.hasOwnProperty(attr) && except.indexOf(attr) === -1) {
                delete obj[attr];
            }
        }
    }
    function findValueObject(topic) {
        var node = rootNode.findOrCreateNode(topic, false);
        if (typeof node.eValueObject === "undefined") {
            node.eValueObject = {
                eType: EType.ValueObject,
                name: topic,
                data: undefined,
                initialized: false,
                getterQueue: [],
                listener: []
            };
            node.eValueFunction = function(valObj) {
                var fn = function() {
                    if (arguments.length === 0) {
                        return node.eValueFunction.get();
                    } else {
                        return node.eValueFunction.set(arguments[0]);
                    }
                };
                fn.eType = EType.ValueFunction;
                fn.eValueObject = valObj;
                fn.set = function(newValue) {
                    var i;
                    valObj.data = newValue;
                    if (!valObj.initialized) {
                        for (i = 0; i < valObj.getterQueue.length; i++) {
                            try {
                                valObj.getterQueue[i](valObj.data);
                            } catch (e) {
                                log.error("e_val('" + valObj.name + "') getter error", e);
                            }
                        }
                        delete valObj.getterQueue;
                        valObj.initialized = true;
                    }
                    for (i = 0; i < valObj.listener.length; i++) {
                        try {
                            valObj.listener[i](valObj.data);
                        } catch (e_) {
                            log.error("e_val('" + valObj.name + "') on[change] listener error", e_);
                        }
                    }
                    return valObj.data;
                };
                fn.on = function(callback) {
                    valObj.listener.push(callback);
                    var id = createCallbackId(valObj.name, EType.ValueChangeListener, node, {
                        callback: callback
                    });
                    return {
                        eType: EType.ValueChangeListener,
                        id: id,
                        name: valObj.name,
                        destroy: function() {
                            _e.destroy(id);
                            _destruct(this);
                        }
                    };
                };
                fn.get = function(callback) {
                    if (typeof callback === "function") {
                        if (valObj.initialized) {
                            callback(valObj.data);
                        } else {
                            valObj.getterQueue.push(callback);
                        }
                    } else {
                        return valObj.data;
                    }
                };
                fn.isEqual = function(val) {
                    return valObj.data === val;
                };
                fn.isDefined = function() {
                    return valObj.initialized;
                };
                return fn;
            }(node.eValueObject);
        }
        return node.eValueFunction;
    }
    function registerEventListener(topic, callback, options) {
        var opts = options || {}, listener = null;
        if (typeof topic === "string") {
            opts.name = topic;
            listener = rootNode.findOrCreateNode(topic).addCallback(callback, opts);
            return {
                eType: EType.EventListener,
                id: listener.id,
                name: listener.name,
                destroy: function() {
                    _e.destroy(listener.id);
                    _destruct(this);
                },
                emit: function() {
                    _e.emit.apply(root, [ listener.name ].concat(Array.prototype.slice.call(arguments)));
                },
                pause: function(pause) {
                    if (typeof pause === "boolean") {
                        listener.paused = pause;
                        return pause;
                    }
                    return listener.paused;
                }
            };
        } else if (typeof topic === "function" && topic.eType === EType.ValueFunction) {
            return topic.on(callback);
        }
    }
    function registerEventListenerOnce(topic, callback, options) {
        var opts = options || {};
        opts.once = true;
        return registerEventListener(topic, callback, opts);
    }
    function registerIdleEventListener(eventPath, idleTimeout, callback, options) {
        var opts = options || {}, idleTimer, listener, paused = false, currentTimeout = idleTimeout;
        function clearTimer() {
            if (idleTimer) {
                clearTimeout(idleTimer);
            }
            idleTimer = undefined;
        }
        function registerTimer(timeout) {
            if (timeout) {
                currentTimeout = timeout;
            }
            clearTimer();
            idleTimer = setTimeout(callIdleFunc, currentTimeout);
        }
        var api = {
            eType: EType.IdleEventListener,
            destroy: function() {
                clearTimer();
                listener.destroy();
            },
            pause: function(pause_, timeout) {
                if (typeof pause_ === "undefined") {
                    return paused;
                }
                paused = pause_;
                if (pause_) {
                    clearTimer();
                    listener.pause(true);
                } else {
                    if (!idleTimer) {
                        registerTimer(timeout);
                        listener.pause(false);
                    }
                }
            },
            start: function(timeout) {
                this.pause(false, timeout);
            },
            stop: function() {
                this.pause(true);
            },
            touch: function() {
                listener.emit();
            }
        };
        function callIdleFunc() {
            idleTimer = undefined;
            listener.pause(true);
            callback.apply(api);
            if (!api.pause()) {
                registerTimer();
                listener.pause(false);
            }
        }
        listener = registerEventListener(eventPath, registerTimer, options);
        registerTimer();
        return api;
    }
    function createEmitStackTrace() {
        if (typeof _e._emitStackTrace !== "object") {
            _e._emitStackTrace = {
                currentLevel: 1,
                topicPath: []
            };
        } else {
            ++_e._emitStackTrace.currentLevel;
        }
        return _e._emitStackTrace;
    }
    function clearEmitStackTrace() {
        --_e._emitStackTrace.currentLevel;
        if (_e._emitStackTrace.currentLevel === 0) {
            _e._emitStackTrace = {
                currentLevel: 0,
                topicPath: []
            };
        }
    }
    function emitEvent(options_, topic_) {
        var args = [], results = [], result_fn, i, len, options = options_, topic = topic_, has_options = typeof options === "object";
        if (!has_options) {
            topic = options_;
            options = {};
        } else {
            if (typeof options.collect === "function") {
                result_fn = options.collect;
            }
        }
        for (i = has_options ? 2 : 1, len = arguments.length; i < len; ++i) {
            if (options.collect === true && i === len - 1 && typeof arguments[i] === "function") {
                result_fn = arguments[i];
            } else {
                args.push(arguments[i]);
            }
        }
        log.traceGroup("_e.emit ->", topic);
        var stacktrace = createEmitStackTrace();
        rootNode.matchNodes(topic, function(node, restPath) {
            try {
                var destroy_callback_ids = [], call_count, destroy = function(id) {
                    return function() {
                        destroy_callback_ids.push(id);
                    };
                }, pause = function(callback) {
                    return function() {
                        callback.paused = true;
                    };
                }, result, context, callback, args_;
                for (i = 0; i < node.callbacks.length; i++) {
                    callback = node.callbacks[i];
                    if (callback.paused) {
                        log.trace("_e.on -> (paused)", callback.name, "[" + callback.id + "]", callback);
                        continue;
                    }
                    if (stacktrace.topicPath.indexOf(callback.id) < 0) {
                        stacktrace.topicPath.push(callback.id);
                        context = callback.binding || {};
                        context.name = topic;
                        context.destroy = destroy(callback.id);
                        if (typeof context.eType === "undefined") {
                            context.eType = EType.EventListener;
                        }
                        args_ = args;
                        if (typeof restPath !== "undefined") {
                            context.pathArgs = restPath.split(_e.options.pathSeparator);
                            args_ = context.pathArgs.concat(args);
                        }
                        log.trace("_e.on ->", callback.name, "[" + callback.id + "]", callback, "args=", args_);
                        result = callback.fn.apply(context, args_);
                        if (callback.once) {
                            destroy_callback_ids.push(callback.id);
                        }
                        if (result !== null && typeof result !== "undefined") {
                            results.push(result);
                        }
                        stacktrace.topicPath.pop();
                    } else {
                        log.error("_e.on -> (skipped/recursion)", callback.name, "[" + callback.id + "]", callback);
                    }
                }
                node.destroyCallbacks(destroy_callback_ids);
            } catch (error) {
                log.error(error);
            }
        });
        clearEmitStackTrace();
        if (result_fn && results.length > 0) {
            result_fn.apply(root, results);
        }
        log.traceGroupEnd();
    }
    function destroy(pathOrId, node) {
        var ref;
        node = node || rootNode;
        if (typeof pathOrId === "number") {
            ref = callbackRefs[pathOrId];
            if (ref) {
                if (ref.eType === EType.ValueChangeListener) {
                    _reject(ref.node.eValueObject.listener, ref.callback);
                    return true;
                }
                delete callbackRefs[pathOrId];
            } else {
                if (node.destroyCallbacks([ pathOrId ]) > 0) {
                    return true;
                } else {
                    var i;
                    for (i = 0; i < node.children.length; i++) {
                        if (destroy(pathOrId, node.children[i])) {
                            return true;
                        }
                    }
                    for (i = 0; i < node.greedyChildren.length; i++) {
                        if (destroy(pathOrId, node.greedyChildren[i])) {
                            return true;
                        }
                    }
                    for (i = 0; i < node.insatiableChildren.length; i++) {
                        if (destroy(pathOrId, node.insatiableChildren[i])) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    function connectEventListener() {
        var listener = Array.prototype.slice.call(arguments), topic = listener.shift();
        return _e.on(topic, function() {
            var args = Array.prototype.slice.call(arguments);
            for (var j = 0; j < listener.length; ++j) {
                if (typeof listener[j] === "string") {
                    _e.emit.apply(root, [ listener[j] ].concat(args));
                } else if (typeof listener[j] === "function" && listener[j].eType === EType.ValueFunction) {
                    listener[j](args[0]);
                }
            }
        });
    }
    _e.on = registerEventListener;
    _e.idle = registerIdleEventListener;
    _e.once = registerEventListenerOnce;
    _e.emit = emitEvent;
    _e.collect = function() {
        emitEvent.apply(root, [ {
            collect: true
        } ].concat(Array.prototype.slice.call(arguments)));
    };
    _e.connect = connectEventListener;
    _e.destroy = destroy;
    _e.val = findValueObject;
    _e.get = function(topic, callback) {
        _e.val(topic).get(callback);
    };
    _e.set = function(topic, value) {
        _e.val(topic).set(value);
    };
    _e.options = {
        pathSeparator: "/",
        greedyChar: "*",
        insatiableSequence: "**",
        trace: false,
        debug: false
    };
    _e._rootNode = rootNode;
    _e.log = log;
})();
