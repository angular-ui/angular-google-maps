/**
 * Tests if the files have been created correctly after running the jasmine
 * integration test.
 */

var grunt = require('grunt');
var path = require('path');

exports['integration'] = {
	'shouldTransitTemplateOptions': function (test) {
		var file = grunt.config.get(
				'jasmine.integration.options.templateOptions.coverage');
		test.ok(grunt.file.exists(file), 'should have written coverage.json');
		var coverage = grunt.file.readJSON(file);
		test.ok(coverage['integration-helper'],
				'should have added helper to coverage');
		test.done();
	},
	'report': {
		'shouldWriteCoverage': function (test) {
			var file = grunt.config.get(
					'jasmine.integration.options.templateOptions.coverage');
			test.ok(grunt.file.exists(file), 'should write coverage.json');
			test.done();
		},
		'shouldWriteReports': function (test) {
			var reports = grunt.config.get(
					'jasmine.integration.options.templateOptions.report');
			test.ok(grunt.file.exists(reports[0].options.dir + '/index.html'),
					'should write HTML report');
			test.ok(grunt.file.exists(
					reports[1].options.dir + '/cobertura-coverage.xml'),
					'should write Cobertura report');
			test.done();
		}
	}
};