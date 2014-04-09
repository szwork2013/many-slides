app.factory('presentationFactory', function () {
	"use strict";
    var factory = {};
    var presentation = {
        aspect_ratio : [16, 9],
        active_slide : 1,
        slides : [
            {
				position : 0,
				transition : 0,
                active: false,
                deleted: false,
                items : [
                    {
                        id: 'qq5tdn7u8650cnmi',
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
                        id: '1ejukkddmeefjemi',
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
            },
            {
                position : 1,
                transition : 0,
                deleted: true,
                active: false,
                items : [{
                        id: '1ejujjddmeefjemi',
                        location : [300, 300],
                        layer : 1,
                        height : 100,
                        width: 100,
                        rotation: 0.0,
                        related_items : [], //Item Array
                        shape : {},
                        text : {},
                        style : {
                            background : '#55bbff',
                            border: '',
                            border_radius : 100
                        },
                        deleted: false
                    }]
            },
            {
                position : 2,
                transition : 0,
                deleted: false,
                active: false,
                items : []
            },
            {
                position : 3,
                transition : 0,
                deleted: false,
                active: false,
                items : []
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