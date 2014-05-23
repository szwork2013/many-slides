app.directive('presentation', function () {
	"use strict";
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div id="presentation">' +
                        '<active-slide><active-slide/>' +
                    '</div>'
    };
});

app.directive('activeSlide', function () {
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
        // Bindonce attribute is important for item directive
        template:   '<div bindonce ng-repeat="item in slide.items" class="item-wrapper">' +
                        '<item></item>' +
                    '</div>'
    };
});

app.directive('item', function () {
	"use strict";
    function link(scope, element, attrs) {
        element.on('click', function (event) {
            var that, that_id, that_controls;
            that = $(this);

            // If the element has been moved dont fire click event (would unselect) 
            if (that.hasClass('being-moved')) {
                that.removeClass('being-moved');
                return;
            }
            
            // Get controls for this item
            that_id = that.attr('id').replace('item-', '');
            that_controls = $('#controls-' + that_id);
            
            // The already selected item was clicked
            if (that.hasClass('selected-object')) {
                that.removeClass('selected-object');
                that_controls.addClass('sidebar-gone');
                that_controls.addClass('hidden');
                $('#item-controls-button').addClass('inactive');
                
            // A previously unselected item has been clicked
            } else {
                var old_item, old_item_id, old_item_controls, old_item_controls_were_visible;
                
                old_item = $('.selected-object');
                old_item_id = old_item.attr('id');

                // If there is a previously selected item, unselect it and clean up
                if (old_item_id) {
                    old_item_id = old_item_id.replace('item-', '');
                    
                    old_item_controls = $('#controls-' + old_item_id);
                    
                    old_item_controls_were_visible = 
                        !(old_item_controls.hasClass('hidden') || 
                          old_item_controls.hasClass('sidebar-gone'));
                    old_item_controls.addClass('sidebar-gone');
                    old_item_controls.addClass('hidden');
                    
                    old_item.removeClass('selected-object');
                }
                
                // Select clicked item and show controls if they were open for the previous item
                that.addClass('selected-object');
                that_controls.removeClass('hidden');
                if(old_item_controls_were_visible) {
                    that_controls.removeClass('sidebar-gone');
                }
                
                // Enable the control panel toggle
                $('#item-controls-button').removeClass('inactive');
            }
        });
        
        element.on('mousedown', function (event) {
            event.preventDefault();
            var that, that_id, that_controls;
            var start_x, start_y, new_x, new_y;
            var x_input, y_input;
          
            that = $(this);
            that_id = that.attr('id').replace('item-', '');
            that_controls = $('#controls-' + that_id);
            
            // If the item is selected and not being resized, move it
            if (that.hasClass('selected-object') && !that.hasClass('being-resized')) {
                x_input = that_controls.find('[ng-model="item.location[0]"]');
                y_input = that_controls.find('[ng-model="item.location[1]"]');
                
                start_x = event.pageX - x_input.val();
                start_y = event.pageY - y_input.val();
                
                $(document).on('mousemove', mousemove);
                $(document).on('mouseup', mouseup);
            }
            
            function mousemove(event) {
                that.addClass('being-moved');
                
                new_x = event.pageX - start_x;
                new_y = event.pageY - start_y;
                
                x_input.val(new_x).change();
                y_input.val(new_y).change();
            }

            function mouseup() {
                $(document).unbind('mousemove', mousemove);
                $(document).unbind('mouseup', mouseup);
            }
        });
        
        // Prevent accidental 'text' selection on double click
        element.on('dblclick', function () {
            event.preventDefault();
        });
    }
    
    // Binding of all the attributes to the corresponding style
    var style = 'position:          absolute;' +
                'height:            {{item.height}}px;' +
                'width:             {{item.width}}px;' +
                '-webkit-transform: translateX({{item.location[0]}}px) translateY({{item.location[1]}}px);' +
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
        // bo-id gets the id from the model and then removes the watcher (the id should not change anymore)
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
        element.on('mousedown', function (event) {
            event.preventDefault();
            
            var that, that_id, that_controls;
            var startX = 0, startY = 0, x = 0, y = 0;
            var startWidth = 0, startHeight = 0, width = 0, height = 0;
            var x_input, element_y_input, parent;
            var element_width_input, element_height_input;
            var oldX, oldY;
            
            that = $(this);
            parent = that.parent();
            parent.addClass('being-resized');
            that_id = parent.attr('id').replace('item-', '');
            that_controls = $('#controls-' + that_id);
            
            x_input = that_controls.find('[ng-model="item.location[0]"]');
            element_y_input = that_controls.find('[ng-model="item.location[1]"]');
            element_width_input  = that_controls.find('[ng-model="item.width"]');
            element_height_input = that_controls.find('[ng-model="item.height"]');

            width  = element_width_input.val();
            height = element_height_input.val();
            x = x_input.val();
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
                    x_input.val(x).change();
                    
                } else if (that.hasClass('corner-bottom-left')) {
                    height = event.pageY - startHeight;
                    element_height_input.val(height).change();
                    
                    width  = 1 * startWidth + (oldX - event.pageX);
                    element_width_input.val(width).change();
                    
                    x = event.pageX - startX;
                    x_input.val(x).change();
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

// THIS IS FOR FUTURE REFERENCE!
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