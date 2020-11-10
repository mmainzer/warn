// function to get data from github, shape and bind it to vector tiles

const warnUrl = 'https://raw.githubusercontent.com/mmainzer/warn/main/application/data/warnLogs.json?token=AD4K4PVKO3DLRJYVMVZD5WS7VKK4U';

function loadData() {
	console.log('getting data');
	
	d3.json(warnUrl)
		.then(function(data) {
			// Code from callback goes here
			console.log(data);
		})
		.catch(function(error) {
			console.log('There was an error getting the data');
		});
}