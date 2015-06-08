/**
 * Common App Application module
 */

(function() {
	'use strict';

	// Define our module.
	var module = angular.module('myApp', [ 'ui.bootstrap',
			'ui.router', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ngStorage',
			'duScroll', 'toggle-switch', 'angularSpinner' ]);

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
		}).state('cart', {
			url : "/cart",
			templateUrl : "ng/common/html/cart.html",
			controller: 'CartController'
		}).state('order', {
			url : "/order",
			templateUrl : "ng/common/html/order.html",
			controller: 'OrderController'
		});
	});
	
	module.run(function($rootScope, $location, webId, appService) {
		document.addEventListener("touchstart", function() {},false);
		Date.prototype.stdTimezoneOffset = function() {
            var jan = new Date(this.getFullYear(), 0, 1);
            var jul = new Date(this.getFullYear(), 6, 1);
            return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
        };

        Date.prototype.dst = function() {
            return this.getTimezoneOffset() < this.stdTimezoneOffset();
        };
        
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
	module.directive('productionQty', function() {
		  return {
		    require: 'ngModel',
		    link: function (scope, element, attr, ngModelCtrl) {
		      function fromUser(text) {
		        var transformedInput = text.replace(/[^0-9]/g, '');
		        console.log(transformedInput);
		        if(transformedInput !== text) {
		            ngModelCtrl.$setViewValue(transformedInput);
		            ngModelCtrl.$render();
		        }
		        return transformedInput;
		      }
		      ngModelCtrl.$parsers.push(fromUser);
		    }
		  }; 
		});
	
	angular.module('myApp').directive('onCarouselChange', function ($parse) {
		return {
			require: 'carousel',
			link: function (scope, element, attrs, carouselCtrl) {
				var fn = $parse(attrs.onCarouselChange);
			    var origSelect = carouselCtrl.select;
			    carouselCtrl.select = function (nextSlide, direction) {
			    	if (nextSlide !== this.currentSlide) {
			    		fn(scope, {
			    			nextSlide: nextSlide,
			    			direction: direction,
			    		});
			    	}
			    	return origSelect.apply(this, arguments);
			    };
			}
		};
	});
	
	angular.module('myApp').controller('HomeController', function ($scope, $location, appService, webId) {
		$scope.appService = {
			deviceOS : appService.deviceOS
		};
		
//		$scope.spinneractive = false;
//		$rootScope.$on('us-spinner:spin', function(event, key) {
//			$scope.spinneractive = true;
//		});
//
//		$rootScope.$on('us-spinner:stop', function(event, key) {
//			$scope.spinneractive = false;
//		});
		$scope.getBackground = function() {
			return webId.web.MAIN_BG_STYLE;
		};
	});

})();
