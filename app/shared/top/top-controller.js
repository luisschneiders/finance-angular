angular.module('MyApp')
  .controller('TopCtrl', ['$scope', '$location', 'DefaultServices', function($scope, $location, DefaultServices) {
    // TODO: refactor this Controller.
    let data = DefaultServices.getTop();
    DefaultServices.setSettingsTop(data);

    $scope.data = data;
  }]);
