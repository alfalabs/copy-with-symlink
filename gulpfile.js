'use strict';
const gulp = require('gulp');
const installWithSymlink = require('./index');

var dest = 'BUILD';

function cb(){console.log('done.');}

gulp.task('install-npm', function(cb){

    installWithSymlink('.', dest, {quiet: false}, cb);

});