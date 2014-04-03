# readdir-on-steroids
Reads the contents of a directory.

## Installation

	npm install readdir-on-steroids

## Methods

	readdir(path, [options, [callback]])

## Options

 * `{integer}   [options.depth]                 How deep to read directory contents`
 * `{boolean}   [options.listDirectories]       Whether the directory paths should be listed too`
 * `{function}  [options.filter]                Filters which files should be listed`
 * `{boolean}   [options.filterDirectories]     Whether the filter should be applied to the directories too`

## Usage

	var readdir = require('readdir-on-steroids');

	var options = {

		//how deep should we go?
		depth: 2,

		//should we list the directory paths too?
		listDirectories: false,

		//should we filter the directories too?
		filterDirectories: false,

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
