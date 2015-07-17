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

	deps: allTestFiles,

	callback: window.__karma__.start

});
