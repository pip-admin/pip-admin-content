function configBlobsResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerPagedCollection('blobs', '/api/v1/blobs/:blob_id',
        { blob_id: '@blob_id' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });
}

angular
    .module('pipBlobsResources', [])
    .config(configBlobsResources);