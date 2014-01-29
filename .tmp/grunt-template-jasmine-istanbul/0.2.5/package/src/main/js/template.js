/* globals require, exports */
/**
 * Code coverage via istanbul.
 *
 * @module grunt-template-jasmine-istanbul
 * @class template
 */
var path = require('path');
var istanbul = require('istanbul');
var grunt = require('grunt');

var REPORTER = __dirname + '/reporter.js';
var TMP_REPORTER = 'grunt-template-jasmine-istanbul/reporter.js';
var DEFAULT_TEMPLATE = __dirname + '/../../../../grunt-contrib-jasmine/tasks/'
		+ 'jasmine/templates/DefaultRunner.tmpl';

/**
 * Instruments the specified sources and moves the instrumented sources to the
 * temporary location, recreating the original directory structure.
 *
 * @private
 * @method instrument
 *
 * @param {Array} sources The paths of the original sources
 * @param {String} tmp The path to the temporary directory
 *
 * @return {Array} The paths to the instrumented sources
 */
var instrument = function (sources, tmp) {
	var instrumenter = new istanbul.Instrumenter();
	var instrumentedSources = [];
	sources.forEach(function (source) {
		var sanitizedSource = source;
		// don't try to write "C:" as part of a folder name on Windows
		if (process.platform == 'win32') {
			sanitizedSource = source.replace(/^([a-z]):/i, '$1');
		}
		var tmpSource = path.join(tmp, sanitizedSource);
		grunt.file.write(tmpSource, instrumenter.instrumentSync(
				grunt.file.read(source), source));
		instrumentedSources.push(tmpSource);
	});
	return instrumentedSources;
};

/**
 * Writes the coverage file.
 *
 * @private
 * @method writeCoverage
 *
 * @param {Object} coverage The coverage data
 * @param {String} file The path to the coverage file
 */
var writeCoverage = function (coverage, file) {
	grunt.file.write(file, JSON.stringify(coverage));
};

/**
 * Writes the report of the specified type, using the specified options and
 * reporting the coverage collected by the specified collector.
 *
 * @private
 * @method writeReport
 *
 * @param {String} type The report type
 * @param {Object} options The report options
 * @param {Collector} collector The collector containing the coverage
 */
var writeReport = function (type, options, collector) {
	istanbul.Report.create(type, options).writeReport(collector, true);
};

/**
 * Writes the istanbul reports created from the specified options.
 *
 * @private
 * @method writeReports
 *
 * @param {Collector} collector The collector containing the coverage
 * @param {Object} options The options describing the reports
 */
var writeReports = function (collector, options) {
	if (typeof options == 'string' || options instanceof String) {
		// default to html report at options directory
		writeReport('html', {
			dir: options
		}, collector);
	} else if (options instanceof Array) {
		// multiple reports
		for (var i = 0; i < options.length; i = i + 1) {
			var report = options[i];
			writeReport(report.type, report.options, collector);
		}
	} else {
		// single report
		writeReport(options.type, options.options, collector);
	}
};

/**
 * Checks whether the specified threshold options have been met. Issues a
 * warning if not.
 *
 * @param {Collector} collector The collector containing the coverage
 * @param {Object} options The options describing the thresholds
 */
var checkThresholds = function (collector, options) {
	var summaries = [];
	collector.files().forEach(function (file) {
		summaries.push(istanbul.utils.summarizeFileCoverage(
				collector.fileCoverageFor(file)));
	});
	var finalSummary = istanbul.utils.mergeSummaryObjects.apply(null,
			summaries);
	grunt.util._.each(options, function (threshold, metric) {
		var actual = finalSummary[metric];
		if(!actual) {
			grunt.warn('unrecognized metric: ' + metric);
		}
		if(actual.pct < threshold) {
			grunt.warn('expected ' + metric + ' coverage to be at least '
					+ threshold + '% but was ' + actual.pct + '%');
		}
	});
};

/**
 * Processes the mixed-in template. Defaults to jasmine's default template and
 * sets up the context using the mixed-in template's options.
 *
 * @private
 * @method processMixedInTemplate
 *
 * @param {Object} grunt The grunt object
 * @param {Object} task Provides utility methods to register listeners and
 *	   handle temporary files
 * @param {Object} context Contains all options
 *
 * @return {String} The template HTML source of the mixed in template
 */
var processMixedInTemplate = function (grunt, task, context) {
	var template = context.options.template;
	if (!template) {
		template = DEFAULT_TEMPLATE;
	}
	// clone context
	var mixedInContext = JSON.parse(JSON.stringify(context));
	// transit templateOptions
	mixedInContext.options = context.options.templateOptions || {};
	if (template.process) {
		return template.process(grunt, task, mixedInContext);
	} else {
		return grunt.util._.template(grunt.file.read(template), mixedInContext);
	}
};

/**
 * Instruments the sources, generates reports and cleans up after tests.
 *
 * @method process
 *
 * @param {Object} grunt The grunt object
 * @param {Object} task Provides utility methods to register listeners and
 *	   handle temporary files
 * @param {Object} context Contains all options
 *
 * @return {String} The template HTML source
 */
exports.process = function (grunt, task, context) {
	// prepend coverage reporter
	var tmpReporter = path.join(context.temp, TMP_REPORTER);
	grunt.file.copy(REPORTER, tmpReporter);
	context.scripts.reporters.unshift(tmpReporter);
	// instrument sources
	var instrumentedSources = instrument(context.scripts.src, context.temp);
	// replace sources
	if (context.options.replace == null || context.options.replace) {
		context.scripts.src = instrumentedSources;
	}
	// listen to coverage event dispatched by reporter
	task.phantomjs.on('jasmine.coverage', function (coverage) {
		var collector = new istanbul.Collector();
		collector.add(coverage);
		writeCoverage(coverage, context.options.coverage);
		writeReports(collector, context.options.report);
		if (context.options.thresholds) {
			checkThresholds(collector, context.options.thresholds);
		}
	});
	// process mixed-in template
	return processMixedInTemplate(grunt, task, context);
};