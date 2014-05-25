app.directive('maslPresentation', function () {
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
            var that = $(this);

            // If the element has been moved dont fire click event (would unselect) 
            if (that.hasClass('being-moved')) {
                that.removeClass('being-moved');
                return;
            }
            
            // Get controls for this item
            var item_id = that.attr('id').replace('item-', '');
            var item_controls = $('#controls-' + item_id);
            
            // The already selected item was clicked
            if (that.hasClass('selected-object')) {
                that.removeClass('selected-object');
                item_controls.addClass('sidebar-gone');
                item_controls.addClass('hidden');
                $('#item-controls-button').addClass('inactive');
                
            // A previously unselected item has been clicked
            } else {
                var old_item_controls, reopen_controls;
                
                var old_item = $('.selected-object');
                var old_item_id = old_item.attr('id');

                // If there is a previously selected item, unselect it and clean up
                if (old_item_id) {
                    old_item_id = old_item_id.replace('item-', '');
                    
                    old_item_controls = $('#controls-' + old_item_id);
                    
                    reopen_controls = !(old_item_controls.hasClass('hidden') ||
                          old_item_controls.hasClass('sidebar-gone'));
                    old_item_controls.addClass('sidebar-gone');
                    old_item_controls.addClass('hidden');
                    
                    old_item.removeClass('selected-object');
                }
                
                // Select clicked item and show controls if they were open for the previous item
                that.addClass('selected-object');
                item_controls.removeClass('hidden');
                if (reopen_controls) {
                    item_controls.removeClass('sidebar-gone');
                }
                
                // Enable the control panel toggle
                $('#item-controls-button').removeClass('inactive');
            }
        });
        
        element.on('mousedown', function (event) {
            event.preventDefault();
            var start_x, start_y, x, y;
            var x_input, y_input;
          
            var that = $(this);
            var item_id = that.attr('id').replace('item-', '');
            var item_controls = $('#controls-' + item_id);
            
            // If the item is selected and not being resized, move it
            if (that.hasClass('selected-object') && !that.hasClass('being-resized')) {
                x_input = item_controls.find('[ng-model="item.location[0]"]');
                y_input = item_controls.find('[ng-model="item.location[1]"]');
                
                start_x = event.pageX - x_input.val();
                start_y = event.pageY - y_input.val();
                
                $(document).on('mousemove', mousemove);
                $(document).on('mouseup', mouseup);
            }
            
            function mousemove(event) {
                that.addClass('being-moved');
                
                x = event.pageX - start_x;
                y = event.pageY - start_y;
                
                x_input.val(x).change();
                y_input.val(y).change();
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
            
            var start_width, start_height;
            var width, height;
            var start_x, start_y;
            var old_x, old_y;
            var x, y;
            
            var that = $(this);

            // Get item this corner belongs to
            var parent = that.parent();
            
            // Add being resized flag to prevent move of item on mousemove
            parent.addClass('being-resized');
            
            // Get controls for this item
            var item_id = parent.attr('id').replace('item-', '');
            var item_controls = $('#controls-' + item_id);
            
            // Get input fields from controls
            var x_input = item_controls.find('[ng-model="item.location[0]"]');
            var y_input = item_controls.find('[ng-model="item.location[1]"]');
            var width_input  = item_controls.find('[ng-model="item.width"]');
            var height_input = item_controls.find('[ng-model="item.height"]');

            // Set needed variables to needed values and bind needed function
            if (that.hasClass('corner-top-right')) {
                start_width  = event.pageX - width_input.val();
                start_height = height_input.val();
                
                start_y = event.pageY - y_input.val();
                old_y   = event.pageY;
                
                $(document).on('mousemove', resizeFromTopRight);
            }
            
            else if (that.hasClass('corner-top-left')) {
                start_width  = width_input.val();
                start_height = height_input.val();
                
                start_y = event.pageY - y_input.val();
                start_x = event.pageX - x_input.val();
                
                old_x = event.pageX;
                old_y = event.pageY;
                
                $(document).on('mousemove', resizeFromTopLeft);
            }
            
            else if (that.hasClass('corner-bottom-left')) {
                start_width  = width_input.val();
                start_height = event.pageY - height_input.val();
                
                start_x = event.pageX - x_input.val();
                old_x   = event.pageX;
                
                $(document).on('mousemove', resizeFromBottomLeft);
            }
            
            else { // bottom right
                start_width  = event.pageX - width_input.val();
                start_height = event.pageY - height_input.val();
                
                $(document).on('mousemove', resizeFromBottomRight);
            }
            
            $(document).on('mouseup', mouseup);
            
            function resizeFromTopRight(event) {
                width  = event.pageX - start_width;
                height = start_height / 1 + (old_y - event.pageY);
                y      = event.pageY - start_y;

                width_input.val(width).change();
                height_input.val(height).change();
                y_input.val(y).change();
            }
            
            function resizeFromTopLeft(event) {
                width  = start_width / 1 + (old_x - event.pageX);
                height = start_height / 1 + (old_y - event.pageY);
                x = event.pageX - start_x;
                y = event.pageY - start_y;

                width_input.val(width).change();
                height_input.val(height).change();
                x_input.val(x).change();
                y_input.val(y).change();
            }
            
            function resizeFromBottomLeft(event) {
                width  = start_width / 1 + (old_x - event.pageX);
                height = event.pageY - start_height;
                x      = event.pageX - start_x;

                width_input.val(width).change();
                height_input.val(height).change();
                x_input.val(x).change();
            }
            
            function resizeFromBottomRight(event) {
                width  = event.pageX - start_width;
                height = event.pageY - start_height;

                width_input.val(width).change();
                height_input.val(height).change();
            }
            
            function mouseup() {
                $(document).unbind('mousemove', resizeFromTopRight);
                $(document).unbind('mousemove', resizeFromTopLeft);
                $(document).unbind('mousemove', resizeFromBottomLeft);
                $(document).unbind('mousemove', resizeFromBottomRight);
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