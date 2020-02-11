import { IFilesDataService, IFilesDataProvider } from './IFilesDataService';

class FilesData implements IFilesDataService {
    private RESOURCE: string = 'files';

    constructor(
        private $stateParams: angular.ui.IStateParamsService,
        private pipRest: pip.rest.IRestService,
        private pipSession: pip.services.ISessionService
    ) { "ngInject"; }

    public readFiles(params: any, start: number = 0, take: number = 100, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.skip = start;
        params.total = true;
        params.take = take;
        return this.pipRest.getResource('files').get(
            params,
            (data: any) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public readFilesGroups(successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {

        return this.pipRest.getResource('files_groups').get(
            null,
            (data: any) => {
                if (successCallback) {
                    successCallback(data.data);
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public updateFile(file_id: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource('files').update(
            {
                file_id: file_id
            },
            data,
            (data: any) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public createFile(data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource('files').save(
            data,
            (data: any) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public deleteFileById(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource('files').delete(
            { file_id: id },
            (data: any) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

}

class FilesDataProvider implements IFilesDataProvider {
    private _service: IFilesDataService;
    private RESOURCE: string = 'files'

    constructor() { }

    public $get(
        $stateParams: angular.ui.IStateParamsService,
        pipRest: pip.rest.IRestService,
        pipSession: pip.services.ISessionService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new FilesData($stateParams, pipRest, pipSession);
        }

        return this._service;
    }

}

angular
    .module('pipFilesData', ['pipRest'])
    .provider('pipFilesData', FilesDataProvider);


