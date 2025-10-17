

// 🌍 Crée la carte
var map = L.map('map', {
  center: [45.214659,5.846747],
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

//dessin
map.pm.addControls({
    position: 'topright', // ou 'topright', 'bottomleft', 'bottomright'
  });

//recentre par commune :



document.addEventListener("DOMContentLoaded", function () {

    const depInput = document.querySelector('#dep');
    const communeInput = document.querySelector('#commune');

    if (!depInput || !communeInput) return; // sécurité

    function getDepCode() {
        const depValue = depInput.value; // Exemple "75 - Paris"
        return depValue.split(" - ")[0].trim();
    }

    communeInput.addEventListener("change", function () {
        const communeName = communeInput.value.trim();
        if (!communeName) return;

        const depCode = getDepCode();
        if (!depCode) return alert("Veuillez sélectionner un département.");

        fetch(`https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(communeName)}&fields=nom,code,centre,departement`)
            .then(res => res.json())
            .then(communes => {

                const filteredCommunes = communes.filter(commune => {
                    const depCodeStart = commune.departement?.code || commune.code;
                    return depCodeStart.startsWith(depCode) && commune.nom.toLowerCase() === communeName.toLowerCase();
                });

                if (filteredCommunes.length === 1) {
                    const commune = filteredCommunes[0];
                    const [lng, lat] = commune.centre.coordinates;
                    map.setView([lat, lng], 14);
                } else if (filteredCommunes.length > 1) {
                    alert("Plusieurs communes correspondent, veuillez préciser le nom complet.");
                } else {
                    alert("Aucune commune trouvée dans le département sélectionné.");
                }
            })
            .catch(err => console.error("Erreur de géocodage :", err));
    });
});





document.addEventListener("DOMContentLoaded", function () {
    const coordInput = document.querySelector('#cord');
    let isCoordInputFocused = false;
    let blurTimeout = null;

    if (!coordInput) return; // sécurité : si l'élément n'existe pas

    coordInput.addEventListener('focus', () => {
        if (blurTimeout) {
            clearTimeout(blurTimeout);
            blurTimeout = null;
        }
        isCoordInputFocused = true;
    });

    coordInput.addEventListener('blur', () => {
        blurTimeout = setTimeout(() => {
            isCoordInputFocused = false;
            blurTimeout = null;
        }, 1000);
    });

    // Gestion du clic sur la carte
    if (typeof map !== 'undefined' && map) {
        map.on('click', function (e) {
            if (!isCoordInputFocused) return;

            const lat = e.latlng.lat.toFixed(5);
            const lng = e.latlng.lng.toFixed(5);

            coordInput.value = `${lat}, ${lng}`;
        });
    }


  
    // Fonction pour centrer la carte sur les coordonnées saisies
    function centercordonnee() {
    const coordInput = document.querySelector('#cord');
    if (!coordInput || !coordInput.value) return alert("Veuillez entrer des coordonnées (lat, lng).");

    const parts = coordInput.value.split(',').map(v => parseFloat(v.trim()));
    if (parts.length !== 2 || parts.some(isNaN)) {
        return alert("Format invalide. Exemple : 45.12345, 5.67890");
    }

    const [lat, lng] = parts;
    map.setView([lat, lng], 14);
    L.marker([lat, lng]).addTo(map);
}












// Add event listener to the featureGroup layer for when a new shape is created
map.on('pm:create', function(e) {
    var layer = e.layer;

    // Attach click event to the new shape
    layer.on('click', function() {
        // Log the color of the clicked shape
        console.log('Current Color:', this.options.color);
        // get new color from the color picker
        var newColor = document.getElementById('color-picker').value;
        console.log('New Color:', newColor);

        // Check if the clicked layer is a polygon
        if (layer instanceof L.Polygon || layer instanceof L.Circle || layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
            // Set the selected polygon
            selectedPolygon = layer;
            selectedPolygon.setStyle({ fillColor: newColor });
            selectedPolygon.setStyle({ color: newColor });

            
        }
    });
});

// Define custom control class
var ColorPickerControl = L.Control.extend({
    onAdd: function(map) {
        // Create container element for color picker
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        
        // Create color picker input element
        var colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.id = 'color-picker'; // Set an ID for styling or event handling
        colorPicker.title = 'Choose color';
        
        // Append color picker to container
        container.appendChild(colorPicker);

        return container;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

// Add custom control to the map
var colorPickerControl = new ColorPickerControl({ position: 'topright' }); // Adjust position as needed
colorPickerControl.addTo(map);




//patloc

let marker;
let generatedUrl = null;  // stocke l’URL générée
let intervalId = null;    // stocke l’ID de l’intervalle


//patloc

L.Control.GenerateLink = L.Control.extend({
  onAdd: function (map) {
    let btn = L.DomUtil.create('button', 'leaflet-bar');
    btn.innerHTML = '<i class="fa-solid fa-street-view"></i>';
    btn.style.padding = '4px';

    L.DomEvent.disableClickPropagation(btn);
    L.DomEvent.disableScrollPropagation(btn);

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const tokeninput = document.querySelector('#alerte_patloc_token');
      const existingToken = tokeninput.value?.trim();

      // Si on a déjà généré un lien, on réutilise
      if (generatedUrl) {
        prompt("Copie ce lien à envoyer :", generatedUrl);
        return;
      }else if (existingToken) { 
        generatedUrl = `/api/patloc/share/${existingToken}`
        prompt("Copie ce lien à envoyer :", generatedUrl);
        return
      }

      fetch('/api/patloc/generate-link')
        .then(res => res.json())
        .then(data => {
          generatedUrl = data.url; // on stocke le lien une fois généré
          prompt("Copie ce lien à envoyer :", generatedUrl);

          const code = generatedUrl.split('/').pop();
          const fetchUrl = `/api/patloc/position/${code}`;

          const tokeninput = document.querySelector('#alerte_patloc_token');
          tokeninput.value = `${code}`;

          // Si un intervalle existait déjà, on le supprime (sécurité)
          if (intervalId) {
            clearInterval(intervalId);
          }

          // Démarrer un intervalle pour récupérer la position régulièrement
          intervalId = setInterval(() => {
            fetch(fetchUrl)
              .then(res => res.json())
              .then(data => {
                if (data.lat && data.lng ) {
                  marker = L.marker([data.lat, data.lng]).addTo(map);
                  map.setView(new L.LatLng(data.lat, data.lng), 15);
                  clearInterval(intervalId); // Arrêter si tu veux une seule position
                  
                }
              })
              .catch(err => {
                console.error("Erreur lors de la récupération de la position :", err);
              });
          }, 3000);
        })
        .catch(error => {
          console.error('Erreur lors de la génération du lien :', error);
        });
    };

    return btn;
  },
  onRemove: function (map) {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }
});

L.control.generateLink = function (opts) {
  return new L.Control.GenerateLink(opts);
};

map.addControl(L.control.generateLink({ position: 'topright' }));





//center cordonée de patlock
function patlocenter() {
    // Récupérer la valeur de l'input (les coordonnées sous forme de "latitude, longitude")
    const tokeninputvalue = document.querySelector('#alerte_patloc_token').value;
    const fetchUrl = `/api/patloc/position/${tokeninputvalue}`;

    fetch(fetchUrl)
              .then(res => res.json())
              .then(data => {
                if (data.lat && data.lng) {
                  marker = L.marker([data.lat, data.lng]).addTo(map);
                  map.setView(new L.LatLng(data.lat, data.lng), 15);
                }
              })
              .catch(err => {
                console.error("Erreur lors de la récupération de la position :", err);
              });

}




document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('[name="alerte"]');
    if (!form) return;

    form.addEventListener('submit', function () {
        const drawn = [];

        const geojson = exportGeomanLayers(map);

        // Insère dans le champ caché
        const geojsonInput = document.querySelector('#alerte_geojson');
        if (geojsonInput) {
            geojsonInput.value = JSON.stringify(geojson);
        }

        console.log("GeoJSON généré :", geojson);
        console.log( geojsonInput.value );

    });
});


//export des dessin
function exportGeomanLayers(map) {
  const features = [];

  map.eachLayer(layer => {
    if (!layer.pm || !layer._drawnByGeoman) return;

    let feature = null;

    // 1. CERCLES
    if (layer instanceof L.Circle) {
      const center = layer.getLatLng();
      feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [center.lng, center.lat]
        },
        properties: {
          type: 'circle',
          radius: layer.getRadius(),
          color: layer.options.color,
          fillColor: layer.options.fillColor
        }
      };
    }

    // 2. MARQUEURS CERCLÉS (CircleMarker)
    else if (layer instanceof L.CircleMarker) {
      const center = layer.getLatLng();
      feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [center.lng, center.lat]
        },
        properties: {
          type: 'circlemarker',
          radius: layer.options.radius,
          color: layer.options.color,
          fillColor: layer.options.fillColor
        }
      };
    }

    // 3. TEXTE (Layer avec icon html)
    else if (layer instanceof L.Marker && layer.options.icon && layer.options.icon.options?.html) {
      const center = layer.getLatLng();
      feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [center.lng, center.lat]
        },
        properties: {
          type: 'text',
          html: layer.options.text,
          className: layer.options.icon.options.className
        }
      };
    }

    // 4. OBJETS GEOJSON STANDARDS
    else {
      feature = layer.toGeoJSON();
      feature.properties = {
        ...feature.properties,
        type:
          layer instanceof L.Polygon ? 'polygon' :
          layer instanceof L.Polyline ? 'polyline' :
          layer instanceof L.Marker ? 'marker' :
          'unknown',
        color: layer.options.color || null,
        fillColor: layer.options.fillColor || null
      };
    }

    if (feature) {
      features.push(feature);
    }
  });

  const geojson = {
    type: 'FeatureCollection',
    features: features
  };

  // 🔍 LOG du GeoJSON enrichi
  console.log("🛰️ Export GeoJSON enrichi :", geojson);

  return geojson;
}



