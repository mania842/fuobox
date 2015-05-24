(function ()
{
    'use strict';
    
    angular.module('myApp').controller('MenuController', 
    		function ($scope, $state, $stateParams, webId, appService) {
    	$scope.data = webId.getWeb();
    	$scope.categoryNav = [];
    	$scope.$on('service.webId:updated', function(event, data) {
    		$scope.data = data;
    		init();
       	});
    	
    	$scope.categoryName = $stateParams.categoryName;
    	var init = function() {
    		$scope.itemCategory = $scope.data.ITEM_CATEGORY;
        	$scope.categoryObj = undefined;
        	$scope.canContainOnlyOne = false;
        	$scope.categoryNav = [];
        	
        	if ($scope.categoryName && $scope.itemCategory) {
        		$scope.categoryObj = $scope.itemCategory[$scope.categoryName];
        		$scope.categoryNav.push({TITLE: "Menu", STATE: $scope.categoryObj.PARENT_STATE});
        		$scope.categoryNav.push({TITLE: $scope.categoryObj.TITLE, STATE: "category"});
        	}
    	};
    	
    	if ($scope.data)
    		init();
    	
    	
    	console.log("$scope.categoryName", $scope.categoryName);
    	
    	
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
    	
    	var viewOffsetMinWidth = 0;
    	// category
    	$scope.cachedPadding = 0;
    	$scope.getTop = function() {
    		var elementResult = document.getElementsByClassName('menu-fix')[0];
    		$scope.cachedOffSet = elementResult.offsetTop + elementResult.offsetHeight;
    		return {'top': elementResult.offsetHeight};
    	};
    	$scope.getPadding = function(isIOS) {
    		if (!isIOS)
    			return;
    		var dailyMenu = document.getElementsByClassName('menu-fix')[0];
    		var top = dailyMenu.offsetHeight + appService.em(1);
    		
    		top = top > $scope.cachedPadding ? top : $scope.cachedPadding;
    		$scope.cachedPadding = top;
    		return {'height': top};
    	};
    	
    	$scope.quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    	$scope.myQuantity = $scope.quantities[0];
    	var checkSize = function() {
    		var view = document.getElementsByClassName('app-ngview')[0];
    		var viewWidth = view.clientWidth <= appService.em(60) ? view.clientWidth : appService.em(60);
    		var availableWidth = viewWidth - appService.em(1);
    		
    		var eachWidth = (availableWidth / 2) - appService.em(1);
    		
    		var buttonView = document.getElementsByClassName('addToOrder')[0];
    		var priceLabelView = document.getElementsByClassName('priceLabel')[0];
    		var selectView = document.getElementsByClassName('myQuantity')[0];
    		
    		var isForOne = false;
    		if (buttonView.clientWidth == 0 || priceLabelView.clientWidth == 0 || selectView.clientWidth == 0) {
    			buttonView = document.getElementsByClassName('addToOrder')[1];
        		priceLabelView = document.getElementsByClassName('priceLabel')[1];
        		selectView = document.getElementsByClassName('myQuantity')[1];
        		isForOne = true;
    		}
    		
    		var minWidth = buttonView.clientWidth + priceLabelView.clientWidth + selectView.clientWidth + appService.em(4);
    		if (!isForOne) {
    			viewOffsetMinWidth = minWidth;
    		}
    		return eachWidth <= viewOffsetMinWidth;
    	};
    	
    	$scope.logResize = function () {
    		$scope.$apply();
        };
        
    	$scope.getItemTitle = function(itemCode) {
    		return $scope.data.ITEMS[itemCode].TITLE;
    	};
    	
    	
    	$scope.getCardWidth = function(itemCode, index) {
    		var view = document.getElementsByClassName('app-ngview')[0];
    		var viewWidth = view.clientWidth <= appService.em(60) ? view.clientWidth : appService.em(60);
    		
    		var availableWidth = viewWidth - appService.em(1);
    		var eachWidth = (availableWidth / 3) - appService.em(1);
    		
    		var minWidth = viewOffsetMinWidth;
    		
    		$scope.canContainOnlyOne = checkSize();
    		
    		if ($scope.canContainOnlyOne) {
    			var style = {"width" : availableWidth};
    			return style;
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
    			"width" : eachWidth,
    			"margin-bottom" : appService.em(.5)
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
    	
    	var buttonClicked = false;
    	$scope.clickOnAddToCart = function(itemCode) {
    		if (!$scope.data.ALLOW_PAYMENT)
    			return;
    		
    		buttonClicked = true;
    		console.log("itemCode", itemCode);
    	};
    	$scope.clickOnItemCard = function(itemCode) {
    		if (buttonClicked) {
    			buttonClicked = false;
    			return;
    		}
    		console.log("clickOn item card", itemCode);
    	};
    	$scope.clickOnSelect = function(itemCode) {
    		if (!$scope.data.ALLOW_PAYMENT)
    			return;
    		buttonClicked = true;
    		console.log("clickOn clickOnSelect", itemCode);
    	};
    	
	});
    
})();
