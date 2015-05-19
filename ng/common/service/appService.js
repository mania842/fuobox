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
    		console.log("timezone", timezone);
    		
    		console.log("OPEN", webId.openHours[webId.todayStr].OPEN);
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
    	
		
//    	service.isLoading = false;
//    	var opts1 = {
//    		lines: 10, // The number of lines to draw
//    		length: 15, // The length of each line
//    		width: 7, // The line thickness
//			radius: 15, // The radius of the inner circle
//			corners: 1, // Corner roundness (0..1)
//			rotate: 0, // The rotation offset
//			direction: 1, // 1: clockwise, -1: counterclockwise
//			speed: 1, // Rounds per second
//			trail: 60, // Afterglow percentage
//			shadow: false, // Whether to render a shadow
//			hwaccel: false, // Whether to use hardware acceleration
//			className: 'spinner', // The CSS class to assign to the spinner
//			zIndex: 2e9, // The z-index (defaults to 2000000000)
//			top: '50%', // Top position relative to parent
//			left: '50%' // Left position relative to parent
//    	};
//    	service.startSpinner = function() {
//    		$.fn.spin = function(opts) {
//    			this.each(function() {
//    				var $this = $(this),
//    				data = $this.data();
//    		 
//    				if (data.spinner) {
//    					data.spinner.stop();
//    					delete data.spinner;
//    				}
//    				if (opts !== false) {
//    					data.spinner = new Spinner($.extend({color: $this.css('color')}, opts1)).spin(this);
//    				}
//    			});
//    			return this;
//    		};
//    		service.isLoading = true;
//    		$('#spinner').spin();
//    	};
//    	
//    	service.stopSpinner = function() {
//    		service.isLoading = false;
//    		$('#spinner').spin(false);
//    	};
//    	
//    	service.serverErrorHandle = function(message) {
//    		service.stopSpinner();
//    		service.errorNotification(message);
//    	};
//    	
//    	
//    	service.successNotification = function(msg) {
//    		$rootScope.$broadcast('success', msg);
//    	};
//    	service.errorNotification = function(msg) {
//    		$rootScope.$broadcast('error', msg);
//    	};
//    	service.clearNotification = function() {
//    		$rootScope.$broadcast('clearNotification');
//    	};
//
//    	/**
//    	 * Set the title to display
//    	 */
//    	service.setMenubarTitle = function(title)
//    	{
//    		service.title = title;
//    	};

	    //-----------------------------------------------------------------------
	});
})();