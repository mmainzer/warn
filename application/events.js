$('.dropdown').select2({
    width: 'style'
});

$('#geoLevelSelect').change(function() {
	console.log('level changed');
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
	console.log('geography changed');
	
	selectedGeo = [ $("#"+selectedLevel[0]+" option:selected").text() ];
	
	console.log(selectedGeo);

	getData();

});

$('#yearSelect').change(function() {
	console.log("Year has been changed!");
	year = $("#select2-yearSelect-container").get().map(el => el.textContent);
	fillMetric = "Employees"+year[0];
	pointMetric = "Companies"+year[0];
	console.log(year, fillMetric, pointMetric);

	getData();

});

// function to fire if no data present in selected options
const onFail = () => {

	map.setFilter('boundaryLayer', ["all",["match",["get",selectedLevel[0]],"Empty", true, false]]);
	map.setFilter('fillLayer', ["all",["match",["get",selectedLevel[0]],"Empty", true, false]]);
	map.setFilter('pointLayer', ["all",["match",["get",selectedLevel[0]],"Empty", true, false]]);

	$(".graphic-container-table").hide();
	$("#alertContainer").show();



}

// function to change the mileage for the radius selection
$('#radius').change(function() {
	console.log("Radius has been changed!");
	distance = $("#select2-radius-container").get().map(el => el.textContent);
	distance = distance[0].split(' ');
	distance = distance[1];
	distance = parseInt(distance);
	


});