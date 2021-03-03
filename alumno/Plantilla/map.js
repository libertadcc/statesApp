
var map;
var tbDraw;
    require(["esri/map",
        "esri/geometry/Extent" ,
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/dijit/BasemapGallery", 
        "esri/dijit/Scalebar",
        "esri/dijit/Legend",
        "esri/dijit/Search",
        "esri/dijit/OverviewMap", 
        "esri/layers/FeatureLayer",
        "esri/toolbars/draw" ,
        "esri/graphic" ,
        "esri/tasks/query",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "dojo/on",
        "dojo/dom",

        "dijit/layout/TabContainer",
        "dijit/layout/ContentPane",
        "dijit/layout/BorderContainer",
        "dojo/domReady!"],
        function(
          Map, Extent, ArcGISDynamicMapServiceLayer, BasemapGallery, Scalebar, Legend, Search, OverviewMap, FeatureLayer, Draw, Graphic, query,
          SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol,


          on, dom,

        ) {
          var boton01 = dojo.byId("pintaYQuery");
          dojo.connect(boton01, "click", fPintaYQuery);                         
          
          on(dom.byId("progButtonNode"),"click",fQueryEstados);
          
        
        function fQueryEstados(){
         alert("Evento del botón Ir a estado");
         console.log('hola')
        }

        var Extent = new Extent({
          
          "xmin":-14098190.379427297,
          "ymin":3574466.237619665,
          "xmax":-10272669.987811813,
          "ymax":6069370.840847155,
          "spatialReference" : {
            "wkid" : 102100
          }
        });

        map = new Map("map", {
          basemap: "topo",
          extent : Extent, 
          sliderStyle: "small"
        });

        /*
             * Step: Add the USA map service to the map
             */
            var lyrUSA = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
                opacity : 0.5
            });
            
            var Ciudades = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0");

            var states = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2");

         /*
            * Step: Revise code to use the addLayers() method
            map.addLayer(lyrUSA);
            */
           map.addLayer (lyrUSA) ;
           map.addLayer (Ciudades) ;

        /*
           * Step: Add the BaseMapGallery widget to the map
           */
          var basemapGallery = new BasemapGallery ({
              map : map,
              basemap : "topo"
            }, "BasemapGallery");
            basemapGallery.startup();

        /*
             * Step: Add a scalebar widget to the map
             */
            var digitScalebar = new Scalebar({
                map : map,
                scalebarUnit : "dual",
                attachTo : "bottom-left"
            });

        /*
             * Step: Add a legend once all layers have been added to the map
             */
            
            map.on("layers-add-result", function() {
                var digitLegend = new Legend({
                    map : map,
                    arrangement : Legend.ALIGN_RIGHT
                },'legendDiv') ;
                digitLegend.startup() ;
            }); // stub

        /*
             * Step: Add the Search widget
             */
            var dijitSearch = new Search ({
                map : map,
                autoComplete : true
            }, "divSearch");
            dijitSearch.startup();

            // Añadir Visor general
            var OverviewMap = new OverviewMap ({
              map: map,
              visible: true
            }, "VGeneral");
            OverviewMap.startup();

            /* Añadir herramientas de selección y dibujo*/
            map.on("pintaYQuery",fPintaYQuery);

                
        /*
              * Step: Implement the Draw toolbar
              */
            function fPintaYQuery () {
              var tbDraw = new Draw (map);
              tbDraw.on("draw-end", displayPolygon) ;
              /*ACTIVAMOS BARRA DE HERRAMIENTAS*/
              tbDraw.activate (Draw.POLYGON) ;
              }
  
            
            function displayPolygon(evt) {

              // Get the geometry from the event object
              var geometryInput = evt.geometry;

              // Define symbol for finished polygon
              var tbDrawSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 255, 0]), 2), new Color([255, 255, 0, 0.2]));

              // Clear the map's graphics layer
              map.graphics.clear();
            
            /*
                 * Step: Construct and add the polygon graphic
                 */
              var graphicPolygon = new Graphic (geometryInput, tbDrawSymbol) ;
              map.graphics.add(graphicPolygon) ;

            // Call the next function
            selectCiudades(geometryInput);
            }

            function selectCiudades(geometryInput) {

              // Define symbol for selected features
              var symbolSelected = new SimpleMarkerSymbol({
                  "type": "esriSMS",
                  "style": "esriSMSCircle",
                  "color": [255, 115, 0, 128],
                  "size": 6,
                  "outline": {
                    "color": [255, 0, 0, 214],
                    "width": 1
                  }
          
              });
              Ciudades.setSelectionSymbol(symbolSelected);

            

            /*
              * Step: Initialize the query
              */
             var BuscaCiudades = new Query();
             BuscaCiudades.geometry = geometryInput;
              
             /*
             * Step: Wire the layer's selection complete event
             */
             Ciudades.on("selection-complete", populateGrid);

             /*
             * Step: Perform the selection
             */
             Ciudades.selectFeatures(BuscaCiudades, FeatureLayer.SELECTION_NEW);

       }

              

            /*map.on("load",function(evt){
              map.resize();
              map.reposition();

        });*/

      });

