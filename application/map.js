

mapboxgl.accessToken = 'pk.eyJ1IjoiZ3BjZWNvbmRldiIsImEiOiJja2hhcjI3a3gwOGhoMnluODU2eHdsbW1zIn0.weWYJ-E_AzwDbebZsJiRPQ';

const map = new mapboxgl.Map({
	container: 'map', // container id
	style: 'mapbox://styles/gpcecondev/ckfgusueg0dcb19oy9vf3oudn',
	center: [-84.3712,33.7737], // starting position [lng, lat]
	zoom: 9.0, // starting zoom
	scrollZoom: false
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
	
	loadData();

	map.addSource('fillSource', {
		type: 'vector',
		url: 'mapbox://gpcecondev.dm783x07'
	});

	map.addLayer({
		'id':'boundaryLayer',
		'type':'line',
		'source':'fillSource',
		'layout': {
          'visibility':'visible',
        },
        'paint': {
        	'line-color':['case',['boolean',['feature-state','hover'],false],"#333","hsla(180, 100%, 92%, 0.9)"],
        	'line-width':['case',['boolean',['feature-state','hover'],false],2,0]
        },
        'source-layer':'gazips'
	}, 'admin-0-boundary-disputed')

	map.addLayer({
		'id':'fillLayer',
		'type':'fill',
		'source':'fillSource',
		'layout': {
          'visibility':'visible',
        },
        'paint': {
        	'fill-color':"hsla(189, 62%, 78%, 0.6)"
        },
        'source-layer':'gazips'
	}, 'boundaryLayer');

});