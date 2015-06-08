/**
 * App Overall Service
 */
(function ()
{
    'use strict';
    
    angular.module('myApp').service('appService', 
	function ($rootScope)
	{
    	var service = this;
    	service.stateList = [{"name":"Alabama","abbreviation":"AL"},{"name":"Alaska","abbreviation":"AK"},{"name":"American Samoa","abbreviation":"AS"},{"name":"Arizona","abbreviation":"AZ"},{"name":"Arkansas","abbreviation":"AR"},{"name":"California","abbreviation":"CA"},{"name":"Colorado","abbreviation":"CO"},{"name":"Connecticut","abbreviation":"CT"},{"name":"Delaware","abbreviation":"DE"},{"name":"District Of Columbia","abbreviation":"DC"},{"name":"Federated States Of Micronesia","abbreviation":"FM"},{"name":"Florida","abbreviation":"FL"},{"name":"Georgia","abbreviation":"GA"},{"name":"Guam","abbreviation":"GU"},{"name":"Hawaii","abbreviation":"HI"},{"name":"Idaho","abbreviation":"ID"},{"name":"Illinois","abbreviation":"IL"},{"name":"Indiana","abbreviation":"IN"},{"name":"Iowa","abbreviation":"IA"},{"name":"Kansas","abbreviation":"KS"},{"name":"Kentucky","abbreviation":"KY"},{"name":"Louisiana","abbreviation":"LA"},{"name":"Maine","abbreviation":"ME"},{"name":"Marshall Islands","abbreviation":"MH"},{"name":"Maryland","abbreviation":"MD"},{"name":"Massachusetts","abbreviation":"MA"},{"name":"Michigan","abbreviation":"MI"},{"name":"Minnesota","abbreviation":"MN"},{"name":"Mississippi","abbreviation":"MS"},{"name":"Missouri","abbreviation":"MO"},{"name":"Montana","abbreviation":"MT"},{"name":"Nebraska","abbreviation":"NE"},{"name":"Nevada","abbreviation":"NV"},{"name":"New Hampshire","abbreviation":"NH"},{"name":"New Jersey","abbreviation":"NJ"},{"name":"New Mexico","abbreviation":"NM"},{"name":"New York","abbreviation":"NY"},{"name":"North Carolina","abbreviation":"NC"},{"name":"North Dakota","abbreviation":"ND"},{"name":"Northern Mariana Islands","abbreviation":"MP"},{"name":"Ohio","abbreviation":"OH"},{"name":"Oklahoma","abbreviation":"OK"},{"name":"Oregon","abbreviation":"OR"},{"name":"Palau","abbreviation":"PW"},{"name":"Pennsylvania","abbreviation":"PA"},{"name":"Puerto Rico","abbreviation":"PR"},{"name":"Rhode Island","abbreviation":"RI"},{"name":"South Carolina","abbreviation":"SC"},{"name":"South Dakota","abbreviation":"SD"},{"name":"Tennessee","abbreviation":"TN"},{"name":"Texas","abbreviation":"TX"},{"name":"Utah","abbreviation":"UT"},{"name":"Vermont","abbreviation":"VT"},{"name":"Virgin Islands","abbreviation":"VI"},{"name":"Virginia","abbreviation":"VA"},{"name":"Washington","abbreviation":"WA"},{"name":"West Virginia","abbreviation":"WV"},{"name":"Wisconsin","abbreviation":"WI"},{"name":"Wyoming","abbreviation":"WY"}];
    	var isDevice = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
            },
            any: function() {
                return (isDevice.Android() || isDevice.BlackBerry() || isDevice.iOS() || isDevice.Opera() || isDevice.Windows());
            },
            getOS: function() {
            	return isDevice.iOS() ? "iOS" : "any";
            }
        };
    	
    	service.successNotification = function(msg) {
    		$rootScope.$broadcast('success', msg);
    	};
    	service.errorNotification = function(msg, time) {
    		$rootScope.$broadcast('error', msg, time);
    	};
    	service.clearNotification = function() {
    		$rootScope.$broadcast('clearNotification');
    	};
    	
    	service.isDevice = isDevice.any();
    	service.deviceOS = isDevice.getOS();
    	service.isIPhone = navigator.userAgent.match(/iPhone|iPod/i);
    	service.isLandscape = function() {
    		return window.innerWidth > window.innerHeight;
    	};
    	service.isOpen = true;
    	
    	service.em = function (input) {
		    var emSize = parseFloat($("body").css("font-size"));
		    return (emSize * input);
		};
		
		service.getLocalTime = function() {
			
		};
		
		service.upperOnlyFirstLetter = function(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
		};
		
		var getTimezoneOffset = function (timezone) {
			var offset = 0;
            if (timezone == "EST") {
            	offset = -5.0;
            }
            return offset;
		};
    	var getTodayUTCTimeWithHour = function(hour, timezone) { // hh:mm a 10:00 am 
    		var offset = getTimezoneOffset(timezone);
            var today = new Date();
            var str = today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear() + " ";
            str += hour;
            var clientDate = new Date(str);
            
//    		var clientDate = new Date();
            var utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
            if (clientDate.dst())
            	offset++;
            
            return new Date(utc + (3600000*offset));
    	};
    	
    	var getCurrentUTCTime = function(timezone) {
    		var offset = getTimezoneOffset(timezone);
            var clientDate = new Date();
            
            var utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
            if (clientDate.dst())
            	offset++;
            
            return new Date(utc + (3600000*offset));
    	};
    	
    	var timezone, openTime, closeTime, currentTime, webId;
    	service.setCheckingOpenHours = function(data) {
    		webId = data;
    		timezone = webId.LOCATION.TIMEZONE;
    		var open = webId.openHours[webId.todayStr].OPEN;
    		var close = webId.openHours[webId.todayStr].CLOSE;
//    		console.log("timezone", timezone);
    		
//    		console.log("OPEN", webId.openHours[webId.todayStr].OPEN);
    		openTime = getTodayUTCTimeWithHour(open, timezone);
            closeTime = getTodayUTCTimeWithHour(close, timezone);
            
            checkTime();
    	};
    	
    	var isOpen = function() {
    		currentTime = getCurrentUTCTime(timezone);
//    		service.time = currentTime.toLocaleString();
    		return currentTime >= openTime && currentTime <= closeTime;
    	};
    	
    	var checkTime = function() {
    		setTimeout(function() {
    			if (currentTime) {
        			if (closeTime.getDate() != currentTime.getDate()) {
        				webId.dateUpdated();
        				$rootScope.$apply();
        				return;
        			}
    			}
    			
    			if (service.isOpen != isOpen()) {
    				service.isOpen = isOpen();
    				$rootScope.$apply();
    			}
        		
                checkTime(); // schedule another update
    		}, 1000);
    	};
    	service.getStateList = function() {
    		return service.stateList; 
    	};
    	
		service.getStateObj = function(abbr) {
			for (var i in service.stateList) {
				if (abbr == service.stateList[i].abbreviation)
					return service.stateList[i];
			}
		};
	    //-----------------------------------------------------------------------
	});
})();
