app.directive('presentation', function () {
	"use strict";
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div id="presentation">' +
                        '<presentation-slides><presentation-slides/>' +
                    '</div>'
    };
});

app.directive('presentationSlides', function () {
	"use strict";
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div ng-repeat="slide in presentation.slides | filter:{ active: true }" class="slide">' +
                        '<slide-items></slide-items>' +
                    '</div>'
    };
});

app.directive('slideItems', function () {
    "use strict";
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div bindonce ng-repeat="item in slide.items" class="item-wrapper">' +
                        '<item></item>' +
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
            var that, that_id, this_controls;
            
            that = $(this);
            that_id = that.attr('id').replace('item-', '');
            this_controls = $('#controls-' + that_id);
            
            if (that.hasClass('selected-object')) {
                that.removeClass('selected-object');
                this_controls.addClass('hidden');
                $('#item-controls-button').addClass('inactive');
            } else {
                var selected_object, selected_object_id, selected_object_controls;
                selected_object = $('.selected-object');
                selected_object_id = selected_object.attr('id');

                if (selected_object_id) {
                    selected_object_id = selected_object_id.replace('item-', '');
                    selected_object_controls = $('#controls-' + selected_object_id);
                    selected_object.removeClass('selected-object');
                    selected_object_controls.addClass('hidden');
                }
                that.addClass('selected-object');
                this_controls.removeClass('hidden');
                $('#item-controls-button').removeClass('inactive');
            }
        });
        
        element.on('mousedown', function (event) {
            event.preventDefault();
            var that, that_id, this_controls, element_is_selected;
            var element_is_being_resized, element_x_input, element_y_input;
          
            that = $(this);
            that_id = that.attr('id').replace('item-', '');
            this_controls = $('#controls-' + that_id);
            
            element_is_selected = that.hasClass('selected-object');
            element_is_being_resized =  that.hasClass('being-resized');
            
            var startX = 0, startY = 0, x = 0, y = 0;
            
            if (element_is_selected && !element_is_being_resized) {
                that.addClass('being-moved');
                element_x_input = this_controls.find('[ng-model="item.location[0]"]');
                element_y_input = this_controls.find('[ng-model="item.location[1]"]');
                
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
                that.removeClass('being-moved');
            }
        });
        
        element.on('dblclick', function () {
            event.preventDefault();
        });
    }
    
    var style = 'position:          absolute;' +
                'height:            {{item.height}}px;' +
                'width:             {{item.width}}px;' +
                '-webkit-transform: translateX({{item.location[0]}}px) translateY({{item.location[1]}}px);' +
                '-moz-transform:    translateX({{item.location[0]}}px) translateY({{item.location[1]}}px);' +
                '-ms-transform:     translateX({{item.location[0]}}px) translateY({{item.location[1]}}px);' +
                '-o-transform:      translateX({{item.location[0]}}px) translateY({{item.location[1]}}px);' +
                'transform:         translateX({{item.location[0]}}px) translateY({{item.location[1]}}px);' +
                'background:        {{item.style.background}};' +
                'border:            {{item.style.border}};' +
                'border-radius:     {{item.style.border_radius}}%;' +
				'z-index:           {{item.layer}};' +
                'text-align:        {{item.text.align}};' +
                'font-size:         {{item.text.size}}rem;' +
                'font-weight:       {{item.text.format}};' +
                'color:             {{item.text.color}};';
    
    return {
        link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div bo-id="\'item-\' + item.id" class="item" style="' + style + '">' +
                        '<item-corner corner-position="top-left"></item-corner>' +
                        '<item-corner corner-position="bottom-left"></item-corner>' +
                        '<item-corner corner-position="bottom-right"></item-corner>' +
                        '<item-corner corner-position="top-right"></item-corner>' +
                        '{{item.text.content}}' +
                    '</div>'
    };
});

