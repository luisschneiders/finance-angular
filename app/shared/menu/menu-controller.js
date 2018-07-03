angular.module('MyApp')
  .controller('MenuCtrl', ['$scope', '$location', '$window', '$auth', 'moment', function($scope, $location, $window, $auth, moment) {
    let state = {
      logo: '/img/schneiders-tech.svg',
      title: 'Your personal finance app',
      alt: 'Your personal finance app',
      width: 170,
      height: 170,
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

    $scope.getAnnualData = function() {
      $location.url(`/main=${moment().format('YYYY')}`);
    };

    $scope.getMonthlyTransactions = function() {
      $location.path(`/transactions/from=${moment().startOf('month').format('YYYY-MM-DD')}&to=${moment().endOf('month').format('YYYY-MM-DD')}&transactions=all`);
    };

    $scope.getMonthlyPurchases = function() {
      $location.path(`/purchases/from=${moment().startOf('month').format('YYYY-MM-DD')}&to=${moment().endOf('month').format('YYYY-MM-DD')}&expenses=all`);
    }

    $scope.getMonthlyTimesheet = function() {
      $location.url(`/timesheets?calendar=${moment().startOf('month').format('YYYY-MM')}`);
    }

    $scope.state = state;
  }]);
