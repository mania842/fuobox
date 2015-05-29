/**
 * Buffet - web data model
 */
(function ()
{
    'use strict';
    
    angular.module('myApp').service('webId', 
	function ($http, $rootScope, $location, $cookieStore, appService) {
    	var service = this;
    	var weekdayMap = { "SUN": 0, "MON": 1, "TUE": 2, "WED": 3, "THU": 4, "FRI": 5, "SAT": 6};
        var weekdayNumMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
//        var homepage = undefined;
    	// The cached data model object
    	service.web = { };
	    
	    //-----------------------------------------------------------------------

    	/**
    	 * Get and cache current web
    	 */
    	service.loadWebData = function() {
    		var reload = false;
    		var homepage = undefined;
    		if ($location.absUrl().indexOf("fuobox") > -1) {
    			if (service && service.homepage != "fuobox") {
    				homepage = "fuobox";
    				reload = true;
    			}
    		}
    		if (service.getDataPromise && !reload) {
    			// Kick off a digest since we're bypassing the $http call
//    			$digest();
    			return service.web;
			} else {
				var jsonData = 'json/' + homepage + "/homedata.json";
    			service.getDataPromise = $http.get(jsonData).success(function(data) {
   	    		   	// Copy properties from web service
    				angular.extend(service.web, data);
    				service.homepage = homepage;
    				var res = data.PHONE.split(" ");
    				service.web.PHONE = "(" + res[0] + ") " + res[1] + "-" + res[2];
    				service.web.CALL = "tel:" + res[0] + "-" + res[1] + "-" + res[2];
    				
    				service.web.logo = "json/" + service.web.DOMAIN + "/title.png";
    				
    				
    				// set open hours for location
    				service.web.openHours = [];
    				angular.forEach(service.web.LOCATION.OPEN_DAY, function(openDay) {
    		        	var day = openDay.DAY;
    		        	var openHours = openDay.OPEN + " - " + openDay.CLOSE;
    		        	service.web.openHours[day] = { DAY : day, OPEN_HOURS_STR: openHours, OPEN: openDay.OPEN, CLOSE: openDay.CLOSE};
    		        });
    		        
    				service.web.openHoursDP = [];
    		        var weekdaySameHours = true;
    		        var preObj = service.web.openHours[weekdayNumMap[1]];
    		        for (var i = 2; i <= 5; i++) {
    		        	var obj = service.web.openHours[weekdayNumMap[i]];
    		        	if (preObj.OPEN !== obj.OPEN || preObj.CLOSE !== obj.CLOSE) {
    		        		weekdaySameHours = false;
    		        		break;
    		        	}
    		        }
    		        var includingDays = [];
    		        if (!weekdaySameHours) {
    		        	var str = appService.upperOnlyFirstLetter(weekdayNumMap[1]);
    		        	for (var i = 2; i <= 5; i++) {
    		            	var obj = service.web.openHours[weekdayNumMap[i]];
    		            	
    		            	if (preObj.OPEN !== obj.OPEN || preObj.CLOSE !== obj.CLOSE) {
    		            		if (preObj.DAY !== weekdayNumMap[i - 1])
    		            			str += " - " + appService.upperOnlyFirstLetter(weekdayNumMap[i - 1]);
    		            		
    		            		includingDays.push(weekdayNumMap[i - 1]);
    		            		service.web.openHoursDP.push({DAY : str, HOURS : preObj.OPEN + " - " + preObj.CLOSE, INCLUDING_DAYS : includingDays});
    		            		includingDays = [];
    		            		preObj = service.web.openHours[weekdayNumMap[i]];
    		            		str = appService.upperOnlyFirstLetter(weekdayNumMap[i]);
    		            	} else {
    		            		includingDays.push(weekdayNumMap[i]);
    		            	}
    		            }
    		        } 
    		        var sat = service.web.openHours[weekdayNumMap[6]];
    		    	var sun = service.web.openHours[weekdayNumMap[0]];
    		    	var weekendSameHours = sat.OPEN === sun.OPEN && sat.CLOSE === sun.CLOSE;
    		    	
    		    	if (weekendSameHours) {
    		    		if (preObj.OPEN === sat.OPEN && preObj.CLOSE === sat.CLOSE) {
    		    			if (weekdaySameHours)
    		    				service.web.openHoursDP.push({DAY : "Everyday", HOURS : preObj.OPEN + " - " + preObj.CLOSE, INCLUDING_DAYS : weekdayNumMap});
    		    			else
    		    				service.web.openHoursDP.push({DAY : appService.upperOnlyFirstLetter(preObj.DAY) + " - " + appService.upperOnlyFirstLetter(weekdayNumMap[0]),
    		    					HOURS : preObj.OPEN + " - " + preObj.CLOSE,
    		    					INCLUDING_DAYS : weekdayNumMap.slice(weekdayMap[preObj.DAY])
    		    					});
    		    		} else {
    		    			if (weekdaySameHours)
    		    				service.web.openHoursDP.push({DAY : "Weekday", HOURS : preObj.OPEN + " - " + preObj.CLOSE, INCLUDING_DAYS: weekdayNumMap.slice(1, 6)});
    		    			else
    		    				service.web.openHoursDP.push({DAY : appService.upperOnlyFirstLetter(preObj.DAY) + " - " + appService.upperOnlyFirstLetter(weekdayNumMap[5]),
    		    					HOURS : preObj.OPEN + " - " + preObj.CLOSE, 
    		    					INCLUDING_DAYS : weekdayNumMap.slice(weekdayMap[preObj.DAY], 6)});
    		    			service.web.openHoursDP.push({DAY : "Weekend", HOURS : sat.OPEN + " - " + sat.CLOSE, INCLUDING_DAYS : [weekdayNumMap[0], weekdayNumMap[6]]});
    		    		}
    		    	} else {
    		    		if (preObj.OPEN === sat.OPEN && preObj.CLOSE === sat.CLOSE) {
    		    			service.web.openHoursDP.push({DAY : appService.upperOnlyFirstLetter(preObj.DAY) + " - " + appService.upperOnlyFirstLetter(weekdayNumMap[6]),
    		    				HOURS : preObj.OPEN + " - " + preObj.CLOSE,
    		    				INCLUDING_DAYS : weekdayNumMap.slice(weekdayMap[preObj.DAY])});
    		    		} else {
    		    			if (weekdaySameHours)
    		    				service.web.openHoursDP.push({DAY : "Weekday", HOURS : preObj.OPEN + " - " + preObj.CLOSE, INCLUDING_DAYS: weekdayNumMap.slice(1, 6)});
    		    			else {
    		    				if (preObj.DAY !== weekdayNumMap[5]) {
    		    					service.web.openHoursDP.push({DAY : appService.upperOnlyFirstLetter(preObj.DAY) + " - " + appService.upperOnlyFirstLetter(weekdayNumMap[5]),
    		        					HOURS : preObj.OPEN + " - " + preObj.CLOSE, 
    		        					INCLUDING_DAYS : weekdayNumMap.slice(weekdayMap[preObj.DAY], 6)});
    		    				} else {
    		    					service.web.openHoursDP.push({DAY : appService.upperOnlyFirstLetter(preObj.DAY),
    		        					HOURS : preObj.OPEN + " - " + preObj.CLOSE, 
    		        					INCLUDING_DAYS : weekdayNumMap.slice(weekdayMap[preObj.DAY], 6)});
    		    				}
    		    			}
    		    				
    		    			service.web.openHoursDP.push({DAY : "Sat", HOURS : sat.OPEN + " - " + sat.CLOSE, INCLUDING_DAYS: [weekdayNumMap[6]]});
    		    		}
    		    		
    		    		service.web.openHoursDP.push({DAY : "Sun", HOURS : sun.OPEN + " - " + sun.CLOSE, INCLUDING_DAYS: [weekdayNumMap[0]]});
    		    	}
    				
    		    	var d = new Date();
    		    	service.web.todayStr = weekdayNumMap[d.getDay()];
    				
    		    	
    		    	// items
    		    	var imgPath = 'json/' + homepage + "/img/";
    		    	if (service.web.ITEMS) {
	    		    	angular.forEach(service.web.ITEMS, function(item) {
	    		    		if (item.IMG) {
	    		    			item.IMG_PATH = {};
	    		    			item.IMG_PATH.SMALL = imgPath + "100/" + item.IMG + "." + item.EXT;
	    		    			item.IMG_PATH.MEDIUM = imgPath + "200/" + item.IMG + "." + item.EXT;
	    		    			item.IMG_PATH.LARGE = imgPath + "500/" + item.IMG + "." + item.EXT;
	    		    		}
	    		        });
    		    	}
    		    	if (service.web.ITEM_CATEGORY) {
	    		    	angular.forEach(service.web.ITEM_CATEGORY.CATEGORY, function(item) {
	    		    		if (service.web.ITEM_CATEGORY[item] && service.web.ITEM_CATEGORY[item].IMG) {
	    		    			var cItem = service.web.ITEM_CATEGORY[item];
	    		    			
	    		    			cItem.IMG_PATH = {};
	    		    			cItem.IMG_PATH.SMALL = imgPath + "100/" + cItem.IMG + "." + cItem.EXT;
	    		    			cItem.IMG_PATH.MEDIUM = imgPath + "200/" + cItem.IMG + "." + cItem.EXT;
	    		    			cItem.IMG_PATH.LARGE = imgPath + "500/" + cItem.IMG + "." + cItem.EXT;
	    		    			
	    		    		}
	    		        });
    		    	}
    		    	if (service.web.ALLOW_PAYMENT) {
    		    		var cartCookie = $cookieStore.get('cart');
    		    		service.web.CART = cartCookie;
    		    	}
    		    	
    		    	if (service.web.KOR_SUPPORT) {
	    		    	var isKorCookie = $cookieStore.get('isKor');
	    		    	if (!isKorCookie) {
	    		    		$cookieStore.put('isKor', false);
	    		    		isKorCookie = false;
	    		    	}
	    		    	service.web.isKor = isKorCookie;
    		    	}
    		    	
    		    	return service.web;
    	    	}).then(function() {
    	    		$rootScope.title = service.web.TITLE;
    	    		
    	    		if (service.web.KOR_SUPPORT) {
	    	    		$rootScope.$watch(function() {
	    	      		  return service.web.isKor;
		    	      	}, function watchCallback(newValue, oldValue) {
		    	      		$cookieStore.put('isKor', newValue);
		    	      		langChanged(newValue);
		    	      	});
    	    		}
    	    		
    	    		$rootScope.$broadcast('service.webId:updated', service.getWeb());
    	    		appService.setCheckingOpenHours(service.web);
    	    	});
			}
    		
    		return service.getDataPromise;
    	};
    	var langChanged = function(isKor) {
    		angular.forEach(service.web.ITEM_CATEGORY.CATEGORY, function(categoryCode) {
				var category = service.web.ITEM_CATEGORY[categoryCode];
				category.TITLE = isKor ? category.KOR : category.ENG;
			});
    		
    		angular.forEach(service.web.ITEMS, function(item) {
    			item.TITLE = isKor ? item.KOR : item.ENG;
    			item.DETAIL = isKor ? item.DETAIL_KOR : item.DETAIL_ENG;
			});
    		
    		$rootScope.$broadcast('service.webId:lang:updated', service.getWeb());
    	};
    	
//    	/**
//    	 * Load user info when service is created
//    	 */
    	
	    //-----------------------------------------------------------------------
    	
    	/**
    	 * Get web
    	 */
    	service.getWeb = function() {
    		return service.loadWebData();
    	};
    	
    	service.getWebFooter = function() {
    		return service.web ? service.web.FOOTER : {};
    	};
    	
    	service.getWebDomain = function() {
    		return service.web ? service.web.DOMAIN : {};
    	};
    	
    	service.web.getAddress = function() {
    		var str = "";
    		if (service.web.ADDRESS) {
    			str += service.web.ADDRESS.STREET_1.trim();
    			if (service.web.ADDRESS.STREET_2 && service.web.ADDRESS.STREET_2.length > 0)
    				str += " " + service.web.ADDRESS.STREET_2.trim();
    			str += ", " + service.web.ADDRESS.CITY.trim();
    			str += ", " + service.web.ADDRESS.STATE.trim();
    			str += " " + service.web.ADDRESS.ZIPCODE.trim();
    			
    			if (service.web.ADDRESS.OPTION && service.web.ADDRESS.OPTION.length > 0)
    				str += " " + service.web.ADDRESS.OPTION.trim();
    		}
    		return str;
    	};
    	
    	service.web.getAddress2 = function() {
    		var str = "";
    		if (service.web.ADDRESS) {
    			str += service.web.ADDRESS.STREET_1.trim();
    			if (service.web.ADDRESS.STREET_2 && service.web.ADDRESS.STREET_2.length > 0)
    				str += " " + service.web.ADDRESS.STREET_2.trim();
    			str += "\n" + service.web.ADDRESS.CITY.trim();
    			str += ", " + service.web.ADDRESS.STATE.trim();
    			str += " " + service.web.ADDRESS.ZIPCODE.trim();
    			if (service.web.ADDRESS.OPTION && service.web.ADDRESS.OPTION.length > 0)
    				str += "\n" + service.web.ADDRESS.OPTION.trim();
    			
    		}
    		return str;
    	};
    	
    	service.web.dateUpdated = function() {
    		var d = new Date();
	    	service.web.todayStr = weekdayNumMap[d.getDay()];
	    	appService.setCheckingOpenHours(service.web);
    	};
    	
    	service.web.getTotalQuantity = function() {
    		if (!service.web.CART)
    			return 0;
    		else {
    			var count = 0;
    			angular.forEach(service.web.CART, function(item) {
    				count += item.quantity;
    			});
    			return count;
    		}
    	};
    	service.web.getTotalTax = function() {
    		var totalTax = 0;
    		angular.forEach(service.web.CART_DATA, function(item) {
    			totalTax += item.tax * item.quantity; 
    		});
    		return totalTax;
    	};
    	service.web.getTotalPrice = function() {
    		var totalPrice = 0;
    		angular.forEach(service.web.CART_DATA, function(item) {
    			totalPrice += (item.price * item.quantity) + (item.tax * item.quantity); 
    		});
    		return totalPrice;
    	};
    	
    	service.web.addToCart = function(itemCode, quantity, removeAll) {
    		if (!itemCode || quantity == 0)
    			return;
    		if (!service.web.CART)
    			service.web.CART = {};
    		
    		if (!service.web.CART[itemCode]) {
    			service.web.CART[itemCode] = {};
        		service.web.CART[itemCode].itemCode = itemCode;
        		service.web.CART[itemCode].quantity = quantity;
    			
    		} else {
    			if (removeAll) {
    				delete service.web.CART[itemCode];
    			} else {
    				service.web.CART[itemCode].quantity += quantity;
    			}
    		}
    		
    		$cookieStore.put('cart', service.web.CART);
    	};
    	
    	service.web.getItem = function(itemCode) {
    		return service.web.ITEMS[itemCode];
    	};
    	
    	
    	service.loadWebData();
	    //-----------------------------------------------------------------------
	});
})();
