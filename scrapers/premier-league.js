var request = require('request'),
	cheerio = require('cheerio'), 
	fs = require('fs'), 
	scrapeURL = 'http://www.sportsmole.co.uk/football/championship/table.html',
	urls = [],
	dir = 'results/premier-league/';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var seasons = [
	{season : "2015-2016"}
];

seasons.forEach(function(item) { 
	loop(item.season);
});

function loop(season){

	// Premier League Scraper
	request(scrapeURL, function(err, resp, body){

		// Check if return okay
		if(!err && resp.statusCode == 200){
			
			var $ = cheerio.load(body),
				leagueInformation = [];

			$('.leaguetableheader').remove();

			var teams = $('.leaguetable:first-child tr');

			teams.each(function(i, val){
				var info = theScraper(val);
				leagueInformation.push(info);	

			});

			var fileInfo = JSON.stringify(leagueInformation);
			fs.writeFile("321.json", fileInfo, function(err) {
			    if(err) {
			        return console.log(err);
			    }

			});

 			
		}

		function theScraper(val){
			// $ = cheerio.load(val);

			var information = {};
		
			information.positionID = $(val).find('.positiontd').eq(0).text();
			information.clubName = $(val).find('.teamtd a').eq(0).text();
			information.gamesPlayed = $(val).find('.numbertd').eq(0).text();
			information.homeWin = $(val).find('.hometd').eq(0).text();
			information.homeDraw = $(val).find('.hometd').eq(1).text();
			information.homeLost = $(val).find('.hometd').eq(2).text();
			information.homeGoalsFor = $(val).find('.hometd').eq(3).text();
			information.homeGoalsAgainst = $(val).find('.hometd').eq(4).text();

			information.awayWin = $(val).find('.awaytd').eq(0).text();
			information.awayDraw = $(val).find('.awaytd').eq(1).text();
			information.awayLost = $(val).find('.awaytd').eq(2).text();
			information.awayGoalsFor = $(val).find('.awaytd').eq(3).text();
			information.awayGoalsAgainst = $(val).find('.awaytd').eq(4).text();

			information.overallWin = $(val).find('.overalltd').eq(0).text();
			information.overallDraw = $(val).find('.overalltd').eq(1).text();
			information.overallLost = $(val).find('.overalltd').eq(2).text();
			information.overallGoalsFor = $(val).find('.overalltd').eq(3).text();
			information.overallGoalsAgainst = $(val).find('.overalltd').eq(4).text();

			information.goalDifference = $(val).find('.numbertd').eq(-1).text();
			information.points = $(val).find('.positiontd').eq(1).text();



			console.log(information);

			return information;
		}
	});

}