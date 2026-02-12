// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken =
  "pk.eyJ1Ijoibml6aTIyIiwiYSI6ImNta2NoYnVnaDAwcnkzY3M4ajRydzN0dWMifQ.rwr4uer-bacd6JOcBwrR2g";

// Define a map object by initialising a Map from Mapbox
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/nizi22/cmljo2551004l01skf306dgaf",
  center: [103.8276, 1.3572],
  minZoom: 4,
  zoom: 8,
  maxBounds: [
    [103.375, 1.255],
    [104.27, 1.5]
  ],
  maxBoundsViscosity: 1.0 // prevents dragging outside
});

map.addControl(new mapboxgl.NavigationControl(), "top-left");
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true,
    maxBounds: [
      [103.37, 1.25],
      [104.27, 1.5]
    ]
  }),
  "top-left"
);
// Add custom copyright information to default copyright info
map.addControl(
  new mapboxgl.AttributionControl({
    customAttribution:
      "Contains OS data © Crown copyright [and database right] 2022. Contains data © Improvement Service and Database of British & Irish Hills.",
    compact: false // Make copyright info only visible on click because it would otherwise cover the mapbox logo due to its length
  })
);

const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search for places", // Placeholder text for the search bar
  proximity: {
    longitude: 103.8276,
    latitude: 1.357255
  } // Coordinates of Singapore city center
});

map.addControl(geocoder, "top-left");