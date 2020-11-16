// a function for making an array from a rolled up object, sorting it and retrieving quantiles
const getStops = (obj, q, metric) => {
	let array = [];
	obj.forEach(function(entry) {
		array.push(entry[metric]);
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
	fillStop1 = getStops(zipRoll, .2, "Employees");
	fillStop2 = getStops(zipRoll, .4, "Employees");
	fillStop3 = getStops(zipRoll, .6, "Employees"); 
	fillStop4 = getStops(zipRoll, .8, "Employees"); 
	fillStop5 = getStops(zipRoll, 1, "Employees");

	fillColor = ["interpolate",["linear"],["get",fillMetric],
					0, "hsla(0, 0%, 0%, 0)",
					1, "hsla(180, 100%, 92%, 0.6)",
					fillStop1, "hsla(180, 100%, 92%, 0.6)",
					fillStop2, "hsla(189, 62%, 78%, 0.6)",
					fillStop3, "hsla(195, 58%, 65%, 0.6)",
					fillStop4, "hsla(199, 57%, 52%, 0.6)",
					fillStop5, "hsla(199, 100%, 36%, 0.7)"
				];

	$("#minFill").text("<"+fillStop1.toFixed(0));
	$("#maxFill").text(">"+fillStop5.toFixed(0));


	if (fillStop1 === fillStop2) {
		fillStop1 = fillStop1 - .2;
	}

	if (fillStop2 === fillStop3) {
		fillStop2 = fillStop2 - .1;
	}

	if (fillStop4 === fillStop5 || fillStop4 === fillStop3) {
		fillStop5 = fillStop5 + .2;
		fillStop4 = fillStop4 + .1;
	}
}

const setPointStops = () => {
	console.log(cityRoll);
	pointStop1 = getStops(cityRoll, .2, "Companies"); //12
	pointStop2 = getStops(cityRoll, .4, "Companies"); //57
	pointStop3 = getStops(cityRoll, .6, "Companies"); //120
	pointStop4 = getStops(cityRoll, .8, "Companies"); //237
	pointStop5 = getStops(cityRoll, 1, "Companies"); //3658

	if (pointStop1 === pointStop2) {
		pointStop1 = pointStop1 - .2;
	}

	if (pointStop2 === pointStop3) {
		pointStop2 = pointStop2 - .1;
	}

	if (pointStop4 === pointStop5 || pointStop4 === pointStop3) {
		pointStop5 = pointStop5 + .2;
		pointStop4 = pointStop4 + .1;
	}

	pointRadius = ["interpolate",["linear"],["get",pointMetric],
						0, 3,
						0.1, 5,
						pointStop1, 5,
						pointStop2, 10,
						pointStop3, 15,
						pointStop4, 25,
						pointStop5, 35
					];

	console.log(pointStop1,pointStop2,pointStop3,pointStop4,pointStop5);
}

const buildTable = (data) => {

	// if Datatable currently exists, then clear and kill it
	if ( $.fn.dataTable.isDataTable('#pointsTable') ) {
		$('#pointsTable').DataTable().destroy();
	}
	$("#pointsTable_paginate").remove();
	// clear existing html from table
  	$("#pointsTable tbody").empty();

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

	$(".graphic-container-table").show();

	$('#pointsTable').DataTable({
        "pageLength" : 10,
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

const setStyle = () => {
	
	map.setFilter('boundaryLayer', ["all",["match",["get",selectedLevel[0]],selectedGeo, true, false]]);
	map.setFilter('fillLayer', ["all",["match",["get",selectedLevel[0]],selectedGeo, true, false]]);
	map.setFilter('pointLayer', ["all",["match",["get",selectedLevel[0]],selectedGeo, true, false]]);

	map.setPaintProperty('fillLayer', 'fill-color', fillColor);
	map.setPaintProperty('pointLayer', 'circle-radius', pointRadius );
}

const getData = () => {

	zipRoll = [];
	cityRoll = [];

	$.getJSON(warnUrl, function(data) {
		console.log(data);
		console.log(selectedLevel);
		console.log(selectedGeo);

		data = data.filter(d => { return d.Year === year[0] && d[selectedLevel[0]] === selectedGeo[0] });
		if (data.length == 0) {
			onFail();
		} else {
			$("#alertContainer").hide();
			buildTable(data);

			data.reduce(function(res, value) {
				if (!res[value.ZCTA]) {
					res[value.ZCTA] = { ZCTA: value.ZCTA, Employees: value.Employees };
					zipRoll.push(res[value.ZCTA])
				} else
				res[value.ZCTA].Employees += value.Employees;
				return res
			}, {});

			data.reduce(function(res, value) {
				if (!res[value.City]) {
					res[value.City] = { City: value.City, Companies: value.Companies };
					cityRoll.push(res[value.City])
				} else
				res[value.City].Companies += value.Companies
				return res
			});

			setFillStops();
			setPointStops();

			// now filter and style the layers
			setStyle();

			//get the new bounding box
			bbox = selectedGeo.map(id => dataObj[selectedLevel].find(({ area }) => area === id).bbox);

			// now fly to the bounding box of the newly selected area
			flyToBounds(bbox[0], 10, 10);

		}

		

	});

}

// a separate get data function to fire when using a radius or
// drivetime, since they need to be handled very differently
const getCustomData = (polygon, zips) => {

	$.getJSON(warnUrl, function(data) {
		console.log(zips);
		console.log(data);

		data = data.filter(d => { return d.Year === year[0] && zips.includes(d.ZCTA) });
		console.log(data);

		if (data.length == 0) {
			onFail();
		} else {
			$("#alertContainer").hide();
			buildTable(data);

			data.reduce(function(res, value) {
				if (!res[value.ZCTA]) {
					res[value.ZCTA] = { ZCTA: value.ZCTA, Employees: value.Employees };
					zipRoll.push(res[value.ZCTA])
				} else
				res[value.ZCTA].Employees += value.Employees;
				return res
			}, {});

			data.reduce(function(res, value) {
				if (!res[value.City]) {
					res[value.City] = { City: value.City, Companies: value.Companies };
					cityRoll.push(res[value.City])
				} else
				res[value.City].Companies += value.Companies
				return res
			});

			setFillStops();
			setPointStops();

			// now filter and style the layers
			map.setFilter('boundaryLayer', ["all",["match",["get","ZCTA"],zips, true, false]]);
			map.setFilter('fillLayer', ["all",["match",["get","ZCTA"],zips, true, false]]);
   			map.setFilter('pointLayer', ["all", ['within', polygon]]);

			map.setPaintProperty('fillLayer', 'fill-color', fillColor);
			map.setPaintProperty('pointLayer', 'circle-radius', pointRadius );

			// now fly to the bounding box of the newly selected area
			flyToBounds(bbox, 50, 50);

		}

	});

}