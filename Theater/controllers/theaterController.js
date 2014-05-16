app.controller("theaterController", function ($scope, $timeout, presentationFactory) {
	"use strict";
    $scope.presentation = {};
    
    init();
    
    console.log("MOOP");
    console.log("MOOP");
    console.log("MOOP");
    console.log("MOOP");
    console.log("MOOP");
    console.log($scope.presentation);
    
    
    function init() {
        $scope.presentation = presentationFactory.getPresentation();
    }
    
    $scope.setActiveSlide = function (index) {
        // TODO - Make better with underscorejs
        var lenght = $scope.presentation.slides.length;
        for (var i = 0; i < lenght; i++) {
            $scope.presentation.slides[i].active = false;   
        }
        $scope.presentation.slides[index].active = true;
        $scope.presentation.active_slide = index;
    };
    
    $timeout(function() {
        $scope.setActiveSlide(0);
    });
});