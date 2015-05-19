/**
 * CSMD - controller - Landing page - header - menu
 */
(function ()
{
    'use strict';

    angular.module('myApp').controller('webHeaderController',
    function ($scope, $window, webId, $location, appService) {
    	$scope.hs = webId.getWeb();
    	$scope.webId = webId;
    	
    	$scope.$on('service.webId:updated', function(event, data, domain) {
    		$scope.hs = data;
    		$scope.webId = webId;
//    		$scope.$apply();
       	});
    	
    	$scope.redirectToHome = function() {
    		$location.path($scope.hs.HOME + $scope.hs.DOMAIN);
    	};
    	
    	
//    	$scope.getHeaderBgStyle = function() {
//    		return {
//    			"background": "-moz-linear-gradient(right, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%), url('json/fondo-home.jpg') no-repeat",
//    			"background": "-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,255,0)), color-stop(0%,rgba(255,255,255,0)), color-stop(100%,rgba(255,255,255,1))), url('json/fondo-home.jpg') no-repeat",
//    			"background": "-webkit-linear-gradient(right, rgba(255,255,255,0) 0%,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%), url('json/fondo-home.jpg') no-repeat",
//    			"background": "-o-linear-gradient(right, rgba(255,255,255,0) 0%,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%), url('json/fondo-home.jpg') no-repeat",
//    			"background": "-ms-linear-gradient(right, rgba(255,255,255,0) 0%,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%), url('json/fondo-home.jpg') no-repeat",
//    			"background": "linear-gradient(to left, rgba(255,255,255,0) 0%,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%), url('json/fondo-home.jpg') no-repeat",
//    			"background-repeat": "no-repeat",
//    			"background-size": "100%",
//    			"background-position": "center"
//    		};
//    		/*if ($scope.hs.isMobile && $scope.hs.message) {
//    			return {'display': 'block'};
//    		} else {
//    			return {'display': 'table-cell'};
//    		}*/
//    	};
    	// Load scope
//    	$scope.vars = { newID: ""};
//    	$scope.hs = csmdHeaderService;
//    	
//    	console.log("csmdUser", csmdUser);
//    	csmdHeaderService.setMobile( window.innerWidth <= 415 || window.innerHeight <= 415);
//    	
//    	var checkMobile = function() {
//    	    var w = window.innerWidth;
//    	    var h = window.innerHeight;
//    	    var wasMobile = csmdHeaderService.isMobile;
//    	    var isMobile = w <= 415 || h <= 415;
//    	    if (wasMobile != isMobile) {
//        	    csmdHeaderService.setMobile(isMobile);
//    	    }
//    	};
//    	
//    	if ($window.addEventListener)
//    		$window.addEventListener("resize", checkMobile);
//    	
//    	$scope.getHeaderStyle = function() {
//    		if ($scope.hs.isMobile && $scope.hs.message) {
//    			return {'display': 'block'};
//    		} else {
//    			return {'display': 'table-cell'};
//    		}
//    	};
//    	
//    	var em = function (input) {
//		    var emSize = parseFloat($("body").css("font-size"));
//		    return (emSize * input);
//		};
//		
//    	$scope.getTop = function() {
//    		return {'top': (window.innerHeight / 2) - em(5)};
//    	};
//    	
//    	var overrideDialog = null;
//    	// Show dialog to change the effective ATTUID
//    	$scope.overrideUser = function() {
//    		csmdUser.getUser().then(function(user) {
//    			if (user.hasRealRole('ADMIN')) {
//    				overrideDialog = new BonesDialog2($scope, 'ng/dashboard/html/attuid_override.html');
//    			}
//    		});
//    	};
//    	
//    	$scope.setEffectiveID = function(id)
//    	{
//    		if (id == '') {
//    			$scope.vars.newID = "";
//    			console.log("asdf");
//    		}
//    		BonesWebRest.getData('dashboard/SetOverride', { ATTUID: id})
//    		.then(function()
//			{
//    			// Hide dialog
//        		overrideDialog.close();
//        		
//        		// Refresh the user in the data model
//        		csmdUser.refresh();
//			},
//			function(error) {
//				overrideDialog.close();
//				csmdHeaderService.serverErrorHandle(error);
//			});
//    	};
	});
})();
