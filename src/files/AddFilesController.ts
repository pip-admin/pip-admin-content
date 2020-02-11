'use strict';


export class FileDialogData {
    public Collection: string;
    public fileName: string;
    public description: string;
    public contentType: string;
    public content: string;
}
export class AddFileDialogController {

    public $mdDialog: angular.material.IDialogService;
    public theme: string;
    public edit: boolean;
    public file: FileDialogData;
    public localFile: any;
    public filesCollections: string[];
    public callback: Function;
    public errorCallback: Function;
    public cancel: Function;
    public retry: Function;
    public setFile: Function;

    constructor(
        params,
        $mdDialog: angular.material.IDialogService,
        $rootScope,
        private pipFileUpload: pip.files.IFileUploadService,
        private pipRest: pip.rest.IRestService) {
        "ngInject";

        //this.pipFileUpload.globalProgress = null;
        this.$mdDialog = $mdDialog;
        this.theme = $rootScope.$theme;
        this.file = params.file || {};
        this.errorCallback = params.errorCallback;
        this.callback = params.callback;
        this.filesCollections = params.filesCollection;
        if (params.file) {
            this.edit = true;
        }
        this.cancel = () => { this.onCancel(); };
        this.retry = () => { this.onOk(); };
        this.setFile = (file) => {
            this.localFile = file;
        }
    }

    public onOk() {

        if (!this.edit) {
            if (this.localFile == null) {
                return;
            }

            let uploadUrl: string = this.pipRest.serverUrl + "/api/1.0/blobs";

            this.pipFileUpload.upload(
                this.localFile,
                uploadUrl,
                (data: any, err: any) => {
                    console.log(data);
                    data.description = this.file.description;
                    data.collection = this.file.Collection;
                    if (!err) {
                        this.$mdDialog.hide(data);
                    }
                }
            );
        } else {
            this.$mdDialog.hide(this.file);
        }

    }
    /*
      public globalProgress():string {
          return this.pipFileUpload.globalProgress;
      }*/

    public onCancel(): void {
        this.$mdDialog.cancel();
    }


    public filterFilesCollections(search: string) {
        let result = [];
        _.each(this.filesCollections, (files: string) => {
            if (files.toLowerCase().indexOf(search.toLowerCase()) > -1) result.push(files);
        });

        return result;
    }
}

angular
    .module('pipAddFileDialog', ['ngMaterial', 'pipFiles', 'pipFiles.Templates'])
    .controller('pipAddFileDialogController', AddFileDialogController);

import './AddFilesService';