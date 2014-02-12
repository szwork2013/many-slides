app.controller("MainController", function ($scope) {
  $scope.items = [
        {
            id: 0,
            location: [0, 0],
            layer: 0,
            height: 10,
            width: 10,
            rotation: 0.0,
            related_items: [],
            shape: {},
            text: {},
            style: {},
            background: "000000"
        },
        {
            id: 1,
            location: [10, 0],
            layer: 1,
            height: 10,
            width: 10,
            rotation: 0.0,
            related_items: [],
            shape: {},
            text: {},
            style: {},
            background: "FFFFFF"
        }
  ];

    $scope.inputValue = "";
});
