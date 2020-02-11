'use strict';



export class AddBlobDialogController {

    public $mdDialog: angular.material.IDialogService;
    public theme: string;
    public edit: boolean;
    public blob: any;
    public localBlob: any;
    public blobsCollections: string[];
    public callback: Function;
    public errorCallback: Function;
    public cancel: Function;
    public retry: Function;
    public setBlob: Function;

    constructor(
        params,
        $mdDialog: angular.material.IDialogService,
        $rootScope,
        private pipFileUpload: pip.files.IFileUploadService,
        private pipRest: pip.rest.IRestService) {
        "ngInject";

        //this.pipBlobUpload.globalProgress = null;
        this.$mdDialog = $mdDialog;
        this.theme = $rootScope.$theme;
        this.blob = params.blob || {};
        this.errorCallback = params.errorCallback;
        this.callback = params.callback;
        this.blobsCollections = params.blobsCollection;
        if (params.blob) {
            this.edit = true;
        }
        this.cancel = () => { this.onCancel(); };
        this.retry = () => { this.onOk(); };
        this.setBlob = (blob) => {
            this.localBlob = blob;
        }
    }

    public onOk() {

        if (!this.edit) {
            if (this.localBlob == null) {
                return;
            }

            let uploadUrl: string = this.pipRest.serverUrl + "/api/1.0/blobs";

            this.pipFileUpload.upload(
                this.localBlob,
                uploadUrl,
                (data: any, err: any) => {
                    if (!err) {
                        this.$mdDialog.hide(data);
                    }
                }
            );
        } else {
            this.$mdDialog.hide(this.blob);
        }

    }
    /*
      public globalProgress():string {
          return this.pipBlobUpload.globalProgress;
      }*/

    public onCancel(): void {
        this.$mdDialog.cancel();
    }


    public filterBlobsCollections(search: string) {
        let result = [];
        _.each(this.blobsCollections, (blobs: string) => {
            if (blobs.toLowerCase().indexOf(search.toLowerCase()) > -1) result.push(blobs);
        });

        return result;
    }
}

angular
    .module('pipAddBlobsDialog', ['ngMaterial', 'pipFiles', 'pipFiles.Templates'])
    .controller('pipAddBlobDialogController', AddBlobDialogController);

import './AddBlobsService';