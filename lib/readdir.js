var fs = require('fs');
var path = require('path');
var Promise = require('promise');

var fsStat = Promise.denodeify(fs.stat);
var fsReadDir = Promise.denodeify(fs.readdir);

/**
 * Recursively reads the contents of a directory.
 * @param   {string}                    directory               The directory
 * @param   {object}                    [options]               The options
 * @param   {function(path, stats)}     [options.listFilter]    Filters the files/directories to be included in the list
 * @param   {function(path, stats)}     [options.walkFilter]    Filters the directories to be read
 * @returns {Promise}
 */
function readdir(directory, options) {

	if (typeof directory !== 'string') {
		throw new Error('Directory path invalid.');
	}

	return _readdir(directory, options || {}, {
		root: directory,
		depth: 1
	});
}

/**
 * Recursively reads the contents of a directory.
 * @param   {string}                    directory               The directory
 * @param   {object}                    options                 The options
 * @param   {function(path, stats)}     options.listFilter      Filters the files/directories to be included in the list
 * @param   {function(path, stats)}     options.walkFilter      Filters the directories to be read
 * @param   {object}                    env                     The environment info
 * @param   {string}                    env.root                The first directory read
 * @param   {integer}                   env.depth               The current depth relative to the root
 * @returns {Promise}
 */
function _readdir(directory, options, env) {
	var list = [];

	return fsReadDir(directory).then(function(files) {
		return Promise.all(files.map(function(file) {
			var file = path.join(directory, file);

			return fsStat(file).then(function(stats) {
				stats.root = env.root
				stats.depth = env.depth;

				if (typeof options.listFilter === 'function') {

					//listFilter files
					if (options.listFilter(file, stats)) {

						//list file
						list.push(file);

					}

				} else {

					//list file
					list.push(file);

				}

				if (stats.isDirectory()) {

					if (typeof options.walkFilter === 'function') {

						//filter files
						if (options.walkFilter(file, stats)) {

							//recurse dirs
							return _readdir(file, options, {
								root: env.root,
								depth: env.depth+1
							}).then(function(files) {
								list = list.concat(files);
							});

						}

					} else {

						//recurse dirs
						return _readdir(file, options, {
							root: env.root,
							depth: env.depth+1
						}).then(function(files) {
							list = list.concat(files);
						});

					}

				}

			});

		})).then(function() {
			return list;
		});
	});

}

module.exports = readdir;
