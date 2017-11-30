angular.module('MyApp')
  .controller('TopCtrl', ['$scope', '$location', 'DefaultServices', function($scope, $location, DefaultServices) {
    let data = DefaultServices.getTop();

    $scope.default = data;
  }]);
