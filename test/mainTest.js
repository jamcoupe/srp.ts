var allTestFiles = [];
var TEST_REGEXP = /(.test)\.js$/i;
Object.keys(window.__karma__.files).forEach(function(file) {

	if (TEST_REGEXP.test(file)) {
		var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
		allTestFiles.push(normalizedTestModule);
	}
});


requirejs.config({

	// Karma serves files under /base, which is the basePath from your config file
	baseUrl: '/base',

	paths: {
		"bigint.ts": "./jspm_packages/github/jamcoupe/bigint.ts@master",
		"encode.ts": "./jspm_packages/github/jamcoupe/encode.ts@master",
		"rusha": "./jspm_packages/github/jamcoupe/rusha@master",
		"fast-sha256-js": "./jspm_packages/github/jamcoupe/fast-sha256-js@master",
		"hash.ts": "./jspm_packages/github/jamcoupe/hash.ts@master"
	},
	deps: allTestFiles,

	callback: window.__karma__.start

});
