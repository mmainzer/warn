// fire getIso() when iso geocoder search is completed
isoGeocoder.on('result', function(ev) {
    // establish coordinates and split each element in the array
    coords = ev.result.geometry.coordinates;

    getIso(coords);

});

const getIso = (coords) => {

	checkLayers();

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
				'type':'line',
				'source':'iso',
				'layout': {
					'visibility':'visible'
				},
				paint: {
					'line-color':"#000",
	                'line-width':2,
	                'line-dasharray':[5,1.5]
				}
			}, 'fillLayer')
		}

	})

}