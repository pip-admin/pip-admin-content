(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.pip||(g.pip = {}));g=(g.admin||(g.admin = {}));g.content = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var AddBlobDialogController = (function () {
    AddBlobDialogController.$inject = ['params', '$mdDialog', '$rootScope', 'pipFileUpload', 'pipRest'];
    function AddBlobDialogController(params, $mdDialog, $rootScope, pipFileUpload, pipRest) {
        "ngInject";
        var _this = this;
        this.pipFileUpload = pipFileUpload;
        this.pipRest = pipRest;
        this.$mdDialog = $mdDialog;
        this.theme = $rootScope.$theme;
        this.blob = params.blob || {};
        this.errorCallback = params.errorCallback;
        this.callback = params.callback;
        this.blobsCollections = params.blobsCollection;
        if (params.blob) {
            this.edit = true;
        }
        this.cancel = function () { _this.onCancel(); };
        this.retry = function () { _this.onOk(); };
        this.setBlob = function (blob) {
            _this.localBlob = blob;
        };
    }
    AddBlobDialogController.prototype.onOk = function () {
        var _this = this;
        if (!this.edit) {
            if (this.localBlob == null) {
                return;
            }
            var uploadUrl = this.pipRest.serverUrl + "/api/1.0/blobs";
            this.pipFileUpload.upload(this.localBlob, uploadUrl, function (data, err) {
                if (!err) {
                    _this.$mdDialog.hide(data);
                }
            });
        }
        else {
            this.$mdDialog.hide(this.blob);
        }
    };
    AddBlobDialogController.prototype.onCancel = function () {
        this.$mdDialog.cancel();
    };
    AddBlobDialogController.prototype.filterBlobsCollections = function (search) {
        var result = [];
        _.each(this.blobsCollections, function (blobs) {
            if (blobs.toLowerCase().indexOf(search.toLowerCase()) > -1)
                result.push(blobs);
        });
        return result;
    };
    return AddBlobDialogController;
}());
exports.AddBlobDialogController = AddBlobDialogController;
angular
    .module('pipAddBlobsDialog', ['ngMaterial', 'pipFiles', 'pipFiles.Templates'])
    .controller('pipAddBlobDialogController', AddBlobDialogController);
