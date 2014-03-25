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
            var that = $(this);
            var this_controls = that.parent().children('.item-controls');
            var element_is_selected = that.hasClass('selected-object');
			var selected_objects = $('.selected-object');
            var selected_object_controls = selected_objects.parent().children('.item-controls');
            
            if (element_is_selected) {
                that.removeClass('selected-object');
                this_controls.addClass('hidden');
            } else {
                selected_objects.removeClass('selected-object');
                selected_object_controls.addClass('hidden');
                that.addClass('selected-object');
                this_controls.removeClass('hidden');
            }
        });
        
        element.on('mousedown', function (event) {
            event.preventDefault();
          
            var that = $(this);
            var this_controls = that.parent().children('.item-controls');
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
                'border-radius: {{item.style.border_radius}}px;' +
				'z-index: {{item.layer}}';
    
    return {
        link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        template: '<div id="item-' + (Math.random()+"").hashCode() + '" class="item" style="' + style + '"></div>'
    };
});

String.prototype.hashCode = function(){
    var hash = 0, i, char;
    if (this.length == 0) return hash;
    for (i = 0, l = this.length; i < l; i++) {
        char  = this.charCodeAt(i);
        hash  = ((hash<<5)-hash)+char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

app.directive('itemControls', function() {
    function link(scope, element, attrs) {
       /* element.on('mousedown', function(event) {
 //           event.preventDefault();
            
            var that = $(this);
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
        });*/
    }
    
    return {
        link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div class="sidebar-right item-controls sidebar-gone hidden" style="-webkit-transform: translateX(100px)  translateY(100px)">' +
//						'<close-button></close-button>' +
                        '<div class="form-group">Width: <input type="text" class="form-control" ng-model="item.width"></div>' +
                        '<div class="form-group">Height: <input type="text" class="form-control" ng-model="item.height"></div>' +
                        '<div class="form-group">Left: <input type="text" class="form-control" ng-model="item.location[0]"></div>' +
                        '<div class="form-group">Top: <input type="text" class="form-control" ng-model="item.location[1]"></div>' +
                        '<div class="form-group">Layer: <input type="text" class="form-control" ng-model="item.layer"></div>' +
                        '<div class="form-group">Color: <input colorpicker type="text" class="form-control" ng-model="item.style.background"></div>' +
                        '<div class="form-group">Border:<input type="text" class="form-control" ng-model="item.style.border"></div>' +
                        '<div class="form-group">Border-Radius:<input type="text" class="form-control" ng-model="item.style.border_radius"></div>' +
                        '<input type="text" class="delete-flag hidden" ng-model="item.deleted">' +
                        '<delete-Item-button></delete-Item-button>' +
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
            console.log(input);
            input.val(true).change();
            console.log(input.parent());
            scope.deleteItems();
        });
	}
	
    return {
		link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<span class="btn btn-block btn-lg btn-primary delete-Item-button">Delete Item</span>'
    };
});

app.directive('slideItems', function () {
    "use strict";
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div ng-repeat="item in slide.items" class="item-wrapper">' +
                        '<item></item>' +
                        '<item-controls></item-controls>' +
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
