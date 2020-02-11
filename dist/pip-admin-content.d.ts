declare module pip.admin.content {

export class AddBlobDialogController {
    private pipFileUpload;
    private pipRest;
    $mdDialog: angular.material.IDialogService;
    theme: string;
    edit: boolean;
    blob: any;
    localBlob: any;
    blobsCollections: string[];
    callback: Function;
    errorCallback: Function;
    cancel: Function;
    retry: Function;
    setBlob: Function;
    constructor(params: any, $mdDialog: angular.material.IDialogService, $rootScope: any, pipFileUpload: pip.files.IFileUploadService, pipRest: pip.rest.IRestService);
    onOk(): void;
    onCancel(): void;
    filterBlobsCollections(search: string): any[];
}

export interface IAddBlobsService {
    show(params: any, successCallback?: (SVGFilterElement) => void, cancelCallback?: () => void): any;
}

class BlobsController {
    private $window;
    private pipNavService;
    constructor($window: ng.IWindowService, $scope: ng.IScope, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, $mdMedia: angular.material.IMedia, $injector: angular.auto.IInjectorService, pipNavService: pip.nav.INavService);
    private appHeader();
    onRetry(): void;
}
function configureBlobsRoute($injector: angular.auto.IInjectorService, $stateProvider: any): void;




export class File {
    id: string;
    group: string;
    name: string;
    description: string;
    content_id: string;
    content_uri: string;
    thumbnail_id: string;
    thumbnail_uri: string;
    create_time: Date;
    expire_time: Date;
    attributes: any;
    custom_hdr: any;
    custom_dat: any;
}

export class FileInfoDataPage {
    data: File[];
    total: number;
}


export interface IBlobsDataProvider {
}
export interface IBlobsDataService {
    readBlobs(params: any, start: number, take: number, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createBlob(data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateBlob(file_id: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    deleteBlobById(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}

export interface IFilesDataProvider {
}
export interface IFilesDataService {
    readFiles(params: any, start: number, take: number, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createFile(data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateFile(file_id: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    deleteFileById(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readFilesGroups(successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}

export class FileDialogData {
    Collection: string;
    fileName: string;
    description: string;
    contentType: string;
    content: string;
}
export class AddFileDialogController {
    private pipFileUpload;
    private pipRest;
    $mdDialog: angular.material.IDialogService;
    theme: string;
    edit: boolean;
    file: FileDialogData;
    localFile: any;
    filesCollections: string[];
    callback: Function;
    errorCallback: Function;
    cancel: Function;
    retry: Function;
    setFile: Function;
    constructor(params: any, $mdDialog: angular.material.IDialogService, $rootScope: any, pipFileUpload: pip.files.IFileUploadService, pipRest: pip.rest.IRestService);
    onOk(): void;
    onCancel(): void;
    filterFilesCollections(search: string): any[];
}

export interface IAddFilesService {
    show(params: any, successCallback?: (SVGFilterElement) => void, cancelCallback?: () => void): any;
}

class FilesController {
    private $window;
    private pipNavService;
    constructor($window: ng.IWindowService, $scope: ng.IScope, $state: ng.ui.IStateService, $rootScope: ng.IRootScopeService, $mdMedia: angular.material.IMedia, $injector: angular.auto.IInjectorService, pipNavService: pip.nav.INavService);
    private appHeader();
    onRetry(): void;
}
function configureFilesRoute($injector: angular.auto.IInjectorService, $stateProvider: any): void;


function configBlobsResources(pipRestProvider: pip.rest.IRestProvider): void;

function configFilesResources(pipRestProvider: pip.rest.IRestProvider): void;

class SearchRowController {
    private _element;
    private _scope;
    private _timeout;
    private pipOnSearch;
    private ngDisable;
    localSearch: string;
    constructor($element: any, $attrs: angular.IAttributes, $scope: angular.IScope, $timeout: ng.ITimeoutService);
    isDisable(): boolean;
    onSearch(): void;
    onClear(): void;
    onKeyPress: (event: JQueryKeyEventObject) => void;
}

}
