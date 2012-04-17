/** custom_event.js -- created at: 2010/05/07
               _                                   _       _     
   ___ _ _ ___| |_ ___ _____       ___ _ _ ___ ___| |_    |_|___ 
  |  _| | |_ -|  _| . |     |     | -_| | | -_|   |  _|_  | |_ -|
  |___|___|___|_| |___|_|_|_|_____|___|\_/|___|_|_|_| |_|_| |___|
                            |_____|                     |___|    

---
Copyright (c) 2010-2012 Wolfger Schramm <wolfger@spearwolf.de>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
(function() {

    // Export VERSION
    var root = this, _e = { VERSION: "0.7.0-pre" };

    // Export the custom_event object
    // for **Node.js** and **"CommonJS"**, with backwards-compatibility for the old `require()` API.
    // If we're not in CommonJS, add `_e` to the global object.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _e;
        }
        exports._e = _e;
    } else if (typeof define === 'function' && define.amd) {
        // Register as a named module with AMD.
        //
        // Module name is `custom_event`.
        define('custom_event', function() {
            return _e;
        });
        // Module `custom_event/global` does the same plus setting `_e` into global namespace.
        define('custom_event/global', function() {
            root._e = _e;
            return _e;
        });
    } else {
        root._e = _e;
    }
    // }}}
    
    function logError() {   // {{{
        if (typeof root.console !== 'undefined') {
            console.error(Array.prototype.slice.call(arguments).join(" "));
        }
    }
    // }}}


    function EventNode(name, parentNode) {  // {{{
        this.eType = "EventNode";  // ETYPE
        this.name = name;
        this.parentNode = parentNode;
        this.children = [];
        this.greedyChildren = [];
        this.insatiableChildren = [];
        this.callbacks = [];
    }
    // }}}

    var rootNode = new EventNode(), nextCallbackId = 1;

    // EventNode prototype ================================================= {{{

    EventNode.prototype.fullPathName = function () {  // {{{
        return (typeof this.name === 'undefined') ? _e.options.pathSeparator : this._fullPathName();
    };

    EventNode.prototype._fullPathName = function () {
        return (typeof this.name === 'undefined') ? '' : this.parentNode._fullPathName() + _e.options.pathSeparator + this.name;
    };
    // }}}

    EventNode.prototype.addChild = function (name) {  // {{{
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
    // }}}

    EventNode.prototype.splitPath = function (path) {  // {{{
        var all_names = path.split(_e.options.pathSeparator),
            name = null;

        while (name === null || name.length === 0) {
            name = all_names.shift();
        }

        if (name === _e.options.insatiableSequence) {
            return [name, ''];
        }

        var rest = [];
        for (var i=0; i < all_names.length; i++) {
            rest.push(all_names[i]);
            if (all_names[i] === _e.options.insatiableSequence) {
                break;
            }
        }

        return [name, rest.length === 0 ? '' : rest.join(_e.options.pathSeparator)];
    };
    // }}}

    EventNode.prototype.matchNodes = function (path, fn) {  // {{{
        var split_path = this.splitPath(path),
            name = split_path[0],
            rest = split_path[1],
            node = this,
            i;

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
    // }}}

    EventNode.prototype.findOrCreateNode = function (path) {  // {{{
        var split_path = this.splitPath(path),
            name = split_path[0],
            rest = split_path[1];

        var findChild = (function (self) {
            return function (childName) {
                var i, child;
                for (i = 0; i < self.children.length; i++) {
                    child = self.children[i];
                    if (childName === child.name) {
                        return child;
                    }
                }
                for (i = 0; i < self.greedyChildren.length; i++) {
                    child = self.greedyChildren[i];
                    if (childName === child.name) {
                        return child;
                    }
                }
                return null;
            };
        })(this);
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
    // }}}

    EventNode.prototype.addCallback = function (callback, options) {  // {{{
        var callback = {
            eType: 'eCallback',  // ETYPE
            id: nextCallbackId++,
            name: options.name,
            fn: callback,
            once: !!options.once,
            binding: options.binding,
            paused: false
        };
        this.callbacks.push(callback);
        return callback;
    };
    // }}}

    EventNode.prototype.destroyCallbacks = function (ids) {  // {{{
        var updated_callbacks = [], i, j, skip, count = 0;
        for (i = 0; i < this.callbacks.length; i++) {
            skip = false;
            for (j = 0; j < ids.length; j++) {
                if (this.callbacks[i].id == ids[j]) {
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
    // }}}

    // ===================================================================== }}}

    function registerEventListener(topic, callback, options) {  // {{{
        var opts = options || {};
        opts.name = topic;
        var listener = rootNode.findOrCreateNode(topic).addCallback(callback, opts);
        return {
            eType: 'EventListener',  // ETYPE
            id: listener.id,
            name: listener.name,
            destroy: function() {
                _e.destroy(listener.id);
                delete this.eType;
                delete this.id;
                delete this.name;
                delete this.destroy;
                delete this.emit;
                delete this.pause;
            },
            emit: function() { _e.emit.apply(root, [listener.name].concat(Array.prototype.slice.call(arguments))); },
            pause: function(pause) { 
                if (typeof pause === 'boolean') {
                    listener.paused = pause;
                }
                return listener.paused;
            }
        };
    }
    // }}}

    function registerEventListenerOnce(topic, callback, options) {  // {{{
        var opts = options || {};
        opts.once = true;
        return registerEventListener(topic, callback, opts);
    }
    // }}}

    function registerIdleEventListener(eventPath, idleTimeout, callback, options) {  // {{{
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
            eType: "IdleEventListener",  // ETYPE

            destroy: function() {
                clearTimer();
                listener.destroy();
            },

            pause: function(pause_, timeout) {
                if (typeof pause_ === 'undefined') {
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

            start: function(timeout) { this.pause(false, timeout); },
            stop: function() { this.pause(true); },

            touch: function() { listener.emit(); }
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
    // }}}

    function createEmitStackTrace() {  // {{{
        if (typeof _e._emitStackTrace !== 'object') {
            _e._emitStackTrace = { currentLevel: 1, topicPath: [] };
        } else {
            ++_e._emitStackTrace.currentLevel;
        }
        return _e._emitStackTrace;
    }
    // }}}

    function clearEmitStackTrace() {  // {{{
        --_e._emitStackTrace.currentLevel;
        if (_e._emitStackTrace.currentLevel === 0) {
            _e._emitStackTrace = { currentLevel: 0, topicPath: [] };
        }
    }
    // }}}

    function emitEvent(options_, topic_) {  // {{{

        var args = [],
            results = [],
            result_fn,
            i, len,
            options = options_,
            topic = topic_,
            has_options = typeof options === 'object';

        if (!has_options) {
            topic = options_;
            options = {};
        } else {
            if (typeof options.collect === 'function') {
                result_fn = options.collect;
            }
        }

        for (i = (has_options ? 2 : 1), len = arguments.length; i < len; ++i) {
            if (options.collect === true && i === len - 1 && typeof arguments[i] === 'function') {
                result_fn = arguments[i];
            } else {
                args.push(arguments[i]);
            }
        }

        if (_e.options.trace) { console.group("_e.emit ->", topic); }

        var stacktrace = createEmitStackTrace();

        rootNode.matchNodes(topic, function (node, restPath) {
            try {
                var destroy_callback_ids = [], call_count,

                    destroy = function(id) {
                        return function() {
                            destroy_callback_ids.push(id);
                        };
                    },

                    pause = function(callback) {
                        return function() {
                            callback.paused = true;
                        };
                    },

                    result,
                    context,
                    callback,
                    args_;

                for (i = 0; i < node.callbacks.length; i++) {
                    callback = node.callbacks[i];

                    if (callback.paused) {
                        if (_e.options.trace) { console.log("_e.on -> (paused)", callback.name, "["+callback.id+"]", callback); }
                        continue;
                    }

                    if (stacktrace.topicPath.indexOf(callback.id) < 0) {
                        stacktrace.topicPath.push(callback.id);

                        context = callback.binding || {};
                        context.name = topic;
                        context.destroy = destroy(callback.id);

                        if (typeof context.eType === 'undefined') {
                            context.eType = 'EventListener';  // ???
                        }

                        // don't overwrite _e.Module's pause()
                        if (typeof context.pause !== 'function') {
                            context.pause = pause(callback);
                        }

                        args_ = args;
                        if (typeof restPath !== 'undefined') {
                            context.pathArgs = restPath.split(_e.options.pathSeparator);
                            args_ = context.pathArgs.concat(args);
                        }

                        if (_e.options.trace) {
                            console.log("_e.on ->", callback.name, "["+callback.id+"]", callback, "args=", args_);
                        }

                        result = callback.fn.apply(context, args_);

                        if (callback.once) {
                            destroy_callback_ids.push(callback.id);
                        }

                        if (result !== null && typeof result !== 'undefined') {
                            results.push(result);
                        }
                        
                        stacktrace.topicPath.pop();
                    } else {
                        if (_e.options.trace) { console.log("_e.on -> (skipped/recursion)", callback.name, "["+callback.id+"]", callback); }
                    }
                }

                node.destroyCallbacks(destroy_callback_ids);

            } catch (error) {
                logError(error);
            }
        });

        clearEmitStackTrace();

        if (result_fn && results.length > 0) {
            result_fn.apply(root, results);
        }

        if (_e.options.trace) { console.groupEnd(); }
    }
    // }}}

    function destroy(pathOrId, node) {  // {{{
        node = node || rootNode;

        if (typeof pathOrId === 'number') {
            if (node.destroyCallbacks([pathOrId]) > 0) {
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
                return false;
            }
        }
    }
    // }}}

    function connectEventListener() {  // {{{
        var listener = Array.prototype.slice.call(arguments),
            topic = listener.shift();
        return _e.on(topic, function() {
            var args = Array.prototype.slice.call(arguments);
            for (var j = 0; j < listener.length; ++j) {
                _e.emit.apply(root, [listener[j]].concat(args));
            }
        });
    }
    // }}}

    function createModule(rootPath, module) {  // {{{
        rootPath = rootPath.replace(/\/+$/, '');
        var listener = [], sub_modules = [], annotation;

        if (_e.options.trace) { console.group("_e.Module ->", rootPath); }

        if ("_init" in module) {
            if (_e.options.trace) { console.log("constructor", rootPath+_e.options.pathSeparator+_e.options.insatiableSequence); }
            listener.push(_e.once(rootPath+_e.options.pathSeparator+_e.options.insatiableSequence, module._init, { binding: module }));
        }
        for (var prop in module) {
            if (module.hasOwnProperty(prop)) {
                annotation = prop.match(/^(on|module) (.+)$/);
                if (annotation) {
                    if (annotation[1] === 'on' && typeof module[prop] === 'function') {
                        if (prop !== '_init') {
                            annotation = annotation[2].split(" ");
                            if (annotation.length === 1) {
                                if (_e.options.trace) { console.log("on", rootPath+_e.options.pathSeparator+annotation[0]); }
                                listener.push(_e.on(rootPath+_e.options.pathSeparator+annotation[0], module[prop], { binding: module }));
                            } else if (annotation[1] === '..') {
                                if (_e.options.trace) { console.log("on", rootPath+_e.options.pathSeparator+annotation[0]+_e.options.pathSeparator+_e.options.insatiableSequence); }
                                listener.push(_e.on(rootPath+_e.options.pathSeparator+annotation[0]+_e.options.pathSeparator+_e.options.insatiableSequence, module[prop], { binding: module }));
                            }
                        }
                    }
                    if (annotation[1] === 'module' && typeof module[prop] === 'object') {
                        sub_modules.push(createModule(rootPath+_e.options.pathSeparator+annotation[2], module[prop]));
                    }
                }
            }
        }
        if (_e.options.trace) { console.groupEnd(); }

        module.destroy = function() {
            var i;
            for (i= 0; i < listener.length; ++i) {
                listener[i].destroy();
            }
            for (i= 0; i < sub_modules.length; ++i) {
                sub_modules[i].destroy();
            }
        };

        var paused = false;
        module.pause = function(pause) {
            if (typeof pause === 'boolean') {
                paused = pause;
                var i;
                for (i= 0; i < listener.length; ++i) {
                    listener[i].pause(pause);
                }
                for (i= 0; i < sub_modules.length; ++i) {
                    sub_modules[i].pause(pause);
                }
            }
            return paused;
        };

        module.eType = "eModule";  // ETYPE

        return module;
    }
    // }}}

    // custom_event _public_ api
    // ==================================================================

    // Register an EventListener.
    // @see eOnSpec.js
    _e.on = registerEventListener;

    // Register an "idle" EventListener.
    _e.idle = registerIdleEventListener;

    // Register an "one-time" EventListener.
    _e.once = registerEventListenerOnce;

    // TODO require
    //      - think about persistence here..
    // _e.require [topic-a, topic-b, ..], function(topicA, topicB, ..)

    // Emit an Event.
    _e.emit = emitEvent;

    // Emit an Event and collect all results (if any).
    // @see eCollectSpec.js
    _e.collect = function() {
        emitEvent.apply(root, [{ collect: true }].concat(Array.prototype.slice.call(arguments)));
    };

    // TODO _e.get "topic", function() {}
    //      should we persist listeners here?

    // Connect multiple topics together.
    _e.connect = connectEventListener;

    // Destroy a registered EventListener.
    _e.destroy = destroy;


    // XXX @obsolete
    // module API
    _e.Module = createModule;


    // options
    _e.options = {
        pathSeparator: '/',
        greedyChar: '*',
        insatiableSequence: '**',
        trace: false
    };

    // debug
    _e._rootNode = rootNode;
})();
