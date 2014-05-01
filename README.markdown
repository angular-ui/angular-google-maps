# angular-google-maps

> AngularJS directives for Google Maps

[![Dependencies](https://david-dm.org/nlaplante/angular-google-maps.png)](https://david-dm.org/nlaplante/angular-google-maps)&nbsp;
[![Dependencies](https://david-dm.org/nlaplante/angular-google-maps/dev-status.png)](https://david-dm.org/nlaplante/angular-google-maps)&nbsp;
[![Build Status](https://travis-ci.org/nlaplante/angular-google-maps.png?branch=r1-dev)](https://travis-ci.org/nlaplante/angular-google-maps)

## Getting started
This is a directive for AngularJS `~1.0.7+, ~1.2.2+`.

If you plan to hack on the directives or want to run the example, first thing to do is to install NPM dependencies:

```shell
npm install
bower install ( for specs and dev dependencies)
```

### Building
To build the library after you made changes, simply run grunt:

```shell
grunt
```

If you get errors from `jshint`, just add the `--force` argument.

### Running the example
To run the example page, just run

```shell
grunt example
```

and open your browser on `http://localhost:3000/example.html`.

### Documentation
The various directives are documented at [official site](http://angular-google-maps.org).

### Contributing

Pull requests more than welcome! If you're adding new features, it would be appreciated if you would provide some docs about the feature. This can be done either by adding a card to our [Trello board](https://trello.com/b/WwTRrkfh/angular-google-maps), forking the website branch and issuing a PR with the updated documentation page, or by opening an issue for us to add the documentation to the site.

[Branching Model w Git Flow](http://nvie.com/posts/a-successful-git-branching-model/)
We are trying to follow the git flow branching model where all bugs that are considered urgent / patches will be pull
requested against master. If the PR (pull request) is an improvement and a non urgent fix it will go towards develop
which is the working(SNAPSHOT) next version of what master will be.

When patches and bugs are rolled into master they will be immediatley rolled into develop as well. Where the flow is
PR(bug fix) -> merge master -> merge develop .
