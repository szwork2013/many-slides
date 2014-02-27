app.controller("Ctrl2", function ($scope) {
$scope.styleClasses= [
        {style: 'item w1 h1'},
        {style: 'item w1 h2'},
        {style: 'item w2 h1'},
        {style: 'item w1 h2'},
        {style: 'item w1 h1'},
        {style: 'item w1 h1'},
        {style: 'item w2 h2'},
        {style: 'item w1 h1'},
        {style: 'item w1 h1'},
        {style: 'item w2 h1'},
        {style: 'item w1 h2'},
        {style: 'item w1 h1'},
        {style: 'item w2 h1'},
        {style: 'item w1 h2'}
  ];

    $scope.presentation = {
        aspect_ratio : [16, 9],
        // grid : [0, 0], //was war der Sinn dafür?
        slides : [
            {
                position : 0,
                transition : 0,
                layers : [
                    {
                        position : 0,
                        visible : true,
                        items : [
                            {
                                location : [0, 0],
                                layer : 0, //(Layer.position)
                                height : 100,
                                width : 100,
                                rotation : 0.0,
                                related_items : [], //Item Array
                                shape : {},
                                text : {},
                                style : {
                                    background : "#99ea0f",
                                    border_radius : 0
                                }
                            },
                            {
                                location : [0, 0],
                                layer : 1, //(Layer.position)
                                height : 100,
                                width: 100,
                                rotation: 0.0,
                                related_items : [], //Item Array
                                shape : {},
                                text : {},
                                style : {
                                    background : "#990f41",
                                    border_radius : 0
                                }
                            }
                        ],
                        item_group : {
//                            location : [0, 0],
//                            number_of_items : 0,
//                            layer : 0, //(Layer.position)
//                            members : [], //Item Array
//                            height : 100,
//                            width : 100,
//                            rotation : 0.0
                        }
                    },
                    {},
                    {}
                ]
            }
        ]
    };
});

app.directive("manySlidesPresentation", function() {
    return {
        restrict: 'E',
        replace: false,
        scope: true,
        template:"<div ng-repeat='slide in presentation.slides' class='slide'><div ng-repeat='layer in slide.layers' class='layer'><div ng-repeat='item in layer.items' class='item'style='position: absolute;height: {{item.height}}px;width: {{item.width}}px;-webkit-transform: translate3d({{item.location[0]}}px,{{item.location[1]}}px,{{item.layer}}px);background: {{item.style.background}};border-radius: {{item.style.border_radius}}px'></div><div ng-repeat='item in layer.items' class='item-controls'><div>Width: <input type='text' ng-model='item.width' /></div><div>Height: <input type='text' ng-model='item.height' /></div><div>Left: <input type='text' ng-model='item.location[0]' /></div><div>Top: <input type='text' ng-model='item.location[1]' /></div><div>Layer: <input type='text' ng-model='item.layer' /></div><div>Color: <input type='text' ng-model='item.style.background' /></div><div>Border-Radius: <input type='text' ng-model='item.style.border_radius' /></div></div></div></div>"
    };
})
     .directive('checkLast', function () {
        return function (scope, element, attrs) {
            //console.log(scope.$position);
            if (scope.$last=== true) {
                element.ready(function () {
                    $('#container').masonry({ columnWidth: 60});

                })
            }
        }
    });
