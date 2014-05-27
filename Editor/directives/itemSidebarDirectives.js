app.directive('maslItemControlbar', function () {
    "use strict";
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        // Bindonce attribute is important for itemControls directive
        template:   '<div ng-repeat="slide in presentation.slides">' +
                        '<div bindonce ng-repeat="item in slide.items">' +
                            '<masl-item-controls></masl-item-controls>' +
                        '</div>' +
                    '</div>'
    };
});

app.directive('maslItemControls', function () {
    "use strict";
    function tooltip(text) {
        return  ' data-toggle="tooltip"' +
                ' data-placement="bottom"' +
                ' title=""' +
                ' data-original-title="' + text + '"';
    }
    
    function textControl(name, model) {
        return  '<div class="form-group">' + name +
                    '<input type="text" class="form-control" ' +
                    'ng-model="' + model + '" >' +
                '</div>';
    }
    
    function colorControl(name, model) {
        return  '<div class="form-group">' + name +
                    '<input colorpicker type="text" class="form-control" ' +
                    'ng-model="' + model + '" >' +
                '</div>';
    }
    
    function link(scope, element, attrs) {
        $(this).ready(function () {
            $(this).find("[data-toggle=tooltip]").tooltip();
        });
    }
    
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        link: link,
        // bo-id gets the id from the model and then removes the watcher (the id should not change anymore)
        template:   '<div bo-id="\'controls-\' + item.id" masl-sidebar-right class="sidebar-right item-controls sidebar-gone hidden">' +
        
                        '<div class="btn-toolbar col-xs-12 col-gutter-none">' +
                            '<div class="btn-group col-xs-12 col-gutter-none">' +
                                '<a class="btn btn-primary col-xs-3 col-gutter-none" href="#"' +
                                    tooltip('placeholder') + '>' +
                                    '<span class="fui-plus"></span>' +
                                '</a>' +
                                '<a class="btn btn-primary col-xs-3 col-gutter-none" href="#"' +
                                    tooltip('placeholder') + '>' +
                                    '<span class="fui-new"></span>' +
                                '</a>' +
                                '<a class="btn btn-primary col-xs-3 col-gutter-none" href="#"' +
                                    tooltip('lock item') + '>' +
                                    '<span class="fui-lock"></span>' +
                                '</a>' +
                                '<a class="btn btn-primary col-xs-3 col-gutter-none" href="#"' +
                                    tooltip('placeholder') + '>' +
                                    '<span class="fui-gear"></span>' +
                                '</a>' +
                            '</div>' +
                          '</div>' +
        
                        /* The ng-controller="AccordionDemoCtrl" should be kept an eye on
                         * as it may interfere with the contentCtrl scope */
                        '<div class="overflow-wrapper" ng-controller="accordionCtrl">' +
                            '<accordion close-others="oneAtATime">' +
                                '<accordion-group heading="Position" is-open="status.isFirstOpen" is-disabled="status.isFirstDisabled">' +
                                    textControl('Left', 'item.location[0]') +
                                    textControl('Top', 'item.location[1]') +
                                    textControl('Layer', 'item.layer') +
                                    textControl('Rotation', 'item.rotation') +
                                '</accordion-group>' +
        
                                '<accordion-group heading="Size">' +
                                    textControl('Width', 'item.width') +
                                    textControl('Height', 'item.height') +
                                '</accordion-group>' +
        
                                '<accordion-group heading="Text">' +
                                    textControl('Content', 'item.text.content') +
                                    textControl('Size', 'item.text.size') +
                                    textControl('Alignment', 'item.text.align') +
                                    colorControl('Color', 'item.text.color') +
                                    textControl('Format', 'item.text.format') +
                                '</accordion-group>' +
        
                                '<accordion-group heading="Color & Decoration">' +
                                    colorControl('Color', 'item.style.background') +
                                    textControl('Border', 'item.style.border') +
                                    textControl('Border-Radius', 'item.style.border_radius') +
                                '</accordion-group>' +
                            '</accordion>' +
        
                            '<input type="text" class="delete-flag hidden" ng-model="item.deleted">' +
        
                            '<div class="form-group">' +
                                '<masl-delete-Item-button></masl-delete-Item-button>' +
                            '</div>' +
                        '</div>' +
        
                    '</div>'
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
        scope: true
    };
});

app.directive('maslDeleteItemButton', function () {
	"use strict";
	function link(scope, element, attrs) {
		element.on('click', function (event) {
            var that, input;
            
            that = $(this);
            input = that.parent().parent().find('[ng-model="item.deleted"]');
            input.val(true).change();
            scope.$apply(function () {
                scope.deleteItems();
            });
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

app.directive('maslItemControlsButton', function () {
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