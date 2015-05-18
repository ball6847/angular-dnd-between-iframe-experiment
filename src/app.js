(function(){
    'use strict';

    var app = angular.module('app', ['ui.router', 'ngDragDrop', 'app.iframeService']);

    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('app', {
                url: '/',
                templateUrl: 'src/templates/main.html',
                controller: 'MainController',
                resolve: {
                    // simple signal service, to make the controller wait for iframe app
                    ready: ['IframeReadySignal', function(IframeReadySignal) {
                        return IframeReadySignal.promise;
                    }],

                    // we need to chain iScope to iframeReady to tell router to wait for iframeReadySignal
                    // then we will can retrieve scope which has been just injected vai resolve
                    iScope: ['ready', 'IframeService', function(ready, IframeService) {
                        return IframeService.getScope();
                    }]
                }
            });
    }]);

    // ---------------------------------------------------------------

    // iScope is what we want
    app.controller('MainController', ['$scope', function($scope) {}]);

    angular.bootstrap(document.body, ['app']);

    // ---------------------------------------------------------------

    angular.module('iframeApp', ['ngDragDrop'])
        .controller('MainController', ['$scope', function($scope) {
            $scope.onDrop = function(){
                alert("Drop signal received!!");
            };
        }]);

    angular.element('#iframe-app').on('load', function() {
        angular.bootstrap(this.contentDocument, ['iframeApp']);
        var el = angular.element(this.contentDocument.body);
        angular.element('[ng-app=app]').injector().get('IframeReadySignal').resolve(el);
    });

})();
