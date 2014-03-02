app.controller("contentController", function ($scope) {
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