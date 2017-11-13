angular.module('MyApp')
  .controller('MenuCtrl', ['$scope', '$location', '$window', '$auth', 'moment', function($scope, $location, $window, $auth, moment) {
    let defaultsApp = {
      logo: null,
      title: null,
      alt: null,
      width: 170,
      year: moment().format('YYYY'),
      month: moment().format('MM')
    };

    defaultsApp.logo = '/img/schneiders-tech-software-development.svg';
    defaultsApp.title = 'Your personal finance app';
    defaultsApp.alt = defaultsApp.title;

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

    $scope.defaultsApp = defaultsApp;
  }]);
