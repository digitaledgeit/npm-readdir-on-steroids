var fs = require('fs');
var path = require('path');
var extend = require('extend');
var flatten = require('flatten');
var Promise = require("promise");

var fsStat = Promise.denodeify(fs.stat);
var fsReadDir = Promise.denodeify(fs.readdir);

var defaults = {
	maxDepth: undefined,
	recursive: false
};

/**
 * Reads the contents of a directory
 * @param   {string}    directory           The directory path
 * @param   {object}    [options]           The iteration options
 * @param   {function}  [options.recurse]   Whether to recursively iterator over the directory contents
 * @param   {function}  [options.filter]    A function to filter the directory contents
 * @return  {Promise}
 */
function readdirOnSteroids(directory, options) {
	return readdir(directory, options).then(function(files) {
		return flatten(files).filter(function(file) {
			return file !== null;
		});
	});
}

/**
 * @param   {string}    directory   The directory path
 * @param   {object}    [options]   The iteration options
 * @param   {object}    [depth]     The depth
 * @return  {Promise}
 */
function readdir(directory, options, depth) {
	depth = depth || 1;
	options = extend(defaults, options || {});

	return fsReadDir(directory).then(function(files) {
		return Promise.all(files.map(function(file) {
			var file = path.join(directory, file);

			return fsStat(file).then(function(stats) {

				if (stats.isDirectory()) {

					//recurse directories
					if (options.depth === undefined || options.depth > depth) {
						return readdir(file, options, depth+1);
					}

				} else if (typeof options.filter === 'function') {

					//filter files
					stats.depth = depth;
					if (options.filter(file, stats)) {
						return file;
					}

				} else {
					return file;
				}

				return null;
			});

		}));
	});

}

module.exports = Promise.nodeify(readdirOnSteroids);
