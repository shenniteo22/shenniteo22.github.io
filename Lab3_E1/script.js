// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken =
  "pk.eyJ1Ijoibml6aTIyIiwiYSI6ImNta2NoYnVnaDAwcnkzY3M4ajRydzN0dWMifQ.rwr4uer-bacd6JOcBwrR2g";

//Before map
const beforeMap = new mapboxgl.Map({
  container: "before",
  style: "mapbox://styles/nizi22/cmkwkw91s000q01qx09lngf9t",
  center: [-0.089932, 51.514441],
  zoom: 14
});
//After map
const afterMap = new mapboxgl.Map({
  container: "after",
  style: "mapbox://styles/nizi22/cmkwldff8000x01sda35p6vub",
  center: [-0.089932, 51.514441],
  zoom: 14
});

const container = "#comparison-container";
const map = new mapboxgl.Compare(beforeMap, afterMap, container, {});