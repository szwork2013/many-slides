app.directive("presentation", function() {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:"<div id='presentation'>" +
            "<presentation-slides/>" +
        "</div>"
    };
})

app.directive("presentationSlides", function() {
    return {
        restrict: 'E',
        replace: false,
        scope: true,
        template:"<div ng-repeat='slide in presentation.slides' class='slide'>" +
            "<slide-layers/>" +
        "</div>"
    };
})
// Nested directive for future reference
/*     .directive('checkLast', function () {
        return function (scope, element, attrs) {
            alert('DOWN');
            element.on(mousedown, function () {
                alert('DOWN');
            })
        }
    })*/
;


app.directive("layerItems", function() {
    function link(scope, element, attrs) {
        var startX = 0, startY = 0, x = 0, y = 0;
        element.on('click', function(event) {
          // Prevent default dragging of selected content
          event.preventDefault();
              alert('down');
        });
    }
    
    return {
        link: link,
        restrict: 'E',
        replace: false,
        scope: true,
        template:"<div ng-repeat='item in layer.items' class='item' style='position: absolute;" +
        "height: {{item.height}}px;" +
        "width: {{item.width}}px;" +
        "-webkit-transform: translate3d({{item.location[0]}}px,{{item.location[1]}}px,{{item.layer}}px);" +
        "background: {{item.style.background}};" +
        "border-radius: {{item.style.border_radius}}px'></div>"
    };
});

app.directive("itemControls", function() {
    return {
        restrict: 'E',
        replace: false,
        scope: true,
        template:"<div ng-repeat='item in layer.items' class='item-controls'>" +
        "<div>Width: <input type='text' ng-model='item.width' /></div>" +
        "<div>Height: <input type='text' ng-model='item.height' /></div>" +
        "<div>Left: <input type='text' ng-model='item.location[0]' /></div>" +
        "<div>Top: <input type='text' ng-model='item.location[1]' /></div>" +
        "<div>Layer: <input type='text' ng-model='item.layer' /></div>" +
        "<div>Color: <input type='text' ng-model='item.style.background' /></div>" +
        "<div>Border-Radius: <input type='text' ng-model='item.style.border_radius' /></div>" +
    "</div>"
    };
});

app.directive("slideLayers", function() {
    return {
        restrict: 'E',
        replace: false,
        scope: true,
        template:"<div ng-repeat='layer in slide.layers' class='layer'>" +
            "<layer-items></layer-items>" +
            "<item-controls></item-controls>" + 
        "</div>"
    };
});