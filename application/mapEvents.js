// function to fly to a new feature after certain events are fired
const flyToBounds = (bbox, left, right) => {
		
	map.fitBounds(bbox, {
      padding : {left: left, right: right}
    });

}

// when reset icon is clicked, fly to the original center of map
$(".reset-map-icon").click(function() {
	
	flyToBounds(bbox, 10, 10);

});

// When the user moves their mouse over the state-fill layer, we'll update the
// feature state for the feature under the mouse.

map.on('mousemove', 'fillLayer', function(e) {
	// Change the cursor style as a UI indicator.
	map.getCanvas().style.cursor = 'pointer';

	if (e.features.length > 0) {
		if (hoveredBoundary) {
			map.setFeatureState(
				{ source: 'fillSource', sourceLayer:'gaZips', id: hoveredBoundary },
				{ hover: false }
			);
		}
		hoveredBoundary = e.features[0].id;
		
		map.setFeatureState(
			{ source: 'fillSource', sourceLayer:'gaZips', id: hoveredBoundary },
			{ hover: true }
		);
	}

	let lngLat = e.lngLat;
	let zip = [ e.features[0].properties.ZCTA ];
	let employees = zipRoll.filter(x => x.ZCTA === zip[0]).map(x => x.Employees);
	if (employees.length === 0) {
		employees.push(0)
	}
	zip = '<h1 class="popup-header">'+zip[0]+'</h1>';
	employees = '<strong> '+employees+' </strong>';
	let html = zip+'<p class="popup-description">There were at least '+employees+' employees laid off by reporting businesses in the selected time period.</p>'
	fillPopup
		.setLngLat(lngLat)
		.setHTML(html)
		.addTo(map);

});

// When the mouse leaves the state-fill layer, update the feature state of the
// previously hovered feature. Also, remove popup and change cursor style

map.on('mouseleave', 'fillLayer', function() {
	// Change the cursor style as a UI indicator.
	map.getCanvas().style.cursor = 'grab';
	fillPopup.remove();

	if (hoveredBoundary) {
		map.setFeatureState(
			{ source: 'fillSource', sourceLayer:'gaZips', id: hoveredBoundary },
			{ hover: false }
		);
	}

	hoveredBoundary = null;
});

// mouse events over points
map.on("mousemove","pointLayer", function(e) {
	fillPopup.remove();
	let lngLat = e.lngLat;
	let city = e.features[0].properties.City;
	let companies = cityRoll.filter(x => x.City === city).map(x => x.Companies);
	if (companies.length === 0) {
		companies.push(0)
	}
	city = '<h1 class="popup-header">'+city+'</h1>';
	companies = '<strong> '+companies+' </strong>';
	let html = city+'<p class="popup-description">There were at least '+companies+' companies that experienced layoffs in the selected time period.</p>'
	pointPopup
		.setLngLat(lngLat)
		.setHTML(html)
		.addTo(map);
});

map.on("mouseleave","pointLayer",function(e) {
	pointPopup.remove();
});