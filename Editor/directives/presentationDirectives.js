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
            var that = $(this);
            var that_id = that.attr('id').replace('item-','');
            var this_controls = $('#controls-' + that_id);
            
            if (that.hasClass('selected-object')) {
                that.removeClass('selected-object');
                this_controls.addClass('hidden');
                $('#item-controls-button').addClass('inactive');
            } else {
                var selected_object = $('.selected-object');
                var selected_object_id = selected_object.attr('id');

                if(selected_object_id) {
                    selected_object_id = selected_object_id.replace('item-','');
                    var selected_object_controls = $('#controls-' + selected_object_id);
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
          
            var that = $(this);
            var that_id = that.attr('id').replace('item-','');
            var this_controls = $('#controls-' + that_id);
            var element_is_selected = that.hasClass('selected-object');
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
                'border-radius:     {{item.style.border_radius}}px;' +
				'z-index:           {{item.layer}}';
    
    return {
        link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<div bo-id="\'item-\' + item.id" class="item" style="' + style + '"></div>'
    };
});

app.directive('itemControls', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div bo-id="\'controls-\' + item.id" class="sidebar-right item-controls sidebar-gone hidden">' +
                        '<div class="overflow-wrapper">' +
//						'<close-button></close-button>' + // Maybe change to "pin" button
                            '<div class="form-group">Width: <input type="text" class="form-control" ng-model="item.width"></div>' +
                            '<div class="form-group">Height: <input type="text" class="form-control" ng-model="item.height"></div>' +
                            '<div class="form-group">Left: <input type="text" class="form-control" ng-model="item.location[0]"></div>' +
                            '<div class="form-group">Top: <input type="text" class="form-control" ng-model="item.location[1]"></div>' +
                            '<div class="form-group">Layer: <input type="text" class="form-control" ng-model="item.layer"></div>' +
                            '<div class="form-group">Color: <input colorpicker type="text" class="form-control" ng-model="item.style.background"></div>' +
                            '<div class="form-group">Border:<input type="text" class="form-control" ng-model="item.style.border"></div>' +
                            '<div class="form-group">Border-Radius:<input type="text" class="form-control" ng-model="item.style.border_radius"></div>' +
                            '<input type="text" class="delete-flag hidden" ng-model="item.deleted">' +
                            '<div class="form-group">' +
                                '<delete-Item-button></delete-Item-button>' +
                            '</div>' +
                        '</div>'+
                    '</div>'
    };
});

/*app.directive('closeButton', function() {
	"use strict";
	function link(scope, element, attrs) {
		element.on('click', function (event) {
            var that = $(this);
			that.parent().addClass('hidden');
        });
	}
	
    return {
		link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<span class="fui-cross close-button"></span>'
    };
});*/

app.directive('deleteItemButton', function() {
	"use strict";
	function link(scope, element, attrs) {
		element.on('click', function (event) {
            var that = $(this);
            var input = that.parent().find('[ng-model="item.deleted"]');
            input.val(true).change();
            scope.deleteItems();
            input.val('').change(); // Trigger angularjs to see the item is gone
        });
	}
	
    return {
		link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<span class="btn btn-block btn-lg btn-primary">Delete Item</span>'
    };
});

app.directive('deleteSlideButton', function() {
	"use strict";
	function link(scope, element, attrs) {
		element.on('click', function (event) {
            var that = $(this);
            var input = that.parent().find('[ng-model="slide.deleted"]');
            input.val(true).change();
            scope.deleteSlides();
            input.val('').change(); // Trigger angularjs to see the slide is gone
        });
	}
	
    return {
		link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<span class="fui-cross close-button delete-slide-button"></span>'
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

app.directive('slideControlbar', function() {
    "use strict";
    
    function tooltip(text) {
        return  ' data-toggle="tooltip"' +
                ' data-placement="bottom"' +
                ' title=""' +
                ' data-original-title="' + text + '"';
    }
    
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div class="slide-controls sidebar-left sidebar-gone">' +
                        '<div class="btn-toolbar col-xs-12 col-gutter-none">' +
                            '<div class="btn-group col-xs-12 col-gutter-none">' +
                                '<a class="btn btn-primary col-xs-3 col-gutter-none" href="#" ng-click="addSlide()"' +                                               tooltip('add slide') + '>' +
                                    '<span class="fui-plus"></span>' +
                                '</a>'+
                                '<a class="btn btn-primary col-xs-3 col-gutter-none" href="#"' +
                                    tooltip('edit slide') + '>' +
                                    '<span class="fui-new"></span>' +
                                '</a>' +
                                '<a class="btn btn-primary col-xs-3 col-gutter-none" href="#"' +
                                    tooltip('lock slide') + '>' +
                                    '<span class="fui-lock"></span>' +
                                '</a>' +
                                '<a class="btn btn-primary col-xs-3 col-gutter-none" href="#"' +
                                    tooltip('slide settings') + '>' +
                                    '<span class="fui-gear"></span>' +
                                '</a>' +
                            '</div>' +
                          '</div>' +
                        '<div class="overflow-wrapper">' +
                            '<div class="slide-preview-wrapper" ng-repeat="slide in presentation.slides">' +
                                '<slide-preview></slide-preview>' +
                                '<input type="text" class="delete-flag hidden" ng-model="slide.deleted">' +
                                '<delete-slide-button></delete-slide-button>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
    };
});

app.directive('slidePreview', function() {
    "use strict";
    function link(scope, element, attrs) {
		element.on('click', function (event) {
            var that = $(this);
            var selected_slides = $('.selected');
               
            if(!that.hasClass('selected')) {
                if(selected_slides.length != 0) {
                    selected_slides.removeClass('selected');
                }
                that.addClass('selected');
            }
        });
	}
	
    return {
		link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div class="slide-preview"></div>'
    };
});

app.directive('itemControlbar', function() {
    "use strict";
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div ng-repeat="slide in presentation.slides">' +
                        '<div bindonce ng-repeat="item in slide.items">' +
                            '<item-controls></item-controls>' +
                        '</div>' +
                    '</div>'
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
