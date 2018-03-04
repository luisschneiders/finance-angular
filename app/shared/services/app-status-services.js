angular.module('MyApp')
.factory('AppStatusServices', ['$window', '$rootScope', function($window, $rootScope) {
    let appStatus = {};

    appStatus.onLine = $window.navigator.onLine;

    appStatus.isOnline = function() {
        return appStatus.onLine;
    }

    $window.addEventListener("online", function () {
        appStatus.onLine = true;
        $rootScope.$digest();
    }, true);

    $window.addEventListener("offline", function () {
        appStatus.onLine = false;
        $rootScope.$digest();
    }, true);

    return appStatus;
}]);
