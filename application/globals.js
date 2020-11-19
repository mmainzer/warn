mapboxgl.accessToken = 'pk.eyJ1IjoiZ3BjZWNvbmRldiIsImEiOiJja2hhcjI3a3gwOGhoMnluODU2eHdsbW1zIn0.weWYJ-E_AzwDbebZsJiRPQ';
const warnUrl = 'https://raw.githubusercontent.com/mmainzer/warn/main/application/data/warnLogs.json?token=AD4K4PVKO3DLRJYVMVZD5WS7VKK4U';
let startYear = "2020";
let endYear = "2020";
let years = ["2020"];
let dateOrder;
let dates;
let fillMetric = [ "+", 0 ];
let pointMetric = [ "+", 0 ];
let selectedLevel = [ "CDRegion" ];
let selectedGeo = [ "Metro South" ];
let bbox = selectedGeo.map(id => dataObj[selectedLevel].find(({ area }) => area === id).bbox);
let zipRoll = [];
let cityRoll = [];
let barData = [];
let tooltip;
let barChart;
let graph;
let y;
let x;
let hoveredBoundary = null;
let fillStop1;
let fillStop2;
let fillStop3;
let fillStop4;
let fillStop5;
let fillColor;
let unit = 'miles';
let distance = 10;
let minutes = 30;
let coords;
let zips;
let buffer;
let isochrone;
const centroidId = 'ckfhqog5d01f023lhf7nq8ob4';
const centroidUrl = "https://api.mapbox.com/datasets/v1/gpcecondev/" + centroidId + "/features?access_token=" + mapboxgl.accessToken;
const isoUrlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/driving/';
const pointRadius = ["interpolate",["linear"],pointMetric,
						0, 3,
						0.1, 5,
						1, 5,
						3, 10,
						5, 15,
						10, 20,
						15, 25,
						25,35,
						35,45,
						50,50,
						100,60
					];