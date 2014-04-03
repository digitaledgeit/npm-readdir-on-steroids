# readdir-on-steroids
Reads the contents of a directory.

## Installation

	npm install readdir-on-steroids

## Method

	readdir(path, [options, [callback]])

## Options

 - `{integer} depth` - How many levels of directories to read.
 - `{function(file, stats)} filter` - A function to filter the directory contents.


## Usage

See `test/example.js` for example usage.