(function ()
{
    'use strict';
    
    angular.module('myApp').controller('CartController', 
    		function ($scope, $state, $stateParams, webId) {
    	$scope.data = webId.getWeb();
    	$scope.contactInfo = {
    		phone: "",
    		firstName: "",
    		lastname: ""
    	};
    	$scope.radioModel = 'carryOut';

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
    		$scope.data.addToCart(item.itemCode, 0, true);
    	};
    	
    	$scope.addItem = function(item, quantity) {
    		item.quantity += quantity;
    		$scope.data.addToCart(item.itemCode, quantity);
    	};
    	
//    	$scope.checkContactInfo = function() {
//    		if (!$scope.contactInfo || $scope.contactInfo.length == 0)
//    			return false;
//    		if (!$scope.contactInfo.phone || $scope.contactInfo.phone.length )
//    			return false;
//    		if (!$scope.contactInfo.firstName || $scope.contactInfo.phone.length )
//    			return false;
//    		$scope.contactInfo = {
//    	    		phone: "",
//    	    		firstName: "",
//    	    		lastname: ""
//    	    	};
//    		
//    	};
    	$scope.sendEmail = function() {
    		$.ajax({
    			type: "POST",
    			url: "https://mandrillapp.com/api/1.0/messages/send.json",
    			data: {
    				'key': 'AH1ZCqyI9L45nqEv8h8m8w',
    			    'message': {
    			      'from_email': 'mania842@gmail.com',
    			      'to': [
    			          {
    			            'email': 'dev.yong842@gmail.com',
    			            'name': 'RECIPIENT NAME (OPTIONAL)',
    			            'type': 'to'
    			          },
    			          {
    			            'email': 'mania842@gmail.com',
    			            'name': 'ANOTHER RECIPIENT NAME (OPTIONAL)',
    			            'type': 'to'
    			          }
    			        ],
    			      'autotext': 'true',
    			      'subject': 'YOUR SUBJECT HERE!',
    			      'html': 'YOUR EMAIL CONTENT HERE! YOU CAN USE HTML!'
    			    }
    			  }
    			 }).done(function(response) {
    			   console.log(response); // if you're into that sorta thing
    			 });
    	};

    });
    
})();
