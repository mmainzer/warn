$('.dropdown').select2({
    width: 'style'
});

$('#geoLevelSelect').change(function() {


	selectedLevel = $("#select2-geoLevelSelect-container").get().map(el => el.textContent);
	$('.geoSelect').not('.'+selectedLevel[0]).removeClass('active');
	$('.'+selectedLevel[0]).addClass('active');

	selectedGeo = [ $("#"+selectedLevel[0]+" option:selected").text() ];
	
	if (selectedLevel[0] === "CDRegion" || selectedLevel[0] === "County" || selectedLevel[0] ==="MSA") {
		getData();
	}

});


// fire when the specific geography is changed
$('.geoDropdown').change(function() {
	
	selectedGeo = [ $("#"+selectedLevel[0]+" option:selected").text() ];
	
	getData();

});

$('#yearSelect').change(function() {

	year = $("#select2-yearSelect-container").get().map(el => el.textContent);
	fillMetric = "Employees"+year[0];
	pointMetric = "Companies"+year[0];

	if (selectedLevel[0] === "radius" || selectedLevel[0] === "drivetime") {
		console.log(selectedLevel);
		console.log(fillMetric);
		console.log(pointMetric);
		console.log(zips);

			$.getJSON(warnUrl, function(data) {

				data = data.filter(d => { return d.Year === year[0] && zips.includes(d.ZCTA) });

				if (data.length == 0) {
					onFail();
				} else {
					$("#alertContainer").hide();
					buildTable(data);

					customGeoReduce(data);

					setFillStops();
					setPointStops();

					setStyleCustomGeo(buffer);

				}

			});

	} else {
		getData();
	}

});

// function to fire if no data present in selected options
const onFail = () => {

	map.setFilter('boundaryLayer', ["all",["match",["get",selectedLevel[0]],"Empty", true, false]]);
	map.setFilter('fillLayer', ["all",["match",["get",selectedLevel[0]],"Empty", true, false]]);
	map.setFilter('pointLayer', ["all",["match",["get",selectedLevel[0]],"Empty", true, false]]);

	$(".graphic-container-table").hide();
	$("#alertContainer").show();



}

// function to check if custom layers exist or not
const checkLayers = () => {
  let isoLayer = map.getLayer('isoLayer');
  let buffLayer = map.getLayer('buffer');

  if(typeof isoLayer !== 'undefined') {
    // clear the map on result if layer exists
    map.removeLayer('isoLayer');
  }

  if(typeof buffLayer !== 'undefined') {
    // clear the map on result if layer exists
    map.removeLayer('buffer');
  }

}

// function to change the mileage for the radius selection
$('#radius').change(function() {

	distance = $("#select2-radius-container").get().map(el => el.textContent);
	distance = distance[0].split(' ');
	distance = distance[1];
	distance = parseInt(distance);
	


});