var request = require('request'),
	cheerio = require('cheerio'), 
	fs = require('fs'), 
	urls = [],
	dir = 'results/premier-league/';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var seasons = [
	{season : "2015-2016"},
	{season : "2014-2015"},
	{season : "2013-2014"},
	{season : "2012-2013"},
	{season : "2011-2012"},
	{season : "2010-2011"},
	{season : "2009-2010"},
	{season : "2008-2009"},
	{season : "2007-2008"},
	{season : "2006-2007"},
	{season : "2005-2006"},
	{season : "2004-2005"},
	{season : "2003-2004"},
	{season : "2002-2003"},
	{season : "2001-2002"},
	{season : "2000-2001"},
	{season : "1999-2000"},
	{season : "1998-1999"},
	{season : "1997-1998"},
	{season : "1996-1997"},
	{season : "1995-1996"},
	{season : "1994-1995"},
	{season : "1993-1994"},
	{season : "1992-1993"},
];

seasons.forEach(function(item) { 
	loop(item.season);
});

function loop(season){

	// Premier League Scraper
	request('http://www.premierleague.com/en-gb/matchday/league-table.html?season='+ season +'', function(err, resp, body){

		// Check if return okay
		if(!err && resp.statusCode == 200){
			var $ = cheerio.load(body),
				leagueTable = ('.leagueTable tbody tr'),
				leagueInformation = [];

			$('.club-row').each(function(i, element) {
				
				var info = theScraper(element);		

				leagueInformation.push(info);	

			});


			var fileInfo = JSON.stringify(leagueInformation);
			fs.writeFile(dir + season +".json", fileInfo, function(err) {
			    if(err) {
			        return console.log(err);
			    }

			});
		}

		function theScraper(leagueTableItem){

			var information = {};
		
			information.clubPosition = $(leagueTableItem).find('.col-pos').text();
			information.clubLastPosition = $(leagueTableItem).find('.col-lp').text();
			information.clubClubName = $(leagueTableItem).find('.col-club').text();
			information.clubGamesPlayed = $(leagueTableItem).find('.col-p').text();
			information.clubGamesWon = $(leagueTableItem).find('.col-w').text();
			information.clubGamesDraw = $(leagueTableItem).find('.col-d').text();
			information.clubGamesLoss = $(leagueTableItem).find('.col-l').text();
			information.clubGoalsFor = $(leagueTableItem).find('.col-gf').text();
			information.clubGoalsAgainst = $(leagueTableItem).find('.col-ga').text();
			information.clubGoalDifference = $(leagueTableItem).find('.col-gd').text();
			information.clubPoints = $(leagueTableItem).find('.col-gd').text();

			return information;
		}
	});

}