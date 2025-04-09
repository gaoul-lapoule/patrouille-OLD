var map = Gp.Map.load(
    "divMap",   // identifiant du conteneur HTML
    // options d'affichage de la carte (Gp.MapOptions)
    {           
        
         apiKey: "ign_scan_ws",
        center: {
            location: "Grenoble"
        },
        zoom: 10,
        layersOptions: {
            "GEOGRAPHICALGRIDSYSTEMS.MAPS": {},
            "SCAN100_PYR-JPEG_WLD_WM": {},
            "SCAN25TOUR_PYR-JPEG_WLD_WM": {},
        },
      // additional tools to display on the map
      controlsOptions : {
          "layerSwitcher" : {},
          "search" : {},
          "drawing" : {},
          "graphicscale" : {},
          "layerimort" : {},
          "mouseposition" : {},
      
      },
      mapEventsOptions: {
                "mapLoaded": afterInitMap
      },
    }    
) ;

    function afterInitMap() {
        console.log("Carte chargée");
        document.getElementById("commune").addEventListener("input", function() {
            var departement = document.getElementById("departement").value;
            var commune = this.value;
            if (commune) {
                map.setCenter({ location: commune + ', ' + departement });
                map.setZoom(15);
            }
        });

    }

function coordcenter(){
    let lat = parseFloat(document.getElementById("latitude").value); // Convertit en nombre
    let long = parseFloat(document.getElementById("longitude").value);
    map.setCenter({x : long, y : lat, projection : "CRS:84"});
    var date = document.getElementById("DATE").value;
    var heure = document.getElementById("HEURE").value;
    map.setMarkersOptions([{content : `<h1>Alerte ${date} ${heure}</h1><br/><p>73 avenue de Paris, Saint-Mandé</p>`}])
    console.log({x : lat, y : long});
}

map.listen("mapLoaded", function () {
    console.log("Carte chargée ✅");

    // Récupération de la carte OpenLayers depuis le SDK Geoportail
    var olMap = map.getLibMap();

    if (!olMap) {
        console.error("Erreur : Impossible de récupérer la carte OpenLayers.");
        return;
    }

    console.log("Carte OpenLayers récupérée ✅");

    // Ajouter un écouteur d'événement pour les clics sur la carte
    olMap.on("click", function (event) {
        var coord = event.coordinate; // Coordonnées du point cliqué en EPSG:3857

        // Transformation des coordonnées en EPSG:4326 (degrés décimaux)
        var lonLat = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');

        // Extraction de la longitude et latitude
        var lon = lonLat[0].toFixed(5); // Longitude en DD
        var lat = lonLat[1].toFixed(5); // Latitude en DD

        console.log("Clic détecté 📍", lon, lat);
        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = lon;
        var date = document.getElementById("DATE").value;
        var heure = document.getElementById("HEURE").value;
    });
});
