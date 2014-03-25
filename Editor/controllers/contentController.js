app.controller("contentController", function ($scope, presentationFactory) {
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
			deleted: true
		});
    };
});