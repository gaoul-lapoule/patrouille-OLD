

// 🌍 Crée la carte
var map = L.map('carte', {
  center: [45.214659, 5.846747],
  zoom: 12,
  fullscreenControl: true, // ⬅️ Ajout du bouton plein écran
  fullscreenControlOptions: {
    position: 'topleft' // ou 'topright'
  }
});


var wmtsUrl = "https://data.geopf.fr/wmts";

var wmtsLayer = L.tileLayer(wmtsUrl + "?service=WMTS&request=GetTile&version=1.0.0" +
    "&layer=GEOGRAPHICALGRIDSYSTEMS.SLOPES.MOUNTAIN" +
    "&style=normal" +
    "&tilematrixset=PM" +
    "&format=image/png" +
    "&tilematrix={z}&tilerow={y}&tilecol={x}&apiKey=ta-cle-api", {
        tileSize: 256,
        minZoom: 12,
        maxZoom: 18,
        attribution: "© IGN",
        crossOrigin: true
});

wmtsLayer.addTo(map);

var limites = L.tileLayer(
    "https://data.geopf.fr/wmts?" +
    "service=WMTS&request=GetTile&version=1.0.0" +
    "&layer=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST" +
    "&style=normal" +
    "&tilematrixset=PM" +
    "&format=image/png" +
    "&tilematrix={z}&tilerow={y}&tilecol={x}", 
    {
        tileSize: 256,
        minZoom: 0,
        maxZoom: 18,
        attribution: "© IGN - Limites administratives",
        crossOrigin: true
    }
);

limites.addTo(map);


var lyr = L.geoportalLayer.WMTS({
    layer   : "TRANSPORTS.DRONES.RESTRICTIONS",
});
lyr.addTo(map); // ou map.addLayer(lyr);
// création et ajout d'une couche Géoplateforme
var lyr = L.geoportalLayer.WMTS({
    layer   : "ORTHOIMAGERY.ORTHOPHOTOS",
});
lyr.addTo(map); // ou map.addLayer(lyr);
var lyr = L.geoportalLayer.WMTS({
    layer   : "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2",
});
lyr.addTo(map); // ou map.addLayer(lyr);

var lyr = L.geoportalLayer.WMTS({
    layer   : "GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR",
});
lyr.addTo(map); // ou map.addLayer(lyr);


// Création et ajout des options
map.addControl(L.geoportalControl.LayerSwitcher());

map.addControl(L.geoportalControl.SearchEngine());

map.addControl(L.geoportalControl.ReverseGeocode());

map.addControl(L.geoportalControl.Route());

map.addControl(L.geoportalControl.MousePosition());

var locateControl = L.control.locate({
  position: 'topright',
  strings: {
    title: "Localiser avec boussole"
  },
  locateOptions: {
    enableHighAccuracy: true,
    watch: true,
    maximumAge: 0,
    timeout: 10000
  },
  showCompass: true,
}).addTo(map);

if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
  DeviceOrientationEvent.requestPermission()
    .then(permissionState => {
      if (permissionState === 'granted') {
        // lancer la géolocalisation / Leaflet LocateControl
      }
    })
    .catch(console.error);
}







document.addEventListener("DOMContentLoaded", function () {
  const depElement = document.getElementById("dep");
  const communeElement = document.getElementById("commune");

  if (!depElement || !communeElement) {
      console.error("Impossible de trouver les éléments de département ou de commune.");
      return;
  }

  const depValue = depElement.textContent.replace("Département :", "").trim();
  const communeName = communeElement.textContent.replace("Commune :", "").trim();
  const depCode = depValue.split(" - ")[0].trim();

  if (!depCode || !communeName) {
      console.error("Valeurs manquantes pour le département ou la commune.");
      return;
  }



  if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
    const marker = L.marker(coords).addTo(map)
        .bindPopup("Position d'alerte")
        .openPopup();

    // Facultatif : centrer la carte sur le marqueur
    map.setView(coords, 14);
  } else {
      fetch(`https://geo.api.gouv.fr/departements/${depCode}/communes?fields=nom,code,centre`)
    .then(res => res.json())
    .then(communes => {
      // 🔍 Recherche de la commune correspondant au nom demandé (insensible à la casse et aux tirets)
      const commune = communes.find(c => 
        c.nom.toLowerCase().replace(/[-']/g, " ") === communeName.toLowerCase().replace(/[-']/g, " ")
      );

      if (commune) {
        const [lng, lat] = commune.centre.coordinates;
        map.setView([lat, lng], 14);
        L.marker([lat, lng]).addTo(map)
          .bindPopup(`<strong>${commune.nom}</strong><br>Département : ${depCode}`)
          .openPopup();
      } else {
        alert(`Aucune commune nommée "${communeName}" trouvée dans le département ${depCode}.`);
      }
    })
      .catch(err => console.error("Erreur lors du géocodage :", err));
  }
});





document.addEventListener('DOMContentLoaded', () => {
    if (!savedGeojson || !savedGeojson.features) {
      console.warn('Aucun GeoJSON trouvé');
      return;
    }

    L.geoJSON(savedGeojson, {
      pointToLayer: function (feature, latlng) {
        switch (feature.properties?.type) {
          case 'circle':
            return L.circle(latlng, {
              radius: feature.properties.radius,
              color: feature.properties.color,
              fillColor: feature.properties.fillColor,
              fillOpacity: 0.5
            });

          case 'circlemarker':
            return L.circleMarker(latlng, {
              radius: feature.properties.radius,
              color: feature.properties.color,
              fillColor: feature.properties.fillColor,
              fillOpacity: 0.5
            });

          case 'text':
            return L.marker(latlng, {
              icon: L.divIcon({
                className: feature.properties.className || '',
                html: `<div style="
                    display: inline-block;
                    white-space: nowrap;
                    font-weight: bold;
                    background: white;
                    padding: 4px;
                    border-radius: 4px;
                    text-align: center;
                  ">${feature.properties.html}</div>`
              })
            });

          default:
            return L.marker(latlng);
        }
      },
      style: function (feature) {
        return {
          color: feature.properties.color,
          fillColor: feature.properties.fillColor,
          fillOpacity: 0.5
        };
      }
    }).addTo(map);
  });


