import { IFilesDataService } from '../data/IFilesDataService';


//import { IAddFilesService } from "./AddFilesService"
import {
    FileInfoDataPage
} from "../data/FileInfoDataPage";
import {
    File
} from "../data/FileInfo";

import {
    IAddFilesService
} from './AddFilesService';

class ToolsFilesState {
    static Progress: string = 'progress';
    static Data: string = 'data';
    static Empty: string = 'empty';
}


interface IFilesPanelBindings {
    [key: string]: any;
}

const FilesPanelBindings: IFilesPanelBindings = {

}

class FilesPanelChanges implements ng.IOnChangesObject, IFilesPanelBindings {
    [key: string]: ng.IChangesObject<any>;

}

class FilesPanelController {
    //private _dialog: IAddFilesService;
    private _start: number = 0;
    public currentSection: any;
     public filesSections: any;
    public selectIndex: number;
    public files: any;
    public details: boolean;
    public state: string;
    public error: string = null;
    public transaction: pip.services.Transaction;
    public search: string = null;

    public getSelectDropdown: Function;

    constructor(
        $window: ng.IWindowService,
        private $location: ng.ILocationService,
        $scope: ng.IScope,
        pipNavService: pip.nav.INavService,
        pipTransaction: pip.services.ITransactionService,
        $log: ng.ILogService,
        private pipConfirmationDialog,
        private pipAddFileDialog: IAddFilesService,
        private pipToasts: pip.controls.IToastService,
        private $state: ng.ui.IStateService,
        private pipFilesData: IFilesDataService,
        public pipMedia: pip.layouts.IMediaService) {

        this.transaction = pipTransaction.create('files');
        this.state = ToolsFilesState.Progress;
        this.readFiles();

   this.selectIndex = $location.search().section || 0;

        this.getSelectDropdown = () => {
            this.selectItem(this.selectIndex);
        }
    }

    private readFiles() {
        this.transaction.begin('Reading files');
        this.transaction.end();

        this.pipFilesData.readFilesGroups((data) => {
            this.filesSections = data;
            this.onFilesRead(this.filesSections);
            this.state = ToolsFilesState.Data;
        })
    }

      public selectItem(index: number) {
          this.search = this.files[this.selectIndex] ? this.files[this.selectIndex].Search : null;
        this.selectIndex = index;

        this.$location.search('section', this.filesSections[index]);

        /*
        if (this.pipMedia('xs')) {
            this.configNavBack();
        }
        */
    }

    public onSearch() {
        this.state = ToolsFilesState.Progress;
        this.files[this.selectIndex] = {};
        this.files[this.selectIndex].Search = this.search;
        this.readFilesInSection(this.filesSections[this.selectIndex], this.selectIndex);
    }

    public clear() {
        this.search = null;
        this.onSearch();
    }

    public addFile(): void {

        this.pipAddFileDialog.show({
        },
            (item) => {
                //this.saveNewFileCallback(item);
                this.saveNewFile(item);
            });
    }

    private saveNewFile(item): void {
        this.transaction.begin('add new file');
        let newItem: File = new File();
        newItem.thumbnail_id = item.id;
        newItem.content_id = item.id;
        newItem.name = item.name;
        newItem.description = item.description;
        newItem.group = item.collection;
        this.pipFilesData.createFile(newItem, (data) => {

            this.saveNewFileCallback(data);
        })
        this.transaction.begin('add new file');

        //this.contentType(newItem, item);

    }

    private contentType(newItem, item) {
        try {
            let jsonContent = JSON.parse(item.content);
            /*
                        this.pipFilesData.uploadFile(newItem, item.content,
                            (file: FileInfo) => {
                                this.saveNewFileCallback(file);
            
                            },
                            (error) => {
                                this.saveNewFileError(error);
            
                            })*/
        } catch (err) {
            /*this.pipFilesData.uploadBinaryFile(newItem, item.content,
                (file: FileInfo) => {
                    this.saveNewFileCallback(file);
                },
                (error) => {
                    this.saveNewFileError(error);
                })*/
        }
    }

    public saveNewFileError(error) {
        this.transaction.end(error.data || error);
        this.pipToasts.showError('File don\'t create from server! ' + error, null, null, null, null);
    }

    public openDeleteDialog(item: File, index: number) {
        this.pipConfirmationDialog.show(
            {
                event: event,
                title: 'Delete file?',
                ok: 'Delete',
                cancel: 'Cancel'
            },
            () => {
                this.deleteFile(item, index);
            },
            () => {
                console.log('You disagreed');
            }
        );
    }

    public deleteFile(item: File, index: number) {
        this.transaction.begin('delete');
        this.pipFilesData.deleteFileById(item.id,
            () => {
                _.remove(this.files[index].Items, {
                    id: item.id
                });

                if (index >= this.files[index].length - 1) {
                    this.selectIndex = 0;
                }

                if (this.files[index].Items.length == 0) {
                    _.remove(this.filesSections, (data: string) => {
                        return item.group == data
                    });
                    _.remove(this.files, (data, dataIndex: number) => { return dataIndex == index });
                    if (this.files[index].length == 0) {
                        this.state = ToolsFilesState.Empty;
                    }
                }
                this.transaction.end();
            },
            (error: any) => {
                this.deleteFileError(error);
            })
    }

    public deleteFileError(error) {
        this.transaction.end();
        this.pipToasts.showError('File don\'t delete from server! ' + error, null, null, null, null);
    }

