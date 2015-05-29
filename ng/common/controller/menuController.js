(function ()
{
    'use strict';
    
    angular.module('myApp').controller('MenuController', 
    		function ($scope, $state, $stateParams, webId, appService, $modal) {
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
    	
    	
    	// menu
    	$scope.getMenus = function(section) {
    		return $scope.itemCategory[section]; 
    	};
    	
    	$scope.getFirstItemImg = function(section) {
    		if ($scope.itemCategory[section] && $scope.itemCategory[section].IMG_PATH)
    			return $scope.itemCategory[section].IMG_PATH.SMALL;
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
    	var checkSize = function(itemCode) {
    		var view = document.getElementsByClassName('app-ngview')[0];
    		var viewWidth = view.clientWidth <= appService.em(60) ? view.clientWidth : appService.em(60);
    		var availableWidth = viewWidth - appService.em(1);
    		
    		var eachWidth = (availableWidth / 2) - appService.em(1);
    		
    		var itemCodeView = document.getElementById(itemCode);
    		var buttonView = itemCodeView.getElementsByClassName('addToOrder')[0];
    		var priceLabelView = itemCodeView.getElementsByClassName('priceLabel')[0];
    		var selectView = itemCodeView.getElementsByClassName('myQuantity')[0];
    		
    		var isForOne = false;
    		if (buttonView.clientWidth == 0 || priceLabelView.clientWidth == 0 || selectView.clientWidth == 0) {
    			buttonView = itemCodeView.getElementsByClassName('addToOrder')[1];
        		priceLabelView = itemCodeView.getElementsByClassName('priceLabel')[1];
        		selectView = itemCodeView.getElementsByClassName('myQuantity')[1];
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
    		
    		$scope.canContainOnlyOne = checkSize(itemCode);
    		
    		if ($scope.canContainOnlyOne) {
    			var style = {"width" : availableWidth};
    			return style;
    		}
    		if (eachWidth < minWidth)
    			eachWidth = (availableWidth / 2) - appService.em(1);
    		
    		
    		if (eachWidth <= minWidth) {
    			eachWidth = availableWidth;
    			return;
    		} else {
    			eachWidth = Math.max(eachWidth, minWidth);
    		}
    		return {
    			"width" : eachWidth,
    			"margin-bottom" : appService.em(.5)
    		};
    	};
    	$scope.getItemImgStyle = function(itemCode, size) {
    		var imgPath = size === 'M' ? $scope.data.ITEMS[itemCode].IMG_PATH.MEDIUM : size === 'L' ? $scope.data.ITEMS[itemCode].IMG_PATH.LARGE : $scope.data.ITEMS[itemCode].IMG_PATH.SMALL;
    		return {
    			"background": "url('" + imgPath + "')",
    			"background-repeat": "no-repeat",
    	    	"background-size": "cover",
    	    	"background-position": "center"
    		};
    	};
    	$scope.getItemImgIconStyle = function(itemCode) {
    		var itemCodeView = document.getElementById(itemCode);
    		var itemTdView = itemCodeView.getElementsByClassName('item')[0];
    		return {
    			"height" : itemTdView.offsetHeight - appService.em(.5)
    		};
    	};
    	$scope.getCartTdWidth = function(itemCode) {
    		if (!$scope.canContainOnlyOne)
    			return;
    		var itemCodeView = document.getElementById(itemCode);
    		var cartTdView = itemCodeView.getElementsByClassName('cart')[0];
    		var width = cartTdView.offsetWidth - appService.em(1);
    		
    		return {
    			"width" : width
    		};
    	};
    	$scope.getItemPrice = function(itemCode) {
    		return "$" + $scope.data.ITEMS[itemCode].PRICE;
    	};
    	$scope.getItemDetails = function(itemCode) {
    		return $scope.data.ITEMS[itemCode].DETAIL;
    	};
    	$scope.openItemDetails = function(itemCode, index) {
    		console.log(itemCode, index);
    		console.log("$scope.categoryObj.CATEGORY", $scope.categoryObj.CATEGORY);
    		var modalInstance = $modal.open({
    			animation: true,
    			templateUrl: 'ng/common/html/item-details.html',
    			controller: 'ModalInstanceCtrl',
    			resolve: {
    				items: function () {
    					var items = [];
    					angular.forEach($scope.categoryObj.CATEGORY, function(itemCode) {
    						$scope.data.ITEMS[itemCode].itemCode = itemCode;
    						items.push($scope.data.ITEMS[itemCode]);
    					});
    					return items;
    				},
    				startIndex: function () {
    					return index;
    				},
    				headerTitle: function () {
    					var parentState = $scope.data.ITEMS[itemCode].PARENT_STATE;
    					return $scope.data.ITEM_CATEGORY[parentState].TITLE; 
    				}
    				
    			}
    		});

    		modalInstance.result.then(function (selectedItem) {
    			$scope.selected = selectedItem;
    		}, function () {
    			console.log('Modal dismissed at: ' + new Date());
    		});
    	};
    	
    	$scope.clickOnAddToCart = function(itemCode, quantity) {
    		if (!$scope.data.ALLOW_PAYMENT)
    			return;
    		
    		$scope.data.addToCart(itemCode, quantity);
    	};
    	$scope.clickOnItemDetails = function(itemCode) {
    		console.log("clickOn item card", itemCode);
    	};
    	
	});
    
    
    
    /*
     * Modal Controller
     * */
    
    angular.module('myApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, startIndex, headerTitle, webId) {
    	$scope.quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    	$scope.myQuantity = $scope.quantities[0];
    	
    	$scope.myInterval = 0;//5000;
    	$scope.headerTitle = headerTitle;
    	$scope.items = items;
    	console.log("items", items);
    	
    	$scope.selected = {
    		item: $scope.items[startIndex]
    	};
    	$scope.items[startIndex].active = true;
    	
    	$scope.getDetailsItemImgStyle = function(item) {
    		return {
    			"background": "url('" + item.IMG_PATH.LARGE + "')",
    			"background-repeat": "no-repeat",
    	    	"background-size": "cover",
    	    	"background-position": "center"
    		};
    	};
    	
    	$scope.onSlideChanged = function (nextSlide, direction) {
    		$scope.selected.item = nextSlide.$parent.item;
    	};
    	
    	$scope.clickOnAddToCart = function(itemCode, quantity) {
    		if (!webId.getWeb().ALLOW_PAYMENT)
    			return;
    		
    		webId.getWeb().addToCart(itemCode, quantity);
    	};
    	
    	$scope.ok = function () {
//    		$modalInstance.close($scope.selected.item);
    	};

    	$scope.cancel = function () {
    		$modalInstance.dismiss('cancel');
    	};
    });
    
})();
