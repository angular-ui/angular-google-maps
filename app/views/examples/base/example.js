var app = angular.module("appMaps", ['google-maps'])
    .config(function($controllerProvider) {
        // Override the normal controller process so controllers can be late loaded.
        app.controller = $controllerProvider.register;
    })
    .controller("exampleCtrl", function($scope, $element, $document, $compile, $http, $q, $controller) {
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
            var results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        var example = getParameterByName("example");
        var examplePath = "/views/examples/" + example + "/";

        // Get the manifest to determine what files to load and what order (based on manifest definition).
        $http.get(examplePath + "manifest.json").then(function(manifest) {
            return manifest.data
        }).then(function(manifest) {
            var promises = [];
            manifest.files.map(function(cur) {
                // Don't include plnkr template
                if (cur === "../base/plnkr.html") {
                    return;
                }

                promises.push($http.get(examplePath + cur).then(function(response) {
                    return {
                        name: cur,
                        content: response.data
                    };
                }));
            });

            return $q.all(promises);
        }).then(function(files) {
            // Get all the javascript files
            var js = files.filter(function(cur) {
                return cur.name.substring(cur.name.length - 3) === ".js";
            });

            // Get all the html files
            var html = files.filter(function(cur) {
                return cur.name.substring(cur.name.length - 5) === ".html";
            });

            // Load all the js files before html, so all controllers are registered
            js.map(function(cur) {
                var module = angular.module;
                // Trick to lazy load controllers into this loaded module, basically
                // replace the controller function with the function for the controllerProvider
                // register function. The controller function is replace above in the module config
                angular.module = function(name, deps) {
                    console.log("Loading module: " + name);
                    if (name === "appMaps") {
                        return app;
                    } else {
                        return module(name, deps)
                    }
                };
                eval(cur.content);
                angular.module = module;
            });

            // Now add all the html
            html.map(function(cur) {
                $http.get(examplePath + cur.name).then(function(index) {
                    $element.append($compile(index.data)($scope));
                });
            });

        });
    });