document.addEventListener('DOMContentLoaded', function () {
  const geojsonInput = document.querySelector('#alerte_geojson');
  if (!geojsonInput || !geojsonInput.value) return;

  try {
    const geojson = JSON.parse(geojsonInput.value);

    L.geoJSON(geojson, {
      pointToLayer: function (feature, latlng) {
        let layer;

        switch (feature.properties?.type) {
          case 'circle':
            layer = L.circle(latlng, {
              radius: feature.properties.radius,
              color: feature.properties.color,
              fillColor: feature.properties.fillColor,
              fillOpacity: 0.5
            });
            break;

          case 'circlemarker':
            layer = L.circleMarker(latlng, {
              radius: feature.properties.radius,
              color: feature.properties.color,
              fillColor: feature.properties.fillColor,
              fillOpacity: 0.5
            });
            break;

          case 'text':
            layer = L.marker(latlng, {
              icon: L.divIcon({
                className: feature.properties.className || '',
                html: feature.properties.html
              })
            });
            break;

          case 'marker':
            layer = L.marker(latlng);
            break;

          default:
            layer = L.marker(latlng); // Fallback
            break;
        }

        // ✅ Indiquer que ce layer vient de Geoman (même après import)
        layer._drawnByGeoman = true;

        return layer;
      },

      onEachFeature: function (feature, layer) {
        // Pour les polylines/polygones/GeoJSON standards
        layer._drawnByGeoman = true;
      },

      style: function (feature) {
        return {
          color: feature.properties.color || '#3388ff',
          fillColor: feature.properties.fillColor || '#3388ff',
          fillOpacity: 0.5
        };
      }
    }).addTo(map);

  } catch (e) {
    console.error("❌ Erreur lors du parsing du GeoJSON :", e);
  }
});




