angular.module('MyApp')
  .controller('TopCtrl', ['$scope', '$location', 'DefaultServices', function($scope, $location, DefaultServices) {
    let data = DefaultServices.getTop();
    DefaultServices.setSettingsTop(data);
    $scope.data = data;
  }]);
