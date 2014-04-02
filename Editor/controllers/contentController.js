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

    $scope.addItem = function (shape) {
        alert('Yo, you choose a frickin\' ' + shape);
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
                text : {},
                style : {
                    background : "#1abc9c",
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
                related_items : [], //Item Array
                shape : {},
                text : {},
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
            },
            'heading': {
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
            },
            'textbox': {
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
            },
            'footer': {
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
            },
        };
        $scope.presentation.slides[0].items.push(shapes[shape]);
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