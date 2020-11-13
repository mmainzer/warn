// function to get data from github, shape and bind it to vector tiles

// a function for making an array from a rolled up object, sorting it and retrieving quantiles
const getStops = (obj, q) => {

	let array = [];
	obj.forEach(function(entry) {
		array.push(entry.Employees);
	});
	array = array.sort((a, b) => a-b);
	let pos = (array.length - 1) * q;
	let base = Math.floor(pos);
	let rest = pos - base;
	if (array[base + 1] !== undefined) {
		return array[base] + rest * (array[base + 1] - array[base]);
	} else {
		return array[base];
	}

}

const setFillStops = () => {
	fillStop1 = getStops(zipRoll, .2); //12
	fillStop2 = getStops(zipRoll, .4); //57
	fillStop3 = getStops(zipRoll, .6); //120
	fillStop4 = getStops(zipRoll, .8); //237
	fillStop5 = getStops(zipRoll, 1); //3658

	fillColor = ["interpolate",["linear"],["get",layersMetric],
					0, "hsla(0, 0%, 0%, 0)",
					1, "hsla(180, 100%, 92%, 0.6)",
					fillStop1, "hsla(180, 100%, 92%, 0.6)",
					fillStop2, "hsla(189, 62%, 78%, 0.6)",
					fillStop3, "hsla(195, 58%, 65%, 0.6)",
					fillStop4, "hsla(199, 57%, 52%, 0.6)",
					fillStop5, "hsla(199, 100%, 36%, 0.7)"
				];
}

const setPointStops = () => {
	pointStop1 = getStops(cityRoll, .2); //12
	pointStop2 = getStops(cityRoll, .4); //57
	pointStop3 = getStops(cityRoll, .6); //120
	pointStop4 = getStops(cityRoll, .8); //237
	pointStop5 = getStops(cityRoll, 1); //3658
	console.log(pointStop1,pointStop2,pointStop3,pointStop4,pointStop5);

	pointRadius = ["interpolate",["linear"],["get",layersMetric],
						0, 3,
						1, 5,
						pointStop1, 5,
						pointStop2, 10,
						pointStop3, 15,
						pointStop4, 25,
						pointStop5, 35
					];
}

// initial function to filter and style layers
// never accessed agagin after page load
function loadMapData(zipRoll, cityRoll) {

	$.getJSON(warnUrl, function(data) {

		console.log(data);
		data = data.filter(datum => (datum.Year === year[0]) & (datum.CDRegion === selectedGeo[0]));
		console.log(data);
		data.reduce(function(res, value) {
			if (!res[value.ZCTA]) {
				res[value.ZCTA] = { ZCTA: value.ZCTA, Employees: value.Employees };
				zipRoll.push(res[value.ZCTA])
			} else
			res[value.ZCTA].Employees += value.Employees;
			return res
		}, {});

		data.reduce(function(res, value) {
			if (!res[value.City]) {
				res[value.City] = { City: value.City, Employees: value.Employees };
				cityRoll.push(res[value.City])
			} else
			res[value.City].Employees += value.Employees
			return res
		});

		console.log(zipRoll);
		console.log(cityRoll)
		console.log(data);

		setFillStops();
		setPointStops();


		map.addLayer({
			'id':'boundaryLayer',
			'type':'line',
			'source':'fillSource',
			'layout': {
	          'visibility':'visible',
	        },
	        'filter': ["all",["match",["get",selectedLevel[0]],selectedGeo, true, false]],
	        'paint': {
	        	'line-color':['case',['boolean',['feature-state','hover'],false],"#333","#333"],
	        	'line-width':['case',['boolean',['feature-state','hover'],false],2.5,0.25]
	        },
	        'source-layer':'gaZips'
		}, 'admin-0-boundary-disputed')

		map.addLayer({
			'id':'fillLayer',
			'type':'fill',
			'source':'fillSource',
			'layout': {
	          'visibility':'visible',
	        },
	        'filter': ["all",["match",["get","CDRegion"],["Metro South"], true, false]],
	        'paint': {
	        	'fill-color': fillColor
	        },
	        'source-layer':'gaZips'
		}, 'boundaryLayer');

		map.addLayer({
			'id':'pointLayer',
			'type':'circle',
			'source':'pointSource',
			'layout':{
				'visibility':'visible'
			},
			'filter': ["all",["match",["get",selectedLevel[0]],selectedGeo, true, false]],
			'paint': {
	        	'circle-color':"hsla(0, 0%, 30%, 0.6)",
	        	'circle-stroke-color':'#000000',
	        	'circle-stroke-width':0.25,
	        	'circle-radius': pointRadius
	        },
	        'source-layer':'warnCitiesFinal-c7hhr2'
		});

	});
}