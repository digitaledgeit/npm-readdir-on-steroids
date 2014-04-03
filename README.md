# readdir-on-steroids
Reads the contents of a directory.

## Installation

	npm install readdir-on-steroids

## Methods

	readdir(path, [options, [callback]])

## Options

 - `{integer} depth` - How many levels of directories to read.
 - `{function(file, stats)} filter` - A function to filter the directory contents.


## Usage

	var readdir = require('readdir-on-steroids');

	var options = {

		//only read two directories down
		depth: 2,

		//filter files ending in '.js'
		filter: function(file, stats) {
			return file.substr(-3, 3) === '.js';
		}

	};

	//log the list of files to the console
	function log(err, files) {
		if (err) throw err;
		console.log(files);
	}

	readdir(process.argv[2], options, log);
