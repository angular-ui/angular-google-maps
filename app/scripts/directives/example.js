'use strict';

angular.module('angularGoogleMapsApp')
    .directive('runnableExample', function (openPlnkr) {
        return {
            restrict: 'E',
            template: '<div>' +
                '<div>' +
                    '<button ng-click="click()">index.html</button>' +
                    '<button ng-click="click()">script.js</button>' +
                    '<button style="float:right" ng-click="editPlnkr()">Edit in Plnkr</button>' +
                '</div>' +
                '<div ng-show="index">' +
                '<pre ng-non-bindable></pre>' +
                '</div>' +
        '<div ng-show="script">' +
            '<pre ng-non-bindable></pre>' +
        '</div>' +
        '<div style="width:100%; height: 350px; padding:4px;">' +
            '<iframe style="width: 100%; height: 100%"></iframe>' +
            '</div>' +
        '</div>',
            scope: {
                example: "=example"
            },
            controller: ["$scope", "$element", "$http", function($scope, $element, $http) {
                console.log("Example controller.");
                $scope.index = true;
                $scope.script = false;
                var prefix = window.location.pathname + "views/examples/";

                $scope.click = function() {
                    $scope.index = !$scope.index;
                    $scope.script = !$scope.script;
                };

                $scope.editPlnkr = function() {
                    openPlnkr(prefix + $scope.example);
                };

                var pres = $element.find('pre');
                $http.get(prefix + $scope.example + "/index.html").then(function(index) {
                    console.log("fetched index", index);
                    pres[0].innerText = index.data;
                });
                $http.get(prefix + $scope.example + "/script.js").then(function(script) {
                    console.log("fetched script", script);
                    pres[1].innerText = script.data;
                });

                var iframe = $element.find("iframe");
                iframe.attr("src", prefix + "base/base.html?example=" + $scope.example);
            }]
        };
    });
