export interface IBlobsDataProvider {

}

export interface IBlobsDataService {
    readBlobs(params: any, start: number, take: number, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createBlob(data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateBlob(file_id: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    deleteBlobById(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}
