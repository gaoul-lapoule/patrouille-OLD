var map = Gp.Map.load(
    "divMap",   // identifiant du conteneur HTML
    // options d'affichage de la carte (Gp.MapOptions)
    {           
         // clef d'accès à la plateforme
         apiKey: "essentiels",
         // centrage de la carte
         center : {
             location : "Grenoble"
         },
         // niveau de zoom de la carte (de 1 à 21)
         zoom : 10,
         // Couches à afficher
         layersOptions : {
          "ORTHOIMAGERY.ORTHOPHOTOS" : {},
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
          "emouseposition" : {},
      
      },
      
      
	}) ;