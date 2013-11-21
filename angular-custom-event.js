// https://github.com/spearwolf/custom_event
(function(){
    "use strict";

    angular.module('spearwolf.custom-event', [])

        .factory('_e', ['$rootScope', function($rootScope) {

            _e.on('__CustomEventCallStackEnd__', function(){
                $rootScope.$apply();
            });

            return _e;
        }])

        .directive('customEventOutput', ['_e', function(_e) {
            var listener;
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    listener = _e.on(attrs.customEventOutput, function(output) {
                        var el = element[0];
                        if (el && typeof output !== 'undefined') {
                            el.innerHTML = output;
                        }
                    });
                    scope.$on('$destroy', function(){
                        listener.destroy();
                    });
                }
            };
        }])

        ;
})();
