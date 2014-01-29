module.exports = function(grunt) {
	grunt.initConfig({
		meta: {
			package: grunt.file.readJSON('package.json'),
			src: {
				main: 'src/main',
				test: 'src/test',
			},
			bin: {
				coverage: 'bin/coverage'
			},
			temp: {
				integration: '.grunt/integration'
			},
			doc: 'doc'
		},
		// test template functionality
		nodeunit: {
			template: '<%= meta.src.test %>/js/template.js',
			reporter: '<%= meta.src.test %>/js/reporter.js',
			integration: '<%= meta.src.test %>/js/integration.js',
			threshold: '<%= meta.src.test %>/js/threshold.js'
		},
		jasmine: {
			// test common use-case
			integration: {
				src: ['<%= meta.src.test %>/js/Generator.js'],
				options: {
					specs: ['<%= meta.src.test %>/js/GeneratorTest.js'],
					template: require('./'),
					templateOptions: {
						coverage: '<%= meta.temp.integration %>/coverage.json',
						report: [
							{
								type: 'html',
								options: {
									dir: '<%= meta.temp.integration %>/html'
								}
							},
							{
								type: 'cobertura',
								options: {
									dir: '<%= meta.temp.integration %>/cobertura'
								}
							},
							{
								type: 'text-summary'
							}
						],
						thresholds: {
							lines: 100,
							statements: 100,
							branches: 100,
							functions: 100
						},
						template: '<%= meta.src.test %>/html/integration.tmpl',
						templateOptions: {
							helpers: ['<%= meta.src.test %>/js/integration-helper.js']
						}
					}
				}
			},
			// test that threshold can fail the build
			threshold: {
				src: ['<%= meta.src.test %>/js/Generator.js'],
				options: {
					specs: ['<%= meta.src.test %>/js/GeneratorTest.js'],
					template: require('./'),
					templateOptions: {
						coverage: '<%= meta.temp.integration %>/coverage.json',
						report: {
							type: 'text-summary'
						},
						thresholds: {
							lines: 101
						},
						template: '<%= meta.src.test %>/html/integration.tmpl',
						templateOptions: {
							helpers: ['<%= meta.src.test %>/js/integration-helper.js']
						}
					}
				}
			}
		},
		clean: {
			temp: ['.grunt'],
			bin: ['bin']
		},
		yuidoc: {
			compile: {
				name: '<%= meta.package.name %>',
				description: '<%= meta.package.description %>',
				version: '<%= meta.package.version %>',
				options: {
					paths: '<%= meta.src.main %>',
					outdir: '<%= meta.doc %>'
				}
			}
		},
		jshint: {
			main: '<%= meta.src.main %>/js/*.js',
			test: '<%= meta.src.test %>/js/*.js',
			options: {
				// enforce
				bitwise: true,
				camelcase: true,
				curly: true,
				eqeqeq: false,
				forin: true,
				immed: true,
				indent: 4,
				latedef: true,
				newcap: true,
				noarg: true,
				noempty: true,
				nonew: true,
				plusplus: true,
				quotmark: 'single',
				undef: true,
				unused: true,
				strict: false, // i don't get it
				trailing: true,
				maxparams: 5,
				maxdepth: 3,
				maxstatements: 42,
				maxcomplexity: 5,
				maxlen: 80,
				// relax
				eqnull: true,
				laxbreak: true, // break on + etc.
				sub: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('report', 'Write coverage report', function () {
		var istanbul = require('istanbul');
		var collector = new istanbul.Collector();
		var reporter = istanbul.Report.create('html', {
			dir: grunt.config.process('<%= meta.bin.coverage %>')
		});
		grunt.file.expand(grunt.config.process('<%= meta.bin.coverage %>/coverage-*.json')).forEach(function (file) {
			collector.add(grunt.file.readJSON(file));
		});
		reporter.writeReport(collector, true);
	});
	
	var WARN = grunt.warn;
	
	grunt.registerTask('mock:warn:install', 'Install mock for grunt.warn()', function () {
		grunt.warn = function(message) {
			grunt.warn.message = message;
		};
	});
	grunt.registerTask('mock:warn:uninstall', 'Uninstall mock for grunt.warn()', function () {
		grunt.warn = WARN;
	});

	grunt.registerTask('check', ['jshint:main', 'jshint:test']);		
	grunt.registerTask('doc', 'yuidoc');
	grunt.registerTask('test:template', ['nodeunit:template']);
	grunt.registerTask('test:reporter', ['nodeunit:reporter']);
	grunt.registerTask('test:integration', ['clean:temp', 'jasmine:integration', 'nodeunit:integration']);
	grunt.registerTask('test:threshold', ['clean:temp', 'mock:warn:install', 'jasmine:threshold', 'nodeunit:threshold', 'mock:warn:uninstall']);
	grunt.registerTask('test', ['test:template', 'test:reporter', 'test:integration', 'test:threshold']);
	grunt.registerTask('test:coverage', ['clean:bin', 'test', 'report']);

};