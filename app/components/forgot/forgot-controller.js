angular.module('MyApp')
  .controller('ForgotCtrl', ['$scope', 'AccountServices', function($scope, AccountServices) {
    $scope.forgotPassword = function() {
      AccountServices.forgotPassword($scope.user)
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
    };
  }]);
