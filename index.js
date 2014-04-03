var fs = require('fs');
var path = require('path');
var extend = require('extend');
var flatten = require('flatten');
var Promise = require('promise');

var fsStat = Promise.denodeify(fs.stat);
var fsReadDir = Promise.denodeify(fs.readdir);

//the default options
var defaults = {
	depth: undefined,
	listDirectories: false,
	filter: undefined,
	filterDirectories: false
};

/**
 * Reads the contents of a directory
 * @param   {string}    directory                       The directory path
 * @param   {object}    [options]                       The iteration options
 * @param   {integer}   [options.depth]                 How deep to read directory contents
 * @param   {boolean}   [options.listDirectories]       Whether the directory paths should be listed too
 * @param   {function}  [options.filter]                Filters which files should be listed
 * @param   {boolean}   [options.filterDirectories]     Whether the filter should be applied to the directories too
 * @return  {Promise}
 */
function readdirOnSteroids(directory, options) {
	return readdir(directory, options);
}

function readdir(directory, options, depth) {
	depth = depth || 1;
	options = extend(defaults, options || {});

	var contents = [];

	return fsReadDir(directory).then(function(files) {
		return Promise.all(files.map(function(file) {
			var file = path.join(directory, file);

			return fsStat(file).then(function(stats) {
				stats.depth = depth;

				if (stats.isDirectory()) {

					if (typeof options.filter === 'function' && options.filterDirectories) {

						//filter dirs
						if (options.filter(file, stats)) {

							//list dir
							if (options.listDirectories) {
								contents.push(file);
							}

							//recurse dirs
							if (options.depth === undefined || options.depth > depth) {
								return readdir(file, options, depth+1).then(function(files) {
									contents = contents.concat(files);
								});
							}

						}

					} else {

						//list dir
						if (options.listDirectories) {
							contents.push(file);
						}

						//recurse dirs
						if (options.depth === undefined || options.depth > depth) {
							return readdir(file, options, depth+1).then(function(files) {
								contents = contents.concat(files);
							});
						}

					}

				} else if (typeof options.filter === 'function') {

					//filter files
					if (options.filter(file, stats)) {

						//list file
						contents.push(file);

					}

				} else {

					//list file
					contents.push(file);

				}

			});

		})).then(function() {
			return contents;
		});
	});

}

module.exports = Promise.nodeify(readdirOnSteroids);
