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
        var items = $scope.presentation.slides[0].layers[0].items;
        $scope.presentation.slides[0].layers[0].items = _.filter(items, function (item) {
            return !item.deleted;
        });
    };
	
	function say() {
		alert('woof');
	}
    
    $scope.addItem = function () {
        $scope.presentation.slides[0].items.push({
			location : [100, 100],
			layer : 0, //(Layer.position)
			height : 100,
			width : 150,
			rotation : 0.0,
			related_items : [], //Item Array
			shape : {},
			text : {},
			style : {
				background : "#fff",
				border: '1px solid black',
				border_radius : 0
			},
			deleted: true
		});
    };
});