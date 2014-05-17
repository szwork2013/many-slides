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
                            '<input type="text" class="delete-flag hidden" ng-model="item.deleted">' +
                            '<div class="form-group">' +
                                '<delete-Item-button></delete-Item-button>' +
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
        scope: true,
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