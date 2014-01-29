/**
 * Nodeunit tests for the basic template functionality.
 */

var grunt = require('grunt');
var path = require('path');
var istanbul = require('istanbul');

var TEMP = '.grunt/temp';
var SRC = 'src/test/js/Generator.js';
var SPEC = 'src/test/js/GeneratorTest.js';
var REPORTER = '../../main/js/reporter.js';
var DEFAULT_TEMPLATE = './node_modules/grunt-contrib-jasmine/tasks/jasmine/'
		+ 'templates/DefaultRunner.tmpl';

var instrumenter = new istanbul.Instrumenter();
var collector = new istanbul.Collector();

function getContext () {
	return {
		temp: TEMP,
		css: ['a.css'],
		scripts: {
			jasmine: ['b.js'],
			helpers: ['c.js'],
			specs: [],
			src: [],
			vendor: ['d.js'],
			reporters: ['e.js'],
			start: ['f.js']
		},
		options: {
			report: 'g',
			coverage: 'h',
			// set template since jasmine is not installed as a peer-dependency
			template: DEFAULT_TEMPLATE
		}
	};
}

function getTask () {
	return {
		phantomjs: {
			on: function () {}
		}
	};
}

exports['template'] = {
	'setUp': function (callback) {
		this.context = getContext();
		this.task = getTask();
		// instrument and load template
		grunt.file.write('src/main/js/template-instrumented.js',
				instrumenter.instrumentSync(
						grunt.file.read('src/main/js/template.js'),
						'src/main/js/template.js'));
		this.template = require('../../main/js/template-instrumented.js');
		callback();
	},
	'tearDown': function (callback) {
		// write coverage data and delete instrumented template
		collector.add(__coverage__);
		grunt.file.write(grunt.config.process(
				'<%= meta.bin.coverage %>/coverage-template.json'),
				JSON.stringify(collector.getFinalCoverage()));
		grunt.file.delete('src/main/js/template-instrumented.js');
		callback();
	},
	'shouldTransitTemplateOptions': function (test) {
		this.context.options.template = {
			process: function (grunt, task, context) {
				return context.options.transited;
			}
		}
		this.context.options.templateOptions = {
			transited: true
		};
		var transited = this.template.process(grunt, this.task, this.context);
		test.equal(transited, true, 'should transit template options');
		test.done();
	},
	'shouldSanitizeWindowsPath': function (test) {
		var windowsFile = 'C:\\some\\file.js';
		var windowsFileSanitized = 'C\\some\\file.js';
		var sanitized = false;
		this.context.scripts.src.push(windowsFile);
		// backup mocks
		var platform = process.platform;
		var read = grunt.file.read;
		var write = grunt.file.write;
		// install mocks
		process.platform = 'win32';
		grunt.file.read = function (file) {
			if (path.normalize(file) == path.normalize(windowsFile)) {
				return '';
			}
			return read.apply(this, arguments);
		};
		grunt.file.write = function (file) {
			if (path.normalize(file) == path.join(TEMP, windowsFileSanitized)) {
				sanitized = true;
				return;
			}
			return write.apply(this, arguments);
		};
		// process
		this.template.process(grunt, this.task, this.context);
		test.ok(sanitized, 'should have been sanitized');
		// uninstall mocks
		process.platform = platform;
		grunt.file.read = read;
		grunt.file.write = write;
		test.done();
	},
	'coverage': {
		'setUp': function (callback) {
			this.context.options.coverage = TEMP + '/coverage/coverage.json';
			this.context.options.report = TEMP + '/coverage';
			this.registered = {};
			this.task.phantomjs.on = (function (scope) {
				return function (event, callback) {
					scope.registered.event = event;
					scope.registered.callback = callback;
				};
			})(this);
			callback();
		},
		'shouldRegister': function (test) {
			this.template.process(grunt, this.task, this.context);
			test.equal(this.registered.event, 'jasmine.coverage',
					'should register for jasmine.coverage');
			test.done();
		},
		'shouldWriteCoverage': function (test) {
			this.template.process(grunt, this.task, this.context);
			this.registered.callback({});
			test.ok(grunt.file.exists(TEMP + '/coverage/coverage.json'),
					'should write coverage.json');
			grunt.file.delete(TEMP);
			test.done();
		},
		'shouldWriteDefaultHtmlReport': function (test) {
			this.template.process(grunt, this.task, this.context);
			this.registered.callback({});
			test.ok(grunt.file.exists(TEMP + '/coverage/index.html'),
					'should write default HTML report');
			grunt.file.delete(TEMP);
			test.done();
		},
		'shouldWriteSingleReport': function (test) {
			this.context.options.report = {
				type: 'cobertura',
				options: {
					dir: TEMP + '/coverage'
				}
			};
			this.template.process(grunt, this.task, this.context);
			this.registered.callback({});
			test.ok(grunt.file.exists(
					TEMP + '/coverage/cobertura-coverage.xml'),
					'should write single report');
			grunt.file.delete(TEMP);
			test.done();
		},
		'shouldWriteMultipleReports': function (test) {
			this.context.options.report = [
				{
					type: 'html',
					options: {
						dir: TEMP + '/coverage/html'
					}
				},
				{
					type: 'cobertura',
					options: {
						dir: TEMP + '/coverage/cobertura'
					}
				},
				{
					type: 'lcovonly',
					options: {
						dir: TEMP + '/coverage/lcov'
					}
				}
			];
			this.template.process(grunt, this.task, this.context);
			this.registered.callback({});
			test.ok(grunt.file.exists(TEMP + '/coverage/html/index.html'),
					'should write HTML report');
			test.ok(grunt.file.exists(
					TEMP + '/coverage/cobertura/cobertura-coverage.xml'),
					'should write Cobertura report');
			test.ok(grunt.file.exists(TEMP + '/coverage/lcov/lcov.info'),
					'should write LCOV report');
			grunt.file.delete(TEMP);
			test.done();
		}
	},
	'instrumentation': {
		'setUp': function (callback) {
			this.context.scripts.src.push(SRC);
			this.template.process(grunt, this.task, this.context);
			callback();
		},
		'tearDown': function (callback) {
			grunt.file.delete(TEMP);
			callback();
		},
		'shouldIncludeReporter': function (test) {
			test.equal(this.context.scripts.reporters.length, 2,
					'should have added 1 reporter');
			test.equal(path.normalize(this.context.scripts.reporters[0]),
					path.join(TEMP,
							'grunt-template-jasmine-istanbul/reporter.js'),
					'should be the temporary coverage reporter');
			test.done();
		},
		'shouldInstrumentSource': function (test) {
			test.equal(this.context.scripts.src.length, 1, 'should have 1 src');
			test.equal(path.normalize(this.context.scripts.src[0]),
					path.join(TEMP, SRC),
					'should store instrumented in temp directory');
			var instrumented = this.context.scripts.src[0];
			var found = grunt.file.read(instrumented).split('\n')[0];
			var expected = 'if (typeof __coverage__ === \'undefined\') '
					+ '{ __coverage__ = {}; }';
			test.equal(found, expected, 'should be instrumented');
			test.done();
		}
	},
	'replacing': {
		'setUp': function (callback) {
			this.context.scripts.src.push(SRC);
			callback();
		},
		'tearDown': function (callback) {
			grunt.file.delete(TEMP);
			callback();
		},
		'shouldReplaceSourceByDefault': function (test) {
			var before = this.context.scripts.src;
			this.template.process(grunt, this.task, this.context);
			var after = this.context.scripts.src;
			test.notEqual(after, before, 'should replace sources');
			test.equal(path.normalize(after[0]), path.join(TEMP, SRC),
					'should be at temp');
			test.done();
		},
		'shouldReplaceSource': function (test) {
			this.context.options.replace = true;
			var before = this.context.scripts.src;
			this.template.process(grunt, this.task, this.context);
			var after = this.context.scripts.src;
			test.notEqual(after, before, 'should replace sources');
			test.equal(path.normalize(after[0]), path.join(TEMP, SRC),
					'should be at temp');
			test.done();
		},
		'shouldNotReplaceSource': function (test) {
			this.context.options.replace = false;
			var before = this.context.scripts.src;
			this.template.process(grunt, this.task, this.context);
			var after = this.context.scripts.src;
			test.equal(path.normalize(after[0]), path.normalize(SRC),
					'should be at temp');
			test.done();
		}
	},
	'thresholds': {
		'setUp': function (callback) {
			this.context.options.coverage = TEMP + '/coverage/coverage.json';
			this.context.options.report = TEMP + '/coverage';
			this.warn = grunt.warn;
			grunt.warn = function (message) {
				throw new Error(message);
			};
			this.coverage = {
				'integration-helper': {
					path: './src/test/js/integration-helper.js',
					s: {},
					b: {},
					f: {},
					branchMap: {},
					fnMap: {}
				}
			};
			this.coverageListener = null;
			this.task.phantomjs.on = (function (scope) {
				return function (event, callback) {
					scope.coverageListener = callback;
				};
			})(this);
			callback();
		},
		'tearDown': function (callback) {
			grunt.warn = this.warn;
			grunt.file.delete(TEMP);
			callback();
		},
		'shouldNotWarnWithoutOption': function (test) {
			this.context.options.thresholds = undefined;
			this.template.process(grunt, this.task, this.context);
			try {
				this.coverageListener(this.coverage);
			} catch (error) {
				test.ok(false, 'should not warn');
			}
			test.done();
		},
		'shouldNotWarnWhenThresholdsMet': function (test) {
			this.context.options.thresholds = {
				lines: 100
			};
			this.template.process(grunt, this.task, this.context);
			try {
				this.coverageListener(this.coverage);
			} catch (error) {
				test.ok(false, 'should not warn');
			}
			test.done();
		},
		'shouldWarnWhenThresholdsNotMet': function (test) {
			this.context.options.thresholds = {
				lines: 101
			};
			this.template.process(grunt, this.task, this.context);
			try {
				this.coverageListener(this.coverage);
				test.ok(false, 'should warn');
			} catch (error) {
				test.equal(error.message,
					'expected lines coverage to be at least 101% but was 100%',
					'should warn correctly');
			}
			test.done();
		},
		'shouldWarnWhenNoMetric': function (test) {
			this.context.options.thresholds = {
				whatever: 101
			};
			this.template.process(grunt, this.task, this.context);
			try {
				this.coverageListener(this.coverage);
				test.ok(false, 'should warn');
			} catch (error) {
				test.equal(error.message, 'unrecognized metric: whatever',
					'should warn correctly');
			}
			test.done();
		}
	},
	'defaultTemplate': {
		'setUp': function (callback) {
			delete this.context.options.template;
			callback();
		},
		'shouldReadPeerDependency': function (test) {
			var redirected = false;
			// backup mocks
			var read = grunt.file.read;
			// install mocks
			grunt.file.read = function (file) {
				if (path.resolve(file) == path.resolve(
						'../grunt-contrib-jasmine/tasks/jasmine/templates/'
						+ 'DefaultRunner.tmpl')) {
					redirected = true;
					return read.apply(this, [DEFAULT_TEMPLATE]);
				}
				return read.apply(this, arguments);
			};
			// process
			this.processed = this.template.process(grunt, this.task,
					this.context);
			this.expected = grunt.util._.template(
					grunt.file.read(DEFAULT_TEMPLATE), this.context);
			test.equal(this.processed, this.expected,
					'should render default template');
			test.ok(redirected, 'should have redirected the template');
			// uninstall mocks
			grunt.file.read = read;
			test.done();
		}
	},
	'staticTemplate': {
		'setUp': function (callback) {
			this.context.options.template = DEFAULT_TEMPLATE;
			this.processed = this.template.process(grunt, this.task,
					this.context);
			callback();
		},
		'shouldRender': function (test) {
			this.expected = grunt.util._.template(
					grunt.file.read(DEFAULT_TEMPLATE), this.context);
			test.equal(this.processed, this.expected,
					'should render transparently');
			test.done();
		}
	},
	'dynamicTemplate': {
		'setUp': function (callback) {
			this.context.options.template = {
				process: function (grunt, task, context) {
					return [grunt, task, context];
				}
			};
			this.processed = this.template.process(grunt, this.task,
					this.context);
			callback();
		},
		'shouldRender': function (test) {
			test.strictEqual(this.processed[0], grunt,
					'should be called with grunt');
			test.strictEqual(this.processed[1], this.task,
					'should be called with task');
			test.notStrictEqual(this.processed[2], this.context,
					'should not be called with same context');
			this.context.options = {};
			test.equal(JSON.stringify(this.processed[2]),
					JSON.stringify(this.context),
					'should be called with cloned context');
			test.done();
		}
	}
};