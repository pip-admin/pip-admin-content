

export interface IAddBlobsService {
    show(params: any, successCallback?: (SVGFilterElement) => void, cancelCallback?: () => void): any;
}

class AddBlobsService implements IAddBlobsService {
    public _mdDialog: angular.material.IDialogService;
    public constructor($mdDialog: angular.material.IDialogService) {
        this._mdDialog = $mdDialog;
    }
    public show(params, successCallback?: (blob) => void, cancelCallback?: () => void) {
         this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'blobs/AddBlobsDialog.html',
            controller: 'pipAddBlobDialogController',
            controllerAs: 'vm',
            locals: {params: params},
            clickOutsideToClose: true
         })
        .then((blob) => {
            if (successCallback) {
                successCallback(blob);
            }
        }, () => {
            if (cancelCallback) {
                cancelCallback();
            }
        });
                
    }
    
}

angular
    .module('pipAddBlobsDialog')
    .service('pipAddBlobsDialog', AddBlobsService);