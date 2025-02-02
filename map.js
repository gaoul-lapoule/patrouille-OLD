var map = Gp.Map.load(
    "divMap",   // identifiant du conteneur HTML
    // options d'affichage de la carte (Gp.MapOptions)
    {           
        
         // centrage de la carte
         center : {
             location : "Grenoble"
         },
         // niveau de zoom de la carte (de 1 à 21)
         zoom : 10,
         // Couches à afficher
         layersOptions : {
            "ORTHOIMAGERY.ORTHOPHOTOS" : {},
            "TRANSPORTS.DRONES.RESTRICTIONS" : {},
            "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2" : {
        
              opacity : 1
          }
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
      mapEventsOptions : {
        // Appel de la fonction après le chargement de la carte
        "mapLoaded" : afterInitMap
    },
      
	}) ;

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
    map.setCenter({x : lat, y : long});
    console.log({x : lat, y : long});
}
