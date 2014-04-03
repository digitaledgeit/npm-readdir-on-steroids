var readdir = require('../index.js');

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
