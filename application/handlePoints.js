// this is to be used if a point file needs integration
// mapbox has a handy tool called sheetmapper to easily upload a csv of points
// to google sheets and read that in as a tileset
// this will be more manageable that creating tilesets in studio the way we need to with polygons

// *** while it leverages Google Sheets it cna really be a csv file stored anywhere ***

// tutorial for basic integration is here: https://labs.tilestream.net/education/impact-tools/sheet-mapper/

// if a need arises for a more advanced solution with a large number of points
// that are always updating, there is a way to leverage AWS w/ lambda functions
// to handle this process
// Advanced Tutorial: https://www.mapbox.com/impact-tools/sheet-mapper-advanced-caching

// link starter: https://docs.google.com/spreadsheets/d/{key}/gviz/tq?tqx=out:csv&sheet={sheetname}

let pointsUrl = 'https://docs.google.com/spreadsheets/d/';
// this is the googl sheet id and sheet name
const key = '1uHrcGdc2Ka0PWgSN9rpfXJiy7e__51ifnLaX0h5d7zg';
const sheet = 'Sheet1';
pointsurl = pointsUrl+key+'/gviz/tq?tqx=out:csv&sheet='+sheet;

// function that will connect to points file, convert to geojson,
// create a layer that can be accessed and edited if necessary

function initPoints() {

	$.ajax({
        type: "GET",
        // YOUR TURN: Replace 'url' value to CSV export link 
        url: pointsurl, 
        dataType: "text",
        success: function(data){
        	// use addPoints if just looking to see the points
        	// addPoints(data);
        	// use addClusteredPoints if needing to cluster many points close together
        	addClusteredPoints(data);
        }

      });

}

function addPoints(data) {
	csv2geojson.csv2geojson(data, {
		latfield: 'Latitude',
		lonfield: 'Longitude',
		delimeter: ','
	}, function (err, data) {
		map.addLayer({
			'id':'unclusteredPoint',
			'type':'circle',
			'source':{
				'type':'geojson',
				'data':data
			},
			'paint':{
				'circle-radius': 5,
				'circle-color': "purple"
			}
		});
	})
}

function addClusteredPoints(data) {
	csv2geojson.csv2geojson(data, {
		latfield: 'Latitude',
		lonfield: 'Longitude',
		delimeter: ','
	}, function (err, data) {
		buildTable(data);
		map.addSource('points', {
			type:'geojson',
			data:data,
			cluster:true,
			clusterMaxZoom: 14, //will need to change this based on project
			clusterRadius: 40 // can change cluster radius when clustering points
		});

		// add cluster layer from source
		map.addLayer({
			id:'clusteredPoints',
			type:'circle',
			source:'points',
			filter:['has','point_count'],
			paint:{
				'circle-color':'#fff',
				'circle-stroke-width': 1,
				'circle-stroke-color': '#4d4d4d',
				'circle-opacity':0.5,
				'circle-radius':['step',['get','point_count'],20,3,30,4,40,5,50]
			}
		});
		// add a number to display in middle of cluster for count of points
		map.addLayer({
			id: 'clusterCount',
			type: 'symbol',
			source: 'points',
			filter: ['has', 'point_count'],
			layout: {
				'text-field': '{point_count_abbreviated}',
				'text-font': ['Bernina Sans Regular', 'Arial Unicode MS Bold'],
				'text-size': 12
			}
		});
		// add layer for points when circles are zoomed in
		map.addLayer({
			id: 'unclusteredPoint',
			type: 'circle',
			source: 'points',
			filter: ['!', ['has', 'point_count']],
			paint: {
				'circle-color': '#fdb714',
				'circle-radius': 5,
				'circle-stroke-width': 1,
				'circle-stroke-color': '#4d4d4d'
			}
		});
	})
}