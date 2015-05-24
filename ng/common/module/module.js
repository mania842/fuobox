/**
 * Common App Application module
 */

(function() {
	'use strict';

	// Define our module.
	var module = angular.module('myApp', [ 'ui.bootstrap', 'ui.router', 'ngSanitize', 'duScroll']);

	module.value('duScrollDuration', 500);
	module.value('duScrollBottomSpy', true);
	
	// Configure app
	module.config(function($stateProvider, $urlRouterProvider) {

		// For any unmatched url, redirect to /state1
		$urlRouterProvider.when('/', '/menu');
		$urlRouterProvider.otherwise("/");

		// Now set up the states
		$stateProvider.state('menu', {
			url : "/menu",
			templateUrl : "ng/common/html/menu.html",
			controller: 'MenuController'
		}).state('location', {
			url : "/location",
			templateUrl : "ng/common/html/location.html",
			controller: 'LocationController'
		}).state('category', {
			url : "/category/:categoryName",
			templateUrl : "ng/common/html/item-category.html",
			controller: 'MenuController'
		});
	});
	
	// Configure app
	/*module.config(function($routeProvider) {
		$routeProvider.when('/', {
			redirectTo: '/buffet/menu/gainesvillehomecooking',
			resolve: {
				myVar: function (webId) {
					webId.loadWebData("gainesvillehomecooking");
				}
				
			}
		})
		.when('/test', { templateUrl : 'ng/common/html/test.html' })
		.when('/location/:homepage', {
			templateUrl: 'ng/common/html/location.html',
			controller: 'LocationController'
		}).when('/about/:homepage', {
			templateUrl: 'ng/common/html/about.html',
			controller: 'AboutController'
		})
		.otherwise({ redirectTo : '/' });
	});*/

	/*module.factory('page', function() {
		var title = 'default';

		return {
			title : function() {
				return title;
			},
			setTitle : function(newTitle) {
				title = newTitle;
			}
		};
	});*/
	
	module.run(function($rootScope, $location, webId, appService) {
//		document.addEventListener("touchstart", function() {},false);
		Date.prototype.stdTimezoneOffset = function() {
            var jan = new Date(this.getFullYear(), 0, 1);
            var jul = new Date(this.getFullYear(), 6, 1);
            return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
        };

        Date.prototype.dst = function() {
            return this.getTimezoneOffset() < this.stdTimezoneOffset();
        };
        
//		if ($location.absUrl().indexOf("gainesvillehomecooking.com") > -1) {
//			$location.path('/buffet/menu/gainesvillehomecooking');
//			webId.loadWebData("gainesvillehomecooking");
//		} else if ($location.absUrl().indexOf("gainesvillehomecooking") > -1) {
////			$location.path('/buffet/menu/gainesvillehomecooking');
//			webId.loadWebData("gainesvillehomecooking");
//		}
        
        console.log("$location.absUrl()", $location.absUrl());
        console.log("$location.host();", $location.host());
        webId.loadWebData();
		
		$rootScope.admin = {
    		web : webId.web,
    		appService : appService
        };
	});
	
	module.directive("scrollbind", function ($document) {
    	return function($scope, element, attr) {
            angular.element(element).bind("scroll", function() {
            	var isScrollTop = this.scrollTop == 0;
            	
            	if (isScrollTop != $scope.isScrollTop) {
            		$scope.isScrollTop = isScrollTop;
            		$scope.$apply();
            	}
            });
    	};
    });
	
	module.directive('onSizeChanged', function ($window, appService) {
	    return {
	        restrict: 'A',
	        scope: {
	            onSizeChanged: '&'
	        },
	        link: function (scope, $element, attr) {
	            var element = $element[0];
	            scope.cachedElementWidth = 0;
	            scope.cachedElementHeight = 0;
	            cacheElementSize(scope, element);
	            
	            function cacheElementSize(scope, element) {
	            	scope.cachedElementWidth = element.offsetWidth;
	            	scope.cachedElementHeight = element.offsetHeight;
	            }
	            
	            function onWindowResize() {
	            	console.log("resize");
	                var isSizeChanged = scope.cachedElementWidth != element.offsetWidth || scope.cachedElementHeight != element.offsetHeight;
	                
	                if (isSizeChanged) {
	                	cacheElementSize(scope, element);
	                    var expression = scope.onSizeChanged();
	                    expression();
	                }
	            };
	            
	            if (appService.deviceOS == 'iOS') {
		            angular.element($window).bind('orientationchange', function () {
		            	cacheElementSize(scope, element);
	                    var expression = scope.onSizeChanged();
	                    expression();
		            });
	            } else {
	            	$window.addEventListener('resize', onWindowResize);
	            }
	        }
	    };
	});
	
	
	angular.module('myApp').controller('HomeController', 
    		function ($scope, $location, appService, webId) {
		$scope.appService = {
			deviceOS : appService.deviceOS
		};
		
		$scope.getBackground = function() {
			return webId.web.MAIN_BG_STYLE;
		};
	});

})();
