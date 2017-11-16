angular.module('MyApp')
  .controller('ResetCtrl', ['$scope', 'AccountServices', function($scope, AccountServices) {
    $scope.resetPassword = function() {
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
