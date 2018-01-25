angular.module('MyApp')
  .controller('LoginCtrl', ['$scope', '$rootScope', '$location', '$window', '$auth', 'DefaultServices', function($scope, $rootScope, $location, $window, $auth, DefaultServices) {
    let data = {
      top: {
        title: null,
        url: null,
        show: false
      },
      year: new Date().getFullYear()
    };

    // DefaultServices.setTop(data.top);

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path(`/main/${data.year}`);
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path(`/main/${data.year}`);
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
