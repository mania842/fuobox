(function ()
{
    'use strict';
    
    angular.module('buffetModule').controller('BuffetPriceController', 
    		function ($http, $scope, $location, $routeParams, page, webId) {
    	
    	$scope.data = webId.loadWebData($routeParams.homepage);
    	$scope.$on('service.webId:updated', function(event, data, domain) {
    		$scope.data = data;
       	});
    	
    	
    	
	});
    

})();
