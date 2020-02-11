(() => {
    'use strict';

    angular.module('pipContent', [
        'pipDirective',

        'pipFilesResources',
        'pipFilesData',
        'pipAddFileDialog',
        'pipFilesPanel',
        'pipFilesPage',

        'pipBlobsResources',
        'pipBlobsData',        
        'pipAddBlobsDialog',
        'pipBlobsPanel',
        'pipBlobsPage',

    ]);
})();
