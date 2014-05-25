app.controller('accordionCtrl', function ($scope) {
	$scope.oneAtATime = true;

	$scope.status = {
		isFirstOpen: true,
		isFirstDisabled: false
	};
});