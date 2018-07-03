angular.module('MyApp')
  .controller('TopCtrl', ['$scope', 'DefaultServices', function($scope, DefaultServices) {
    // TODO: refactor this Controller.
    let data = DefaultServices.getTop();
    DefaultServices.setSettingsTop(data);
    $scope.data = data;
  }]);
