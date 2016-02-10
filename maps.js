/**
* map is a Google Maps
* layer is an object
* 
**/

var map;
var USERNAME = "";
var TEMPLATE_NAME = "";

function initMap() {
	
	var lat = $("#user_lat").val();
	var lng = $("#user_lng").val();
	
	//Set default center LatLng for the maps
	centerLatLng = new google.maps.LatLng(lat, lng);
	
	//Call element
	var map_canvas = document.getElementById("map_canvas");
	
	//Create maps with option
	map = new google.maps.Map(map_canvas, getMapOptions());
	
	//Add maps event listener on Click
	map.addListener('click', onMapClickListener);
	
	//Add maps event listener on TilesLoaded
	google.maps.event.addListenerOnce(map, 'tilesloaded', onMapLoadedListener);
}

function onMapClickListener(event) {
	var latLng = event.latLng;
	var randomId = makeId();
	addMarker(randomId, latLng, false);
}

function onMapLoadedListener() {
	createCartoDBLayer(map);
}

function createCartoDBLayer(map) {
	
	var tableName = "my_table_name";
	var cartocss= = "some css";
	var sql = "some query statements";
	
	//This layer source object is defined with CartoDB user_name, template_name.
	var layerSource = {
	  user_name: USERNAME,
	  type: "namedmap",
	  named_map: {
	    name: TEMPLATE_NAME,
		layers: [{
		  layer_name: tableName
		}]
	  }
	};

	//Call CartoDB.js to create a layer with layer source.
	cartodb.createLayer(map, layerSource).addTo(map).done(function(cartoDBLayer) {
	
		  //When done, set parameters to filter dataset in that layer
  		cartoDBLayer.setParams("css_layer", cartocss);
  		cartoDBLayer.setParams("sql_statement", sql);
  		
  		var subLayer = cartoDBLayer.getSubLayer(0);
  		
  		subLayer.setInteraction(true);
  		
  		//This should be listened
  		layers.on('featureOver', function(e, latlng, pos, data) {
  		    console.log("Feature Over Called");
  		});
  		
  		
	})
	.error(function(err) {
	
		console.log(err);
	});
}
