// this is a function that will build a table from the point layer data
// after it is brought in as a csv and before it is transformed into geojson

function buildTable(data) {
	// if Datatable currently exists, then clear and kill it
	if ( $.fn.dataTable.isDataTable('#schoolsTable') ) {
		$('#pointsTable').DataTable().destroy();
	}
	console.log(data);
	// get list of headers
	let str = '<tr>';
	let headers = ['Location','Street','City','ZIP','County'];
	headers.forEach(function(header) {
		str += '<th>' + header + '</th>';
	});
	str += '</tr>';
	$('#pointsTable thead').html(str);

	// create empty array to put all data in correct format into
	let arrAll = [];
	data.features.forEach(function(d) {
		let tempArray = [];
		let location = d.properties.Location;
		let street = d.properties.Street;
		let city = d.properties.City;
		let zip = d.properties.ZIP;
		let county = d.properties.County;
		tempArray.push(location, street, city, zip, county);
		arrAll.push(tempArray);
	});

	// build row and send to html table
	arrAll.forEach(function(rowData) {
		let row = document.createElement('tr');
		rowData.forEach(function(cellData) {
			let cell = document.createElement('td');
			cell.appendChild(document.createTextNode(cellData));
			row.appendChild(cell);
		});
		$("#pointsTable tbody").append(row);
	});

	$('#pointsTable').DataTable({
        "pageLength" : 5,
        "paging" : true,
        "searching" : false,
        "bInfo" : false,
        "autoWidth" : true,
        "dom" : "Bfrtip",
        "pagingType" : "full",
        "buttons" : [{
          extend : 'pdf',
          text : 'Export PDF',
          title : 'Locations in Selected Area'
        }],
        "colReorder" : false
    });

    // move the pagination element to a fixed position at the bottom of a container
    $("#pointsTable_paginate").appendTo(".graphic-container-table")
}