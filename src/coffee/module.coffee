###
!
The MIT License

Copyright (c) 2010-2013 Google, Inc. http://angularjs.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

angular-google-maps
https://github.com/nlaplante/angular-google-maps

@authors
Nicolas Laplante - https://plus.google.com/108189012221374960701
Nicholas McCready - https://twitter.com/nmccready
###
#define application wide modules
angular.module("google-maps.directives.api.utils", [])
angular.module("google-maps.directives.api.managers", [])
angular.module("google-maps.directives.api.models.child", [
    "google-maps.directives.api.utils"])
angular.module("google-maps.directives.api.models.parent", [
    "google-maps.directives.api.managers",
    "google-maps.directives.api.models.child"
])
angular.module("google-maps.directives.api", [ "google-maps.directives.api.models.parent"])
angular.module("google-maps", [ "google-maps.directives.api"])
.factory("debounce", ["$timeout", ($timeout) ->
        (fn) -> # debounce fn
            nthCall = 0
            -> # intercepting fn
                that = this
                argz = arguments
                nthCall++
                later = ((version) ->
                    ->
                        fn.apply that, argz  if version is nthCall)(nthCall)
                $timeout later, 0, true
])