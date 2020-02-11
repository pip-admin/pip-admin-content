import { IBlobsDataService } from '../data/IBlobsDataService';

import {
    IAddBlobsService
} from './AddBlobsService';

class ToolsBlobsState {
    static Progress: string = 'progress';
    static Data: string = 'data';
    static Empty: string = 'empty';
}


interface IBlobsPanelBindings {
    [key: string]: any;
}

const BlobsPanelBindings: IBlobsPanelBindings = {

}

class BlobsPanelChanges implements ng.IOnChangesObject, IBlobsPanelBindings {
    [key: string]: ng.IChangesObject<any>;

}

class BlobsPanelController {
    //private _dialog: IAddBlobsService;
    private _start: number = 0;
    public currentSection: any;
    public blobsSections: any;
    public selectIndex: number;
    public details: boolean;
    public state: string;
    public error: string = null;
    public transaction: pip.services.Transaction;
    public search: string = null;
    public blobs: any[];

    constructor(
        $window: ng.IWindowService,
        private $location: ng.ILocationService,
        $scope: ng.IScope,
        pipNavService: pip.nav.INavService,
        pipTransaction: pip.services.ITransactionService,
        $log: ng.ILogService,
        private pipConfirmationDialog,
        private pipAddBlobsDialog: IAddBlobsService,
        private pipToasts: pip.controls.IToastService,
        private $state: ng.ui.IStateService,
        private pipBlobsData: IBlobsDataService,
        public pipMedia: pip.layouts.IMediaService) {

        this.transaction = pipTransaction.create('blobs');
        this.state = ToolsBlobsState.Progress;
        this.readBlobs();
    }
    private readBlobs() {

        this.pipBlobsData.readBlobs(null, 0, 100, (results) => {
            this.blobs = results.data; console.log(this.blobs, results);
            this.state = ToolsBlobsState.Data;
        });
    }

    public addBlob(): void {

        this.pipAddBlobsDialog.show({},
            (item) => {
                this.blobs.push(item);
            });
    }

}

(() => {
    angular
        .module('pipBlobsPanel', ['pipLists', 'pipBehaviors', 'pipButtons'])
        .component('pipBlobsPanel', {
            bindings: BlobsPanelBindings,
            templateUrl: 'blobs/BlobsPanel.html',
            controller: BlobsPanelController
        })

})();
