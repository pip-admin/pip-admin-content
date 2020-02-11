export interface IFilesDataProvider {

}

export interface IFilesDataService {
    readFiles(params: any, start: number, take: number, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createFile(data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateFile(file_id: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
 deleteFileById(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
 readFilesGroups(successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> ;
}
