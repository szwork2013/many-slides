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

app.directive('itemControls', function () {
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
        template:   '<div bo-id="\'controls-\' + item.id" masl-sidebar-right class="sidebar-right item-controls sidebar-gone hidden">' +
                        '<div class="btn-toolbar col-xs-12 col-gutter-none">' +
                            '<div class="btn-group col-xs-12 col-gutter-none">' +
                                '<a class="btn btn-primary col-xs-3 col-gutter-none" href="#" ng-click="addSlide()"' +                                               tooltip('add slide') + '>' +
                                    '<span class="fui-plus"></span>' +
                                '</a>' +
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
                            '<accordion close-others="true">' +
                                '<accordion-group heading="Position" is-open="true">' +
                                    '<div class="form-group">Left<input type="text" class="form-control" ng-model="item.location[0]"></div>' +
                                    '<div class="form-group">Top<input type="text" class="form-control" ng-model="item.location[1]"></div>' +
                                    '<div class="form-group">Layer<input type="text" class="form-control" ng-model="item.layer"></div>' +
                                '</accordion-group>' +
                                '<accordion-group heading="Size">' +
                                    '<div class="form-group">Width<input type="text" class="form-control" ng-model="item.width"></div>' +
                                    '<div class="form-group">Height<input type="text" class="form-control" ng-model="item.height"></div>' +
                                '</accordion-group>' +
                                '<accordion-group heading="Text">' +
                                    '<div class="form-group">Content<input type="text" class="form-control" ng-model="item.text.content"></div>' +
                                    '<div class="form-group">Size<input type="text" class="form-control" ng-model="item.text.size"></div>' +
                                    '<div class="form-group">Alignment<input type="text" class="form-control" ng-model="item.text.align"></div>' +
                                    '<div class="form-group">Color<input colorpicker type="text" class="form-control" ng-model="item.text.color"></div>' +
                                    '<div class="form-group">Format<input type="text" class="form-control" ng-model="item.text.format"></div>' +
                                '</accordion-group>' +
                                '<accordion-group heading="Other">' +
                                    '<div class="form-group">Color<input colorpicker type="text" class="form-control" ng-model="item.style.background"></div>' +
                                    '<div class="form-group">Border<input type="text" class="form-control" ng-model="item.style.border"></div>' +
                                    '<div class="form-group">Border-Radius<input type="text" class="form-control" ng-model="item.style.border_radius"></div>' +
                                '</accordion-group>' +
                            '</accordion>' +
//                          '<close-button></close-button>' + // Maybe change to "pin" button
                            '<input type="text" class="delete-flag hidden" ng-model="item.deleted">' +
                            '<div class="form-group">' +
                                '<delete-Item-button></delete-Item-button>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
    };
});

app.directive('deleteItemButton', function () {
	"use strict";
	function link(scope, element, attrs) {
		element.on('click', function (event) {
            var that, input;
            
            that = $(this);
            input = that.parent().parent().find('[ng-model="item.deleted"]');
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

app.directive('deleteSlideButton', function () {
	"use strict";
	function link(scope, element, attrs) {
		element.on('click', function (event) {
            var that, input;
            
            that = $(this);
            input = that.parent().find('[ng-model="slide.deleted"]');
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

app.directive('slideControlbar', function () {
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
        template:   '<div masl-sidebar-left class="slide-controls sidebar-left sidebar-gone">' +
                        '<div class="btn-toolbar col-xs-12 col-gutter-none">' +
                            '<div class="btn-group col-xs-12 col-gutter-none">' +
                                '<a class="btn btn-primary col-xs-3 col-gutter-none" href="#" ng-click="addSlide()"' +                                               tooltip('add slide') + '>' +
                                    '<span class="fui-plus"></span>' +
                                '</a>' +
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

app.directive('slidePreview', function () {
    "use strict";
    function link(scope, element, attrs) {
		element.on('click', function (event) {
            var that, selected_slides;
            
            that = $(this);
            selected_slides = $('.selected');
               
            if (!that.hasClass('selected')) {
                if (selected_slides.length !== 0) {
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
        template:   '<div class="slide-preview" ng-Click="setActiveSlide($index)"></div>'
    };
});

app.directive('itemControlbar', function () {
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

app.directive('itemControlsButton', function () {
    "use strict";
    
     function link(scope, element, attrs) {
		element.on('click', function (event) {
            $(".sidebar-right").toggleClass('sidebar-gone');
        });
         
         element.on('mouseenter', function (event) {
            $(".sidebar-right").removeClass('sidebar-gone');
        });
         
         element.on('mouseleave', function (event) {
            $(".sidebar-right").addClass('sidebar-gone');
        });
	}
    
    return {
        link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div id="item-controls-button" class="fui-new inactive"><button></button></div>'
    };
});

app.directive('slideControlsButton', function () {
    "use strict";
    
     function link(scope, element, attrs) {
		element.on('click', function (event) {
            $(".sidebar-left").toggleClass('sidebar-gone');
        });
         
         element.on('mouseenter', function (event) {
            $(".sidebar-left").removeClass('sidebar-gone');
        });
         
         element.on('mouseleave', function (event) {
            $(".sidebar-left").addClass('sidebar-gone');
        });
	}
    
    return {
        link: link,
        restrict: 'E',
        replace: true,
        scope: true,
        template:   '<div id="slide-controls-button" class="navbar-toggle collapsed"><button></button></div>'
    };
});

app.directive('maslSidebarRight', function () {
    "use strict";
    
     function link(scope, element, attrs) {
        element.on('mouseenter', function (event) {
            element.removeClass('sidebar-gone');
        });
	}
    return {
        link: link,
        restrict: 'A',
        replace: false,
        scope: true,
    };
});

app.directive('maslSidebarLeft', function () {
    "use strict";
    
     function link(scope, element, attrs) {
        element.on('mouseenter', function (event) {
            element.removeClass('sidebar-gone');
        });
         
        element.on('mouseleave', function (event) {
            element.addClass('sidebar-gone');
        });
	}
    return {
        link: link,
        restrict: 'A',
        replace: false,
        scope: true,
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
