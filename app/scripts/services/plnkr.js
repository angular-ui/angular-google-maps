/**
 * Shamelessly copied from angularjs https://github.com/angular/angular.js/blob/master/docs/app/src/examples.js
 * and modified for this use under the MIT License restrictions.
 */
angular.module('angularGoogleMapsApp')

    .factory('formPostData', ['$document', function($document) {
        return function(url, fields) {
            var form = angular.element('<form style="display: none;" method="post" action="' + url + '" target="_blank"></form>');
            angular.forEach(fields, function(value, name) {
                var input = angular.element('<input type="hidden" name="' +  name + '">');
                input.attr('value', value);
                form.append(input);
            });
            $document.find('body').append(form);
            form[0].submit();
            form.remove();
        };
    }])

    .factory('openPlnkr', ['formPostData', '$http', '$q', function(formPostData, $http, $q) {
        return function(exampleFolder) {

            var exampleName = 'Angular Google Maps Example';

            function getInsertionPoint(index, anchor) {
                return index.content.indexOf(anchor);
            }

            function getIndex(files) {
                return files.filter(function(cur) { return cur.name === "index.html"; })[0];
            }

            function appendContent(index, insertPoint, data) {
                index.content = index.content.substring(0, insertPoint) + data + index.content.substring(insertPoint);
            };

            function insertFiles(files, filter, anchor, template) {
                var list = files.filter(filter);
                var index = getIndex(files);
                var insertPoint = getInsertionPoint(index, anchor);
                var tags = [];
                list.map(function(cur) {
                    tags.push(template.replace("$file", cur.name));
                });
                appendContent(index, insertPoint, tags.join("\n"));
            }

            function insertScripts(files) {
                var filter = function(cur) {
                    return cur.name.substring(cur.name.length - 3) === ".js";
                };
                var template = "<script type='text/javascript' src='$file'></script>";
                var anchor = "<!--script-->";
                insertFiles(files, filter, anchor, template);
            }

            function insertExample(files) {
                var anchor = "<!--example-->";
                var index = getIndex(files);
                var insertionPoint = getInsertionPoint(index, anchor);
                var exampleIdx = -1;
                var example = files.filter(function(cur, idx) {
                    if (cur.name === "example.html") {
                        exampleIdx = idx;
                        return true;
                    }

                    return false;
                })[0];
                appendContent(index, insertionPoint, example.content);
                delete files[exampleIdx];
            }

            // Load the manifest for the example
            $http.get(exampleFolder + '/manifest.json')
                .then(function(response) {
                    return response.data;
                })
                .then(function(manifest) {
                    var filePromises = [];

                    // Build a pretty title for the Plunkr
                    var exampleNameParts = manifest.name.split('-');
                    exampleNameParts.unshift('AngularJS');
                    angular.forEach(exampleNameParts, function(part, index) {
                        exampleNameParts[index] = part.charAt(0).toUpperCase() + part.substr(1);
                    });
                    exampleName = exampleNameParts.join(' - ');

                    angular.forEach(manifest.files, function(filename) {
                        filePromises.push($http.get(exampleFolder + '/' + filename, { transformResponse: [] })
                            .then(function(response) {

                                // The manifests provide the production index file but Plunkr wants
                                // a straight index.html
                                if (filename === "index.html") {
                                    filename = "example.html";
                                }

                                // Rename plnkr to the main entry point
                                if (filename === "../base/plnkr.html") {
                                    filename = "index.html";
                                }

                                return {
                                    name: filename,
                                    content: response.data
                                };
                            }));
                    });
                    return $q.all(filePromises);
                })
                .then(function(files) {
                    // TODO: Add CSS insertion.
                    var postData = {};
                    insertScripts(files);
                    insertExample(files);
                    angular.forEach(files, function(file) {
                        postData['files[' + file.name + ']'] = file.content;
                    });

                    postData['tags[0]'] = "angularjs";
                    postData['tags[1]'] = "example";
                    postData['tags[2]'] = "angular-google-maps";
                    postData.private = true;
                    postData.description = exampleName;

                    formPostData('http://plnkr.co/edit/?p=preview', postData);
                });
        };
    }]);