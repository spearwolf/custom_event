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

    // ___ custom_event core __________________________________________________

    var g_rootNode
      //, g_allNodes = {}
      ;

    // ___ CustomEventError _______________________________________________ {{{

    function CustomEventError(message, name) {
        this.message = message || 'unknown reason';
        this.name = name || 'CustomEventError';
    }

    CustomEventError.prototype.toString = function() {
        return this.name + ': ' + this.message;
    };

    // ____________________________________________________________________ }}}
    // ___ NodePath _______________________________________________________ {{{

    function NodePath(path, node) {
        if (!path) {
            if (node) {
                path = '';
            } else {
                path = '/';
            }
        }
        if (path[0] === '/') {
            this.path = path;
            this.isAbsolute = true;
        } else {
            if (node) {
                this.node = node;
                this.path = path;
                this.isAbsolute = false;
            } else {
                this.isAbsolute = true;
                this.path = '/' + path;
            }
        }
    }

    NodePath.prototype.toString = function() {
        return this.path;
    };

    NodePath.prototype.pathItems = function() {
        var items = this.path.split('/')
          , path_items = []
          ;
        for (var i = 0; i < items.length; i++) {
            if (items[i]) {
                path_items.push(items[i]);
            }
        }
        return path_items;
    };

    NodePath.prototype.absolutePath = function() {
        if (this.isAbsolute) {
            return this;
        } else {
            if (this.node) {
                var path_items = [this.node.nodeName].concat(this.pathItems())
                  , par_node = this.node.parentNode
                  ;
                while (par_node) {
                    if (!par_node.isRootNode) {
                        path_items.splice(0, 0, par_node.nodeName);
                    }
                    par_node = par_node.parentNode;
                }
                return new NodePath('/' + path_items.join('/'));
            } else {
                throw new CustomEventError('NodePath.absolutePath: relative path without node');
            }
        }
    };

    /*
    NodePath.prototype.join = function(otherPath) {
        if (typeof otherPath === 'string') {
            otherPath = new NodePath(otherPath, this.node); // XXX targetNode
        }
        if (otherPath.isAbsolute) {
            throw new CustomEventError('NodePath.join: otherPath should not be absolute');
        }
        return new NodePath(this.absolutePath() + '/' + otherPath);
    };
    */

    // ____________________________________________________________________ }}}
    // ___ EventNode ______________________________________________________ {{{

    function makeEventNode(name, parentNode) {

        var children = {}
          , nodeAPI = {
                type: 'CustomEventNode',
                nodeName: name,
                isRootNode: !parentNode,
                parentNode: parentNode
            }
          ;

        nodeAPI.rootNode = (function(){
            if (nodeAPI.isRootNode) {
                return undefined;
            } else {
                return g_rootNode;
            }
        })();

        nodeAPI.path = (function(){
            if (nodeAPI.isRootNode) {
                return undefined;
            } else {
                var path = '/' + nodeAPI.nodeName;
                if (parentNode !== nodeAPI.rootNode) {
                    path = parentNode.path.toString() + path;
                }
                return new NodePath(path, nodeAPI);
            }
        })();

        nodeAPI.addChild = function(nodeName) {
            if (!children[nodeName]) {
                var childNode = makeEventNode(nodeName, nodeAPI);
                children[nodeName] = childNode;
                return childNode;
            } else {
                throw new CustomEventError('addChild: nodeName should be unique: '+nodeName);
            }
        };

        nodeAPI.getChild = function(nodeName) {
            return children[nodeName];
        };

        function to_path(path) {
            return typeof path === 'string' ? new NodePath(path, nodeAPI) : path;
        }

        function _find_or_create(path) {
            var path_items = path.pathItems()
              , next_name
              , next_node
              , cur_node = nodeAPI
              ;
            while (!!(next_name = path_items.shift())) {
                next_node = cur_node.getChild(next_name);
                if (!next_node) {
                    next_node = cur_node.addChild(next_name);
                }
                cur_node = next_node;
            }
            return cur_node;
        }

        nodeAPI.findOrCreate = function(path) {
            path = to_path(path);
            if (path.isAbsolute) {
                if (nodeAPI.isRootNode) {
                    return _find_or_create(path);
                } else {
                    return nodeAPI.rootNode.findOrCreate(path);
                }
            } else { // path.node is available
                if (nodeAPI === path.node) {
                    return _find_or_create(path);
                } else {
                    return path.node.findOrCreate(path);
                }
            }
        };

        return nodeAPI;
    }

    // ____________________________________________________________________ }}}
    // ___ initialize _____________________________________________________ {{{

    g_rootNode = makeEventNode();

    // ____________________________________________________________________ }}}
    // ___ public API _____________________________________________________ {{{

    _e.log = log;
    _e.rootNode = g_rootNode;
    _e.NodePath = NodePath;

    // ____________________________________________________________________ }}}

})();
