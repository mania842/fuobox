(function() {
	'use strict';

	angular.module('myApp').directive('myMap', function(webId) {
	    // directive link function
	    var link = function($scope, element, attrs) {
	        var map, infoWindow;
	        var markers = [];
	        var watchId = undefined;
	        var currentPositionMarker = undefined;
	        $scope.data = webId.getWeb();
	        
	        // map config
	        var mapOptions = {
	            center: new google.maps.LatLng($scope.long, $scope.lang),
	            zoom: 16,
	            mapTypeId: google.maps.MapTypeId.ROADMAP,
	            scrollwheel: true
	        };
	        
	        // init the map
	        var initMap = function() {
	            if (map === void 0) {
	            	
	                map = new google.maps.Map(element[0], mapOptions);
	                setMarker(map, new google.maps.LatLng($scope.long, $scope.lang), $scope.data.TITLE, $scope.data.getAddress2());
//	    	        setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
//	    	        setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
	    	        
	            }
	        };
	        
	        // place a marker
	        var setMarker = function (map, position, title, content, isMyLocation) {
	            var marker;
	            var markerOptions = {
	                position: position,
	                map: map,
	                title: title,
	            };
	            if (isMyLocation) {
	            	markerOptions.animation =  google.maps.Animation.DROP;
	            	markerOptions.icon = 'ng/common/images/my-location-marker.png';
	            }

	            marker = new google.maps.Marker(markerOptions);
	            markers.push(marker); // add marker to array
	            
	            if (isMyLocation) {
	            	google.maps.event.addListener(marker, 'click', function () {
	            		// close window if not undefined
		                if (infoWindow !== void 0) {
		                    infoWindow.close();
		                }
		                
		                if (marker.getAnimation() != null) {
		                    marker.setAnimation(null);
		                  } else {
		                    marker.setAnimation(google.maps.Animation.BOUNCE);
		                  }
	            	});
	            } else {
	            	google.maps.event.addListener(marker, 'click', function () {
		                // close window if not undefined
		                if (infoWindow !== void 0) {
		                    infoWindow.close();
		                }
		                // create new window
		                var infoWindowOptions = {
		                    content: content
		                };
		                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
		                infoWindow.open(map, marker);
		            });
	            }
	            
	            return marker;
	        };
	        
	      //Cancel watching
	    	$scope.$on("$destroy", function(){
	    		if (watchId != null)
	    			navigator.geolocation.clearWatch(watchId);
	        });
	        
	        initMap();
	        
	        if ($scope.setCurrent && navigator.geolocation) {
//	    		navigator.geolocation.getCurrentPosition(function(position){
//	    			$scope.$apply(function(){
//	    				console.log("position", position.coords.latitude);
//	    				console.log("position", position.coords.longitude);
//	    				$scope.position = position.coords;
//	    			});
//	    	    });
	    		
	    		navigator.geolocation.getCurrentPosition(function(position){
	    			if (currentPositionMarker) return;
	    				// Log that this is the initial position.
//	    				console.log( "Initial current position Found",  position.coords.latitude + " " + position.coords.longitude);
	    				// Set initial marker to the map using the position.
	    				currentPositionMarker = setMarker(map, mapOptions.center, 'Yong', 'Text here', true);
//	    				console.log("currentPositionMarker.getPosition()", position);
	    				
//	    				var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//	    			    // using global variable:
//	    			    map.panTo(center);
//	    			    map.setZoom(16);
	    				
	                    },
	                    function( error ) {
	                        console.log( "Something went wrong while initializing google map:", error );
	                    },
	                    {
	                        timeout: Infinity,
	                        maximumAge: 0,
	                        enableHighAccuracy: true
	                    }
	                );
	    		
	    		watchId = navigator.geolocation.watchPosition( function( position ){
                    // Set the new position of the existing marker.
	    			currentPositionMarker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
	    		});
	    	}
	    };
	    
	    return {
	        restrict: 'E',
	        template: '<div id="gmaps"></div>',
	        replace: true,
	        link: link,
	        scope:
			{
				setCurrent: '=',
				long: '@',
				lang: '@'
			}
	    };
	});

})();
