var request = require('request'),
	cheerio = require('cheerio'), 
	fs = require('fs'), 
	scrapeURL = 'http://www.sportsmole.co.uk/football/championship/table.html',
	urls = [],
	dir = 'results/premier-league/';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var leagues = [
	{name: 'premier-league',  url : "http://www.sportsmole.co.uk/football/premier-league/table.html"},
	{name: 'championship',  url : "http://www.sportsmole.co.uk/football/championship/table.html"},
	{name: 'league-one',  url : "http://www.sportsmole.co.uk/football/league-one/table.html"},
	{name: 'league-two',  url : "http://www.sportsmole.co.uk/football/league-two/table.html"},
	{name: 'league-two',  url : "http://www.sportsmole.co.uk/football/national-league/table.html"},
];

leagues.forEach(function(league) { 
	loop(league);
});

function loop(league){

	// Premier League Scraper
	request(league.url, function(err, resp, body){

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
			fs.writeFile(dir + league.name + ".json", fileInfo, function(err) {
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



			// console.log(information);

			return information;
		}
	});

}