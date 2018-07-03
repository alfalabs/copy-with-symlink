# gulp-install-with-symlink

If you have **symbolic links** in your `node_modules`, 
and run `npm instal` or `gulp-install` task, this will create new `node_modules` folder for production with broken symbolic links. (not tested on linux or darwin)

`gulp-install-with-symlink` utility will copy all node modules from dev `node_modules` to production with actual folders instead of symbolic links. Modules for `devDependencies` as listed in `package.json` will NOT be copied by default. Setting option `{all:true}` will copy them also.

NOTE:  
The production `node_modules` folder MUST NOT exist before this operation. This folder will be created. Otherwise strange things will happen on Windows. (not tested on linux or darwin)

Symbolic links are great for private modules, but npm should handle it for production release.

To check if you have symbolic links in node_modules, look for little link arrows on the folder icon in file explorer:  
<img src="symlinks.png">

## gulp example

```javascript
const gulp = require('gulp');
const installWithSymlink = require('gulp-install-with-symlink');

var dest = 'BUILD';

function cb(){console.log('done.');}

gulp.task('install-npm', function(cb){

    installWithSymlink('.', dest, {quiet: false}, cb);

});
```

This utility is synchronous (slow) for now. (Maybe if future I'll make it async)