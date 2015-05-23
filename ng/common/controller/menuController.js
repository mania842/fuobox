(function ()
{
    'use strict';
    
    angular.module('myApp').controller('MenuController', 
    		function ($scope, $state, $stateParams, webId, appService) {
    	$scope.data = webId.getWeb();
    	$scope.itemCategory = $scope.data.ITEM_CATEGORY;
    	$scope.categoryObj = undefined;
    	$scope.canContainOnlyOne = false;
    	var categoryName = $stateParams.categoryName;
    	if (categoryName && $scope.itemCategory) {
    		$scope.categoryObj = $scope.itemCategory[categoryName];
    	}
    	
    	// menu
    	$scope.getMenus = function(section) {
    		return $scope.itemCategory[section]; 
    	};
    	
    	$scope.getFirstItemImg = function(section) {
    		return $scope.itemCategory[section].IMG_PATH;
    	};
    	
    	$scope.clickCategory = function(category) {
    		$state.go('category', { categoryName: category });
    	};
    	
    	
    	
    	// category
    	$scope.quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    	$scope.myQuantity = $scope.quantities[0];
//    	var canContainOnlyOne = false;
    	var checkSize = function() {
    		var view = document.getElementsByClassName('app-ngview')[0];
    		var viewWidth = view.clientWidth <= appService.em(60) ? view.clientWidth : appService.em(60);
    		var availableWidth = viewWidth - appService.em(2);
    		
    		var eachWidth = (availableWidth / 2) - appService.em(1);
    		
    		var buttonView = document.getElementsByClassName('addToOrder')[0];
    		var priceLabelView = document.getElementsByClassName('priceLabel')[0];
    		var selectView = document.getElementsByClassName('myQuantity')[0];
    		
    		if (buttonView.clientWidth == 0 || priceLabelView.clientWidth == 0 || selectView.clientWidth == 0) {
    			buttonView = document.getElementsByClassName('addToOrder')[1];
        		priceLabelView = document.getElementsByClassName('priceLabel')[1];
        		selectView = document.getElementsByClassName('myQuantity')[1];
    		}
    		
    		var minWidth = buttonView.clientWidth + priceLabelView.clientWidth + selectView.clientWidth + appService.em(4);
    		return eachWidth <= minWidth;
    	}
    	
    	$scope.logResize = function () {
    		$scope.$apply();
        };
        
    	$scope.getItemTitle = function(itemCode) {
    		return $scope.data.ITEMS[itemCode].TITLE;
    	};
    	
    	
    	$scope.getCardWidth = function(itemCode, index) {
    		var view = document.getElementsByClassName('app-ngview')[0];
    		var viewWidth = view.clientWidth <= appService.em(60) ? view.clientWidth : appService.em(60);
    		var itemView = document.getElementById(itemCode);
    		
    		var availableWidth = viewWidth - appService.em(2);
    		
    		var eachWidth = (availableWidth / 3) - appService.em(1);
    		
    		var buttonView = itemView.getElementsByClassName('addToOrder')[0];
    		var priceLabelView = itemView.getElementsByClassName('priceLabel')[0];
    		var selectView = itemView.getElementsByClassName('myQuantity')[0];
    		var minWidth = buttonView.clientWidth + priceLabelView.clientWidth + selectView.clientWidth + appService.em(4);
    		
//    		console.log(eachWidth, minWidth);
    		
    		$scope.canContainOnlyOne = checkSize();
    		
    		if ($scope.canContainOnlyOne) {
    			var oneContainer = itemView.getElementsByClassName('oneContainer')[0];
    			
    			var iconTableView = oneContainer.getElementsByClassName('icon')[0];
    			var titleTableView = oneContainer.getElementsByClassName('title')[0];
    			var cartTableView = oneContainer.getElementsByClassName('cart')[0];
    			var pricetdTableView = oneContainer.getElementsByClassName('pricetd')[0];
    			
    			var minTableWidth = iconTableView.clientWidth + titleTableView.clientWidth + cartTableView.clientWidth + pricetdTableView.clientWidth + appService.em(3);
    			console.log("iconTableView.clientWidth", iconTableView);
    			console.log("titleTableView.clientWidth", titleTableView);
    			console.log("pricetdTableView.clientWidth", pricetdTableView);
    			console.log("minTableWidth", minTableWidth);
    			
    			console.log(availableWidth, minTableWidth);
    			var style = {"width" : availableWidth};
//    			if (availableWidth < minTableWidth)
//    				style["min-width"] = minTableWidth;
    			return style;
//    			return {
//        			"width" : availableWidth
//        		};
    		}
    		if (eachWidth < minWidth)
    			eachWidth = (availableWidth / 2) - appService.em(1);
    		
    		
    		if (eachWidth < minWidth) {
    			$scope.canContainOnlyOne = true;
    			eachWidth = availableWidth;
    		} else {
    			$scope.canContainOnlyOne = false;
    			eachWidth = Math.max(eachWidth, minWidth);
    		}
    		return {
    			"width" : eachWidth
    		};
    	};
    	$scope.getItemImgStyle = function(itemCode) {
    		return {
    			"background": "url('" + $scope.data.ITEMS[itemCode].IMG_PATH + "')",
    			"background-repeat": "no-repeat",
    	    	"background-size": "100%",
    	    	"background-position": "center"
    		};
    	};
    	$scope.getItemPrice = function(itemCode) {
    		return "$" + $scope.data.ITEMS[itemCode].PRICE;
    	};
    	
    	$scope.clickOnAddToCart = function(itemCode) {
    		if (!$scope.data.ALLOW_PAYMENT)
    			return;
    		console.log("itemCode", itemCode);
    	};
    	
	});
    
})();
