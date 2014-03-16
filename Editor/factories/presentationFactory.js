app.factory('presentationFactory', function () {
	"use strict";
    var factory = {};
    var presentation = {
        aspect_ratio : [16, 9],
        // grid : [0, 0], //was war der Sinn dafür?
        slides : [
            {
				position : 0,
				transition : 0,
                items : [
                    {
                        location : [100, 100],
                        layer : 0,
                        height : 150,
                        width : 150,
                        rotation : 0.0,
                        related_items : [], //Item Array
                        shape : {},
                        text : {},
                        style : {
                            background : '#99ea0f',
                            border: '',
                            border_radius : 100
                        },
                        deleted: false
                    },
                    {
                        location : [200, 200],
                        layer : 1,
                        height : 100,
                        width: 100,
                        rotation: 0.0,
                        related_items : [], //Item Array
                        shape : {},
                        text : {},
                        style : {
                            background : '#990f41',
                            border: '',
                            border_radius : 10
                        },
                        deleted: false
                    }
                ],
                item_group : {
//                  location : [0, 0],
//                  number_of_items : 0,
//                  layer : 0, //(Layer.position)
//                  members : [], //Item Array
//                  height : 100,
//                  width : 100,
//                  rotation : 0.0
                }
            }
        ]
    };
    
    factory.getPresentation = function () {
        return presentation;
    };
    
    factory.pushPresentation = function () {
        // placeholder
    };
    
    return factory;
});