app.directive('itemCorner', function () {
    "use strict";
    function link(scope, element, attrs) {
        console.log('TEST');
        element.on('mousedown', function (event) {
            event.preventDefault();
            console.log("draggin");
            
            var that, that_id, this_controls, element_is_selected;
            var startX = 0, startY = 0, x = 0, y = 0;
            var startWidth = 0, startHeight = 0, width = 0, height = 0;
            var element_x_input, element_y_input, parent;
            var element_width_input, element_height_input;
            var oldX, oldY;
            
            that = $(this);
            parent = that.parent();
            parent.addClass('being-resized');
            that_id = parent.attr('id').replace('item-', '');
            this_controls = $('#controls-' + that_id);
            
            element_x_input = this_controls.find('[ng-model="item.location[0]"]');
            element_y_input = this_controls.find('[ng-model="item.location[1]"]');
            element_width_input  = this_controls.find('[ng-model="item.width"]');
            element_height_input = this_controls.find('[ng-model="item.height"]');

            width  = element_width_input.val();
            height = element_height_input.val();
            x = element_x_input.val();
            y = element_y_input.val();

            if (that.hasClass('corner-top-right')) {
                startWidth  = event.pageX - width;
                startHeight = height;
                startY = event.pageY - y;
                oldY = event.pageY;
            } else if (that.hasClass('corner-top-left')) {
                startHeight = height;
                startWidth  = width;
                
                startY = event.pageY - y;
                startX = event.pageX - x;
                
                oldX = event.pageX;
                oldY = event.pageY;
            } else if (that.hasClass('corner-bottom-left')) {
                startWidth  = width;
                startHeight = event.pageY - height;
                startX = event.pageX - x;
                oldX = event.pageX;
            } else {
                startWidth  = event.pageX - width;
                startHeight = event.pageY - height;
            }
            
            $(document).on('mousemove', mousemove);
            $(document).on('mouseup', mouseup);
            
            function mousemove(event) {
                if (that.hasClass('corner-top-right')) {
                    width  = event.pageX - startWidth;
                    element_width_input.val(width).change();
               
                    height  = 1 * startHeight + (oldY - event.pageY);
                    element_height_input.val(height).change();
                    
                    y = event.pageY - startY;
                    element_y_input.val(y).change();
                } else if (that.hasClass('corner-top-left')) {

                    height  = 1 * startHeight + (oldY - event.pageY);
                    element_height_input.val(height).change();
                    
                    y = event.pageY - startY;
                    element_y_input.val(y).change();
                    width  = 1 * startWidth + (oldX - event.pageX);
                    element_width_input.val(width).change();
                    
                    x = event.pageX - startX;
                    element_x_input.val(x).change();
                    
                } else if (that.hasClass('corner-bottom-left')) {
                    height = event.pageY - startHeight;
                    element_height_input.val(height).change();
                    
                    width  = 1 * startWidth + (oldX - event.pageX);
                    element_width_input.val(width).change();
                    
                    x = event.pageX - startX;
                    element_x_input.val(x).change();
                } else {
                    width  = event.pageX - startWidth;
                    height = event.pageY - startHeight;
               
                    element_width_input.val(width).change();
                    element_height_input.val(height).change();
                }
            }

            function mouseup() {
                $(document).unbind('mousemove', mousemove);
                $(document).unbind('mouseup', mouseup);
                parent.removeClass('being-resized');
            }
        });
        
        element.on('dblclick', function () {
            event.preventDefault();
        });
    }
    
    return {
        restrict: 'E',
        //require: ['^cornerPosition'],  // NOT INCLUDED SINCE IT THROWS ERRORS WHEN USED IN CONJUNCTION WITH THE 'link' ATTRIBUTE!
        scope: {
            cornerPosition: '@'
        },
        replace: true,
        link: link,
        template:   '<div class="item-corner corner-{{cornerPosition}}"></div>'
    };
});

// THIS STUFF IS FOR FUTURE REFERENCE!!!
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.10.0 - 2014-01-14
 * License: MIT
 */
/*angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.alert"]);
angular.module("ui.bootstrap.tpls", ["template/alert/alert.html"]);
angular.module("ui.bootstrap.alert", [])

.controller('AlertController', ['$scope', '$attrs', function ($scope, $attrs) {
  $scope.closeable = 'close' in $attrs;
}])

.directive('alert', function () {
  return {
    restrict:'EA',
    controller:'AlertController',
    templateUrl:'template/alert/alert.html',
    transclude:true,
    replace:true,
    scope: {
      type: '=',
      close: '&'
    }
  };
});

angular.module("template/alert/alert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/alert/alert.html",
    "<div class='alert' ng-class='\"alert-\" + (type || \"warning\")'>\n" +
    "    <button ng-show='closeable' type='button' class='close' ng-click='close()'>&times;</button>\n" +
    "    <div ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);*/