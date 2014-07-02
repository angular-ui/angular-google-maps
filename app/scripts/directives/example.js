'use strict';

angular.module('angularGoogleMapsApp')
    .directive('runnableExample', function (openPlnkr) {
        return {
            restrict: 'E',
            templateUrl: '/views/examples/base/template.html',
            scope: {
                example: "=example"
            },
            controller: ["$scope", "$element", "$http", function($scope, $element, $http) {
                console.log("Example controller.");
                $scope.index = true;
                $scope.script = false;

                $scope.click = function() {
                    $scope.index = !$scope.index;
                    $scope.script = !$scope.script;
                };

                $scope.editPlnkr = function() {
                    openPlnkr("/views/examples/" + $scope.example);
                };

                var pres = $element.find('pre');
                $http.get("/views/examples/" + $scope.example + "/index.html").then(function(index) {
                    console.log("fetched index", index);
                    pres[0].innerText = index.data;
                });
                $http.get("/views/examples/" + $scope.example + "/script.js").then(function(script) {
                    console.log("fetched script", script);
                    pres[1].innerText = script.data;
                });

                var iframe = $element.find("iframe");
                iframe.attr("src", "/views/examples/base/base.html?example=" + $scope.example);
            }]
        };
    });
