app.controller("contentController", function ($scope, $timeout) {
	"use strict";
    $scope.presentation = {};
    
    var chosenEntry = null;
    var fileStatus = ''; // status report
    var fileContent = '';
    var filePath = '';
    var scope;
    
    init();
    
    // Private functions
    
    function init() {
        loadInitialFile(launchData);
    }

    function errorHandler(e) {
        console.error(e);
    }

    function displayEntryData(theEntry) {
        if (theEntry.isFile) {
            chrome.fileSystem.getDisplayPath(theEntry, function (path) {
                filePath = path;
            });
        } else {
            filePath = theEntry.fullPath;
        }
    }

    function readAsText(fileEntry, callback) {
        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onerror = errorHandler;
            reader.onload = function (e) {
                callback(e.target.result);
            };

            reader.readAsText(file);
        });
    }

    function writeFileEntry(writableEntry, opt_blob, callback) {
        if (!writableEntry) {
            fileStatus = 'Nothing selected';
            return;
        }

        writableEntry.createWriter(function (writer) {
            writer.onerror = errorHandler;
            writer.onwriteend = callback;

            // If we have data, write it to the file. Otherwise, just use the file we loaded.
            if (opt_blob) {
                writer.truncate(opt_blob.size);
                waitForIO(writer, function () {
                    writer.seek(0);
                    writer.write(opt_blob);
                });
            } else {
                chosenEntry.file(function (file) {
                    writer.truncate(file.fileSize);
                    waitForIO(writer, function () {
                        writer.seek(0);
                        writer.write(file);
                    });
                });
            }
        }, errorHandler);
    }

    function waitForIO(writer, callback) {
        // set a watchdog to avoid eventual locking:
        var start = Date.now();
        // wait for a few seconds
        var reentrant = function () {
            if (writer.readyState === writer.WRITING && Date.now() - start < 4000) {
                setTimeout(reentrant, 100);
                return;
            }
            if (writer.readyState === writer.WRITING) {
                console.error("Write operation taking too long, aborting!" +
                    " (current writer readyState is " + writer.readyState + ")");
                writer.abort();
            } else {
                callback();
            }
        };
        setTimeout(reentrant, 100);
    }

    function loadFileEntry(_chosenEntry) {
        chosenEntry = _chosenEntry;
        chosenEntry.file(function (file) {
            readAsText(chosenEntry, function (result) {
                fileContent = result.toString();

                $scope.$apply(function () {
                    $scope.presentation = JSON.parse(fileContent);
                });
            });
            // Update display.
            displayEntryData(chosenEntry);
        });
    }

    function loadInitialFile(launchData) {
        if (launchData && launchData.items && launchData.items[0]) {
            loadFileEntry(launchData.items[0].entry);
        } else {
            // see if the app retained access to an earlier file or directory
            chrome.storage.local.get('chosenFile', function (items) {
                if (items.chosenFile) {
                    // if an entry was retained earlier, see if it can be restored
                    chrome.fileSystem.isRestorable(items.chosenFile, function (bIsRestorable) {
                        // the entry is still there, load the content
                        console.info("Restoring " + items.chosenFile);
                            chrome.fileSystem.restoreEntry(items.chosenFile, function (chosenEntry) {
                            if (chosenEntry && chosenEntry.isFile) {
                                loadFileEntry(chosenEntry);
                            }
                        });
                    });
                }
            });
        }
    }
    
    // Scope functions

    $scope.loadFile = function () {
        var accepts = [{
            mimeTypes: ['text/*'],
            extensions: ['txt', 'json']
        }];
        
        chrome.fileSystem.chooseEntry({type: 'openFile', accepts: accepts}, function (theEntry) {
            if (!theEntry) {
                fileStatus = 'No file selected';
                return;
            }
            // use local storage to retain access to this file
            chrome.storage.local.set({'chosenFile': chrome.fileSystem.retainEntry(theEntry)});
            loadFileEntry(theEntry);
        });
    };
    
    // corresponds to 'save as'
    $scope.saveFile = function () {
        var config = {
            type: 'saveFile',
            suggestedName: chosenEntry.name
        };

        chrome.fileSystem.chooseEntry(config, function (writableEntry) {
            fileContent = JSON.stringify($scope.presentation);
            var blob = new Blob([fileContent], {type: 'text/plain'});

            writeFileEntry(writableEntry, blob, function (e) {
                fileStatus = 'Presentation <ADD-NAME> saved !';
            });
        });
    };
    
    $scope.showPresentationSettings = function () {
        alert('Nothing here, yet!');
    };
    
    $scope.addItem = function (shape) {
        var shapes = {
            'circle': {
                id: Math.random().toString(36).slice(2),
                location : [100, 100],
                layer : 0, //(Layer.position)
                height : 130,
                width : 130,
                rotation : 0.0,
                related_items : [], //Item Array
                shape : {},
                text : {
                    align: 'left',
                    color: '#000000'
                },
                style : {
                    background : '#1abc9c',
                    border: '',
                    border_radius : 100
                },
                deleted: false
            },
            'square': {
                id: Math.random().toString(36).slice(2),
                location : [100, 100],
                layer : 0, //(Layer.position)
                height : 125,
                width : 125,
                rotation : 0.0,
                related_items : [],
                shape : {},
                text : {
                    align: 'left',
                    color: '#000000'
                },
                style : {
                    background : "#1abc9c",
                    border: '',
                    border_radius : 10
                },
                deleted: false
            },
            'rectangle': {
                id: Math.random().toString(36).slice(2),
                location : [100, 100],
                layer : 0,
                height : 100,
                width : 150,
                rotation : 0.0,
                related_items : [],
                shape : {},
                text : {
                    align: 'left',
                    color: '#000000'
                },
                style : {
                    background : "#1abc9c",
                    border: '',
                    border_radius : 10
                },
                deleted: false
            },
            'heading': {
                id: Math.random().toString(36).slice(2),
                location : [100, 100],
                layer : 0, //(Layer.position)
                height : 100,
                width : 750,
                rotation : 0.0,
                related_items : [], //Item Array
                shape : {},
                text : {
                    content : 'Enter heading text',
                    size: 3.5,
                    align: 'left',
                    color: '#000000',
                    format: 'bold'
                },
                style : {},
                deleted: false
            },
            'textbox': {
                id: Math.random().toString(36).slice(2),
                location : [100, 100],
                layer : 0, //(Layer.position)
                height : 300,
                width : 750,
                rotation : 0.0,
                related_items : [], //Item Array
                shape : {},
                text : {
                    content : 'Enter text',
                    size: 2.0,
                    align: 'left',
                    color: '#000000'
                },
                style : {},
                deleted: false
            },
            'footer': {
                id: Math.random().toString(36).slice(2),
                location : [100, 100],
                layer : 0, //(Layer.position)
                height : 100,
                width : 750,
                rotation : 0.0,
                related_items : [], //Item Array
                shape : {},
                text : {
                    content : 'Enter footer text',
                    size: 1.5,
                    align: 'left',
                    color: '#000000'
                },
                style : {},
                deleted: false
            }
        };
        
        $scope.presentation.slides[$scope.presentation.active_slide].items.push(shapes[shape]);
    };
    
    $scope.deleteItems = function () {
        var items = $scope.presentation.slides[$scope.presentation.active_slide].items;
        $scope.presentation.slides[$scope.presentation.active_slide].items = _.filter(items, function (item) {
            return !item.deleted;
        });
    };
    
    $scope.showItemSettings = function () {
        var item = $('.item.selected-object');
        if (item) {
            var item_id = item.attr('id').replace('item-', '');
            $('#controls-' + item_id).removeClass('hidden').removeClass('sidebar-gone');
        }
    };
    
    $scope.addSlide = function () {
        $scope.presentation.slides.push({
            position : 4,
            transition : 0,
            deleted: false,
            items : []
		});
    };
    
    $scope.deleteSlides = function () { //TODO - set new active_slide when active slide was deleted
        var slides = $scope.presentation.slides;
        $scope.presentation.slides = _.filter(slides, function (slide) {
            return !slide.deleted;
        });
    };
    
    $scope.showSlideSettings = function () {
        alert('Nothing here, yet!');
    };
    
    $scope.setActiveSlide = function (index) {
        // TODO - Make better with underscorejs
        var lenght = $scope.presentation.slides.length;
        var i;
        for (i = 0; i < lenght; i++) {
            $scope.presentation.slides[i].active = false;
        }
        $scope.presentation.slides[index].active = true;
        $scope.presentation.active_slide = index;
    };
    
    $timeout(function () {
        $("[data-toggle=tooltip]").tooltip();
    });
});