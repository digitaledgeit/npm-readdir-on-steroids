var readdir = require('../index.js');

var options = {

	//how deep should we go?
	depth: 2,

	//should we list the directory paths too?
	listDirectories: true,

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
	console.log('done!');
}

readdir(process.argv[2], options, log);
