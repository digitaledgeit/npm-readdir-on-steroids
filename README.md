# readdir-on-steroids
Recursively reads the contents of a directory.

## Installation

	npm install readdir-on-steroids

## Methods

	readdir(directory, [options, [callback]])

## Options

 - listFilter: `function(path, stats)` - Filters the files/directories to be included in the list
 - walkFilter: `function(path, stats)` - Filters the directories to be read

Where:

 - path: `string` - The full path of the file or directory. If a relative root path was passed the path will remain relative to the root.
 - stats: `object` - The fs.Stat object with two additional properties:
	- root: `string` - The root directory passed to the readdir method
	- depth: `integer` - The depth of the current path

## Usage

	var readdir = require('readdir-on-steroids');

	var directory = '.';

	var options = {

		//only list files ending in '.js'
		listFilter: function(path, stats) {
			return (path.substr(-3) === '.js');
		},

		//don't look in the .git or node_modules folders (for performance sake)
		walkFilter: function(path, stats) {
			return path.indexOf('.idea') === -1 && path.indexOf('.git') === -1 && path.indexOf('node_modules') === -1;
		}

	};

	//log the list of files found to the console
	function callback(err, files) {
		if (err) throw err;
		console.log(files);
		console.log('done!');
	}

	readdir(directory, options, callback);

