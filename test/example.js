var readdir = require('../index');

var directory = process.argv[2] || process.cwd();

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
