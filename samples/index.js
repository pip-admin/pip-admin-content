(function (angular, _) {
    'use strict';

    var thisModule = angular.module('appSamples',
        [
            // 3rd Party Modules
            'ui.router', 'ui.utils', 'ngResource', 'ngAria', 'ngCookies', 'ngSanitize', 'ngMessages',
            'ngMaterial', 'wu.masonry', 'LocalStorageModule', 'angularFileUpload', 'ngAnimate',
            // Application Configuration must go first
            'pipSampleConfig', 
            // Modules from WebUI Framework
            'pipNav', 'pipContent', 'pipAdminContent.Templates', 'pipDialogs', 'pipFiles', 'pipFiles.Select',
             
            
        ]
    );

    thisModule.controller('pipSampleController',
        function ($scope, $rootScope, $state, $mdSidenav, pipTranslate, pipRest, pipToasts,
                  pipSession, $mdTheming, $timeout) {

            
            $scope.isEntryPage = () => {
                return $state.current.name === 'signin' || $state.current.name === 'signup' ||
                    $state.current.name === 'recover_password' || $state.current.name === 'post_signup';
            };

        }
    );

})(window.angular, window._);
