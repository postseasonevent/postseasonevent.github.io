(() => {
var hash = location.hash.substr(1);
var TOKENS = {};
for (let v of hash.split('&')) {
	let s = v.split('=');
	TOKENS[s[0]] = (s.length > 1) ? s[1] : undefined;
}
const drivers = document.getElementById('page_DRIVERS')
const tb = document.getElementById('fullstandings')
const podium = [
	document.getElementById('standings_podium_first'),
	document.getElementById('standings_podium_second'),
	document.getElementById('standings_podium_third')
]
var currentData = []
function hasChanged(teams) {
	if (teams.length != currentData.length)
		return true
	
	for (let i in teams) {
		let n = teams[i]
		let o = currentData[i]
		for (let k in n) 
			if (n[k] != o[k])
				return true
	}
	
	return false
}
function getStanding(team, pos) {
	// standings_null_last_position
	// standings_top_last_position
	// standings_down_last_position
	let tr = document.createElement('tr')
	tr.className = '2.00000000'
	tr.innerHTML = `
		<td class="position_column">
			<div class="div_load_scroll_page_DRIVERS" id="standings_position">${pos}</div>
			<div id="standings_last_position">
				<a class="standings_null_last_position"></a>
			</div>
		</td>
		<td class="podium_driver_column"><img class="standings_cars" src="https://www.trackmania-formula-league.com/images/drivers/cars/countries/${team.flag}.png" alt=""></td>
		<td class="cell_pseudo_standing"><img class="standings_flag" src="https://www.trackmania-formula-league.com/images/countries/${team.flag}.png" alt="">
			<a>${team.name}</a>
		</td>
		<td class="cell_team_column"></td>
		<td class="standings_points">${team.pts}</td>
	`
	return tr
}
function renderTable(teams) {
	for (let n in teams) {
		let t = teams[n]
		if (n < podium.length) {
			try {
				let p = podium[n]
				let car = p.getElementsByClassName('standings_podium_cars')[0]
				car.src = "https://www.trackmania-formula-league.com/images/drivers/cars/countries/" + t.flag + ".png";
				let flag = p.getElementsByClassName('standings_podium_flag')[0]
				flag.src = "https://www.trackmania-formula-league.com/images/countries/" + t.flag + ".png";
				flag.parentNode.nextSibling.innerText = t.pts + ' pts'
				flag.nextSibling.innerText = t.name
			} catch { }
		} else {
			let p = Number(n)+1
			tb.innerHTML = ""
			tb.appendChild(getStanding(t, p))
		}
	}
	currentData = teams
}
function handleSheet(sheet) {
	if (sheet.values != undefined) {
		let teams = []
		for (let v of sheet.values) {
			teams.push(
				{
					'name': v[0],
					'pts': v[1],
					'flag': v[2]					
				}
			)
		}
		teams.sort((a,b) => b.pts - a.pts);
		if (hasChanged(teams))
			renderTable(teams)
	}
}
if (TOKENS.sheet != undefined && TOKENS.key != undefined) {
	const url = 'https://sheets.googleapis.com/v4/spreadsheets/' + TOKENS.sheet + '/values/Podium!A1:C100?key=' + TOKENS.key
	const requestStandings = () =>  {
		fetch(url)
			.then(response => response.json())
			.then(data => handleSheet(data));
	}
	window.standings = setInterval(requestStandings, 5000); // request every 5s
	requestStandings()
} else {
	console.log("Missing sheet")
}
})()
