app.controller("contentController", function ($scope, $timeout, presentationFactory) {
	"use strict";
    $scope.presentation = {};
    
    init();
    
    function init() {
        $scope.presentation = presentationFactory.getPresentation();
    }
    
    $scope.savePresentation = function () {
        presentationFactory.pushPresentation($scope.presentation);
    };
    
    $scope.deleteItems = function () {
        var items = $scope.presentation.slides[0].items;
        $scope.presentation.slides[0].items = _.filter(items, function (item) {
            return !item.deleted;
        });
    };

    $scope.addItem = function () {
        $scope.presentation.slides[0].items.push({
            id: Math.random().toString(36).slice(2),
			location : [100, 100],
			layer : 0, //(Layer.position)
			height : 100,
			width : 150,
            rotation : 0.0,
			related_items : [], //Item Array
			shape : {},
			text : {},
			style : {
				background : "#1abc9c",
				border: '',
				border_radius : 10
			},
			deleted: false
		});
    };
    
    $scope.addSlide = function () {
        $scope.presentation.slides.push({
            position : 4,
            transition : 0,
            deleted: false,
            items : []
		});
    };
    
    $scope.deleteSlides = function () { //TODO - make work
        var slides = $scope.presentation.slides;
        $scope.presentation.slides = _.filter(slides, function (slide) {
            return !slide.deleted;
        });
    };
    
    $timeout(function(){$("[data-toggle=tooltip]").tooltip();});
});