function downloadTxt() {
    // Récupérer les valeurs du formulaire selon les nouveaux IDs
    const date = document.getElementById("requerant").value; // Si tu veux un vrai date, créer un champ DATE
    const telephone = document.getElementById("tel").value;
    const qualite = document.getElementById("qualite").value;

    const type = document.getElementById("type").value;
    const race = document.getElementById("race").value;
    const poids = document.getElementById("poids").value;

    const departement = document.getElementById("dep").value;
    const commune = document.getElementById("commune").value;
    const lieudi = document.getElementById("lieux").value;
    const coord = document.getElementById("cord").value;

    const description = document.getElementById("description").value;
    const blessure = document.getElementById("blessures").value;
    const depuis = document.getElementById("depuis").value;

    const marche = document.getElementById("marche").value;
    const aide = document.getElementById("aide").value;
    const pickup = document.getElementById("pickup").value;

    // Créer le contenu texte
    const content = `PRISE D'ALERTE
APPELANT
Requérant: ${date}
Téléphone: ${telephone}
Qualité: ${qualite}
ANIMAL
Type: ${type}
Race: ${race}
Poids: ${poids}
LIEUX
Département: ${departement}
Commune: ${commune}
Lieu-dit: ${lieudi}
Coordonnées: ${coord}
DESCRIPTION
Description: ${description}
Blessure: ${blessure}
Depuis: ${depuis}
ACCÈS
Marche: ${marche}
Aide: ${aide}
Pick-Up: ${pickup}`;

    // Créer un Blob et déclencher le téléchargement
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'formulaire_prise_alerte.txt';
    link.click();
}

