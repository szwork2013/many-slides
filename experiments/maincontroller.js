app.controller("MainController", function ($scope) {
  $scope.items = [
        {
            id: 0,
            location: [0, 0],
            layer: 0,
            height: 200,
            width: 200,
            rotation: 0.0,
            related_items: [],
            shape: {},
            text: {},
            style: {},
            background: "#99ea0f",
            border_radius: 0
        },
        {
            id: 1,
            location: [0, 0],
            layer: 1,
            height: 100,
            width: 100,
            rotation: 0.0,
            related_items: [],
            shape: {},
            text: {},
            style: {},
            background: "#990f41",
            border_radius: 0
        }
  ];

    $scope.inputValue = "";
});
