function InfoController($scope, $log) {
	$scope.templateValue = 'hello from the template itself';
	$scope.clickedButtonInWindow = function () {
		$log.info('clicked a window in the template!');
	};
};

