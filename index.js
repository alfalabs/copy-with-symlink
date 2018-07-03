'use strict';
const fs = require('fs-extra');
const path = require('path');
const walkDirsSync = require('./walk-dirs-sync');

/**
 * 
 * @param {*} devSource - development folder where original node_modules with symlinks are
 * @param {*} destination - build folder where install alreday made node_moduled folder with symlinks still pointing to dev
 * @param {*} opts {
 *                  quiet:true, do not show progress in console
 *                  all: false by default - do not include devDependencies, if true all dependencies will be copied
 *             }
 * @param {*} cb for gulp task
 */
module.exports = function(devSource, destination, opts, cb){
    opts = opts || {};

    var devDependencies = require('./package.json').devDependencies;
    devDependencies = devDependencies || {};

    if (!devSource.toLowerCase().endsWith('node_modules')) {devSource = path.join(devSource, 'node_modules');}

    if (fs.existsSync(path.join(destination, 'node_modules'))) {
        console.log('\x1b[31m ERROR:');
        console.error('node_modules can not exist in destination!', path.join(destination, 'node_modules') ); 
        console.log('\x1b[0m');
        throw (`node_modules can not exist in destination! '${destination}'`);
    }
    // NO! if (!destination.toLowerCase().endsWith('node_modules')) {destination = path.join(destination, 'node_modules');}

   

    var walkDirCallbacks = {

        condition: function(stat, lstat, dirItem){

            // process only folders in dependencies do not include devDependencies
            if (stat.isDirectory()){
                if (opts.all) return true;
                var dirItemName = path.parse(dirItem).name;
                if (devDependencies[dirItemName]) return false;
                return true;
            } 
            return false;

            // return true;
            // return stat.isDirectory();
            // return stat.isDirectory() && lstat.isSymbolicLink(); // all dirs that are symlinks
        },
        onCondition: function(dirItem, _opts){
    
            // console.log(dirItem); return;
    
            /*  copying over existing symbolic link dirs damages original folder!
                copy with dereference works only on fresh folder
                when copying to folder with sym links deleted, dereference does not work !?
                RIDICOLOUS WORKAROUND:
                copy with derefenece to TEMP and then cpu to dest
            */
            
            var dirItemName = path.parse(dirItem).name;

            
        
            var source = dirItem;
            var dest = path.join(destination, dirItem);

            // var tempDest = path.join('TEMP', dirItemName);
        
            if(!opts.quiet) console.log(source, ' -> ', dest);

            try{
                fs.removeSync(dest); // delete existing symbolic links, if not, the original folder will be damaged
            } catch(err){console.error('removeSync', err);}
            try{
                fs.copySync(source, dest, {dereference: true}); // copy and dereference -break symbolic link
            } catch(err){console.error('copySync', err);}
    
            // return;
            // // workaround:
            // try{
            //     fs.copySync(source, tempDest, {dereference: true}); // copy and dereference -break symbolic link
            // } catch(err){console.error('copySync', err);}
    
            // try{
            //     fs.copySync(tempDest, dest); // copy and dereference -break symbolic link
            // } catch(err){console.error('copySync', err);}
    
        }
    };

    var resp = walkDirsSync(devSource, walkDirCallbacks, {makeArr:false});

    console.log('----------------------------------------------');
    console.log('processed', resp, 'items');
    
    cb();
};