require("./AddBlobsService");
},{"./AddBlobsService":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AddBlobsService = (function () {
    AddBlobsService.$inject = ['$mdDialog'];
    function AddBlobsService($mdDialog) {
        this._mdDialog = $mdDialog;
    }
    AddBlobsService.prototype.show = function (params, successCallback, cancelCallback) {
        this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'blobs/AddBlobsDialog.html',
            controller: 'pipAddBlobDialogController',
            controllerAs: 'vm',
            locals: { params: params },
            clickOutsideToClose: true
        })
            .then(function (blob) {
            if (successCallback) {
                successCallback(blob);
            }
        }, function () {
            if (cancelCallback) {
                cancelCallback();
            }
        });
    };
    return AddBlobsService;
}());
angular
    .module('pipAddBlobsDialog')
    .service('pipAddBlobsDialog', AddBlobsService);
},{}],3:[function(require,module,exports){
configureBlobsRoute.$inject = ['$injector', '$stateProvider'];
var BlobsController = (function () {
    BlobsController.$inject = ['$window', '$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipNavService'];
    function BlobsController($window, $scope, $state, $rootScope, $mdMedia, $injector, pipNavService) {
        "ngInject";
        this.$window = $window;
        this.pipNavService = pipNavService;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.appHeader();
    }
    BlobsController.prototype.appHeader = function () {
        this.pipNavService.appbar.parts = {
            logo: false,
            icon: false,
            title: 'breadcrumb'
        };
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = 'Blobs';
        this.pipNavService.actions.hide();
    };
    BlobsController.prototype.onRetry = function () {
        this.$window.history.back();
    };
    return BlobsController;
}());
function configureBlobsRoute($injector, $stateProvider) {
    "ngInject";
    $stateProvider
        .state('blobs', {
        url: '/blobs',
        controller: BlobsController,
        auth: false,
        controllerAs: '$ctrl',
        templateUrl: 'blobs/BlobsPage.html'
    });
}
(function () {
    angular
        .module('pipBlobsPage', ['pipNav'])
        .config(configureBlobsRoute);
})();
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ToolsBlobsState = (function () {
    function ToolsBlobsState() {
    }
    return ToolsBlobsState;
}());
ToolsBlobsState.Progress = 'progress';
ToolsBlobsState.Data = 'data';
ToolsBlobsState.Empty = 'empty';
var BlobsPanelBindings = {};
var BlobsPanelChanges = (function () {
    function BlobsPanelChanges() {
    }
    return BlobsPanelChanges;
}());
var BlobsPanelController = (function () {
    BlobsPanelController.$inject = ['$window', '$location', '$scope', 'pipNavService', 'pipTransaction', '$log', 'pipConfirmationDialog', 'pipAddBlobsDialog', 'pipToasts', '$state', 'pipBlobsData', 'pipMedia'];
    function BlobsPanelController($window, $location, $scope, pipNavService, pipTransaction, $log, pipConfirmationDialog, pipAddBlobsDialog, pipToasts, $state, pipBlobsData, pipMedia) {
        this.$location = $location;
        this.pipConfirmationDialog = pipConfirmationDialog;
        this.pipAddBlobsDialog = pipAddBlobsDialog;
        this.pipToasts = pipToasts;
        this.$state = $state;
        this.pipBlobsData = pipBlobsData;
        this.pipMedia = pipMedia;
        this._start = 0;
        this.error = null;
        this.search = null;
        this.transaction = pipTransaction.create('blobs');
        this.state = ToolsBlobsState.Progress;
        this.readBlobs();
    }
    BlobsPanelController.prototype.readBlobs = function () {
        var _this = this;
        this.pipBlobsData.readBlobs(null, 0, 100, function (results) {
            _this.blobs = results.data;
            console.log(_this.blobs, results);
            _this.state = ToolsBlobsState.Data;
        });
    };
    BlobsPanelController.prototype.addBlob = function () {
        var _this = this;
        this.pipAddBlobsDialog.show({}, function (item) {
            _this.blobs.push(item);
        });
    };
    return BlobsPanelController;
}());
(function () {
    angular
        .module('pipBlobsPanel', ['pipLists', 'pipBehaviors', 'pipButtons'])
        .component('pipBlobsPanel', {
        bindings: BlobsPanelBindings,
        templateUrl: 'blobs/BlobsPanel.html',
        controller: BlobsPanelController
    });
})();
},{}],5:[function(require,module,exports){

},{}],6:[function(require,module,exports){
var SearchRowController = (function () {
    SearchRowController.$inject = ['$element', '$attrs', '$scope', '$timeout'];
    function SearchRowController($element, $attrs, $scope, $timeout) {
        "ngInject";
        var _this = this;
        this.onKeyPress = function (event) {
            if (event.keyCode === 13) {
                event.stopPropagation();
                event.preventDefault();
                this.onSearch();
            }
        };
        $element.addClass('pip-search-row');
        $element.addClass('flex');
        this._element = $element;
        this._scope = $scope;
        this._timeout = $timeout;
        this.pipOnSearch = $scope['onSearch'] ? $scope['onSearch'] : null;
        $scope.$watch('search', function (search) {
            if (search != _this.localSearch) {
                _this.localSearch = search;
            }
        });
    }
    SearchRowController.prototype.isDisable = function () {
        this.ngDisable = this._scope['ngDisabled'] ? this._scope['ngDisabled'] : null;
        return _.isFunction(this.ngDisable) && this.ngDisable();
    };
    SearchRowController.prototype.onSearch = function () {
        var _this = this;
        if (this.isDisable()) {
            return;
        }
        this._scope['search'] = this.localSearch;
        this._timeout(function () {
            if (_.isFunction(_this.pipOnSearch)) {
                _this.pipOnSearch();
            }
        }, 200);
    };
    SearchRowController.prototype.onClear = function () {
        if (this.isDisable()) {
            return;
        }
        this.localSearch = null;
        this.onSearch();
    };
    return SearchRowController;
}());
(function () {
    function SearchRowDirective() {
        return {
            restrict: 'E',
            controller: SearchRowController,
            controllerAs: 'searchRow',
            scope: {
                search: '=pipSearch',
                onSearch: '&pipOnSearch',
                ngDisabled: '&'
            },
            templateUrl: 'common/search/SearchRow.html'
        };
    }
    angular
        .module('pipDirective', [])
        .directive('pipSearchRow', SearchRowDirective);
})();
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BlobsData = (function () {
    BlobsData.$inject = ['$stateParams', 'pipRest', 'pipSession'];
    function BlobsData($stateParams, pipRest, pipSession) {
        "ngInject";
        this.$stateParams = $stateParams;
        this.pipRest = pipRest;
        this.pipSession = pipSession;
        this.RESOURCE = 'blobs';
    }
    BlobsData.prototype.readBlobs = function (params, start, take, successCallback, errorCallback) {
        if (start === void 0) { start = 0; }
        if (take === void 0) { take = 100; }
        params = params || {};
        params.skip = start;
        params.total = true;
        params.take = take;
        return this.pipRest.getResource('blobs').get(params, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    BlobsData.prototype.updateBlob = function (blob_id, data, successCallback, errorCallback) {
        return this.pipRest.getResource('blobs').update({
            blob_id: blob_id
        }, data, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    BlobsData.prototype.createBlob = function (data, successCallback, errorCallback) {
        return this.pipRest.getResource('blobs').save(data, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    BlobsData.prototype.deleteBlobById = function (id, successCallback, errorCallback) {
        return this.pipRest.getResource('blobs').delete({ blob_id: id }, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    return BlobsData;
}());
var BlobsDataProvider = (function () {
    function BlobsDataProvider() {
        this.RESOURCE = 'blobs';
    }
    BlobsDataProvider.prototype.$get = ['$stateParams', 'pipRest', 'pipSession', function ($stateParams, pipRest, pipSession) {
        "ngInject";
        if (this._service == null) {
            this._service = new BlobsData($stateParams, pipRest, pipSession);
        }
        return this._service;
    }];
    return BlobsDataProvider;
}());
angular
    .module('pipBlobsData', ['pipRest'])
    .provider('pipBlobsData', BlobsDataProvider);
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var File = (function () {
    function File() {
    }
    return File;
}());
exports.File = File;
},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileInfoDataPage = (function () {
    function FileInfoDataPage() {
    }
    return FileInfoDataPage;
}());
exports.FileInfoDataPage = FileInfoDataPage;
},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FilesData = (function () {
    FilesData.$inject = ['$stateParams', 'pipRest', 'pipSession'];
    function FilesData($stateParams, pipRest, pipSession) {
        "ngInject";
        this.$stateParams = $stateParams;
        this.pipRest = pipRest;
        this.pipSession = pipSession;
        this.RESOURCE = 'files';
    }
    FilesData.prototype.readFiles = function (params, start, take, successCallback, errorCallback) {
        if (start === void 0) { start = 0; }
        if (take === void 0) { take = 100; }
        params = params || {};
        params.skip = start;
        params.total = true;
        params.take = take;
        return this.pipRest.getResource('files').get(params, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    FilesData.prototype.readFilesGroups = function (successCallback, errorCallback) {
        return this.pipRest.getResource('files_groups').get(null, function (data) {
            if (successCallback) {
                successCallback(data.data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    FilesData.prototype.updateFile = function (file_id, data, successCallback, errorCallback) {
        return this.pipRest.getResource('files').update({
            file_id: file_id
        }, data, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    FilesData.prototype.createFile = function (data, successCallback, errorCallback) {
        return this.pipRest.getResource('files').save(data, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    FilesData.prototype.deleteFileById = function (id, successCallback, errorCallback) {
        return this.pipRest.getResource('files').delete({ file_id: id }, function (data) {
            if (successCallback) {
                successCallback(data);
            }
        }, function (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        });
    };
    return FilesData;
}());
var FilesDataProvider = (function () {
    function FilesDataProvider() {
        this.RESOURCE = 'files';
    }
    FilesDataProvider.prototype.$get = ['$stateParams', 'pipRest', 'pipSession', function ($stateParams, pipRest, pipSession) {
        "ngInject";
        if (this._service == null) {
            this._service = new FilesData($stateParams, pipRest, pipSession);
        }
        return this._service;
    }];
    return FilesDataProvider;
}());
angular
    .module('pipFilesData', ['pipRest'])
    .provider('pipFilesData', FilesDataProvider);
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],13:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var FileDialogData = (function () {
    function FileDialogData() {
    }
    return FileDialogData;
}());
exports.FileDialogData = FileDialogData;
var AddFileDialogController = (function () {
    AddFileDialogController.$inject = ['params', '$mdDialog', '$rootScope', 'pipFileUpload', 'pipRest'];
    function AddFileDialogController(params, $mdDialog, $rootScope, pipFileUpload, pipRest) {
        "ngInject";
        var _this = this;
        this.pipFileUpload = pipFileUpload;
        this.pipRest = pipRest;
        this.$mdDialog = $mdDialog;
        this.theme = $rootScope.$theme;
        this.file = params.file || {};
        this.errorCallback = params.errorCallback;
        this.callback = params.callback;
        this.filesCollections = params.filesCollection;
        if (params.file) {
            this.edit = true;
        }
        this.cancel = function () { _this.onCancel(); };
        this.retry = function () { _this.onOk(); };
        this.setFile = function (file) {
            _this.localFile = file;
        };
    }
    AddFileDialogController.prototype.onOk = function () {
        var _this = this;
        if (!this.edit) {
            if (this.localFile == null) {
                return;
            }
            var uploadUrl = this.pipRest.serverUrl + "/api/1.0/blobs";
            this.pipFileUpload.upload(this.localFile, uploadUrl, function (data, err) {
                console.log(data);
                data.description = _this.file.description;
                data.collection = _this.file.Collection;
                if (!err) {
                    _this.$mdDialog.hide(data);
                }
            });
        }
        else {
            this.$mdDialog.hide(this.file);
        }
    };
    AddFileDialogController.prototype.onCancel = function () {
        this.$mdDialog.cancel();
    };
    AddFileDialogController.prototype.filterFilesCollections = function (search) {
        var result = [];
        _.each(this.filesCollections, function (files) {
            if (files.toLowerCase().indexOf(search.toLowerCase()) > -1)
                result.push(files);
        });
        return result;
    };
    return AddFileDialogController;
}());
exports.AddFileDialogController = AddFileDialogController;
angular
    .module('pipAddFileDialog', ['ngMaterial', 'pipFiles', 'pipFiles.Templates'])
    .controller('pipAddFileDialogController', AddFileDialogController);
require("./AddFilesService");
},{"./AddFilesService":14}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AddFilesService = (function () {
    AddFilesService.$inject = ['$mdDialog'];
    function AddFilesService($mdDialog) {
        this._mdDialog = $mdDialog;
    }
    AddFilesService.prototype.show = function (params, successCallback, cancelCallback) {
        this._mdDialog.show({
            targetEvent: params.event,
            templateUrl: 'files/AddFilesDialog.html',
            controller: 'pipAddFileDialogController',
            controllerAs: 'vm',
            locals: { params: params },
            clickOutsideToClose: true
        })
            .then(function (file) {
            if (successCallback) {
                successCallback(file);
            }
        }, function () {
            if (cancelCallback) {
                cancelCallback();
            }
        });
    };
    return AddFilesService;
}());
angular
    .module('pipAddFileDialog')
    .service('pipAddFileDialog', AddFilesService);
},{}],15:[function(require,module,exports){
configureFilesRoute.$inject = ['$injector', '$stateProvider'];
var FilesController = (function () {
    FilesController.$inject = ['$window', '$scope', '$state', '$rootScope', '$mdMedia', '$injector', 'pipNavService'];
    function FilesController($window, $scope, $state, $rootScope, $mdMedia, $injector, pipNavService) {
        "ngInject";
        this.$window = $window;
        this.pipNavService = pipNavService;
        var pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.appHeader();
    }
    FilesController.prototype.appHeader = function () {
        this.pipNavService.appbar.parts = {
            logo: false,
            icon: false,
            title: 'breadcrumb'
        };
        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = 'Files';
        this.pipNavService.actions.hide();
    };
    FilesController.prototype.onRetry = function () {
        this.$window.history.back();
    };
    return FilesController;
}());
function configureFilesRoute($injector, $stateProvider) {
    "ngInject";
    $stateProvider
        .state('files', {
        url: '/files',
        controller: FilesController,
        auth: false,
        controllerAs: '$ctrl',
        templateUrl: 'files/FilesPage.html'
    });
}
(function () {
    angular
        .module('pipFilesPage', ['pipNav'])
        .config(configureFilesRoute);
})();
},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileInfo_1 = require("../data/FileInfo");
var ToolsFilesState = (function () {
    function ToolsFilesState() {
    }
    return ToolsFilesState;
}());
ToolsFilesState.Progress = 'progress';
ToolsFilesState.Data = 'data';
ToolsFilesState.Empty = 'empty';
var FilesPanelBindings = {};
var FilesPanelChanges = (function () {
    function FilesPanelChanges() {
    }
    return FilesPanelChanges;
}());
var FilesPanelController = (function () {
    FilesPanelController.$inject = ['$window', '$location', '$scope', 'pipNavService', 'pipTransaction', '$log', 'pipConfirmationDialog', 'pipAddFileDialog', 'pipToasts', '$state', 'pipFilesData', 'pipMedia'];
    function FilesPanelController($window, $location, $scope, pipNavService, pipTransaction, $log, pipConfirmationDialog, pipAddFileDialog, pipToasts, $state, pipFilesData, pipMedia) {
        var _this = this;
        this.$location = $location;
        this.pipConfirmationDialog = pipConfirmationDialog;
        this.pipAddFileDialog = pipAddFileDialog;
        this.pipToasts = pipToasts;
        this.$state = $state;
        this.pipFilesData = pipFilesData;
        this.pipMedia = pipMedia;
        this._start = 0;
        this.error = null;
        this.search = null;
        this.transaction = pipTransaction.create('files');
        this.state = ToolsFilesState.Progress;
        this.readFiles();
        this.selectIndex = $location.search().section || 0;
        this.getSelectDropdown = function () {
            _this.selectItem(_this.selectIndex);
        };
    }
    FilesPanelController.prototype.readFiles = function () {
        var _this = this;
        this.transaction.begin('Reading files');
        this.transaction.end();
        this.pipFilesData.readFilesGroups(function (data) {
            _this.filesSections = data;
            _this.onFilesRead(_this.filesSections);
            _this.state = ToolsFilesState.Data;
        });
    };
    FilesPanelController.prototype.selectItem = function (index) {
        this.search = this.files[this.selectIndex] ? this.files[this.selectIndex].Search : null;
        this.selectIndex = index;
        this.$location.search('section', this.filesSections[index]);
    };
    FilesPanelController.prototype.onSearch = function () {
        this.state = ToolsFilesState.Progress;
        this.files[this.selectIndex] = {};
        this.files[this.selectIndex].Search = this.search;
        this.readFilesInSection(this.filesSections[this.selectIndex], this.selectIndex);
    };
    FilesPanelController.prototype.clear = function () {
        this.search = null;
        this.onSearch();
    };
    FilesPanelController.prototype.addFile = function () {
        var _this = this;
        this.pipAddFileDialog.show({}, function (item) {
            _this.saveNewFile(item);
        });
    };
    FilesPanelController.prototype.saveNewFile = function (item) {
        var _this = this;
        this.transaction.begin('add new file');
        var newItem = new FileInfo_1.File();
        newItem.thumbnail_id = item.id;
        newItem.content_id = item.id;
        newItem.name = item.name;
        newItem.description = item.description;
        newItem.group = item.collection;
        this.pipFilesData.createFile(newItem, function (data) {
            _this.saveNewFileCallback(data);
        });
        this.transaction.begin('add new file');
    };
    FilesPanelController.prototype.contentType = function (newItem, item) {
        try {
            var jsonContent = JSON.parse(item.content);
        }
        catch (err) {
        }
    };
    FilesPanelController.prototype.saveNewFileError = function (error) {
        this.transaction.end(error.data || error);
        this.pipToasts.showError('File don\'t create from server! ' + error, null, null, null, null);
    };
    FilesPanelController.prototype.openDeleteDialog = function (item, index) {
        var _this = this;
        this.pipConfirmationDialog.show({
            event: event,
            title: 'Delete file?',
            ok: 'Delete',
            cancel: 'Cancel'
        }, function () {
            _this.deleteFile(item, index);
        }, function () {
            console.log('You disagreed');
        });
    };
    FilesPanelController.prototype.deleteFile = function (item, index) {
        var _this = this;
        this.transaction.begin('delete');
        this.pipFilesData.deleteFileById(item.id, function () {
            _.remove(_this.files[index].Items, {
                id: item.id
            });
            if (index >= _this.files[index].length - 1) {
                _this.selectIndex = 0;
            }
            if (_this.files[index].Items.length == 0) {
                _.remove(_this.filesSections, function (data) {
                    return item.group == data;
                });
                _.remove(_this.files, function (data, dataIndex) { return dataIndex == index; });
                if (_this.files[index].length == 0) {
                    _this.state = ToolsFilesState.Empty;
                }
            }
            _this.transaction.end();
        }, function (error) {
            _this.deleteFileError(error);
        });
    };
    FilesPanelController.prototype.deleteFileError = function (error) {
        this.transaction.end();
        this.pipToasts.showError('File don\'t delete from server! ' + error, null, null, null, null);
    };
    FilesPanelController.prototype.updateFile = function (oldItem) {
        var _this = this;
        this.pipAddFileDialog.show({
            file: {
                fileName: oldItem.name,
                description: oldItem.description
            }
        }, function (item) {
            _this.updateFileItem(item, oldItem);
        });
    };
    FilesPanelController.prototype.updateFileItem = function (item, oldItem) {
        var newItem = _.cloneDeep(oldItem);
        newItem.description = item.description;
    };
    FilesPanelController.prototype.updateFileError = function (error) {
        this.transaction.end();
        this.pipToasts.showError('File don\'t update from server! ' + error, null, null, null, null);
    };
    FilesPanelController.prototype.saveNewFileCallback = function (item) {
        var index = _.findIndex(this.filesSections, function (file) {
            return file == item.group;
        });
        if (index != -1) {
            this.files[index].Items.push(item);
            this.selectIndex = index;
        }
        else {
            this.filesSections.push(item.group);
            if (!this.files) {
                this.files = [{ Start: 0, Items: [item] }];
                this.selectIndex = 0;
            }
            else {
                this.files[index].push({ Start: 0, Items: [item] });
                this.selectIndex = this.files[index].length - 1;
            }
        }
        this.transaction.end();
    };
    FilesPanelController.prototype.filter = function (section) {
        var filter = {};
        filter['Collection'] = section;
        if (this.search) {
            filter['Search'] = this.search;
        }
        return filter;
    };
    FilesPanelController.prototype.onFilesRead = function (filesSections) {
        var _this = this;
        this.filesSections = filesSections;
        this.files = [];
        _.each(this.filesSections, function (section, index) {
            _this.readFilesInSection(section, index);
        });
    };
    FilesPanelController.prototype.readFilesInSection = function (section, index) {
        var _this = this;
        if (section === this.$location.search().section) {
            this.selectIndex = index;
        }
        if (!this.files[index]) {
            this.files[index] = { Start: 0 };
        }
        if (!this.files[index].Items) {
            this.files[index].Items = [];
        }
        this.pipFilesData.readFiles({ group: section, search: this.files[this.selectIndex] ? this.files[this.selectIndex].Search : null }, this.files[index].Start || 0, 100, function (files) {
            var start = _this.files[index].Start || 0;
            if (files.data.length > 0 || (start !== 0 && _this.files[index].Items.length > 0)) {
                _this.state = ToolsFilesState.Data;
                _.each(files.data, function (item) {
                    item['ext'] = _.split(item.name, '.')[_.split(item.name, '.').length - 1];
                    if (_this.files[index].Items[start]) {
                        _this.files[index].Items[start] = item;
                    }
                    else {
                        _this.files[index].Items.push(item);
                    }
                    start++;
                });
                _this.files[index].Start += files.data.length;
            }
            else {
                _this.state = ToolsFilesState.Empty;
            }
            _this.transaction.end();
        }, function (error) {
            _this.readFilesError(error);
        });
    };
    FilesPanelController.prototype.readFilesError = function (error) {
        this.transaction.end(error);
        this.pipToasts.showError('Reading files have errors on server! ' + error, null, null, null, null);
    };
    FilesPanelController.prototype.onError = function (error) {
        this.error = error;
        this.transaction.end(error);
    };
    FilesPanelController.prototype.download = function (item) {
    };
    FilesPanelController.prototype.configNavBack = function () {
    };
    return FilesPanelController;
}());
(function () {
    angular
        .module('pipFilesPanel', ['pipLists', 'pipBehaviors', 'pipButtons'])
        .component('pipFilesPanel', {
        bindings: FilesPanelBindings,
        templateUrl: 'files/FilesPanel.html',
        controller: FilesPanelController
    });
})();
},{"../data/FileInfo":8}],17:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipContent', [
        'pipDirective',
        'pipFilesResources',
        'pipFilesData',
        'pipAddFileDialog',
        'pipFilesPanel',
        'pipFilesPage',
        'pipBlobsResources',
        'pipBlobsData',
        'pipAddBlobsDialog',
        'pipBlobsPanel',
        'pipBlobsPage',
    ]);
})();
},{}],18:[function(require,module,exports){
configBlobsResources.$inject = ['pipRestProvider'];
function configBlobsResources(pipRestProvider) {
    pipRestProvider.registerPagedCollection('blobs', '/api/v1/blobs/:blob_id', { blob_id: '@blob_id' }, {
        page: { method: 'GET', isArray: false },
        update: { method: 'PUT' }
    });
}
angular
    .module('pipBlobsResources', [])
    .config(configBlobsResources);
},{}],19:[function(require,module,exports){
configFilesResources.$inject = ['pipRestProvider'];
function configFilesResources(pipRestProvider) {
    pipRestProvider.registerPagedCollection('files', '/api/v1/files/:file_id', { file_id: '@file_id' }, {
        page: { method: 'GET', isArray: false },
        update: { method: 'PUT' }
    });
    pipRestProvider.registerPagedCollection('files_groups', '/api/v1/files/groups');
}
angular
    .module('pipFilesResources', [])
    .config(configFilesResources);
},{}],20:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipAdminContent.Templates');
} catch (e) {
  module = angular.module('pipAdminContent.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('blobs/AddBlobsDialog.html',
    '<md-dialog class="pip-dialog layout-column bb-add-blob" width="400" md-theme="{{vm.theme}}"><div class="pip-body p24-flex pip-scroll" ng-if="!vm.globalProgress()"><h3 class="tm0" ng-if="!vm.edit">New blob</h3><h3 class="tm0" ng-if="vm.edit">Edit blob</h3><div ng-show="!vm.edit"><pip-file-select pip-change="vm.setBlob" pip-local-file="vm.localBlob"></pip-file-select></div></div><div class="pip-footer" ng-if="!vm.globalProgress()"><div><md-button class="md-accent" ng-click="vm.onCancel()">Cancel</md-button><md-button class="md-accent" ng-click="vm.onOk()">Upload</md-button></div></div><pip-file-progress ng-if="vm.globalProgress()" pip-cancel="vm.cancel" pip-retry="vm.retry" pip-name="vm.localBlob.name"></pip-file-progress></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipAdminContent.Templates');
} catch (e) {
  module = angular.module('pipAdminContent.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('blobs/BlobsPage.html',
    '<pip-blobs-panel></pip-blobs-panel>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipAdminContent.Templates');
} catch (e) {
  module = angular.module('pipAdminContent.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('blobs/BlobsPanel.html',
    '<pip-document><md-button class="md-fab md-accent md-fab-bottom-right" style="z-index: 55" ng-if="$ctrl.state != \'progress\'" ng-disabled="$ctrl.transaction.busy()" aria-label="add" ng-click="$ctrl.addBlob()"><md-icon md-svg-icon="icons:plus"></md-icon></md-button><div class="pip-body p0"><md-list class="pip-ref-list tp0" ng-if="$ctrl.state == \'data\'"><md-list-item class="pip-ref-list-item divider-bottom" md-ink-ripple="" ng-repeat="blob in $ctrl.blobs"><div class="pip-pic flex-fixed lm16 layout-row layout-align-center-center"></div><div class="pip-content flex"><div class="text-body2 text-overflow">{{blob.name}} <span ng-if="blob.size">•</span> {{blob.size}}</div><p class="pip-subtitle pip-blob-message">{{blob.content_type}}</p></div><div class="pip-pic rm0"><md-button class="md-icon-button flex-fixed" ng-if="blob.Error" ng-click="$ctrl.onErrorDetails(blob)" aria-label="error"><md-icon md-svg-icon="icons:search"></md-icon></md-button></div></md-list-item></md-list></div></pip-document>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipAdminContent.Templates');
} catch (e) {
  module = angular.module('pipAdminContent.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('files/AddFilesDialog.html',
    '<md-dialog class="pip-dialog layout-column bb-add-file" width="400" md-theme="{{vm.theme}}"><div class="pip-body p24-flex pip-scroll" ng-if="!vm.globalProgress()"><h3 class="tm0" ng-if="!vm.edit">New file</h3><h3 class="tm0" ng-if="vm.edit">Edit file</h3><md-autocomplete flex="" required="" class="bm0" md-input-name="autocompleteField" md-search-text="vm.file.Collection" md-items="item in vm.filterFilesCollections(vm.file.Collection)" md-no-cache="true" md-require-match="false" md-floating-label="Collection"><md-item-template><span>{{::item}}</span></md-item-template></md-autocomplete><md-input-container class="md-block flex bm0 tm0"><label>Description</label> <input ng-model="vm.file.description"></md-input-container><div ng-show="!vm.edit"><pip-file-select pip-change="vm.setFile" pip-local-file="vm.localFile"></pip-file-select></div></div><div class="pip-footer" ng-if="!vm.globalProgress()"><div><md-button class="md-accent" ng-click="vm.onCancel()">Cancel</md-button><md-button class="md-accent" ng-click="vm.onOk()">Upload</md-button></div></div><pip-file-progress ng-if="vm.globalProgress()" pip-cancel="vm.cancel" pip-retry="vm.retry" pip-name="vm.localFile.name"></pip-file-progress></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipAdminContent.Templates');
} catch (e) {
  module = angular.module('pipAdminContent.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('files/FilesPage.html',
    '<pip-files-panel></pip-files-panel>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipAdminContent.Templates');
} catch (e) {
  module = angular.module('pipAdminContent.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('files/FilesPanel.html',
    '<div class="pip-main-menu pip-files" ng-class="{\'pip-single-content\': $ctrl.details}" ng-if="$ctrl.pipMedia(\'gt-sm\')"><div class="pip-menu"><div class="pip-list-container pip-scroll"><md-list class="pip-simple-list tp0" pip-selected="$ctrl.selectIndex" pip-select="$ctrl.selectItem($event.index)"><md-list-item class="pip-simple-list-item pip-selectable {{ $ctrl.selectIndex == $index ? \'selected\' : \'\' }}" md-ink-ripple="" ng-repeat="section in $ctrl.filesSections"><p class="pip-title text-body2">{{ section || \'Undefined\' }}</p></md-list-item></md-list></div></div><div class="pip-content-container"><div class="layout-column"><pip-document class="pip-scroll"><div class="pip-filter-row layout-row layout-align-start-center pip-search-panel rp0 lp0 pip-filter-search-row flex"><pip-search-row pip-search="$ctrl.search" pip-on-search="$ctrl.onSearch()" xxxng-disabled="$ctrl.transaction.busy()"></pip-search-row></div><div class="pip-body p0"><div class="pip-menu" style="width: 100% !important;" ng-if="$ctrl.state == \'data\'"><div class="pip-list-container pip-scroll"><md-list class="pip-ref-list tp0"><md-list-item class="pip-ref-list-item divider-bottom" md-ink-ripple="" ng-repeat="file in $ctrl.files[$ctrl.selectIndex].Items" ng-click="$mdOpenMenu()"><div class="pip-pic tm0 rm0" ng-if="file.content_type == \'json\' || file.content_type == \'jpeg\' || file.content_type == \'xls\' || file.content_type == \'xml\' || file.content_type == \'pdf\' || file.content_type == \'doc\'"><md-icon md-svg-icon="bootbarn-icons:file-format-{{file.content_type}}"></md-icon></div><div class="pip-pic tm0 rm0" ng-if="file.content_type != \'json\' && file.content_type != \'jpeg\' && file.content_type != \'xls\' && file.content_type != \'pdf\' && file.content_type != \'xml\' && file.content_type != \'doc\'"><md-icon md-svg-icon="bootbarn-icons:file-format-custom"></md-icon></div><div class="pip-content flex"><div class="text-body2 text-overflow">{{file.name}}</div><p class="pip-subtitle">{{file.description}}</p></div><div class="pip-pic rm0 tm0"><md-menu><md-button class="md-icon-button" ng-click="$mdOpenMenu()" aria-label="xxx"><md-icon md-menu-origin="" md-svg-icon="icons:vdots"></md-icon></md-button><md-menu-content width="3"><md-menu-item><md-button ng-click="$ctrl.download(file)" aria-label="xxx">Download</md-button></md-menu-item><md-menu-item><md-button ng-click="$ctrl.updateFile(file)" aria-label="xxx">Update</md-button></md-menu-item><md-menu-item ng-click="$ctrl.openDeleteDialog(file, $ctrl.selectIndex)"><md-button aria-label="xxx">Delete</md-button></md-menu-item></md-menu-content></md-menu></div></md-list-item></md-list></div></div></div><div class="layout-column layout-align-center-center flex pip-empty pip-scroll" ng-if="$ctrl.state == \'progress\' || $ctrl.state == \'empty\'"><div class="pip-empty" ng-if="$ctrl.state == \'empty\'"><img src="images/EmptyState.svg" class="pip-pic"><div class="pip-text">There are no events right now…<br>Try again later or change filter options</div></div><div class="pip-empty" ng-if="$ctrl.state == \'progress\'"><img src="images/LoadingState.svg" class="pip-pic"><div class="pip-text">Loading Files<md-progress-linear md-mode="indeterminate" class="tm24"></md-progress-linear></div></div></div></pip-document></div></div></div><md-button class="md-fab md-accent md-fab-bottom-right" style="z-index: 55" ng-if="$ctrl.state != \'progress\'" ng-disabled="$ctrl.transaction.busy()" aria-label="add" ng-click="$ctrl.addFile()"><md-icon md-svg-icon="icons:plus"></md-icon></md-button><pip-dropdown pip-actions="$ctrl.filesSections" pip-active-index="$ctrl.selectIndex" pip-change="$ctrl.getSelectDropdown()" ng-if="($ctrl.pipMedia(\'xs\') || $ctrl.pipMedia(\'sm\')) && $ctrl.state == \'data\'"></pip-dropdown><div class="pip-main-menu pip-files" ng-if="($ctrl.pipMedia(\'xs\') || $ctrl.pipMedia(\'sm\')) && $ctrl.state == \'data\'"><div class="pip-filter-row layout-row layout-align-start-center pip-search-panel rp0 lp0 pip-filter-search-row flex"><pip-search-row pip-search="$ctrl.search" pip-on-search="$ctrl.onSearch()" xxxng-disabled="$ctrl.transaction.busy()"></pip-search-row></div><pip-simple class="pip-scroll"><div class="pip-menu" style="width: 100% !important;"><div class="pip-list-container pip-scroll"><md-list class="pip-ref-list tp0"><md-list-item class="pip-ref-list-item divider-bottom" md-ink-ripple="" ng-repeat="file in $ctrl.files[$ctrl.selectIndex].Items"><div class="pip-pic tm0 rm0" ng-if="file.content_type == \'json\' || file.content_type == \'jpeg\' || file.content_type == \'pdf\' || file.content_type == \'xls\' || file.content_type == \'xml\' || file.content_type == \'doc\'"><md-icon md-svg-icon="bootbarn-icons:file-format-{{file.content_type}}"></md-icon></div><div class="pip-pic rm0" ng-if="file.content_type != \'json\' && file.content_type != \'jpeg\' && file.content_type != \'xls\' && file.content_type != \'xml\' && file.content_type != \'pdf\' && file.content_type != \'doc\'"><md-icon md-svg-icon="bootbarn-icons:file-format-custom"></md-icon></div><div class="pip-content flex"><div class="text-body2 text-overflow">{{file.name}}</div><p class="pip-subtitle">{{file.Description}}</p></div><div class="pip-pic rm0"><md-menu><md-button class="md-icon-button" ng-click="$mdOpenMenu()" aria-label="xxx"><md-icon md-menu-origin="" md-svg-icon="icons:vdots"></md-icon></md-button><md-menu-content width="3"><md-menu-item><md-button ng-click="$ctrl.download(file)" aria-label="xxx">Download</md-button></md-menu-item><md-menu-item><md-button ng-click="$ctrl.updateFile(file)" aria-label="xxx">Update</md-button></md-menu-item><md-menu-item ng-click="$ctrl.openDeleteDialog(file, $ctrl.selectIndex)"><md-button aria-label="xxx">Delete</md-button></md-menu-item></md-menu-content></md-menu></div></md-list-item></md-list></div></div></pip-simple></div><div class="layout-column layout-align-center-center flex pip-empty pip-scroll" ng-if="($ctrl.state == \'progress\' || $ctrl.state == \'empty\') && !$ctrl.pipMedia(\'gt-sm\')"><div class="pip-empty" ng-if="$ctrl.state == \'empty\'"><img src="images/EmptyState.svg" class="pip-pic"><div class="pip-text">There are no events right now…<br>Try again later or change filter options</div></div><div class="pip-empty" ng-if="$ctrl.state == \'progress\'"><img src="images/LoadingState.svg" class="pip-pic"><div class="pip-text">Loading files<md-progress-linear md-mode="indeterminate" class="tm24"></md-progress-linear></div></div></div><md-progress-linear md-mode="indeterminate" style="position: absolute; z-index: 100" ng-show="$ctrl.transaction.busy() && $ctrl.state != \'progress\'"></md-progress-linear>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipAdminContent.Templates');
} catch (e) {
  module = angular.module('pipAdminContent.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('common/search/SearchRow.html',
    '<div class="pip-search layout-row layout-align-start-center flex"><md-button class="md-icon-button pip-search-button flex-fixed" ng-click="searchRow.onSearch()" ng-disabled="searchRow.isDisable()" aria-label="search"><md-icon md-svg-icon="icons:search"></md-icon></md-button><md-input-container md-no-float="" class="md-block tm8 bm8" ng-disabled="searchRow.isDisable()"><input ng-model="searchRow.localSearch" placeholder="Search..." ng-keypress="searchRow.onKeyPress($event)" ng-change="searchRow.onSearch()"></md-input-container><md-button class="md-icon-button flex-fixed pip-search-clear-button" ng-if="searchRow.localSearch != \'\' && searchRow.localSearch" ng-click="searchRow.onClear()" n="" ng-disabled="searchRow.isDisable()" aria-label="search"><md-icon md-svg-icon="icons:delete"></md-icon></md-button></div>');
}]);
})();



},{}]},{},[20,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])(20)
});

//# sourceMappingURL=pip-admin-content.js.map
