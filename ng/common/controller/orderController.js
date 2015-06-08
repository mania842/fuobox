(function ()
{
    'use strict';
    
    angular.module('myApp').controller('OrderController', function ($state, $scope, $location, $localStorage, webId, $filter) {
    	var initialized = false;
    	$scope.data = webId.getWeb();
    	$scope.$on('service.webId:updated', function(event, data) {
    		$scope.data = data;
    		init();
       	});
    	$scope.$on('service.webId:lang:updated', function(event, data) {
    		$scope.data = data;
    		init();
       	});
    	
    	var sendEmail = function() {
    		var clientName = $scope.contactInfo.firstName;
    		if ($scope.contactInfo.lastName && $scope.contactInfo.lastName.length > 0)
    			clientName += $scope.contactInfo.lastName;
    		var orderMethod = $scope.contactInfo.radioModel == 'carryOut' ? "Carry Out" : "Delivery";
    		var payment = $scope.contactInfo.payment == 'cash' ? "Cash" : "Paypal";
    		
    		var orderTime = new Date();
    		var body = "<p><h3><b><i>Order Confirmation</i></b></h3></p>";
    		body += "<p>Order: " + orderTime.toLocaleString() + "</p>";
    		body += "<p>Thank you for placing your order via our Online Ordering service</p>";
    		body += "<p><font color='red'>Please find below the details of your order</font></p>";
    		body += "<p>Order type: " + orderMethod + "</p>";
    		body += "<p>Method of Payment: " + payment + "</p>";
    		body += "<p><b>Restaurant Location:</b><br>";
    		body += $scope.data.ADDRESS.STREET_1 + "<br>";
    		if ($scope.data.ADDRESS.STREET_2 && $scope.data.ADDRESS.STREET_2.length > 0)
    			body += $scope.data.ADDRESS.STREET_2 + "<br>";
    		if ($scope.data.ADDRESS.OPTION && $scope.data.ADDRESS.OPTION.length > 0)
    			body += $scope.data.ADDRESS.OPTION + "<br>";
    		body += $scope.data.ADDRESS.CITY + ", " + $scope.data.ADDRESS.STATE + " " + $scope.data.ADDRESS.ZIPCODE + "</p>";
    		body += "<p>" + $scope.data.PHONE + "</p>";

    		var orderBody = "<p><b><font color='blue'>Order Detail:</font></b></p>";
    		orderBody += "<table><tr><td>Quantity&nbsp;&nbsp;</td><td>Item&nbsp;&nbsp;</td><td>Total&nbsp;&nbsp;</td></tr>";
    		
    		angular.forEach($scope.items, function(item){
    			orderBody += "<tr><td>" + item.quantity + "</td><td>" + item.name + "&nbsp;&nbsp;</td><td>" + $filter("currency")(item.price * item.quantity, "$", 2) + "&nbsp;&nbsp;</td><tr>";
    		});
    		
    		if (orderMethod == "Delivery") {
    			orderBody += "<tr><td>Delivery </td><td></td><td>" + $filter("currency")($scope.data.PAYMENT_INFO.DELIVERY_CHARGE, "$", 2) + " </td><tr>";
    		}
    		orderBody += "<tr><td>Tax </td><td></td><td>" + $filter("currency")($scope.payment.totalTax, "$", 2) + " </td><tr>";
    		orderBody += "<tr><td>Price </td><td></td><td>" + $filter("currency")($scope.payment.totalPrice, "$", 2) + " </td><tr></table>";
    		
    		body += orderBody;
    		body += "<p>Thank you for order online. For questions regarding your order, please call us at " + $scope.data.PHONE + ".</p>";
    		
    		var ownerBody = "<p><h3><b><i>Order Confirmation</i></b></h3></p>";
    		ownerBody += "<p>Order: " + orderTime.toLocaleString() + "</p>";
    		ownerBody += "<p>Order type: " + orderMethod + "</p>";
    		ownerBody += "<p>Method of Payment: " + payment + "</p>";
    		ownerBody += "<p><font color='blue'><b>Client Information:</b></font><br>";
    		ownerBody += "<p><b>" + $scope.contactInfo.firstName;
    		if ($scope.contactInfo.lastName && $scope.contactInfo.lastName.length > 0)
    			ownerBody += " " + $scope.contactInfo.lastName;
    		ownerBody += "</b><br>";
    		
    		if (orderMethod == "Delivery") {
	    		ownerBody += "<p>Address:<br>";
	    		ownerBody += $scope.contactInfo.addr.line1 + "<br>";
	    		if ($scope.contactInfo.addr.line2 && $scope.contactInfo.addr.line2.length > 0)
	    			ownerBody += $scope.contactInfo.addr.line2 + "<br>";
	    		ownerBody += $scope.contactInfo.addr.city + ", " + $scope.contactInfo.addr.state.abbreviation + " " + $scope.contactInfo.addr.zipcode + "</p>";
    		}
    		ownerBody += "<p>Phone: " + $scope.contactInfo.phone1 + "-" + $scope.contactInfo.phone2 + "-" + $scope.contactInfo.phone3 + "</p>";
    		ownerBody += "<p>Email: " + $scope.contactInfo.email + "</p>";
    		ownerBody += orderBody;
    		
//    		$scope.emailBody = body;
    		
//    		return;
    		// Order email to Owner
    		$.ajax({
    			type: "POST",
    			url: "https://mandrillapp.com/api/1.0/messages/send.json",
    			data: {
    				'key': 'AH1ZCqyI9L45nqEv8h8m8w',
    			    'message': {
    			    	'from_email': $scope.data.PAYMENT_INFO.EMAIL,
    			    	'to': [{
    			    		'email': $scope.data.PAYMENT_INFO.EMAIL,
    			            'name': "Online Ordered / " + orderMethod + " by " + clientName, //OPTIONAL
    			            'type': 'to'
    			          }/*, {
    			            'email': 'mania842@gmail.com',
    			            'name': 'ANOTHER RECIPIENT NAME (OPTIONAL)',
    			            'type': 'to'
    			          }*/],
    			      'autotext': 'true',
    			      'subject': $scope.data.TITLE + " Online Ordered / " + orderMethod,
    			      'html': ownerBody
    			    }
    			  }
    		}).done(function(response) {
    			console.log(response); // if you're into that sorta thing
    		});
    		
    		
    		// Order email to client
    		$.ajax({
    			type: "POST",
    			url: "https://mandrillapp.com/api/1.0/messages/send.json",
    			data: {
    				'key': 'AH1ZCqyI9L45nqEv8h8m8w',
    			    'message': {
    			    	'from_email': $scope.data.PAYMENT_INFO.EMAIL,
    			    	'to': [{
    			    		'email': $scope.contactInfo.email,
    			            'name': clientName, //OPTIONAL
    			            'type': 'to'
    			          }],
    			      'autotext': 'true',
    			      'subject': $scope.data.TITLE + " Online Ordered / " + orderMethod, 
    			      'html': body
    			    }
    			  }
    		}).done(function(response) {
    			console.log(response); // if you're into that sorta thing
    		});
    	};
    	
    	
    	var init = function() {
    		$scope.orderedItems = {};
        	angular.copy($localStorage.cart, $scope.orderedItems);
        	$scope.payment = {};
        	
        	$scope.contactInfo = $localStorage.contactInfo;
        	angular.copy($localStorage.payment, $scope.payment);
        	$scope.data.setOrderCompleted();
        	console.log("$localStorage.contactInfo", $localStorage.contactInfo);
        	console.log("$scope.contactInfo", $scope.contactInfo);
        	console.log("$scope.orderedItems", $scope.orderedItems);
        	
    		$scope.items = [];
    		angular.forEach($scope.orderedItems, function(item){
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
    			$scope.items.push(mItem);
    		});
    		if (!$scope.items || $scope.items.length <= 0) {
        		$state.go('menu');
        		return;
        	} else {
	    		if (!initialized) {
	    			initialized = true;
	    			sendEmail();
	    		}
        	}
    	};
    	if ($scope.data)
    		init();
    	
	});
    

})();
