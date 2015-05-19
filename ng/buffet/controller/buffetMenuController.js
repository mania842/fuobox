(function ()
{
    'use strict';
    
    angular.module('buffetModule').controller('BuffetMenuController', 
    		function ($document, $http, $rootScope, $scope, $location, $routeParams, webId, appService) {
    	$scope.isScrollTop = true;
    	$scope.data = webId.loadWebData($routeParams.homepage);
    	$scope.vars = {
    		cachedCollapse: false,
    	};
//    	$scope.data = webId.getWeb();
    	
    	$scope.cachedPadding = 0;
    	
//    	$scope.menuBarClick = function(day, index) {
//    		console.log(day, index);
//    	    var someElement = angular.element(document.getElementById(day));
//            $document.scrollToElementAnimated(someElement);
//    	};
    	
    	$scope.getTop = function() {
    		var elementResult = document.getElementsByClassName('weekly-menu-fix')[0];
    		$scope.cachedOffSet = elementResult.offsetTop + elementResult.offsetHeight;
    		return {'top': elementResult.offsetHeight};
    	};
    	$scope.getPadding = function(isIOS) {
    		var dailyMenu = document.getElementsByClassName('daily-menu-fix')[0];
    		var top = dailyMenu.offsetHeight + appService.em(1);
    		
    		if (isIOS)
    			top += appService.em(2);
    		
    		top = top > $scope.cachedPadding ? top : $scope.cachedPadding;
    		$scope.cachedPadding = top;
    		return {'height': top};
    	};
    	
    	$scope.logResize = function () {
    		$scope.$apply();
        };
        
        $rootScope.$on('duScrollspy:becameActive', function($event, $element){
        	var navId = "nav" + $scope.data.MENU[$scope.data.MENU.length - 1].DAY;
        	var navId1 = "nav" + $scope.data.MENU[$scope.data.MENU.length - 2].DAY;
        	if (navId === $element.context.id || navId1 === $element.context.id) {
        		$scope.data.DAILY_MENU.collapsed = false;
        		$scope.vars.isAtBottom = true;
        	} else {
        		$scope.data.DAILY_MENU.collapsed = $scope.vars.cachedCollapse;
        		$scope.vars.isAtBottom = false;
        	}
        	$scope.$apply();
        });
        
        $scope.clickOnCommentTitle = function(data) {
        	if (!$scope.vars.isAtBottom) {
        		data.DAILY_MENU.collapsed = !data.DAILY_MENU.collapsed;
        		$scope.vars.cachedCollapse = $scope.data.DAILY_MENU.collapsed;
        		
        	} else {
        		data.DAILY_MENU.collapsed = false;
        	}
        };
        
        $scope.repeatComplete = function() {
            setTimeout(function() {
            	document.getElementById('nav' + $scope.data.todayStr).click();
            }, 100);
        };
        

        
//        $document.scrollToElement(someElement, offset, duration);

	});
    

})();
