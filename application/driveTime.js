// fire getIso() when iso geocoder search is completed
isoGeocoder.on('result', function(ev) {
    // establish coordinates and split each element in the array
    coords = ev.result.geometry.coordinates;

    getIso(coords);

});

const getIso = (coords) => {

	checkLayers();

	console.log(coords);
	console.log(minutes);
	
	const url = isoUrlBase + coords + '?contours_minutes='+ minutes + '&polygons=true&access_token=' + mapboxgl.accessToken;

	$.ajax({
		method:'GET',
		url:url
	}).done(function(isochrone) {
		map.getSource('iso').setData(isochrone);
		bbox = turf.bbox(isochrone);

		if (typeof isoLayer === 'undefined') {
			map.addLayer({
				'id':'isoLayer',
				'type':'fill',
				'source':'iso',
				'layout': {
					'visibility':'visible'
				},
				paint: {
					'fill-color':"#4d4d4d",
	              	'fill-opacity':0.1
				}
			}, 'fillLayer')
		}

		$.ajax({
			method:'GET',
			url:centroidUrl
		}).done(function(data) {
			const collected = turf.collect(isochrone, data, 'geoid', 'geoid');
			zips = collected.features[0].properties.geoid;

			getCustomData(isochrone, zips);

		});

	});

}