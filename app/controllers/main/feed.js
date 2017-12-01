angular.module('MyApp')
  .controller('FeedCtrl', ['$scope', '$location', 'DefaultServices', function($scope, $location, DefaultServices) {
    let data = {
      title: 'Educational Ads...'
    }

    $scope.data = data;
  }]);
