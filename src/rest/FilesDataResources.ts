function configFilesResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerPagedCollection('files', '/api/v1/files/:file_id',
        { file_id: '@file_id' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });
    pipRestProvider.registerPagedCollection('files_groups', '/api/v1/files/groups');
}

angular
    .module('pipFilesResources', [])
    .config(configFilesResources);