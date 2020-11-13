// a function for making an array from a rolled up object, sorting it and retrieving quantiles
const getStops = (obj, q, metric) => {

	let array = [];
	obj.forEach(function(entry) {
		array.push(entry.metric);
	});
	array = array.sort((a, b) => a-b);
	let pos = (array.length - 1) * q;
	let base = Math.floor(pos);
	let rest = pos - base;
	if (array[base + 1] !== undefined) {
		return array[base] + rest * (array[base + 1] - array[base]);
	} else {
		return array[base];
	}

}

const setFillStops = () => {
	fillStop1 = getStops(zipRoll, .2, Employees); //12
	fillStop2 = getStops(zipRoll, .4, Employees); //57
	fillStop3 = getStops(zipRoll, .6, Employees); //120
	fillStop4 = getStops(zipRoll, .8, Employees); //237
	fillStop5 = getStops(zipRoll, 1, Employees); //3658

	fillColor = ["interpolate",["linear"],["get",fillMetric],
					0, "hsla(0, 0%, 0%, 0)",
					1, "hsla(180, 100%, 92%, 0.6)",
					fillStop1, "hsla(180, 100%, 92%, 0.6)",
					fillStop2, "hsla(189, 62%, 78%, 0.6)",
					fillStop3, "hsla(195, 58%, 65%, 0.6)",
					fillStop4, "hsla(199, 57%, 52%, 0.6)",
					fillStop5, "hsla(199, 100%, 36%, 0.7)"
				];
}

const setPointStops = () => {
	pointStop1 = getStops(cityRoll, .2, Companies); //12
	pointStop2 = getStops(cityRoll, .4, Companies); //57
	pointStop3 = getStops(cityRoll, .6, Companies); //120
	pointStop4 = getStops(cityRoll, .8, Companies); //237
	pointStop5 = getStops(cityRoll, 1, Companies); //3658
	console.log(pointStop1,pointStop2,pointStop3,pointStop4,pointStop5);

	pointRadius = ["interpolate",["linear"],["get",pointMetric],
						0, 3,
						1, 5,
						pointStop1, 5,
						pointStop2, 10,
						pointStop3, 15,
						pointStop4, 25,
						pointStop5, 35
					];
}

const buildTable = (data) => {

	console.log(data);

	// if Datatable currently exists, then clear and kill it
	if ( $.fn.dataTable.isDataTable('#schoolsTable') ) {
		$('#pointsTable').DataTable().destroy();
	}

	// get list of headers
	let str = '<tr>';
	let headers = ['Date','Company','City','County','Employees'];
	headers.forEach(function(header) {
		str += '<th>' + header + '</th>';
	});
	str += '</tr>';
	$('#pointsTable thead').html(str);

	// create empty array to put all data in correct format into
	let arrAll = [];
	data.forEach(function(d) {
		let tempArray = [];
		let date = d.Date;
		let company = d.Company;
		let city = d.City;
		let county = d.County;
		let employees = d.Employees;
		tempArray.push(date, company, city, county, employees);
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