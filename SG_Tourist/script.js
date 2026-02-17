mapboxgl.accessToken =
  "pk.eyJ1Ijoibml6aTIyIiwiYSI6ImNta2NoYnVnaDAwcnkzY3M4ajRydzN0dWMifQ.rwr4uer-bacd6JOcBwrR2g";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/nizi22/cmlqe9vum000c01r7f8fo0zyd",
  center: [103.8276, 1.3572],
  minZoom: 4,
  zoom: 8,
  maxBounds: [
    [103.375, 1.255],
    [104.27, 1.5]
  ],
  attributionControl: false
});

// --- Controls
map.addControl(new mapboxgl.NavigationControl(), "top-right");
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-right"
);
map.addControl(
  new mapboxgl.AttributionControl({
    customAttribution:
      'Contains information from Singapore\'s open data portal <a href="https://www.data.gov.sg" target="_blank">www.data.gov.sg</a>',
    compact: false
  })
);

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  marker: false,
  placeholder: "      Search for places",
  proximity: { longitude: 103.8276, latitude: 1.357255 }
});
map.addControl(geocoder, "top-right");

// --- MRT hover popup
const labelpopup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
  offset: 10,
  className: "mrt-popup"
});

// --- Popup for nearest MRT when clicking tourist attractions
const mrtHighlightPopup = new mapboxgl.Popup({
  closeButton: true,
  closeOnClick: true,
  offset: 10,
  className: "mrt-highlight-popup"
});

map.on("mouseenter", "sg-mrt-2", (e) => {
  map.getCanvas().style.cursor = "pointer";
  const feature = e.features[0];
  if (!feature) return;
  const stationName = feature.properties.STN_NAM.replace(
    /MRT STATION/gi,
    ""
  ).trim();
  labelpopup
    .setLngLat(feature.geometry.coordinates)
    .setText(stationName)
    .addTo(map);
});

map.on("mouseleave", "sg-mrt-2", () => {
  map.getCanvas().style.cursor = "";
  labelpopup.remove();
});

map.on("load", () => {
  // --- Tourist attractions elements
  const listButton = document.getElementById("see-list");
  const listSidebar = document.getElementById("list-sidebar");
  const listingContainer = document.getElementById("listing-container");
  const mainSidebar = document.getElementById("main-sidebar");
  let allFeatures = [];

  // Cursor pointer for tourist attractions
  map.on("mouseenter", "tourist-attraction-3", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "tourist-attraction-3", () => {
    map.getCanvas().style.cursor = "";
  });

  // --- Function to show main sidebar
  function showMainSidebar(feature) {
    const props = feature.properties;
    const website =
      props.EXTERNAL_L && props.EXTERNAL_L !== "null"
        ? props.EXTERNAL_L.startsWith("http")
          ? props.EXTERNAL_L
          : `https://${props.EXTERNAL_L}`
        : null;

    mainSidebar.style.display = "block";
    mainSidebar.innerHTML = `
      <h3>${props.PAGETITLE || "Unknown Attraction"}</h3>
      ${
        props.ADDRESS && props.ADDRESS !== "null"
          ? `<p><strong>Address:</strong> ${props.ADDRESS}</p>`
          : ""
      }
      ${
        props.OVERVIEW && props.OVERVIEW !== "null"
          ? `<p><strong>Overview:</strong> ${props.OVERVIEW}</p>`
          : ""
      }
      ${
        props.OPENING_HO &&
        props.OPENING_HO !== "null" &&
        props.OPENING_HO.trim() !== ""
          ? `<p><strong>Opening Hours:</strong> ${props.OPENING_HO}</p>`
          : ""
      }
      ${
        website
          ? `<p><strong>Website:</strong> <a href="${website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>`
          : ""
      }
    `;
  }

  // --- Function to display nearest MRT popup
  function showNearestMRTPopup(feature) {
    const nearestMRT = feature.properties.NEAR_STN;
    if (!nearestMRT) {
      console.error("NEAR_STN missing or null");
      return;
    }

    // Find MRT from rendered features
    const mrtFeature = map
      .queryRenderedFeatures({ layers: ["sg-mrt-2"] })
      .find(
        (f) =>
          f.properties.STN_NAM &&
          f.properties.STN_NAM.trim() === nearestMRT.trim()
      );

    if (!mrtFeature) {
      console.error(`No MRT found for ${nearestMRT}`);
      return;
    }

    const stationName = mrtFeature.properties.STN_NAM.replace(
      /MRT STATION/gi,
      ""
    ).trim();

    // Show popup at MRT coordinates
    mrtHighlightPopup
      .setLngLat(mrtFeature.geometry.coordinates)
      .setText(stationName)
      .addTo(map);

    // Fly to MRT
    map.flyTo({ center: mrtFeature.geometry.coordinates, zoom: 14 });
  }

  // --- Render sidebar list
  function renderList(features) {
    listingContainer.innerHTML = features
      .map(
        (f, idx) =>
          `<div class="list-item" data-index="${idx}">${
            f.properties.PAGETITLE || "Unknown"
          }</div>`
      )
      .join("");

    listingContainer.querySelectorAll(".list-item").forEach((item, idx) => {
      item.addEventListener("click", () => {
        const feature = features[idx];
        if (!feature || !feature.geometry) return;

        map.flyTo({
          center: feature.geometry.coordinates,
          zoom: 16,
          offset: [200, 0]
        });

        showNearestMRTPopup(feature);
        showMainSidebar(feature);
      });
    });
  }

  // --- "See List" button
  listButton.addEventListener("click", () => {
    allFeatures = map.queryRenderedFeatures({
      layers: ["tourist-attraction-3"]
    });
    if (!allFeatures.length) return alert("No attractions found!");

    allFeatures.sort((a, b) =>
      (a.properties.PAGETITLE || "").localeCompare(b.properties.PAGETITLE || "")
    );

    listSidebar.style.display = "block";
    renderList(allFeatures);
  });

  // --- Filter change
  document.getElementById("filters").addEventListener("change", (event) => {
    const value = event.target.value;
    if (!allFeatures.length) return;

    const filtered =
      value === "all"
        ? allFeatures
        : allFeatures.filter((f) => f.properties.ADMISSION === value);

    map.setFilter(
      "tourist-attraction-3",
      value === "all" ? null : ["==", ["get", "ADMISSION"], value]
    );
    renderList(filtered);
  });

  // --- Click on tourist attraction → show nearest MRT popup
  map.on("click", "tourist-attraction-3", (e) => {
    const feature = e.features[0];
    if (!feature || !feature.geometry) return;

    showNearestMRTPopup(feature);
    showMainSidebar(feature);
  });

  // --- Close sidebars when clicking empty space
  map.on("click", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["tourist-attraction-3"]
    });
    if (!features.length) {
      mainSidebar.style.display = "none";
      listSidebar.style.display = "none";
    }
  });
});