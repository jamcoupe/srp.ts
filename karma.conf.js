// Karma configuration
// Generated on Sat Jul 11 2015 15:30:28 GMT+0100 (BST)

module.exports = function(config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine', 'requirejs'],

		files: [
			{ pattern: 'test/mainTest.js', included: true, watched: true,  served: true },

			{ pattern: 'src/**/*.ts', watched: true, included: false, served: false},
			{ pattern: 'spr.ts', watched: true, included: false, served: false},
			{ pattern: 'test/**/*.ts', watched: true, included: false, served: false},

			{ pattern: 'node_modules/encode.ts/encode.js', included: false },
			{ pattern: 'node_modules/hash.ts/hash.js', included: false },
			{ pattern: 'node_modules/bigint.ts/bigint.js', included: false },
			{ pattern: 'node_modules/hash.ts/node_modules/rusha/rusha.js', included: false },
			{ pattern: 'node_modules/encode.ts/node_modules/base64-js/base64.js', included: false },
			{ pattern: 'node_modules/hash.ts/node_modules/encode.ts/encode.js', included: false },
			{ pattern: '**/src/**/*.js', included: false },

			{ pattern: 'srp.js', included: false },
			{ pattern: 'src/**/*.js', included: false },
			{ pattern: 'test/**/*.js', included: false }
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'**/*.ts': ['tsc']
		},


		tscPreprocessor: {
			tsConfig: "tsconfig.json" //relative to the __dirname value
		},


		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],



		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_DEBUG,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false
	})
};
