app.controller("contentController", function ($scope, presentationFactory) {
    $scope.presentation = {};
    
    init();
    
    function init() {
        $scope.presentation = presentationFactory.getPresentation();
    }
    
    $scope.savePresentation = function () {
        presentationFactory.pushPresentation($scope.presentation);
    }
});