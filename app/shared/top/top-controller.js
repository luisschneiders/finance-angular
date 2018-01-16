angular.module('MyApp')
  .controller('TopCtrl', ['$scope', '$location', 'DefaultServices', function($scope, $location, DefaultServices) {
    $scope.data = DefaultServices.getTop();
  }]);
