var gulp = require('gulp');
var karma = require('karma');
var Config = require('karma/lib/config').Config;
var config = new Config();
require('./karma.conf')(config);
var Server = karma.Server;


config.set({
	singleRun: true
});


gulp.task('test', function(done) {

	console.log(config);

	new Server(config, function(result) {
		console.log(result);
		done();
	}).start();

});