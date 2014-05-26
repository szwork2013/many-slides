app.controller("theaterController", function ($scope, $timeout) {
	"use strict";
    $scope.presentation = {};
    
    init();
    
    function init() {
        // Get presentation
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
        //$scope.setActiveSlide(0);
    });
});