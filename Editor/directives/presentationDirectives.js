app.directive('presentation', function () {
	"use strict";
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div id="presentation">' +
                        '<presentation-slides/>' +
                    '</div>'
    };
});

app.directive('presentationSlides', function () {
	"use strict";
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div ng-repeat="slide in presentation.slides" class="slide">' +
                        '<slide-items></slide-items>' +
                    '</div>'
    };
});

app.directive('item', function () {
	"use strict";
    function link(scope, element, attrs) {
        var mousemove_fired = false;
        
        element.on('click', function (event) {
            if (mousemove_fired) {
                mousemove_fired = false;
                return;
            }
            var this_element = $(this);
            var this_controls = this_element.parent().children('.item-controls');
            var element_is_selected = this_element.hasClass('selected-object');
			var selected_objects = $('.selected-object');
            var selected_object_controls = selected_objects.parent().children('.item-controls');
            
            if (element_is_selected) {
                this_element.removeClass('selected-object');
                this_controls.addClass('hidden');
            } else {
                selected_objects.removeClass('selected-object');
                selected_object_controls.addClass('hidden');
                this_element.addClass('selected-object');
                this_controls.removeClass('hidden');
            }
        });
        
        element.on('mousedown', function (event) {
            event.preventDefault();
          
            var this_element = $(this);
            var this_controls = this_element.parent().children('.item-controls');
            var element_is_selected = this_element.hasClass('selected-object');
            var startX = 0, startY = 0, x = 0, y = 0;
            
            if (element_is_selected) {
                // TODO CHANGE THIS BEHAVIOUR
                var element_x_input = this_controls.find('[ng-model="item.location[0]"]');
                var element_y_input = this_controls.find('[ng-model="item.location[1]"]');
                
                x = element_x_input.val();
                y = element_y_input.val();
                
                startX = event.pageX - x;
                startY = event.pageY - y;
                $(document).on('mousemove', mousemove);
                $(document).on('mouseup', mouseup);
            }
            
            function mousemove(event) {
                mousemove_fired = true;
                y = event.pageY - startY;
                x = event.pageX - startX;
                element_x_input.val(x).change();
                element_y_input.val(y).change();
            }

            function mouseup() {
                $(document).unbind('mousemove', mousemove);
                $(document).unbind('mouseup', mouseup);
            }
        });
        
        element.on('dblclick', function () {
            event.preventDefault();
        });
    }
    
    var style = 'position: absolute;' +
                'height: {{item.height}}px;' +
                'width: {{item.width}}px;' +
                '-webkit-transform: translateX({{item.location[0]}}px) translateY({{item.location[1]}}px);' +
                '-moz-transform: translateX({{item.location[0]}}px) translateY({{item.location[1]}}px);' +
                '-ms-transform: translateX({{item.location[0]}}px) translateY({{item.location[1]}}px);' +
                '-o-transform: translateX({{item.location[0]}}px) translateY({{item.location[1]}}px);' +
                'transform: translateX({{item.location[0]}}px) translateY({{item.location[1]}}px);' +
                'background: {{item.style.background}};' +
                'border: {{item.style.border}};' +
                'border-radius: {{item.style.border_radius}}px;';
    
    return {
        link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<div class="item" style="' + style + '"></div>'
    };
});

app.directive('itemControls', function() {
    function link(scope, element, attrs) {
        element.on('mousedown', function(event) {
 //           event.preventDefault();
            
            var this_element = $(this);
            var startX = 0, startY = 0, x = 0, y = 0;

                // TODO CHANGE THIS BEHAVIOUR
            var element_x_input = this_controls.find('[ng-model="item.location[0]"]');
            var element_y_input = this_controls.find('[ng-model="item.location[1]"]');

            x = element_x_input.val();
            y = element_y_input.val();

            startX = event.pageX - x;
            startY = event.pageY - y;
            $(document).on('mousemove', mousemove);
            $(document).on('mouseup', mouseup);

            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                element_x_input.val(x).change();
                element_y_input.val(y).change();
            }

            function mouseup() {
                $(document).unbind('mousemove', mousemove);
                $(document).unbind('mouseup', mouseup);
            }
        });
    }
    
    return {
        link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<div class="item-controls hidden" style="-webkit-transform: translateX(100px)  translateY(100px)">' +
                        '<div class="form-group">Width: <input type="text" class="form-control" ng-model="item.width"></div>' +
                        '<div class="form-group">Height: <input type="text" class="form-control" ng-model="item.height"></div>' +
                        '<div class="form-group">Left: <input type="text" class="form-control" ng-model="item.location[0]"></div>' +
                        '<div class="form-group">Top: <input type="text" class="form-control" ng-model="item.location[1]"></div>' +
                        '<div class="form-group">Layer: <input type="text" class="form-control" ng-model="item.layer"></div>' +
                        '<div class="form-group">Color: <input colorpicker type="text" class="form-control" ng-model="item.style.background"></div>' +
                        '<div class="form-group">Border:<input type="text" class="form-control" ng-model="item.style.border"></div>' +
                        '<div class="form-group">Border-Radius:<input type="text" class="form-control" ng-model="item.style.border_radius"></div>' +
                    '</div>'
    };
});

app.directive('slideItems', function () {
    "use strict";
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div ng-repeat="item in slide.items" class="item-wrapper" style="position: absolute; z-index: {{item.layer}};">' +
                        '<item></item>' +
                        '<item-controls></item-controls>' +
                    '</div>'
    };
});

app.directive('menubar', function () {
    "use strict";
	return {
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<div class="col-xs-12 col-gutter-none">' +
                      '<nav class="navbar navbar-inverse navbar-embossed" role="navigation">' +
                        '<div class="navbar-header">' +
                          '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse-01">' +
                            '<span class="sr-only">Toggle navigation</span>' +
                          '</button>' +
                        '</div>' +
                        '<div class="collapse navbar-collapse" id="navbar-collapse-01">' +
                          '<ul class="nav navbar-nav navbar-left    ">' +
                            '<li><a href="#" ng-click="addItem()">Add Item</a></li>' +
                            '<li><a href="#" ng-click="deleteItems()">Delete Items</a></li>' +
                            '<li><a href="https://github.com/Gambloide/many-slides">GitHub</a></li>' +
                           '</ul>' +
                        '</div>' +
                      '</nav>' +
                    '</div>'
    };
});