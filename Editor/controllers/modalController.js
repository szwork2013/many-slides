var ModalDemoCtrl = function ($scope, $modal, $log) {
    $scope.open = function (size) {
        var manifest = chrome.runtime.getManifest();
        var github_url = 'https://github.com/Gambloide/many-slides';
        var nounproject_url = 'http://thenounproject.com/';
        var logo_author_url = 'http://thenounproject.com/bnvk/';
        var modalInstance = $modal.open({
            template:   '<div class="modal-header">' +
                            '<h4 class="modal-title">About Many-Slides</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                            '<p>Our Logo is a derivative work of Flash Cards by ' +
                                '<a href="' + logo_author_url + '" target="_blank">Brennan Novak</a>' +
                                ' from ' +
                                '<a href="' + nounproject_url + '" target="_blank">The Noun Project</a></p>' +
                            '<p>Version ' + manifest.version + '</p>' +
                            '<p>Many-Slides is made possible by our open source community on ' +
                                '<a href="' + github_url + '" target="_blank">GitHub</a></p>' +
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<button class="btn btn-primary" ng-click="ok()">Got it!</button>' +
                        '</div>',
            controller: ModalInstanceCtrl,
            size: size
        });
    };
};

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};