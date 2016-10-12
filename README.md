angular-google-maps
===================

[![Build Status](https://travis-ci.org/angular-ui/angular-google-maps.png?branch=website)](https://travis-ci.org/angular-ui/angular-google-maps)

This is the angular google maps `website` branch. This is where you'll find sources for the official 
website including the API documentation and the live example.

Feel free to open pull requests to improve the docs.

The website is built using [yo](http://yeoman.io/) and [generator-angular](https://github.com/yeoman/generator-angular). 

To run the site locally, you'll need [node](https://nodejs.org), [bower](http://bower.io/) and [grunt](http://gruntjs.com/) in your path.

## Installation

```bash
$ git clone -b website git@github.com:angular-ui/angular-google-maps.git
$ cd angular-google-maps
$ npm install
$ grunt build
$ grunt server
```

## Deployment

`grunt gh-pages`

### Basic Build

`grunt build`

### Prod Build (minifies and all that jaz)

`grunt prod_build`

### Serve the Files

`grunt server`
