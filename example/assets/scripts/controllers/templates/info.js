function InfoController($scope, $log) {
	$scope.templateValue = 'hello from the template itself';
	$scope.clickedButtonInWindow = function () {
		var msg = 'clicked a window in the template!';
        $log.info(msg);
        alert(msg);
	};
};

