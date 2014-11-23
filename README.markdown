# angular-google-maps

> AngularJS directives for Google Maps


[![Dependencies](https://david-dm.org/angular-ui/angular-google-maps.svg)](https://david-dm.org/angular-ui/angular-google-maps)&nbsp; 
[![Dependencies](https://david-dm.org/angular-ui/angular-google-maps/dev-status.svg)](https://david-dm.org/angular-ui/angular-google-maps)&nbsp; 
Master: [![Build Status](https://travis-ci.org/angular-ui/angular-google-maps.svg?branch=master)](https://travis-ci.org/angular-ui/angular-google-maps)
Develop: [![Build Status](https://travis-ci.org/angular-ui/angular-google-maps.svg?branch=develop)](https://travis-ci.org/angular-ui/angular-google-maps)

task board: [![Stories in Ready](https://badge.waffle.io/angular-ui/angular-google-maps.png?label=ready&title=Ready)](https://waffle.io/angular-ui/angular-google-maps)

[![Gitter chat](https://badges.gitter.im/angular-ui/angular-google-maps.svg)](https://gitter.im/angular-ui/angular-google-maps)

<img src="http://benschwarz.github.io/bower-badges/badge@2x.png?pkgname=angular-google-maps" width="130" height="30">&nbsp;

##Post 1.2.X:

With the minor release of 1.2.0 (which is why it is a minor) there are a few breaking changes:

- all directives are now restricted to ```EA``` see [here](https://docs.angularjs.org/guide/directive) and search for 'restrict'
- marker directive now requires the attribute ```idkey``` to be defined and it is not optional like markers or windows. This is to prevent unnecessary redraws.

If I have forgotten anything then it can be added here or to the website branch which is responsible for... the website. Feel free to contribute and make pull requests to either.

## 2.0.X:
2.0.0 will introduced major changes:
- **ui-gmap** namespace which will be appended to all directives, services, and factories.
  - The main goal for this is to decrease conflicts with external libraries. The other major reason for this is to not conflict with svg definitions like polygon or marker.
- **GoogleMapAPI**: Is Provider and a Promise at the same time. This allows you to load the Google Maps SDK asynchronously into the DOM. The provider itself is a promise when passed off to the controller. Thefore the API (google and angular-google-maps) is ready on GoogleMapApi.then callback. If your getting nulls on controllers or nulls on google maps objects then this is because you are trying to access things prior to them being initialized. For more details read the website and dig into the code base. Also if your having issues with GoogleMapAPI search closed issues as a lot has been asked about these issues on several closed tickets. Search issues, gitter, and the google plus community!

## 2.0.7+:
- Bluebird & JQuery have been removed as dependencies, :clap:

## Getting started
This is a directive for AngularJS `~1.0.7+, ~1.2.2+`.

If you plan to hack on the directives or want to run the example, first thing to do is to install NPM dependencies:

```shell
npm install #note bower install is run on post install 
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

Pull requests more than welcome! If you're adding new features, it would be appreciated if you would provide some docs about the feature. This can be done either by adding a card to our [Trello board](https://trello.com/b/WwTRrkfh/angular-google-maps), forking the website branch and issuing a PR with the updated documentation page, or by opening an issue for us to add the documentation to the site.

[Branching Model w Git Flow](http://nvie.com/posts/a-successful-git-branching-model/)
We are trying to follow the git flow branching model where all bugs that are considered urgent / patches will be pull
requested against master. If the PR (pull request) is an improvement and a non urgent fix it will go towards develop
which is the working(SNAPSHOT) next version of what master will be.

When patches and bugs are rolled into master they will be immediatley rolled into develop as well. Where the flow is
PR(bug fix) -> merge master -> merge develop .
