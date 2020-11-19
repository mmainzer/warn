// function to get data from github, shape and bind it to vector tiles



// initial function to filter and style layers
// never accessed agagin after page load
function loadData(zipRoll, cityRoll) {

	$.getJSON(warnUrl, function(data) {

		getYears();

		data = data.filter(d => { return years.includes(d.Year) && d[selectedLevel[0]] === selectedGeo[0] });
		buildTable(data);
		// buildBarChart(data);

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
				res[value.City] = { City: value.City, Companies: value.Companies };
				cityRoll.push(res[value.City])
			} else
			res[value.City].Companies += value.Companies
			return res
		});

		buildMetrics();
		setFillStops();

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
	        'filter': ["all",["match",["get",selectedLevel[0]],selectedGeo, true, false]],
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

		boundaryLayer = map.getLayer('boundaryLayer');
		fillLayer = map.getLayer('fillLayer');
		pointLayer = map.getLayer('pointLayer');

		bbox = selectedGeo.map(id => dataObj[selectedLevel].find(({ area }) => area === id).bbox);
		bbox = bbox[0];

	});
}