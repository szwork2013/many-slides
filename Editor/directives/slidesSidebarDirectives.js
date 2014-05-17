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