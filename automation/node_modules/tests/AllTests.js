/**
 @brief      File auto importer
 @file       _import.js
 @author     Jack Cole jcole2@mail.sfsu.edu
 @date       2018-01-08
 @details    This script automatically imports all javascript files in it's directory.
 It will return a dictionary with the file names (without their extensions) as the index, and the imports as values.
 Files can be ignored by using the IGNORED_NAMES constant.

 */

let glob = require('glob');
let path = require('path');

// These file names will be skipped
// path.parse(__filename).name is this file
const IGNORED_NAMES = [path.parse(__filename).name, "Test","Interactions","Mixins","Undo_Redo_mixin"];

// The location to import from.
// __dirname is the location of this file.
const IMPORT_LOCATION = __dirname + "/*.js";

// Searches the ACTIONS_LOCATION directory for files (.js), and imports them into an object with their file names
// as the index. Ignores files matching IGNORED_NAMES.
let files = {};
glob.sync(IMPORT_LOCATION).forEach(function (file) {
  let imported_file = require(path.resolve(file));
  let className = path.parse(file).name;
  if (!IGNORED_NAMES.includes(className)) {
    files[className] = imported_file;
  }
});

// Export the imported files
module.exports = files;
