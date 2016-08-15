<a name"2.4.3"></a>
### 2.4.3 (2016-08-15)


#### Bug Fixes

* **build:** webpack-dev-server is a peer dependency of grunt-webpack ([e7631d28](https://github.com/angular-ui/angular-google-maps/commit/e7631d28))
* **map-loader:** change includeScript to place maps api script tag to head element instead of bod ([8d6ed161](https://github.com/angular-ui/angular-google-maps/commit/8d6ed161))


<a name"2.3.3"></a>
### 2.3.3 (2016-05-13)


<a name"2.3.2"></a>
### 2.3.2 (2016-02-11)


#### Bug Fixes

* **angular 1.5:** working ([8ac35c3e](https://github.com/angular-ui/angular-google-maps/commit/8ac35c3e))


<a name"2.3.1"></a>
### 2.3.1 (2016-01-28)


#### Bug Fixes

* **lodash:** #1682 check both directions 3.X to 4.X and 4.X to 3.X. ([cb3a20bd](https://github.com/angular-ui/angular-google-maps/commit/cb3a20bd))


<a name"2.2.2"></a>
### 2.2.2 (2016-01-21)


#### Bug Fixes

* **EventsHelper removeEvents:** hasOwnProperty check to protect againt those that override Array.prototype issue ([4aa49942](https://github.com/angular-ui/angular-google-maps/commit/4aa49942))
* **angular-simple-logger:** point to browser version of the lib ([6136cb81](https://github.com/angular-ui/angular-google-maps/commit/6136cb81))
* **loader:** replace remove() with removeChild() to delete an existing ([86aa0fe8](https://github.com/angular-ui/angular-google-maps/commit/86aa0fe8))
* **lodash:** lodash version also fixed to 3.X on devDependencies for node #1682 ([065568aa](https://github.com/angular-ui/angular-google-maps/commit/065568aa))
* **lodash extensions:** fixed indenting and other mistakes ([4f303c08](https://github.com/angular-ui/angular-google-maps/commit/4f303c08))
* **mapType:** options watch deep, is now watchCollection as it avoids infinite digests ([222e68f3](https://github.com/angular-ui/angular-google-maps/commit/222e68f3))
* **travis:** remove underscore spec for now ([84db4848](https://github.com/angular-ui/angular-google-maps/commit/84db4848))
* **window memory scope leaks:** - WindowsParent model now correctly destroys its child model's scopes. - coffeel ([42cca071](https://github.com/angular-ui/angular-google-maps/commit/42cca071))


<a name"2.2.1"></a>
### 2.2.1 (2015-09-11)


#### Bug Fixes

* **meteor:** prepping for new release to have meteor working again ([6d01d4eb](https://github.com/angular-ui/angular-google-maps/commit/6d01d4eb))


<a name"2.2.0"></a>
### 2.2.0 (2015-09-06)

#### Bug Fixes

* **searchbox:** visibility fixes, issue #1471 ([265e2a3](https://github.com/angular-ui/angular-google-maps/commit/265e2a3))

#### Features

* **uiGmapLogger:** internals outsourced to nemSimpleLogger which we now instantiate ([05af52c](https://github.com/angular-ui/angular-google-maps/commit/05af52c))

<a name"2.1.6"></a>
### 2.1.6 (2015-08-27)


#### Bug Fixes

* **circle:** scope properties update again even if the event attribute is not set in the dire ([b33d4a92](https://github.com/angular-ui/angular-google-maps/commit/b33d4a92))
* **circle-parent-model:** circle radius and center events dupe firing fixed by boolean gates to not re-tri ([ae4f09b6](https://github.com/angular-ui/angular-google-maps/commit/ae4f09b6))
* **is-ready max attempts:** Stop checking map's readiness after reaching max attempts issue #/1445 ([63637fe9](https://github.com/angular-ui/angular-google-maps/commit/63637fe9))
* **lodash:** lodash polyfill for _.get , issue /#1433 ([705cd34c](https://github.com/angular-ui/angular-google-maps/commit/705cd34c))
* **markerManager:** /#1449 adding destroy ([99609baa](https://github.com/angular-ui/angular-google-maps/commit/99609baa))
* **markers-parent-model events:** internal events are not getting unhooked; added saftey check ([117be87a](https://github.com/angular-ui/angular-google-maps/commit/117be87a))
* **markerspiderfier:** Check if spiderfier is on during an event to recreate the spiderfier if the mark ([cf178c87](https://github.com/angular-ui/angular-google-maps/commit/cf178c87))
* **polylines polygons attribute watching:** updates not get set correctly fixes issue #1255 ([4274d5a0](https://github.com/angular-ui/angular-google-maps/commit/4274d5a0))


<a name"2.1.5"></a>
### 2.1.5 (2015-06-18)


<a name"2.1.4"></a>
### 2.1.4 (2015-06-14)


#### Bug Fixes

* **changelog:** on version bump the next version is used as the main header of the changelog ([cef77ecb](https://github.com/angular-ui/angular-google-maps/commit/cef77ecb))
* **marker:**
  * markers now update on model changes ([f46fd49e](https://github.com/angular-ui/angular-google-maps/commit/f46fd49e))
  * markers now update on model changes ([32086ad4](https://github.com/angular-ui/angular-google-maps/commit/32086ad4))


#### Features

* **RichMarker:** Build all post merge of feature RichMarker which marker and the markers directiv ([323e41f6](https://github.com/angular-ui/angular-google-maps/commit/323e41f6))
* **better graphing:** switched to grunt-angular-architecture-graph ([b4f96dba](https://github.com/angular-ui/angular-google-maps/commit/b4f96dba))
* **bump w changelog:** changelog added to all bumps ([e16a86e8](https://github.com/angular-ui/angular-google-maps/commit/e16a86e8))
* **graphviz:**
  * added to bump routines ([69b317fa](https://github.com/angular-ui/angular-google-maps/commit/69b317fa))
  * trying to aid in documentation and help people figure this out ([b6017de0](https://github.com/angular-ui/angular-google-maps/commit/b6017de0))
* **grunt-changelog:** changelog added to our grunt build, sorry I did not know about this sooner. See  ([84227c03](https://github.com/angular-ui/angular-google-maps/commit/84227c03))
