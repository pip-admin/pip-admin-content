

export interface IAddFilesService {
    show(params: any, successCallback?: (SVGFilterElement) => void, cancelCallback?: () => void): any;
}

class AddFilesService implements IAddFilesService {
    public _mdDialog: angular.material.IDialogService;
    public constructor($mdDialog: angular.material.IDialogService) {
        this._mdDialog = $mdDialog;
    }
    public show(params, successCallback?: (file) => void, cancelCallback?: () => void) {
         this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'files/AddFilesDialog.html',
            controller: 'pipAddFileDialogController',
            controllerAs: 'vm',
            locals: {params: params},
            clickOutsideToClose: true
         })
        .then((file) => {
            if (successCallback) {
                successCallback(file);
            }
        }, () => {
            if (cancelCallback) {
                cancelCallback();
            }
        });
                
    }
    
}

angular
    .module('pipAddFileDialog')
    .service('pipAddFileDialog', AddFilesService);