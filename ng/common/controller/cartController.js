(function ()
{
    'use strict';
    
    angular.module('myApp').controller('CartController', 
    		function ($location, $rootScope, $scope, $state, webId, appService, $localStorage, $filter, usSpinnerService) {
    	
    	$scope.url = {
    		cancel: $location.absUrl(),
    		completed: $location.absUrl().replace("cart", "order")
    	};
    	
    	$scope.stateList = appService.getStateList();
    	$scope.data = webId.getWeb();
    	$scope.payInfo = {
    		clicked: false,
    		isPayable: false
    	};
    	$scope.contactInfo = {
    		radioModel: "",
    		email: "",
    		phone1: "",
    		phone2: "",
    		phone3: "",
    		firstName: "",
    		lastName: "",
    		addr: {
    			line1: "",
    			line2: "",
    			city: "",
    			state: {
    				abbreviation: "",
    				name: ""
    			},
    			zipcode: ""
    		},
    		distance: 0,
    	};
    	$scope.getPhone = function() {
			return $scope.contactInfo.phone1 + "" + $scope.contactInfo.phone2 + "" + $scope.contactInfo.phone3;
		};
		$scope.spinnerActive = false;
    	
    	var geocoder = new google.maps.Geocoder();
    	var directionsService = new google.maps.DirectionsService();
    	
    	if ($localStorage.contactInfo)
    		$scope.contactInfo = $localStorage.contactInfo;
    	
    	if (!$scope.contactInfo.radioModel)
    		$scope.contactInfo.radioModel = "carryOut"; 
    	
    	if (!$scope.contactInfo.addr.state)
    		$scope.contactInfo.addr.state = appService.getStateObj($rootScope.admin.web.ADDRESS.STATE);
    	
    	$scope.$watch(function() {
    		return $scope.contactInfo;
    	}, function watchCallback(newValue, oldValue) {
    		$localStorage.contactInfo = newValue;
    		if ($scope.contactInfo.addr.state && $scope.contactInfo.addr.state.abbreviation)
    			$scope.contactInfo.addr.state = appService.getStateObj($scope.contactInfo.addr.state.abbreviation);
    	}, true);
    	
    	var codeAddress = function(address, payment) {
    		geocoder.geocode( { 'address': address}, function(results, status) {
    			if (status == google.maps.GeocoderStatus.OK) {
    				var from = new google.maps.LatLng($scope.data.LOCATION.LONG, $scope.data.LOCATION.LANG);
    				var to   = results[0].geometry.location;
    				
    				var request = {
    					origin:from,
    					destination:to,
    					travelMode: google.maps.DirectionsTravelMode.DRIVING
    				};
    				
    				directionsService.route(request, function(response, status) {
    					if (status == google.maps.DirectionsStatus.OK) {
    						$scope.contactInfo.distance = response.routes[0].legs[0].distance.value / 1000 * 0.6214;
    						var isDeliverable =  $scope.contactInfo.distance <= $scope.data.PAYMENT_INFO.DELIVERY_LIMIT_MILE;
    						
    						if (!isDeliverable) {
    							var errorMsg = "Sorry. we're unable to deliver to this address. We make deliveries within ";//1.5
    							errorMsg += $scope.data.PAYMENT_INFO.DELIVERY_LIMIT_MILE;
    							errorMsg += " mile(s) limit. The location is ";
    							errorMsg += $scope.contactInfo.distance.toFixed(2);
    							errorMsg += " mile(s) away.";
    							appService.errorNotification(errorMsg, 5000);
    							$rootScope.$apply();
    						} else {
    							goPay(payment);
    						}
    					}
    				});
    			}
    		});
    	};
    	
    	$scope.checkModel = {
    		carryOut: false,
    	    delivery: true
    	};
    	  
    	$scope.$on('service.webId:updated', function(event, data) {
    		$scope.data = data;
    		init();
       	});
    	
    	$scope.$on('service.webId:lang:updated', function(event, data) {
    		$scope.data = data;
    		init();
       	});
    	
    	var init = function() {
    		$scope.cart = [];
    		angular.forEach($scope.data.CART, function(item){
    			var itemCode = item.itemCode;
    			var quantity = item.quantity;
    			var mItem = {
    				name: $scope.data.ITEMS[itemCode].TITLE,
    				item: $scope.data.ITEMS[itemCode],
    				quantity: quantity,
    				price: $scope.data.ITEMS[itemCode].PRICE,
    				itemCode: itemCode,
    				tax: $scope.data.ITEMS[itemCode].PRICE * $scope.data.PAYMENT_INFO.TAX
    			};
    			$scope.cart.push(mItem);
    		});
    		$scope.data.CART_DATA = $scope.cart;
    	};
    	
    	if ($scope.data)
    		init();
    	
    	$scope.removeAllItems = function(item) {
    		var index = $scope.cart.indexOf(item);
    		if (index > -1) {
    			$scope.cart.splice(index, 1);
    		}
    		$scope.data.addToCart(item.itemCode, 0, true, true);
    	};
    	
    	$scope.addItem = function(item, quantity) {
    		item.quantity += quantity;
    		$scope.data.addToCart(item.itemCode, quantity, false, true);
    	};
    	
    	$scope.clickOnPay = function(payment) {
    		$scope.payInfo.clicked = true;
    		$scope.payInfo.isPayable = isPayable(payment);
    		
    		if ($scope.payInfo.isPayable) {
    			var addr = $scope.contactInfo.addr.line1 + " ";
    			addr += $scope.contactInfo.addr.city + " "
    				+ $scope.contactInfo.addr.state.abbreviation + " "
    				+ $scope.contactInfo.addr.zipcode;
    			
	    		var isDelivery = $scope.contactInfo.radioModel == 'delivery';
	    		var totalPrice = $scope.data.getTotalPrice(isDelivery);
	    		totalPrice = $filter("currency")(totalPrice, "$", 2);
	    		
	    		if ($scope.contactInfo.radioModel == 'delivery')
	    			codeAddress(addr, payment);
	    		else {
	    			goPay(payment);
	    		}
    		} else {
    			$scope.contactInfo.distance = 0;
    		}
    	};
    	
    	var goPay = function(payment) {
    		$scope.contactInfo.payment = payment;
    		var mPayment = {
    			totalQuantity: $scope.data.getTotalQuantity($scope.contactInfo.radioModel == 'delivery'),
    			totalTax: $scope.data.getTotalTax(),
    			totalPrice: $scope.data.getTotalPrice(),
    		};
    		$localStorage.payment = mPayment;
    		 
    		if (payment == 'paypal') {
				var form = $('form');
				$scope.spinnerActive = true;
	    		usSpinnerService.spin('spinner-1');
				form.submit();
			} else {
				$state.go('order');
			}
    	};
    	
    	var isPayable = function(payment) {
    		var info = $scope.contactInfo;
    		if (!info.firstName || info.firstName.length <= 0 )
    			return false;
    		if (!info.email || info.email.length <= 0)
    			return false;
    		if (!info.phone1 || info.phone1.length != 3)
    			return false;
    		if (!info.phone2 || info.phone2.length != 3)
    			return false;
    		if (!info.phone3 || info.phone3.length != 4)
    			return false;
    		if (info.radioModel === "carryOut")
    			return true;
    		
    		if (!info.addr)
    			return false;
    		if (!info.addr.line1 || info.addr.line1.length <= 0)
    			return false;
    		if (!info.addr.state || !info.addr.state.abbreviation)
    			return false;
    		if (!info.addr.city || info.addr.city.length <= 0)
    			return false;
    		if (!info.addr.zipcode || info.addr.zipcode.length != 5)
    			return false;
    		
			
    		/*if (payment == 'paypal') {
    			
    		} else if (payment == 'cash') {
    			
    		}*/
    		return true;
    	};
    });
    
})();
