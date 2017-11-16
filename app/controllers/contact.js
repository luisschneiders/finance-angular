angular.module('MyApp')
  .controller('ContactCtrl', ['$scope', 'ContactServices', function($scope, ContactServices) {
    $scope.sendContactForm = function() {
      ContactServices.send($scope.contact)
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
