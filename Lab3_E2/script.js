// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken =
  "pk.eyJ1Ijoibml6aTIyIiwiYSI6ImNta2NoYnVnaDAwcnkzY3M4ajRydzN0dWMifQ.rwr4uer-bacd6JOcBwrR2g";

const style_2025 = "mapbox://styles/nizi22/cmkwldff8000x01sda35p6vub";
const style_2024 = "mapbox://styles/nizi22/cmkwkw91s000q01qx09lngf9t";

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: style_2025,
  center: [-0.089932, 51.514441],
  zoom: 14
});

const layerList = document.getElementById("menu");
const inputs = layerList.getElementsByTagName("input");
//On click the radio button, toggle the style of the map.
for (const input of inputs) {
  input.onclick = (layer) => {
    if (layer.target.id == "style_2025") {
      map.setStyle(style_2025);
    }
    if (layer.target.id == "style_2024") {
      map.setStyle(style_2024);
    }
  };
}