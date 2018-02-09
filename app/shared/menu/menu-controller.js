angular.module('MyApp')
  .controller('MenuCtrl', ['$scope', '$location', '$window', '$auth', 'moment', function($scope, $location, $window, $auth, moment) {
    let state = {
      logo: '/img/schneiders-tech.svg',
      title: 'Your personal finance app',
      alt: 'Your personal finance app',
      width: 170,
      height: 170,
      year: moment().format('YYYY'),
      month: moment().format('MM'),
      period: {
        from: moment().startOf('month').format('YYYY-MM-DD'),
        to: moment().endOf('month').format('YYYY-MM-DD')
      }
    };

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.logout = function() {
      $auth.logout();
      delete $window.localStorage.user;
      $location.path('/');
    };

    $scope.state = state;
  }]);
