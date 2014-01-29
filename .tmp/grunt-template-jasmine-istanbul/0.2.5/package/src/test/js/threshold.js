/**
 * Tests if a warning has been issued correctly after running the jasmine
 * threshold test.
 */

var grunt = require('grunt');

exports['threshold'] = {
	'shouldTransitTemplateOptions': function (test) {
		var expected = 'expected lines coverage to be at least 101% but was 100%';
		test.equal(grunt.warn.message, expected, 'should have warned correctly');
		test.done();
	}
};