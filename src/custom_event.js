/*globals exports:true */
/*globals define */
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
    // ___ CustomEventListener ____________________________________________ {{{

    var g_nextListenerId = 1
      //, g_allListener = {}
      ;

    function find_function(obj, pathItems) {
        var propName;
        while (!!(propName = pathItems.shift())) {
            if (propName in obj) {
                obj = obj[propName];
            } else {
                return;
            }
        }
        if (typeof obj === 'function') {
            return obj;
        } else {
            return;
        }
    }

    function makeCustomEventListener(node, action) {

        var action_type = typeof action
          , isDeepListener = action_type === 'object'

          , listenerAPI = {
                id: (g_nextListenerId++),
                node: node,
                type: 'CustomEventListener',
                actionType: action_type,
                isDeepListener: isDeepListener,
                action: action
            }
          ;

        if ('function' === action_type) {

            listenerAPI.callAction = function(restPathItems, args) {
                // TODO filter: pause,..
                if (!restPathItems) {
                    if (args) {
                        action.apply(root, args);
                    } else {
                        action.apply(root);
                    }
                }
            };

        } else if ('object' === action_type) {

            listenerAPI.callAction = function(restPathItems, args) {
                // TODO filter: pause,..
                if (restPathItems) {
                    var fn = find_function(action, restPathItems);
                    if (fn) {
                        if (args) {
                            fn.apply(action, args);
                        } else {
                            fn.apply(action);
                        }
                    }
                }
            };

        } else {
            log.error('unsupported listener action type:', action_type);

            listenerAPI.callAction = function(){};
        }

        if (isDeepListener) {
            node.deepListener.push(listenerAPI);
        } else {
            node.listener.push(listenerAPI);
        }

        listenerAPI.destroy = function() {
            var listener = isDeepListener ? node.deepListener : node.listener
              , i = listener.indexOf(listenerAPI);
            if (i >= 0) {
                listener.splice(i, 1);
            }
            for (var prop in listenerAPI) {
                if (listenerAPI.hasOwnProperty(prop)) {
                    delete listenerAPI[prop];
                }
            }
        };

        //g_allListener[listenerAPI.id] = listenerAPI;

        return listenerAPI;
    }

    // ____________________________________________________________________ }}}
    // ___ EventNode ______________________________________________________ {{{

    function makeEventNode(name, parentNode) {

        var children = {};

        var nodeAPI = function(path, callback) {
            var node = nodeAPI.findOrCreate(to_path(path))
              , listener = [];

            var sub_node_api = {
                on: function(_path, action) {
                    var listen = node.on(_path, action);
                    listener.push(listen);
                    return listen;
                },
                emit: node.emit,
                clear: function() {
                    listener.forEach(function(listen) {
                        if (typeof listen.destroy === 'function') {
                            listen.destroy();
                        }
                    });
                    listener = [];
                },
                group: node
            };

            if (typeof callback === 'function') {
                callback(sub_node_api);
            }

            return sub_node_api;
        };

        nodeAPI.type = 'CustomEventNode';
        nodeAPI.nodeName = name;
        nodeAPI.isRootNode = !parentNode;
        nodeAPI.parentNode = parentNode;
        nodeAPI.rootNode = g_rootNode;
        nodeAPI.listener = [];
        nodeAPI.deepListener = [];

        // ___ path _______________________________________________________ {{{
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
        // ________________________________________________________________ }}}
        // ___ addChild ___________________________________________________ {{{
        nodeAPI.addChild = function(nodeName) {
            if (!children[nodeName]) {
                var childNode = makeEventNode(nodeName, nodeAPI);
                children[nodeName] = childNode;
                return childNode;
            } else {
                throw new CustomEventError('addChild: nodeName should be unique: '+nodeName);
            }
        };
        // ________________________________________________________________ }}}
        // ___ getChild ___________________________________________________ {{{
        nodeAPI.getChild = function(nodeName) {
            return children[nodeName];
        };
        // ________________________________________________________________ }}}
        // ___ _to_path ___________________________________________________ {{{
        function to_path(path) {
            return typeof path === 'string' ? new NodePath(path, nodeAPI) : path;
        }
        // ________________________________________________________________ }}}
        // ___ find, match, findOrCreate __________________________________ {{{
        function find_node(path) {
            var path_items = path.pathItems()
              , next_name
              , node = nodeAPI
              ;
            while (!!(next_name = path_items.shift())) {
                node = node.getChild(next_name);
                if (!node) {
                    break;
                }
            }
            return node;
        }

        function find_or_create_node(path) {
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

        function match_node(path, isDeepMatch) {
            var path_items = path.pathItems()
              , next_name
              , next_node
              , cur_node = nodeAPI
              , rest_path
              , visited_nodes
              ;

            if (isDeepMatch) {
                visited_nodes = [{
                    node: cur_node,
                    restPathItems: path_items.slice(0)
                }];
            }

            while (!!(next_name = path_items.shift())) {
                next_node = cur_node.getChild(next_name);

                if (!next_node) {
                    path_items.splice(0, 0, next_name);
                    break;
                }

                cur_node = next_node;

                if (isDeepMatch) {
                    if (cur_node.listener.length > 0) {  // TODO deepListener
                        visited_nodes.push({
                            node: cur_node,
                            restPathItems: (path_items.length > 0 ? path_items.slice(0) : undefined)
                        });
                    }
                }
            }

            //if (isDeepMatch) {
                //console.log('DEEPMATCH', visited_nodes.map(function(m){
                    //return [(m.node.isRootNode ? '<root>' : '<'+m.node.nodeName+'>'), (m.restPathItems ? m.restPathItems.join('/') : '-/-')];
                //}));
            //}

            return {
                node: cur_node,
                restPathItems: (path_items.length > 0 ? path_items : undefined),
                visitedNodes: visited_nodes
            };
        }

        function make_finder(finderMethod, actionCallback, travelAlwaysFromRoot) {
            return function(path) {
                path = to_path(path);
                if (travelAlwaysFromRoot) {
                    path = path.absolutePath();
                }
                if (path.isAbsolute) {
                    if (nodeAPI.isRootNode) {
                        return actionCallback(path, travelAlwaysFromRoot);
                    } else {
                        return nodeAPI.rootNode[finderMethod](path, travelAlwaysFromRoot);
                    }
                } else { // path.node is available
                    if (nodeAPI === path.node) {
                        return actionCallback(path);
                    } else {
                        return path.node[finderMethod](path);
                    }
                }
            };
        }

        nodeAPI.find = make_finder('find', find_node);
        nodeAPI.match = make_finder('match', match_node);
        nodeAPI.deepMatch = make_finder('deepMatch', match_node, true);
        nodeAPI.findOrCreate = make_finder('findOrCreate', find_or_create_node);
        // ________________________________________________________________ }}}

        nodeAPI.createEventListener = function(action) {
            return makeCustomEventListener(nodeAPI, action);
        };

        nodeAPI.on = function(path, action) {
            return nodeAPI.findOrCreate(path).createEventListener(action);
        };

        nodeAPI.forEachListener = function(fn) {
            nodeAPI.listener.forEach(fn);
            nodeAPI.deepListener.forEach(fn);
        };

        nodeAPI.emit = function(path) {
            var args = null;
            if (arguments.length > 1) {
                args = Array.prototype.slice.call(arguments, 1);
            }
            nodeAPI.deepMatch(path).visitedNodes.forEach(function(match) {
                match.node.forEachListener(function(listener) {
                    listener.callAction(match.restPathItems, args);
                });
            });
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

    _e.on = g_rootNode.on;
    _e.emit = g_rootNode.emit;

    _e.group = g_rootNode;

    // ____________________________________________________________________ }}}

})();
