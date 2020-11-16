// fire the function when geocoder is used
bufferGeocoder.on('result', function(ev) {

  // establish coordinates and split each element in the array
  coords = ev.result.geometry.coordinates;
  
  getBuffer(coords);

});

const getBuffer = (coords) => {

	checkLayers();
  
  // create a source for the point from which a buffer will be created
	const bufferPoint = {
		'type': 'Feature',
		'geometry': {
			'type': 'Point',
			'coordinates':coords
		},
		'properties': {
			'name':'Buffer Point'
		}
	};

	 // create buffer feature collection with turf
    buffer = turf.buffer(bufferPoint, distance, {units:unit});
    const bufferFC = turf.featureCollection([buffer]);

    // set the buff source data to the return here
    map.getSource('buff').setData(buffer);

    bbox = turf.bbox(buffer);

    if(typeof buffLayer === 'undefined') {
        // add buffer layer
      	map.addLayer({
        	"id": "buffer",
        	"type": "line",
        	"source": 'buff',
        	"layout": {
          		'visibility' : 'visible'
        	},
        	paint: {
              'line-color':"#000",
              'line-width':2,
              'line-dasharray':[5,1.5]
            }
      	}, 'fillLayer');
    }

    // fetch the zip centroids in order to pass a geography to filter
    // the data and layers
    $.ajax({
    	method:'GET',
    	url:centroidUrl
    }).done(function(data) {
    	// get the array of points inside the buffer
    	const collected = turf.collect(bufferFC, data, 'geoid', 'geoid');
    	zips = collected.features[0].properties.geoid;

    	getCustomData(buffer, zips);

    });

    


}