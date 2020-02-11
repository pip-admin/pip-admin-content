import { IBlobsDataService, IBlobsDataProvider } from './IBlobsDataService';

class BlobsData implements IBlobsDataService {
    private RESOURCE: string = 'blobs';

    constructor(
        private $stateParams: angular.ui.IStateParamsService,
        private pipRest: pip.rest.IRestService,
        private pipSession: pip.services.ISessionService
    ) { "ngInject"; }

    public readBlobs(params: any, start: number = 0, take: number = 100, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.skip = start;
        params.total = true;
        params.take = take;
        return this.pipRest.getResource('blobs').get(
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


    public updateBlob(blob_id: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource('blobs').update(
            {
                blob_id: blob_id
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

    public createBlob(data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource('blobs').save(
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

    public deleteBlobById(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource('blobs').delete(
            { blob_id: id },
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

class BlobsDataProvider implements IBlobsDataProvider {
    private _service: IBlobsDataService;
    private RESOURCE: string = 'blobs'

    constructor() { }

    public $get(
        $stateParams: angular.ui.IStateParamsService,
        pipRest: pip.rest.IRestService,
        pipSession: pip.services.ISessionService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new BlobsData($stateParams, pipRest, pipSession);
        }

        return this._service;
    }

}

angular
    .module('pipBlobsData', ['pipRest'])
    .provider('pipBlobsData', BlobsDataProvider);


