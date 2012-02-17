// custom_event.js
// Created 2010/05/07 by Wolfger Schramm <wolfger@spearwolf.de>
(function() {

    var root = this, _e = { VERSION: "0.7.0-pre" };

    // Export the custom_event object {{{
    // for **Node.js** and **"CommonJS"**, with backwards-compatibility for the old `require()` API.
    // If we're not in CommonJS, add `_` to the global object.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _e;
        }
        exports._e = _e;
    } else if (typeof define === 'function' && define.amd) {
        // Register as a named module with AMD.
        define('custom_event', function() {
            return _e;
        });
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
            child, i;

        for (i = 0; i < this.insatiableChildren.length; i++) {
            // TODO find insatiableChildren from parents
            fn(this.insatiableChildren[i], path);
        }
        if (rest.length > 0) {
            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                if (name === _e.options.greedyChar || name === child.name) {
                    child.matchNodes(rest, fn);
                }
            }
            for (i = 0; i < this.greedyChildren.length; i++) {
                this.greedyChildren[i].matchNodes(rest, fn);
            }
        } else {
            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                if (name === _e.options.greedyChar || name === child.name) {
                    fn(child);
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

    EventNode.prototype.addCallback = function (callbackFn, options) {  // {{{
        var callback = {
            eType: 'CallbackFn',  // ETYPE
            id: nextCallbackId++,
            name: options.name,
            fn: callbackFn,
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

    function registerEventListener(eventPath, callbackFn, options) {  // {{{
        var opts = options || {};
        opts.name = eventPath;
        var listener = rootNode.findOrCreateNode(eventPath).addCallback(callbackFn, opts);
        return {
            eType: 'EventListener',  // ETYPE
            id: listener.id,
            name: listener.name,
            unbind: function() { _e.unbind(listener.id); },
            action: function() { _e.action.apply(root, [listener.name].concat(Array.prototype.slice.call(arguments))); },
            pause: function(pause) { 
                if (typeof pause === 'boolean') {
                    listener.paused = pause;
                }
                return listener.paused;
            }
        };
    }
    // }}}

    function registerEventListenerOnce(eventPath, callbackFn, options) {  // {{{
        var opts = options || {};
        opts.once = true;
        return registerEventListener(eventPath, callbackFn, opts);
    }
    // }}}

    function registerIdleEventListener(eventPath, idleTimeout, callbackFn, options) {  // {{{
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

            unbind: function() {
                clearTimer();
                listener.unbind();
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

            touch: function() { listener.action(); }
        };

        function callIdleFunc() {
            idleTimer = undefined;
            listener.pause(true);
            callbackFn.apply(api);
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
            _e._emitStackTrace = { currentLevel: 1 };
        } else {
            ++_e._emitStackTrace.currentLevel;
        }
        return _e._emitStackTrace;
    }
    // }}}

    function clearEmitStackTrace() {  // {{{
        --_e._emitStackTrace.currentLevel;
        if (_e._emitStackTrace.currentLevel === 0) {
            _e._emitStackTrace = { currentLevel: 0 };
        }
    }
    // }}}

    function emitEvent(eventName) {  // {{{

        if (_e.options.debug) { console.group("_e.action ->", eventName); }

        var args = [],
            results = [],
            result_fn,
            i, len;

        for (i = 1, len = arguments.length; i < len; ++i) {
            if (i === len - 1 && typeof arguments[i] === 'function') {
                result_fn = arguments[i];
            } else {
                args.push(arguments[i]);
            }
        }

        var stacktrace = createEmitStackTrace();

        rootNode.matchNodes(eventName, function (node, restPath) {
            try {
                var destroy_callback_ids = [], call_count,

                    unbind = function(id) {
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
                    callback;

                for (i = 0; i < node.callbacks.length; i++) {
                    callback = node.callbacks[i];

                    if (callback.paused) {
                        continue;
                    }

                    if (!(callback.id in _e._emitStackTrace)) {
                        stacktrace[callback.id] = 1;

                        context = callback.binding || {};
                        context.name = eventName;
                        context.unbind = unbind(callback.id);

                        if (typeof context.pause !== 'function') {  // don't overwrite _e.Module's pause()
                            context.pause = pause(callback);
                        }

                        if (typeof restPath !== 'undefined') {
                            context.pathArgs = restPath.split(_e.options.pathSeparator);
                            result = callback.fn.apply(context, context.pathArgs.concat(args));
                        } else {
                            result = callback.fn.apply(context, args);
                        }

                        if (callback.once) {
                            destroy_callback_ids.push(callback.id);
                        }

                        if (result !== null && typeof result !== 'undefined') {
                            results.push(result);
                        }
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

        if (_e.options.debug) { console.groupEnd(); }
    }
    // }}}

    function unbind(pathOrId, node) {  // {{{
        node = node || rootNode;

        if (typeof pathOrId === 'number') {
            if (node.destroyCallbacks([pathOrId]) > 0) {
                return true;
            } else {
                var i;
                for (i = 0; i < node.children.length; i++) {
                    if (unbind(pathOrId, node.children[i])) {
                        return true;
                    }
                }
                for (i = 0; i < node.greedyChildren.length; i++) {
                    if (unbind(pathOrId, node.greedyChildren[i])) {
                        return true;
                    }
                }
                for (i = 0; i < node.insatiableChildren.length; i++) {
                    if (unbind(pathOrId, node.insatiableChildren[i])) {
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
            action = listener.shift();
        return _e.on(action, function() {
            var args = Array.prototype.slice.call(arguments);
            for (var j = 0; j < listener.length; ++j) {
                _e.action.apply(this, [listener[j]].concat(args));
            }
        });
    }
    // }}}

    function createModule(rootPath, module) {  // {{{
        rootPath = rootPath.replace(/\/+$/, '');
        var listener = [], sub_modules = [], annotation;

        if (_e.options.debug) { console.group("_e.Module ->", rootPath); }

        if ("_init" in module) {
            if (_e.options.debug) { console.log("constructor", rootPath+_e.options.pathSeparator+_e.options.insatiableSequence); }
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
                                if (_e.options.debug) { console.log("on", rootPath+_e.options.pathSeparator+annotation[0]); }
                                listener.push(_e.on(rootPath+_e.options.pathSeparator+annotation[0], module[prop], { binding: module }));
                            } else if (annotation[1] === '..') {
                                if (_e.options.debug) { console.log("on", rootPath+_e.options.pathSeparator+annotation[0]+_e.options.pathSeparator+_e.options.insatiableSequence); }
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
        if (_e.options.debug) { console.groupEnd(); }

        module.destroy = function() {
            var i;
            for (i= 0; i < listener.length; ++i) {
                listener[i].unbind();
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

    // custom event API
    _e.on = registerEventListener;
    _e.idle = registerIdleEventListener;
    _e.once = registerEventListenerOnce;
    _e.action = emitEvent;
    _e.connect = connectEventListener;  // TODO connect groups API
    _e.unbind = unbind;
    
    // module API
    _e.Module = createModule;

    // options
    _e.options = {
        pathSeparator: '/',
        greedyChar: '*',
        insatiableSequence: '**',
        debug: false
    };

    // debug
    _e._rootNode = rootNode;
})();
