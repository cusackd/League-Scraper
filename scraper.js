var fs = require('fs'),
	dir = 'results';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}


// Premier League
// require('./scrapers/premier-league.js');

// Premier League
require('./scrapers/premier-league-sportsmole.js');

// Bundesliga
// require('./scrapers/bundesliga.js');