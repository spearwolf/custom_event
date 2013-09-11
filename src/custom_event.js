/*globals define exports:true */
(function() {

    // ___ Namespace, CommonJS and AMD Support ____________________________ {{{

    // Export VERSION
    var root = this, _e = { "VERSION": "0.8.0" };

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
    // ___ log ____________________________________________________________ {{{

    var log = (function() {

        var has_console = typeof root.console !== 'undefined' && typeof Function === 'function' && typeof Function.prototype.bind === 'function',
            has_console_group = has_console && typeof root.console.group === 'function',
            logPrefix = "custom_event.js:",
            log = {
                node_env: (typeof window === 'undefined')
            },

            bindConsole = !has_console ? undefined : function(method) {
                return Function.prototype.bind.call(console[method], console);
            },

            _error = has_console ? bindConsole("error") : null,
            _debug = has_console ? bindConsole("log") : null,
            _trace = has_console ? bindConsole("log") : null,
            _group = has_console_group ? bindConsole("group") : null,

            groupPrefix = "";


        if (has_console) {
            log.error = function() {
                _error.apply(console, [groupPrefix+logPrefix].concat(Array.prototype.slice.call(arguments)));
            };
            log.debug = function() {
                if (_e.options.debug) {
                    _debug.apply(console, [groupPrefix+logPrefix].concat(Array.prototype.slice.call(arguments)));
                }
            };
            log.trace = function() {
                if (_e.options.trace) {
                    _trace.apply(console, [groupPrefix+logPrefix].concat(Array.prototype.slice.call(arguments)));
                }
            };
            if (has_console_group) {
                log.debugGroup = function() {
                    if (_e.options.debug) {
                        _group.apply(console, [groupPrefix+logPrefix].concat(Array.prototype.slice.call(arguments)));
                    }
                };
                log.debugGroupEnd = function() {
                    if (_e.options.debug) {
                        console.groupEnd();
                    }
                };
                log.traceGroup = function() {
                    if (_e.options.trace) {
                        _group.apply(console, [groupPrefix+logPrefix].concat(Array.prototype.slice.call(arguments)));
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
                        _debug.apply(root, [groupPrefix+logPrefix].concat(Array.prototype.slice.call(arguments)));
                        groupPrefix += "    ";
                    }
                };
                log.traceGroup = function() {
                    if (_e.options.trace) {
                        _trace.apply(root, [groupPrefix+logPrefix].concat(Array.prototype.slice.call(arguments)));
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
    })();
    // }}}

    //___ custom_event core ___________________________________________________







    // ___ public API _________________________________________________________

    _e.log = log;

})();
