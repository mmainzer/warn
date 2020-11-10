$('.dropdown').select2({
    width: 'style'
});

let selectedLevel;

$('#geoLevelSelect').change(function() {
	console.log('level changed');
	selectedLevel = $("#select2-geoLevelSelect-container").get().map(el => el.textContent);
	console.log(selectedLevel);
	$('.geoSelect').not('.'+selectedLevel[0]).removeClass('active');
	$('.'+selectedLevel[0]).addClass('active');


});

// When the user moves their mouse over the state-fill layer, we'll update the
// feature state for the feature under the mouse.

let hoveredBoundary = null;

map.on('mousemove', 'fillLayer', function(e) {
	// Change the cursor style as a UI indicator.
	map.getCanvas().style.cursor = 'pointer';

	if (e.features.length > 0) {
		if (hoveredBoundary) {
			map.setFeatureState(
				{ source: 'fillSource', sourceLayer:'gazips', id: hoveredBoundary },
				{ hover: false }
			);
		}
		hoveredBoundary = e.features[0].id;
		console.log(hoveredBoundary);
		
		map.setFeatureState(
			{ source: 'fillSource', sourceLayer:'gazips', id: hoveredBoundary },
			{ hover: true }
		);
	}

	// let lngLat = e.lngLat;
	// let zip = '<h1 class="popup-header">'+e.features[0].properties.GEOID10+'</h1>';
	// let jobs = '<strong> '+e.features[0].properties['zipData_2020 Jobs']+' </strong>';
	// let html = zip+'<p class="popup-description">There are'+jobs+'relevant jobs in this zip code.</p>'
	// fillPopup
	// 	.setLngLat(lngLat)
	// 	.setHTML(html)
	// 	.addTo(map);

});

// When the mouse leaves the state-fill layer, update the feature state of the
// previously hovered feature. Also, remove popup and change cursor style

map.on('mouseleave', 'fillLayer', function() {
	// Change the cursor style as a UI indicator.
	map.getCanvas().style.cursor = 'grab';
	// fillPopup.remove();

	if (hoveredBoundary) {
		map.setFeatureState(
			{ source: 'fillSource', sourceLayer:'gazips', id: hoveredBoundary },
			{ hover: false }
		);
	}

	hoveredBoundary = null;
});

// when user clicks on a cluster, it zooms in to break apart cluster
// map.on("click", "clusteredPoints", function(e) {
// 	let features = map.queryRenderedFeatures(e.point, {
// 		layers:['clusteredPoints']
// 	});
// 	let clusterId = features[0].properties.cluster_id;
// 	map.getSource('points').getClusterExpansionZoom(
// 		clusterId,
// 		function(err, zoom) {
// 			if (err) return;

// 			map.easeTo({
// 				center: features[0].geometry.coordinates,
// 				zoom: zoom
// 			});
// 		}
// 	);
// });

// map.on("mousemove","unclusteredPoint", function(e) {
// 	fillPopup.remove();
// 	let lngLat = e.lngLat;
// 	let location = '<h1 class="popup-header">'+e.features[0].properties.Location+'</h1>';
// 	let addrOne = '<p class="popup-description">'+e.features[0].properties.Street+'</p>';
// 	let addrTwo = '<p class="popup-description">'+e.features[0].properties.City+', '+e.features[0].properties.State+' '+e.features[0].properties.ZIP+'</p>';
// 	let html = location+addrOne+addrTwo;
// 	pointPopup
// 		.setLngLat(lngLat)
// 		.setHTML(html)
// 		.addTo(map);
// });

// map.on("mouseleave","unclusteredPoint",function(e) {
// 	pointPopup.remove();
// });

// when reset icon is clicked, fly to the original center of map
$(".reset-map-icon").click(function() {
	map.flyTo({
		center: [-84.3712,33.7737],
		zoom:9.0
	});
});