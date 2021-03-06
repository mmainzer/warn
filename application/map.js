

const map = new mapboxgl.Map({
	container: 'map', // container id
	style: 'mapbox://styles/gpcecondev/ckfgusueg0dcb19oy9vf3oudn',
	center: [-84.5742,33.4331], // starting position [lng, lat]
	zoom: 8.8, // starting zoom
	scrollZoom: true
});



let currentZoom = map.getZoom();

// Create a popup, but don't add it to the map yet.
const fillPopup = new mapboxgl.Popup({
	closeButton: false,
	closeOnClick: false
});

const pointPopup = new mapboxgl.Popup({
	closeButton: false,
	closeOnClick: false
});

// add zoom and rotation controls to the map
const nav = new mapboxgl.NavigationControl({showCompass:false});
map.addControl(nav, 'top-left');

// add another control at the bottom with a zoom to extent button
const resetIcon = "<button class='mapboxgl-ctrl-reset' type='button' title='Reset Map' aria-label='Reset Map'><span class='reset-map-icon' aria-hidden='true'><img class='reset-icon' src='./assets/images/map-regular.svg'></span></button>"
$(".mapboxgl-ctrl.mapboxgl-ctrl-group").append(resetIcon);

// create geocoder for buffer search
const bufferGeocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
    zoom: currentZoom,
    flyTo: false,
    placeholder: 'Radius from...'

});

// create geocoder for isochrone search
const isoGeocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
    zoom: currentZoom,
    flyTo: false,
    placeholder: 'Drive time from...'

});

$('#bufferGeocoder').append(bufferGeocoder.onAdd(map));
$('#isoGeocoder').append(isoGeocoder.onAdd(map));

// after the map loads, bring in the source and layer you want displayed
map.on('load', function() {
	
	map.addSource('fillSource', {
		type: 'vector',
		url: 'mapbox://gpcecondev.dm783x07?latest=true'
	});

	map.addSource('pointSource', {
		type: 'vector',
		url: 'mapbox://gpcecondev.06528wej?latest=true'
	});

	// when the map loads, add the empty (for now) isochrone sources
    map.addSource('iso', {
        type: 'geojson',
        data: {
            'type': 'FeatureCollection',
            'features': []
        }
    });

    // repeat that process for the buffer layer
    map.addSource('buff', {
        type: 'geojson',
        data: {
          'type': 'FeatureCollection',
          'features': []
        }
    });

	loadData(zipRoll, cityRoll);

});