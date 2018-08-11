angular.module('MyApp')
.factory('UserLocalStorageServices', ['$window', function($window) {
  return {
    updateUserSettings: function(params, value) {
      const updateUserSettings = {};
      let currentUserSettings = angular.fromJson($window.localStorage.userSettings);

      Object.defineProperty(updateUserSettings, params, {
        value: value,
        writable: true,
        enumerable: true,
        configurable: true
      });

      let newUserSettings = Object.assign({}, currentUserSettings, updateUserSettings);

      $window.localStorage.userSettings = angular.toJson(newUserSettings);
    }
  }
}]);