function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Veuillez sélectionner un fichier .txt");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const data = parseTextFile(content);
        fillForm(data);
    };
    reader.readAsText(file);
}

function parseTextFile(content) {
    const data = {};
    const lines = content.split("\n");

    lines.forEach(line => {
        line = line.trim();
        if (line.includes(":")) {
            const parts = line.split(":");
            const key = parts[0].trim();
            const value = parts.slice(1).join(":").trim();
            if (key && value) {
                data[key] = value;
            }
        }
    });

    return data;
}

function fillForm(data) {
    const mapping = {
        "Requérant": "requerant",
        "Téléphone": "tel",
        "Qualité": "qualite",
        "Type": "type",
        "Race": "race",
        "Poids": "poids",
        "Département": "dep",
        "Commune": "commune",
        "Lieu-dit": "lieux",
        "Coordonnées": "cord",
        "Description": "description",
        "Blessure": "blessures",
        "Depuis": "depuis",
        "Marche": "marche",
        "Aide": "aide",
        "Pick-Up": "pickup"
    };

    Object.keys(mapping).forEach(key => {
        const fieldId = mapping[key];
        if (data[key] && document.getElementById(fieldId)) {
            document.getElementById(fieldId).value = data[key];
        }
    });
}


function sendMessenger() {
    // Récupération des valeurs du formulaire
    const requerant = document.getElementById("requerant").value;
    const tel = document.getElementById("tel").value;
    const qualite = document.getElementById("qualite").value;

    const type = document.getElementById("type").value;
    const race = document.getElementById("race").value;
    const poids = document.getElementById("poids").value;

    const departement = document.getElementById("dep").value;
    const commune = document.getElementById("commune").value;
    const lieux = document.getElementById("lieux").value;
    const coord = document.getElementById("cord").value;

    const description = document.getElementById("description").value;
    const blessures = document.getElementById("blessures").value;
    const depuis = document.getElementById("depuis").value;

    const marche = document.getElementById("marche").value;
    const aide = document.getElementById("aide").value;
    const pickup = document.getElementById("pickup").value;

    // Construction du message (encodé pour URL)
    let message = `ALERTE ESAM%0A`;
    message += `Appelant : ${requerant} (%20Tel: ${tel}, Qualité: ${qualite})%0A%0A`;
    message += `Animal : ${type} - ${race}%0A`;
    message += `Poids : ${poids} kg%0A%0A`;
    message += `Lieu : ${departement}, ${commune} - ${lieux}%0A`;
    message += `Coordonnées : ${coord}%0A%0A`;
    message += `Description : ${description}%0A`;
    message += `Blessures : ${blessures}%0A`;
    message += `Depuis : ${depuis}%0A%0A`;
    message += `Accès :%0A`;
    message += `Marche : ${marche}%0A`;
    message += `Aide : ${aide}%0A`;
    message += `Pick-up : ${pickup}%0A%0A`;
    message += `Pat'rouille | Alpha 1.2`;

    // Générer le lien Messenger et ouvrir dans un nouvel onglet
    const messengerUrl = `https://www.messenger.com/t/4257757770900949?text=${message}`;
    window.open(messengerUrl, "_blank");
}



