'use strict';
const gulp = require('gulp');
const copyWithSymlinks = require('./index');

var dest = 'BUILD';

function cb(){console.log('done.');}

gulp.task('copy-npm-modules', function(cb){

    copyWithSymlinks(
        './',                           // sourceRoot
        dest,                           // destinationRoot
        'node_modules',                 // dirName
        {
            quiet: false,               // print copied files to console
            noDevDependencies: true     // do not copy devDependencies (form package.json)
        }, 
        cb                              // callback for gulp task
    );

});