[![Release](http://img.shields.io/github/release/rails-assets/angular-semver-sort.svg)](https://github.com/rails-assets/angular-semver-sort/releases) [![Build Status](http://img.shields.io/travis/rails-assets/angular-semver-sort.svg)](https://travis-ci.org/rails-assets/angular-semver-sort) [![Dependency Status](http://img.shields.io/gemnasium/rails-assets/angular-semver-sort.svg)](https://gemnasium.com/rails-assets/angular-semver-sort)

# angular-semver-sort

> Angular.js filter for ordering collections by [semantic version number](http://semver.org).

## Installation

```sh
bower install angular-semver-sort
```

If you’re building a Rails app, you can easily use it with [Rails Assets](https://rails-assets.org)—this package is available as `rails-assets-angular-semver-sort`.

## Usage

```js
angular.module('yourApp', ['semverSort']);
```

### semverSort

```html
<ol>
  <li ng-repeat="version in gem.versions | semverSort">
    {{ version }}
  </li>
</ol>
```

### semverSort:property

```html
<ol>
  <li ng-repeat="gem in gems | semverSort:'version'">
    {{ gem.version }}
  </li>
</ol>
```

### semverReverseSort

```html
<ol>
  <li ng-repeat="version in gem.versions | semverReverseSort">
    {{ version }}
  </li>
</ol>
```

### semverReverseSort:property

```html
<ol>
  <li ng-repeat="gem in gems | semverReverseSort:'version'">
    {{ gem.version }}
  </li>
</ol>
```

## Development

Clone the repository, then:

```sh
npm install

grunt
grunt test
```

## Credits

The filter **includes** the browser build of [node-semver](https://github.com/isaacs/node-semver), the BSD-licensed semver parser created by Isaac Z. Schlueter.

Made for [Rails Assets](https://rails-assets.org).
