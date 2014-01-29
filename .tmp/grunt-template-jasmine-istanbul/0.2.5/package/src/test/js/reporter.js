/**
 * Nodeunit tests for the basic template functionality.
 */

var grunt = require('grunt');
var istanbul = require('istanbul');
var instrumenter = new istanbul.Instrumenter();
var collector = new istanbul.Collector();

var jasmine;
var phantom;

function getJasmine () {
	var jasmine = {
		reporters: [],
		Reporter: function() {},
		getEnv: function() {
			return {
				addReporter: function (reporter) {
					jasmine.reporters.push(reporter);
				}
			};
		}
	}
	return jasmine;
}

function getPhantom () {
	var phantom = {
		messages: [],
		sendMessage: function (event, data) {
			phantom.messages.push({
				event: event,
				data: data
			});
		}
	};
	return phantom;
}

exports['reporter'] = {
	'setUp': function (callback) {
		jasmine = getJasmine();
		phantom = getPhantom();
		// instrument and load reporter
		eval(instrumenter.instrumentSync(
				grunt.file.read('src/main/js/reporter.js'),
				'src/main/js/reporter.js'));
		callback();
	},
	'tearDown': function (callback) {
		// write coverage data and delete instrumented template
		collector.add(__coverage__);
		grunt.file.write(grunt.config.process(
				'<%= meta.bin.coverage %>/coverage-reporter.json'),
				JSON.stringify(collector.getFinalCoverage()));
		callback();
	},
	'shouldNotDefineReporter': function (test) {
		test.throws(function () {
			return reporter;
		}, ReferenceError, 'should not define reporter');
		test.done();
	},
	'shouldAddReporter': function (test) {
		test.strictEqual(jasmine.reporters.length, 1, 'should add 1 reporter');
		test.done();
	},
	'shouldSendMessageToPhantom': function (test) {
		var reporter = jasmine.reporters[0];
		reporter.reportRunnerResults();
		test.strictEqual(phantom.messages.length, 1, 'should send message');
		var message = phantom.messages[0];
		test.equal(message.event, 'jasmine.coverage',
				'should send jasmine.coverage event');
		test.strictEqual(message.data, __coverage__,
				'should send coverage data');
		test.done();
	},
	'shouldNotSendMessageToPhantom': function (test) {
		var oldCoverage = __coverage__;
		__coverage__ = null;
		var reporter = jasmine.reporters[0];
		reporter.reportRunnerResults();
		test.strictEqual(phantom.messages.length, 0, 'should not send message');
		__coverage__ = oldCoverage;
		test.done();
	}
};