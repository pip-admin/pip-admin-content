

(() => {
    'use strict';

    var thisModule = angular.module('pipSampleConfig',
        ['pipShell', 'pipEntry', 'pipLayout', 'pipNav']); //'pipRest.State', 'pipSideNav', 'pipAppBar', 

    // Configure application services before start
    thisModule.config(
        function ($mdIconProvider, $urlRouterProvider, pipAuthStateProvider, $stateProvider,
            pipTranslateProvider, pipSideNavProvider, pipNavMenuProvider, pipRestProvider) { //pipSideNavProvider, pipAppBarProvider,  

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);

            pipNavMenuProvider.sections = [
                {
                    title: 'About',
                    icon: 'icons:goal',
                    links: [
                        { title: 'ABOUT_ME', url: '/about_me' },
                        { title: 'Files', url: '/files' },
                        { title: 'Blobs', url: '/blobs' }
                    ]
                },
                {
                    links: [
                        { title: 'SIGNOUT', url: '/signout' }
                    ]
                }
            ];
            pipSideNavProvider.part('user', true);
            pipSideNavProvider.part('links', true);
            pipSideNavProvider.type = 'sticky';

            $stateProvider.state('about_me', {
                url: '/about_me',
                auth: false,
                template: 'about_me'
            })


            // Set global constants
            /*            
                        pipAppBarProvider.appTitleText('Entry Sample Application');
                        pipAppBarProvider.globalSecondaryActions([
                            {name: 'global.signout', title: 'SIGNOUT', state: 'signout'}
                        ]);
            */
            // Configure REST API
            // pipRestProvider.version('1.0');
            pipRestProvider.serverUrl = 'http://api.positron.stage.iquipsys.net:30001';
            $urlRouterProvider.otherwise(($injector, $location) => {
                return $location.$$path === '' ? '/' : '/about_me';
            });

            // String translations
            pipTranslateProvider.translations('en', {
                SAMPLE_APPLICATION: 'Sample application',
                ABOUT_ME: 'About Me',
                ABOUT_SYSTEM: 'About system',
                SIGNOUT: 'Sign out'
            });

            pipTranslateProvider.translations('ru', {
                SAMPLE_APPLICATION: 'Пример приложения',
                ABOUT_ME: 'Обо мне',
                ABOUT_SYSTEM: 'О системе',
                SIGNOUT: 'Выйти'
            });

            // Configure default states
            pipAuthStateProvider.unauthorizedState = 'signin';
            pipAuthStateProvider.authorizedState = 'about_me';

        }
    );


})();

