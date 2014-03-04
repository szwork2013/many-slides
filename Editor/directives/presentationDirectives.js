app.directive('presentation', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div id="presentation">' +
                        '<presentation-slides/>' +
                    '</div>'
    };
})

app.directive('presentationSlides', function() {
    return {
        restrict: 'E',
        replace: false,
        scope: true,
        template:   '<div ng-repeat="slide in presentation.slides" class="slide">' +
                        '<slide-layers/>' +
                    '</div>'
    };
});

app.directive('item', function() {
    function link(scope, element, attrs) {
        element.on('click', function(event) {
            
            var this_element = $(this);
            var is_selected_object = this_element.hasClass('selected-object');  
            
            if(is_selected_object) {
                this_element.removeClass('selected-object');
            } else {
                $('.selected-object').removeClass();
                this_element.addClass('selected-object');
                this_element.parent().children('.item-controls').removeClass('.hidden');
            }
            
        });
        
        element.on('dblclick', function() {
            event.preventDefault();
        });
        
        element.on('mousedown', function() {
            event.preventDefault();
        });
    }
    
    var style = 'position: absolute;' +
                'height: {{item.height}}px;' +
                'width: {{item.width}}px;' +
                '-webkit-transform: translate3d(' +
                    '{{item.location[0]}}px,' +
                    '{{item.location[1]}}px,' +
                    '{{item.layer}}px);' +
                'background: {{item.style.background}};' +
                'border-radius: {{item.style.border_radius}}px';
    
    return {
        link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<div class="item" style="' + style + '"></div>'
    };
});

app.directive('layerItems', function() {
    return {
        restrict: 'E',
        replace: false,
        scope: true,
        template:   '<div ng-repeat="item in layer.items" class="item-wrapper">' +
                        '<item></item>' +
                        '<div class="item-controls hidden">' +
                            '<div class="form-group">Width: <input type="text" class="form-control" ng-model="item.width"></div>' +
                            '<div class="form-group">Height: <input type="text" class="form-control" ng-model="item.height"></div>' +
                            '<div class="form-group">Left: <input type="text" class="form-control" ng-model="item.location[0]"></div>' +
                            '<div class="form-group">Top: <input type="text" class="form-control" ng-model="item.location[1]"></div>' +
                            '<div class="form-group">Layer: <input type="text" class="form-control" ng-model="item.layer"></div>' +                        
                            '<div class="form-group">Color: <input type="text" class="form-control" ng-model="item.style.background"></div>' +
                            '<div class="form-group">Border-Radius:<input type="text" class="form-control" ng-model="item.style.border_radius"></div>' +
                            '</div>' +
                    '</div>' 
    };
});

app.directive('slideLayers', function() {
    return {
        restrict: 'E',
        replace: false,
        scope: true,
        template:   '<div ng-repeat="layer in slide.layers" class="layer">' +
                        '<layer-items></layer-items>' +
                    '</div>'
    };
});