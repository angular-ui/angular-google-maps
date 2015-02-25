# angular-google-maps

> AngularJS directives for Google Maps


[![Dependencies](https://david-dm.org/angular-ui/angular-google-maps.svg)](https://david-dm.org/angular-ui/angular-google-maps)&nbsp; 
[![Dependencies](https://david-dm.org/angular-ui/angular-google-maps/dev-status.svg)](https://david-dm.org/angular-ui/angular-google-maps)&nbsp; 
Master: [![Build Status](https://travis-ci.org/angular-ui/angular-google-maps.svg?branch=master)](https://travis-ci.org/angular-ui/angular-google-maps)
Develop: [![Build Status](https://travis-ci.org/angular-ui/angular-google-maps.svg?branch=develop)](https://travis-ci.org/angular-ui/angular-google-maps)

task board: [![Stories in Ready](https://badge.waffle.io/angular-ui/angular-google-maps.png?label=ready&title=Ready)](https://waffle.io/angular-ui/angular-google-maps)

[![Gitter chat](https://badges.gitter.im/angular-ui/angular-google-maps.svg)](https://gitter.im/angular-ui/angular-google-maps)

<img src="http://benschwarz.github.io/bower-badges/badge@2x.png?pkgname=angular-google-maps" width="130" height="30">&nbsp;

## 2.0.X:
2.0.0 will introduced major changes:
- **ui-gmap** namespace which will be appended to all directives, services, and factories.
  - The main goal for this is to decrease conflicts with external libraries. The other major reason for this is to not conflict with svg definitions like polygon or marker.
- **GoogleMapAPI**: Is Provider and a Promise at the same time. This allows you to load the Google Maps SDK asynchronously into the DOM. The provider itself is a promise when passed off to the controller. Thefore the API (google and angular-google-maps) is ready on GoogleMapApi.then callback. If your getting nulls on controllers or nulls on google maps objects then this is because you are trying to access things prior to them being initialized. For more details read the website and dig into the code base. Also if your having issues with GoogleMapAPI search closed issues as a lot has been asked about these issues on several closed tickets. Search issues, gitter, and the google plus community!

## 2.0.7+:
- Bluebird & JQuery have been removed as dependencies, :clap:

## Things to Come:
_______________________
## 2.0.12 maybe 2.0.13

These will probably be close to the last 2.0.X releases. Depending on the severity of the bugs other 2.0.X releases may be necessary.

## 2.1

So I guess the poll was for naught.. So develop has been pretty stable for a while now and it is mainly what I use for work. Therefore I plan on cutting a 2.1.X release soon. 3.0.X is going to take some time to flush out. So I'd rather get this out now.

Main Changes:
- Plural directives can evaluate expressions (new) and (old) string properties of models.

## 3.0.X
This release is going to be much stricter in terms of when it will be released and allowed features. It will require more specs and will be focusing on bad bugs, unifying the API. There are more items being discussed internally as well and they will become public discussion soon.

Few items known:
- **transclusion**: Only the map will be transcluded (no more window or windows in markers). This will de-complicate the api tremendously. This will also make it much easier to have one PluralParentModel for the rest of the parents to use. This *may* be held off for 3.0.X. 
- **watches**:All directives to be moved to using shallow watches (no equality) and or $watchCollection.

- **drop singular layer directives**: Singular directives while being 'angular', are pretty useless for production and performance unless your size is small. To bring focus to the API our goal for layers (shapes, markers, windows) is to make all of the directives plural.

- **remove many watches**, from pural directives. We may be de-angularizing somethings to aide in speed. This main change will have to do with watches on models itself. Watchers are a pain, not only are they a performance hit, but it also makes the internals of the api less explicit (where watchers guess and figure out what is going on). We are considering using the control to allow models to be explicitly updated, destroyed, and created. See [Polygons](https://github.com/angular-ui/angular-google-maps/blob/master/src/coffee/directives/api/polygons.coffee#L24-L29).

Overall we are thinking making this a more aggressive follow up to 2.1.X on watches where we just abort using many them. This [read](http://gehrcke.de/2014/11/sharing-state-in-angularjs-be-aware-of-watch-issues-and-race-conditions-during-app-initialization/), summarizes it best.

__________________
## Getting started
This is a set of directives and services for AngularJS `~1.0.7+, ^1.2.2+`.

If you plan to hack on the directives or want to run the example, first thing to do is to install NPM dependencies:

```shell
npm install #note bower install is run on post install 
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
grunt mappAll
```
This will generate source maps for development (angular-google-maps_dev_mapped.js) (non minified) and source maps to minified (angular-google-maps_dev_mapped.min.js) files. They each have their own corresponding map files.  To get the coinciding source files you will need to copy the generated `/tmp` directory (currently not under scc).

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

Pull requests more than welcome! If you're adding new features, it would be appreciated if you would provide some docs about the feature. This can be done either by adding a card to our [Waffle.io board](https://waffle.io/angular-ui/angular-google-maps), forking the website branch and issuing a PR with the updated documentation page, or by opening an issue for us to add the documentation to the site.

[Branching Model w Git Flow](http://nvie.com/posts/a-successful-git-branching-model/)
We are trying to follow the git flow branching model where all bugs that are considered urgent / patches will be pull
requested against master. If the PR (pull request) is an improvement and a non urgent fix it will go towards develop
which is the working(SNAPSHOT) next version of what master will be.

When patches and bugs are rolled into master they will be immediatley rolled into develop as well. Where the flow is
PR(bug fix) -> merge master -> merge develop .
