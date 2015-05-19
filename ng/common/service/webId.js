/**
 * Buffet - web data model
 */
(function ()
{
    'use strict';
    
    angular.module('myApp').service('webId', 
	function ($http, $rootScope, appService) {
    	var service = this;
    	var weekdayMap = { "SUN": 0, "MON": 1, "TUE": 2, "WED": 3, "THU": 4, "FRI": 5, "SAT": 6};
        var weekdayNumMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    	
    	// The cached data model object
    	service.web = { };
	    
	    //-----------------------------------------------------------------------

    	/**
    	 * Get and cache current web
    	 */
    	service.loadWebData = function(homepage) {
    		if (service.getDataPromise && service.homepage === homepage) {
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
//    		        console.log("service.web.openHoursDP", service.web.openHoursDP);
//    		        console.log("service.web.openHours", service.web.openHours);
    				
    				
    		    	var d = new Date();
    		    	service.web.todayStr = weekdayNumMap[d.getDay()];
    		    	console.log("service.web.todayStr", service.web.openHours[service.web.todayStr].OPEN_HOURS_STR);
    				
    				
   	    		   	return service.web;
    	    	}).then(function() {
    	    		$rootScope.title = service.web.TITLE;
    	    		$rootScope.$broadcast('service.webId:updated', service.getWeb());
    	    		appService.setCheckingOpenHours(service.web);
    	    	});
			}
    		
    		return service.getDataPromise;
    	};

//    	/**
//    	 * Load user info when service is created
//    	 */
//    	service.loadWebData();
    	
	    //-----------------------------------------------------------------------
    	
    	/**
    	 * Get web
    	 */
    	service.getWeb = function() {
    		return service.web;
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
    	
	    //-----------------------------------------------------------------------
	});
})();
