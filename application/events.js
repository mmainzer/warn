$('.dropdown').select2({
    width: 'style'
});

$('#geoLevelSelect').change(function() {
	console.log('level changed');
	selectedLevel = $("#select2-geoLevelSelect-container").get().map(el => el.textContent);
	console.log(selectedLevel);
	$('.geoSelect').not('.'+selectedLevel[0]).removeClass('active');
	$('.'+selectedLevel[0]).addClass('active');

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