    public updateFile(oldItem: File): void {

        this.pipAddFileDialog.show({
            file: {
                fileName: oldItem.name,
                description: oldItem.description
            }
        },
            (item) => {
                this.updateFileItem(item, oldItem);
            });
    }

    private updateFileItem(item, oldItem: File) {

        let newItem: File = _.cloneDeep(oldItem);
        newItem.description = item.description;


        /*this.pipFilesData.updateFile(newItem, null, (data) => {

            if (newItem.collection == oldItem.collection && index > -1) {
                let indexItem = _.findIndex(this.files[index].Items, { Id: newItem.id });
                this.files[index].Items[indexItem] = newItem;
                //this.selectIndex = index;
            } else {
                if (index > -1) {
                    this.files[index].Items.push(newItem);
                } else {
                    this.filesSections.push(newItem.collection);
                    this.files[index].push({ Start: 0, Items: [newItem] });
                }
                _.remove(this.files[oldIndex].Items, { Id: newItem.id });
                if (this.files[oldIndex].Items.length == 0) {
                    _.remove(this.files, (data, dataIndex: number) => { return dataIndex == oldIndex });
                    _.remove(this.filesSections, (data: string) => { return data == oldItem.collection });
                }
                this.selectItem(_.findIndex(this.filesSections, (name: string) => { return newItem.collection == name }));
            }
        }, (error: any) => {
            this.updateFileError(error);
        });*/

    }

    private updateFileError(error: any) {
        this.transaction.end();
        this.pipToasts.showError('File don\'t update from server! ' + error, null, null, null, null);
    }


    private saveNewFileCallback(item: File): void {


     let index: number = _.findIndex(this.filesSections, (file: string) => {
            return file == item.group;
        })

        if (index != -1) {
            //this.updateFileItems(this.filesSections[index], 0);
            this.files[index].Items.push(item);
            this.selectIndex = index;
        } else {
            this.filesSections.push(item.group);
            if (!this.files) {
                this.files = [{ Start: 0, Items: [item] }];
                this.selectIndex = 0;
            } else {
                this.files[index].push({ Start: 0, Items: [item] });
                this.selectIndex = this.files[index].length - 1;
            }
        }

        this.transaction.end();
    }

    private filter(section: string) {
        let filter = {};
        filter['Collection'] = section;
        if (this.search) {
            filter['Search'] = this.search;
        }
        return filter;
    }

    private onFilesRead(filesSections) {
         this.filesSections = filesSections;
        this.files = [];

        _.each(this.filesSections, (section: string, index: number) => {
            this.readFilesInSection(section, index);
        });
    }

    private readFilesInSection(section: string, index: number) {

    if (section === this.$location.search().section) {
            this.selectIndex = index;
        }
        if (!this.files[index]) { this.files[index] = { Start: 0 }; }
        if (!this.files[index].Items) { this.files[index].Items = []; }
        //this.files[index] = [{title: section + " title", description: section + " description"}];
        this.pipFilesData.readFiles({group:section, search: this.files[this.selectIndex] ? this.files[this.selectIndex].Search : null}, this.files[index].Start || 0, 100, (files: FileInfoDataPage) => {
            let start: number = this.files[index].Start || 0;

            if (files.data.length > 0 || (start !== 0 && this.files[index].Items.length > 0)) {
                this.state = ToolsFilesState.Data;
                _.each(files.data, (item: File) => {

                    item['ext'] = _.split(item.name, '.')[_.split(item.name, '.').length - 1];
                    if (this.files[index].Items[start]) {
                        this.files[index].Items[start] = item;
                    } else {
                        this.files[index].Items.push(item);
                    }
                    start++;
                })
                this.files[index].Start += files.data.length;
            } else {
                this.state = ToolsFilesState.Empty;
            }
            this.transaction.end();
        }, (error: any) => {
            this.readFilesError(error);
        });
    }

    private readFilesError(error: any) {
        this.transaction.end(error);
        this.pipToasts.showError('Reading files have errors on server! ' + error, null, null, null, null);
    }

    private onError(error) {
        this.error = error;//this._bbHandleErrors.parseError(error);
        this.transaction.end(error);
    }

    private download(item: File) {
        /* this.pipFilesData.getFileUrl(item.id, (data: string) => {
             var link = document.createElement("a");
             link.download = item.name;
             link.href = data;
             link.click();
 
         }, (error) => {
             this.transaction.end(error);
             this.pipToasts.showError('Download files have errors on server! ' + error, null, null, null, null);
         })*/
    }

    private configNavBack() {
        //this.details = true;
        /*
                this._bbNavigation.reset();
                this._pipNavService.breadcrumb.items = [
                    <pip.nav.BreadcrumbItem>{
                        title: "Troubleshooting",
                        click: () => {
                            this._state.go('tools.home');
                        }
                    },
                    <pip.nav.BreadcrumbItem>{
                        title: "Files",
                        click: () => {
                            //this.details = false;
                            this.$location.search('section', null);
                            this.appHeader();
                        }
                    },
                    <pip.nav.BreadcrumbItem>{
                        title: "Files Details"
                    }
                ];*/
    }

}

(() => {
    angular
        .module('pipFilesPanel', ['pipLists','pipBehaviors', 'pipButtons'])
        .component('pipFilesPanel', {
            bindings: FilesPanelBindings,
            templateUrl: 'files/FilesPanel.html',
            controller: FilesPanelController
        })

})();
