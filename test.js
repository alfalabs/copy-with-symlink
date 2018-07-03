'use strict';
const gulp = require('gulp');
const instalCopySymlink = require('./index');

var dest = 'BUILD';

function cb(){console.log('done.');}


    instalCopySymlink('.', dest, {quiet: false}, cb);
