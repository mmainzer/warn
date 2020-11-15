// function to fly to a new feature after certain events are fired
const flyToBounds = () => {
	let bbox = selectedGeo.map(id => dataObj[selectedLevel].find(({ area }) => area === id).bbox);

    map.fitBounds(bbox[0], {
      padding : {left: 10, right: 10}
    });
}

// when reset icon is clicked, fly to the original center of map
$(".reset-map-icon").click(function() {
	
	flyToBounds();

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
	let zip = '<h1 class="popup-header">'+e.features[0].properties.ZCTA+'</h1>';
	let employees = '<strong> '+e.features[0].properties[fillMetric]+' </strong>';
	let html = zip+'<p class="popup-description">There were at least '+employees+' employees laid off by reporting businesses.</p>'
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
	let city = '<h1 class="popup-header">'+e.features[0].properties.City+'</h1>';
	let companies = '<strong> '+e.features[0].properties[pointMetric]+' </strong>';
	let html = city+'<p class="popup-description">There were at least '+companies+' companies that experienced layoffs.</p>'
	pointPopup
		.setLngLat(lngLat)
		.setHTML(html)
		.addTo(map);
});

map.on("mouseleave","pointLayer",function(e) {
	pointPopup.remove();
});