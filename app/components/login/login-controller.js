angular.module('MyApp')
  .controller('LoginCtrl', ['$scope', '$rootScope', '$location', '$window', '$auth', function($scope, $rootScope, $location, $window, $auth) {
    let data = {
      year: new Date().getFullYear()
    };

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.url(`/main=${data.year}`);
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.goToLocation = function(location) {
      switch(location) {
        case 'forgot':
          $location.url(`/forgot`);
          break;
        case 'signup':
          $location.url(`/signup`);
          break;
        default:
          $location.url(`/`);
          break;
      }
    }

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.url(`/main=${data.year}`);
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };

    $scope.data = data;
  }]);
