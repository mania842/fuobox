(function ()
{
    'use strict';

    angular.module('myApp').directive('popdown', function($document, $timeout) {
        return {
            restrict: 'E',
            scope: {},
            replace: true,
            templateUrl: 'ng/common/directives/popdown.html',
            link: function($scope) {
            	var get_browser = function(){
            	    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
            	    if(/trident/i.test(M[1])){
            	        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
            	        return 'IE '+(tem[1]||'');
            	        }   
            	    if(M[1]==='Chrome'){
            	        tem=ua.match(/\bOPR\/(\d+)/);
            	        if(tem!=null)   {return 'Opera '+tem[1];}
            	        }   
            	    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            	    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
            	    return M[0];
            	};
            	
            	var get_browser_version = function() {
            		var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];	
            		if (/trident/i.test(M[1])) {
            			tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
						return 'IE ' + (tem[1] || '');
					}
            		if (M[1] === 'Chrome') {
            			tem = ua.match(/\bOPR\/(\d+)/);
            			if (tem != null) {
            				return 'Opera ' + tem[1];
            			}
					}
					M = M[2] ? [ M[1], M[2] ] : [navigator.appName, navigator.appVersion, '-?' ];
					if ((tem = ua.match(/version\/(\d+)/i)) != null) {
						M.splice(1, 1, tem[1]);
					}
					return M[1];
				};
				
				var isMSOldBrowser = get_browser() == 'MSIE' && get_browser_version() < 9;
				
                $scope.show = false;
                $scope.messageList = [];
                $scope.closeNotification = function(msg) {
                	var idx = $scope.messageList.indexOf(msg);
                	if (idx != -1) {
	                	document.getElementById(msg.id).classList.add('closed');
	                	$timeout(function() {
	                		var idx = $scope.messageList.indexOf(msg);
	                    	if (idx != -1) {
	                    		$scope.messageList.splice(idx, 1); // The second parameter is the number of elements to remove.
	                    	}
	                	}, 500);
	               	}
               	};
                
                $scope.$on('success', function(event, msg) {
                	if (isMSOldBrowser) {
                		alert(msg);
                	} else {
	                	var d = new Date();
	                	var n = d.getTime().toString(); 
	                    var newMsg = {status: 'success', message: msg, id:n };
	                    $scope.messageList.push(newMsg);
	                    $timeout(function() {
	                    	$scope.closeNotification(newMsg);
	                    }, 3000);
	                    $scope.toggleDisplay();
                	}
                });

                $scope.$on('error', function(event, msg, time) {
                	if (isMSOldBrowser) {
                		alert(msg);
                	} else {
	                	var d = new Date();
	                	var n = d.getTime().toString(); 
	                	var newMsg = {status: 'error', message: msg, id:n };
	                	$scope.messageList.push(newMsg);
	                	
	                	if (time) {
	                		$timeout(function() {
		                    	$scope.closeNotification(newMsg);
		                    }, time);
	                	}
	                    $scope.toggleDisplay();
                	}
                });
                
                $scope.$on('clearNotification', function(event) {
                	$scope.messageList = [];
                });

                $scope.toggleDisplay = function toggledisplay() {
                    $scope.show = $scope.messageList.length > 0;
                };
            }
        };
    });
})();