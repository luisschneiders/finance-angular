angular.module('MyApp')
  .controller('ResetCtrl', ['$scope', '$routeParams', 'AccountServices', function($scope, $routeParams, AccountServices) {
    $scope.resetPassword = function() {
      $scope.user.token = $routeParams.token;
      AccountServices.resetPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    }
  }]);
