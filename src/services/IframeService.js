(function(){

    angular.module('app.iframeService', [])
    
    // iframeService contains scope instance of the iframe
    .factory('IframeService', [function() {
        var el;
        return {
            setElement: function($el) {
                el = $el;
            },
            getElement: function() {
                return el;
            },
            getScope: function() {
                return el.scope();
            }
        }
    }])

    // iframeReadySignal, this service will be retrieve in iframe via injector, and will be called when the app in the iframe already initialized
    .factory('IframeReadySignal', ['$q', 'IframeService', function($q, IframeService) {
        var deferred = $q.defer();

        // set scope on success
        deferred.promise.then(function(el) {
            IframeService.setElement(el);
        });

        return deferred;
    }]);

})();
