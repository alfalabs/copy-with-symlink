'use strict';
const fs = require('fs-extra');
const path = require('path');

module.exports = walkDirsSync;

/** walk directory recursively finding only files or folders matching condition
 *  and runs function onCondition to operate on a file or dir matching conditon
 * 
 * @param {String} rootDir - start folder
 * @param {Object} callbacks { 
 *                      condition(stat, lstat, dirItem) - REQUIRED function defining the condition criteria
 *                          examples:
 *                          condition: function(stat, lstat, dirItem){
                                return true; // all files and dirs
                                return stat.isDirectory(); // all dirs
                                return !stat.isDirectory() && dirItem.endsWith('.js'); // all javascript files
                                return stat.isDirectory() && lstat.isSymbolicLink(); // all dirs that are symlinks
                            },
 *                      onCondition(dirItem, _opts) - OPTIONAL function, do something with the dirItem
 *                  }
 * @param {Object} opts - {makeArr: default true} block folder array creation to save memory when only onCondition is needed
 * 
 * @param {} dirsArr - for internal recursive use
 * @param {} count - for internal recursive use
 * 
 * @returns {Array} array of folders matching condition or if makeArr:false, number of items matching condition
 */
function walkDirsSync(rootDir, callbacks, opts, dirsArr, count){
    if (!dirsArr) dirsArr = [];
    count = count || {count: 0}; // count has to be an object to be passed by reference recursively
    opts = opts || {makeArr:true};

    var dirs =  fs.readdirSync(rootDir);
    dirs.forEach(function(dirItem){
        dirItem = path.join(rootDir, dirItem);
        var stat = fs.statSync(dirItem);
        var lstat = fs.lstatSync(dirItem);

        if (callbacks.condition(stat, lstat, dirItem)) runOnCondition(dirItem, {stat, lstat});

        if (stat.isDirectory()) {walkDirsSync(dirItem, callbacks, opts, dirsArr, count);}
    });

    return opts.makeArr ? dirsArr : count.count;

    function runOnCondition(dirItem, _opts){
        count.count++;
        if(opts.makeArr) dirsArr.push(dirItem);
        if(typeof callbacks.onCondition==='function') callbacks.onCondition(dirItem, _opts);
    }
}