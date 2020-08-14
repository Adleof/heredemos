/*
Credit - https://developer.here.com/documentation/examples/maps-js/services/map-with-route-from-a-to-b
I used some of the rendering functions from here!
*/

const KEY = 'c1LJuR0Bl2y02PefaQ2d8PvPnBKEN8KdhAOFYR_Bgmw';

document.addEventListener('DOMContentLoaded', init, false);
let showRouteButton, startField, endField, directionsDiv;

let map, platform, router, geocoder;


function init() {
	platform = new H.service.Platform({
		'apikey': KEY
	});

	// Obtain the default map types from the platform object:
	let defaultLayers = platform.createDefaultLayers();

	map = new H.Map(
		document.getElementById('map'),
		defaultLayers.vector.normal.map,
		{
			zoom: 5,
			center: { lat: 30.22, lng: -92.02 },
			pixelRatio: window.devicePixelRatio || 1
		}
	);


	let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

	// Create the default UI:
	let ui = H.ui.UI.createDefault(map, defaultLayers);

	router = platform.getRoutingService(null,8);
	geocoder = platform.getSearchService();

	showRouteButton = document.querySelector('#showRouteButton');
	showRouteButton.addEventListener('click', doShowRoute);

	startField = document.querySelector('#start');
	endField = document.querySelector('#end');
	// temp for testing
	startField.value = 'Lafayette, LA, USA';
	endField.value = 'Chicago, Il, USA';

	directionsDiv = document.querySelector('#directionsText');

}

async function doShowRoute() {
	console.log('do the route thing');
	let start = startField.value;
	let end = endField.value;

	if(!start) {
		alert('Specify a starting location.');
		return;
	}

	if(!end) {
		alert('Specify a end location.');
		return;
	}

	let originPos = await geocode(start);
	let endPos = await geocode(end);
	console.log(originPos, endPos);

    let routeRequestParams = {
        routingMode: 'fast',
        transportMode: 'car',
        origin: originPos.lat+','+originPos.lng, 
        destination: endPos.lat+','+endPos.lng,  
        return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
    };

	let route = await getRoute(routeRequestParams);
	console.log(route);
	addRouteShapeToMap(route);
	addRouteText(route);
}

async function geocode(s) {
	let params = {
		q:s
	};

	return new Promise((resolve, reject) => {
		geocoder.geocode(
			params,
			r => {
				resolve(r.items[0].position);
			},
			e => reject(e)
		);
	});
}

async function getRoute(p) {
	return new Promise((resolve, reject) => {

		router.calculateRoute(
			p,
			r => resolve(r.routes[0]),
			e => reject(e)
		);

	});
}

function addRouteShapeToMap(route) {
	// remove existing routes
	let obs = map.getObjects();
	obs.forEach(ob => {
		if(ob.type === H.map.Object.Type.SPATIAL) map.removeObject(ob);
	});

  route.sections.forEach((section) => {
    // decode LineString from the flexible polyline
    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

    // Create a polyline to display the route:
    let polyline = new H.map.Polyline(linestring, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    });

    // Add the polyline to the map
    map.addObject(polyline);
  });
}

function addRouteText(route) {
	
	let desc = '<ol>';
	route.sections.forEach(s => {
		s.actions.forEach((a, idx) => {
			desc += `<li>${a.instruction}</li>`;
		});
	});
	desc += '</ol>';
	directionsDiv.innerHTML = desc;

}