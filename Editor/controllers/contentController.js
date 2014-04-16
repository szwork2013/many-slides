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
    
    $scope.showPresentationSettings = function () {
        alert('Soon!');
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
                    color: '#000000',
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
                    color: '#000000',
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
                    color: '#000000',
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
                height : 100,
                width : 750,
                rotation : 0.0,
                related_items : [], //Item Array
                shape : {},
                text : {
                    content : 'Enter text',
                    size: 2.0,
                    align: 'left',
                    color: '#000000',
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
                    color: '#000000',
                },
                style : {},
                deleted: false
            },
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
        if(item) {
            var item_id = item.attr('id').replace('item-','');
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
        for (var i = 0; i < lenght; i++) {
            $scope.presentation.slides[i].active = false;   
        }
        $scope.presentation.slides[index].active = true;
        $scope.presentation.active_slide = index;
    };
    
    $timeout(function() {
        $("[data-toggle=tooltip]").tooltip();
        $scope.setActiveSlide(0);
    });
});