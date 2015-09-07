
# angular-google-maps
> AngularJS directives for Google Maps
[![Dependencies](https://david-dm.org/angular-ui/angular-google-maps.svg)](https://david-dm.org/angular-ui/angular-google-maps)&nbsp;
[![Dependencies](https://david-dm.org/angular-ui/angular-google-maps/dev-status.svg)](https://david-dm.org/angular-ui/angular-google-maps)&nbsp;

Builds:
- Master (2.2.X): [![Build Status](https://travis-ci.org/angular-ui/angular-google-maps.svg?branch=master)](https://travis-ci.org/angular-ui/angular-google-maps)

- 2.2.X: [![Build Status](https://travis-ci.org/angular-ui/angular-google-maps.svg?branch=2.2.X)](https://travis-ci.org/angular-ui/angular-google-maps)

- 2.1.X: [![Build Status](https://travis-ci.org/angular-ui/angular-google-maps.svg?branch=2.1.X)](https://travis-ci.org/angular-ui/angular-google-maps)

- 2.0.X: [![Build Status](https://travis-ci.org/angular-ui/angular-google-maps.svg?branch=2.0.X)](https://travis-ci.org/angular-ui/angular-google-maps)

task board: [![Stories in Ready](https://badge.waffle.io/angular-ui/angular-google-maps.png?label=ready&title=Ready)](https://waffle.io/angular-ui/angular-google-maps)

[![Gitter chat](https://badges.gitter.im/angular-ui/angular-google-maps.svg)](https://gitter.im/angular-ui/angular-google-maps)

<img src="http://benschwarz.github.io/bower-badges/badge@2x.png?pkgname=angular-google-maps" width="130" height="30">&nbsp;

[![NPM](https://nodei.co/npm/angular-google-maps.png?downloads=true&downloadRank=true)](https://nodei.co/npm/angular-google-maps/)

__________________
## Getting started
This is a set of directives and services for AngularJS `~1.0.7+, ^1.2.2+`.

## Dependencies

Please always be checking the [package.json](./package.json) and [bower.json](./bower.json). They are the spoken word and will usually be more up to date **than this readme**.

**Tip** *use some library which will always pull in your dependencies (no matter what the changes are) to your vendor.js. IE: [main-bower-files](https://github.com/ck86/main-bower-files)*

Current Dependencies:
- [lodash](lodash.com)
- [angular](https://github.com/angular/angular.js)
- [angular-simple-logger](https://github.com/nmccready/angular-simple-logger) *as of 2.2.X*
- [google maps sdk](https://developers.google.com/maps/documentation/javascript/3.exp/reference), loaded for you by this directives services

## Development and or Running the Build

If you plan to hack on the directives or want to run the example, first thing to do is to install NPM dependencies:

```shell
npm install && bower install
```

* Installing for [Meteor](https://www.meteor.com/) application:

```shell
meteor add angularui:angular-google-maps
```

### Building
To build the library after you made changes, simply run grunt:

```shell
grunt
```

If you get errors from `jshint` or specs, just add the `--force` argument.

### Generating SourceMap(s)
```shell
grunt buildAll
```
This will generate source maps for development (angular-google-maps_dev_mapped.js) (non minified) and source maps to minified
(angular-google-maps_dev_mapped.min.js) files. They each have their own corresponding map files.  To get the coinciding source
files you will need to copy the generated `/tmp` directory (currently not under scc).

### Running the example
To run the example page, just run

```shell
grunt example
```

and open your browser on `http://localhost:3000/example.html`.

### Documentation
The various directives are documented at [official site](http://angular-google-maps.org).

### Contributing

Filing issues:
 Prior to submiting an issue:
- Search open/**closed** issues, src examples (./examples), gitter, and then google plus community! **Again please search!**
- issues w/ plnkrs get attention quicker

Pull Requests (PR) more than welcome! If you're adding new features, it would be appreciated if you would provide some docs about the feature.
This can be done either by adding a card to our [Waffle.io board](https://waffle.io/angular-ui/angular-google-maps), forking the website
branch and issuing a PR with the updated documentation page, or by opening an issue for us to add the documentation to the site.

PR's should follow [angular git commit conventions](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit).


### Branching Scheme

PRS to master are for 2.2.X only.

If you want it rolled into a older release then target your PR to that respective branching name like 2.1.X.

*Note: many fixes relevant to 2.0.X can be rolled up into 2.1.X, and 2.2.X*

- master: points to the active targeted next release branch (2.2.X)
- 2.2.X: latest of 2.2.X  *side note: 2.2.X is basically the same as 2.1.X except the logging dependency has been added*
- 2.1.X: latest of 2.1.X
- 2.0.X: ""
... etc
