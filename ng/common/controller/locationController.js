(function ()
{
    'use strict';
    
    angular.module('myApp').controller('LocationController', 
    		function ($scope, $location, $filter, webId, appService) {
    		
    	$scope.data = webId.getWeb();
    	
    	$scope.$on('service.webId:updated', function(event, data) {
    		$scope.data = data;
    		init();
       	});
    	
    	$scope.logResize = function () {
    		$scope.$apply();
        };
        
        $scope.vars = {
        	todayStr : $scope.data.todayStr
        };
        
        var init = function() {
        	$scope.openHours = $scope.data.openHours;
            $scope.openHoursDP = $scope.data.openHoursDP;
        };
        init();
        
        
    	$scope.setMapHeight = function() {
    		var winHeight = window.innerHeight;
    		var header = document.getElementById('web-landing-header');
    		var headerHeight = header.offsetHeight;
    		var footer = document.getElementById('web-landing-footer');
    		var footerHeight = footer.offsetHeight;
    		var height = winHeight - headerHeight - footerHeight;
    		return { "max-height" : height/2};
    	};
    	
	});
    

})();
