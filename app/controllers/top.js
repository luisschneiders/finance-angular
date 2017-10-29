angular.module('MyApp')
  .controller('TopCtrl', ['$scope', '$location', 'DefaultServices', function($scope, $location, DefaultServices) {
    let data = {
      title: null,
      url: null,
      show: false
    };
    let top = DefaultServices.getTop();

    data.title = top.title;
    data.url = top.url;
    data.show = top.show;

    $scope.default = data;
  }]);
