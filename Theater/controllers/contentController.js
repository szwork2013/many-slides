app.controller('contentCtrl', function ($scope, $timeout) {
        'use strict';
        $scope.presentation = {};

        var chosenEntry = null;
        var fileStatus = ''; // status report
        var fileContent = '';
        var filePath = '';
        var scope;

        init();

        /* --- Private functions --- */

        // Stuff that should be done when this controller is created
        function init() {
            // TODO should not run if theater is opened
            loadInitialFile(launchData);
        }

        // Simple error Handler
        function errorHandler(e) {
            console.error(e);
        }

        // Logs the file path to a given entry in the console
        function displayEntryData(theEntry) {
            if (theEntry.isFile) {
                chrome.fileSystem.getDisplayPath(theEntry, function (path) {
                    filePath = path;
                });
            } else {
                filePath = theEntry.fullPath;
            }
            console.log('filepath: ' + filePath);
        }

        // Reads in the file from the given file entry
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

        // Writes the given blob to the given writable file entry
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

        // Waits for systems IO to be free
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
                    console.error('Write operation taking too long, aborting!' +
                        ' (current writer readyState is ' + writer.readyState + ')');
                    writer.abort();
                } else {
                    callback();
                }
            };
            setTimeout(reentrant, 100);
        }

        // Loades the file from the given file entry
        function loadFileEntry(_chosenEntry) {
            chosenEntry = _chosenEntry;
            chosenEntry.file(function (file) {
                readAsText(chosenEntry, function (result) {
                    fileContent = result.toString();
                    $scope.$apply(function () {
                        $scope.presentation = JSON.parse(fileContent);
                        // Set loaded presentation to the globalPresentation
                        globalPresentation = $scope.presentation;
                        console.log(globalPresentation);
                    });
                });
            });
        }

        // Tries to load the most recent file
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
                            console.info('Restoring ' + items.chosenFile);
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

        /* --- Scope functions --- */

        $scope.parsePresentation = function () {
            var foo = $scope.presentationInputVaule;
            console.log(foo);
            $scope.presentation = JSON.parse(foo);
        }

        // Jump to previous Slide
        $scope.previousSlide = function () {
            if (document.getElementById('slide-index').value.length == 0) {
                document.getElementById('slide-index').value = 0;
            }
            var index = parseInt(document.getElementById('slide-index').value);
            if (index > 0) {

                index = index - 1;
                document.getElementById('slide-index').value = index;

                onMessageSend(4, 1);
            }
            $scope.setActiveSlide(index);
        };
        // Jump to next Slide
        $scope.nextSlide = function () {
            if (document.getElementById('slide-index').value.length == 0) {
                document.getElementById('slide-index').value = 0;
            }
            var index = parseInt(document.getElementById('slide-index').value);

            var length = $scope.presentation.slides.length;
            if (index < length - 1) {

                index = index + 1;
                document.getElementById('slide-index').value = index;
                $scope.setActiveSlide(index);
                onMessageSend(4, 1);
            }
        };
        // Show or Hide presentation
        $scope.blankPresentation = function () {
            if ($('#blankPresentation').html() == "hide") {
                $('#blankPresentation').html("show");
                $('#presentation').hide();
                onMessageSend(4, 2);
            }
            else if ($('#blankPresentation').html() == "show") {
                $('#blankPresentation').html("hide");
                $('#presentation').show();
                onMessageSend(4, 3);
            }
        };

        // Toggle Sharing
        $scope.toggleSharing = function () {
            if ($('#toogleSharing').html() == "Start sharing") {
                $('#toogleSharing').removeClass("switch-off");
                $('#toogleSharing').addClass("switch-on");
                $('#toogleSharing').html("Stop sharing");
            }
            else if ($('#toogleSharing').html() == "Stop sharing") {
                $('#toogleSharing').removeClass("switch-on");
                $('#toogleSharing').addClass("switch-off");
                $('#toogleSharing').html("Start sharing");
            }
        }

        $scope.printPresentation = function () {
            console.log($scope.presentation);
        };

        // corresponds to 'open file'
        $scope.loadFile = function () {
            var accepts = [
                {
                    mimeTypes: ['text/*'],
                    extensions: ['txt', 'json']
                }
            ];

            // opens file explorer to choose a file
            chrome.fileSystem.chooseEntry({type: 'openFile', accepts: accepts}, function (theEntry) {
                if (!theEntry) {
                    fileStatus = 'No file selected';
                    return;
                }
                // use local storage to retain access to this file
                chrome.storage.local.set({'chosenFile': chrome.fileSystem.retainEntry(theEntry)});
                loadFileEntry(theEntry);
                toastr.success("New presentation successfully loaded!");
            });
        };

        // TODO - Implement presentation settings
        $scope.showPresentationSettings = function () {
            console.info('Nothing here, yet!');
        };

        // Tries to open the selected items control panel
        $scope.showItemSettings = function () {
            var item = $('.item.selected-object');
            if (item) {
                var item_id = item.attr('id').replace('item-', '');
                $('#controls-' + item_id).removeClass('hidden').removeClass('sidebar-gone');
            }
        };

        // TODO - Implement slide settings
        $scope.showSlideSettings = function () {
            console.info('Nothing here, yet!');
        };

        $scope.setActiveSlideFromInput = function () {
            var value = $scope.activeSlideInputValue;
            $scope.setActiveSlide(value / 1);
        }

        // Sets the slide at the given index active
        // TODO - Make better using underscorejs
        $scope.setActiveSlide = function (index) {
            var lenght = $scope.presentation.slides.length;
            if (lenght < index) {
                return;
            }
            var i;
            for (i = 0; i < lenght; i++) {
                $scope.presentation.slides[i].active = false;
            }
            $scope.presentation.slides[index].active = true;
            $scope.presentation.active_slide = index;
        };

        // Tooltip activation after they have been created by angular
        // May be moved into the correpsonding directives, maybe
        $timeout(function () {
            $("[data-toggle=tooltip]").tooltip();
        });
    }
)
;