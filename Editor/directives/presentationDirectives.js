app.directive("presentation", function() {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:   "<div id='presentation'>" +
                        "<presentation-slides/>" +
                    "</div>"
    };
})

app.directive("presentationSlides", function() {
    return {
        restrict: 'E',
        replace: false,
        scope: true,
        template:   "<div ng-repeat='slide in presentation.slides' class='slide'>" +
                        "<slide-layers/>" +
                    "</div>"
    };
});

app.directive("layerItems", function() {
    function link(scope, element, attrs) {
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
        template:   "<div ng-repeat='item in layer.items' class='item' style='position: absolute;" +
                        "height: {{item.height}}px;" +
                        "width: {{item.width}}px;" +
                        "-webkit-transform: translate3d(" +
                            "{{item.location[0]}}px," +
                            "{{item.location[1]}}px," +
                            "{{item.layer}}px);" +
                        "background: {{item.style.background}};" +
                        "border-radius: {{item.style.border_radius}}px'>" +
                    "</div>"
    };
});

app.directive("itemControls", function() {
    return {
        restrict: 'E',
        replace: false,
        scope: true,
        template:   "<div ng-repeat='item in layer.items' class='item-controls'>" +
                        "<div class='form-group'>Width: <input type='text' class='form-control' ng-model='item.width'></div>" +
                        "<div class='form-group'>Height: <input type='text' class='form-control' ng-model='item.height'></div>" +
                        "<div class='form-group'>Left: <input type='text' class='form-control' ng-model='item.location[0]'></div>" +
                        "<div class='form-group'>Top: <input type='text' class='form-control' ng-model='item.location[1]'></div>" +
                        "<div class='form-group'>Layer: <input type='text' class='form-control' ng-model='item.layer'></div>" +
                        "<div class='form-group'>Color: <input type='text' class='form-control' ng-model='item.style.background'></div>" +
                        "<div class='form-group'>Border-Radius:<input type='text' class='form-control' ng-model='item.style.border_radius'></div>" +
                    "</div>"
    };
});

app.directive("slideLayers", function() {
    return {
        restrict: 'E',
        replace: false,
        scope: true,
        template:   "<div ng-repeat='layer in slide.layers' class='layer'>" +
                        "<layer-items></layer-items>" +
                        "<item-controls></item-controls>" + 
                    "</div>"
    };
});