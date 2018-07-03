'use strict';
const fs = require('fs-extra');
const path = require('path');
const walkDirsSync = require('./walk-dirs-sync');

/**
 * 
 * @param {*} sourceRoot - development folder where original node_modules with symlinks are
 * @param {*} destinationRoot - build folder 
 * @param {*} dirName - name of folder to copy from sourceRoot to destinationRoot
 * @param {*} opts {
 *                  quiet:true, do not show progress in console
 *                  all: false by default - do not include devDependencies, if true all dependencies will be copied
 *                  noDevDependencies: do not copy devDependencies as per package.json
 *             }
 * @param {*} cb for gulp task
 */
module.exports = function(sourceRoot, destinationRoot, dirName, opts, cb){
    opts = opts || {};

    var devDependencies;
    if (opts.noDevDependencies) {
        var pck = path.join(sourceRoot, './package.json'); pck = pck==='package.json' ? `./${pck}` : pck;
        devDependencies = require(pck).devDependencies; 
    }
    devDependencies = devDependencies || {};

    if (fs.existsSync(path.join(destinationRoot, dirName))) {
        var msg=`destination folder already exists: '${path.join(destinationRoot, dirName)}' symlinks are unpredictable.`;
        console.log('\x1b[31m ERROR:');
        console.error(msg); 
        console.log('\x1b[0m');
        throw (msg);
    }

   

    var walkDirCallbacks = {

        condition: function(stat, lstat, dirItem){
            if (stat.isDirectory()){
                if (opts.all) return true;
                var dirItemName = path.parse(dirItem).name;
                if (devDependencies[dirItemName]) return false;  // do not include devDependencies
                return true;
            } 
            return false;
        },
        onCondition: function(dirItem, _opts){
                
            var dirItemName = path.parse(dirItem).name;
            var _source = dirItem;
            var dest = path.join(destinationRoot, dirItem);
            if(!opts.quiet) console.log(_source, ' -> ', dest);
            try{
                fs.removeSync(dest); // delete existing symbolic links, if not, the original folder will be damaged
            } catch(err){console.error('removeSync', err);}
            try{
                fs.copySync(_source, dest, {dereference: true}); // copy and dereference -break symbolic link
            } catch(err){console.error('copySync', err);}
        }
    };
    var root = path.join(sourceRoot, dirName);

    var resp = walkDirsSync(root, walkDirCallbacks, {makeArr:false});

    console.log('----------------------------------------------');
    console.log('processed', resp, 'items');
    
    cb();
};