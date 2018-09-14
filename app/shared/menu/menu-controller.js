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
      return viewLocation === $location.url();
    };

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.logout = function() {
      $auth.logout();
      delete $window.localStorage.user;
      $location.url(`/`);
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

    $scope.getMonthlyDataMaintenance = function() {
      $location.url(`/data-maintenance?calendar=${moment().startOf('month').format('YYYY-MM')}`);
    }

    $scope.goToLocation = function(location) {

      switch(location) {
        case 'all-banks':
          $location.url(`all-banks?page=1&pageSize=12`);
          break;
        case 'all-users':
          $location.url(`all-users?page=1&pageSize=12`);
          break;
        case 'all-expenses-type':
          $location.url(`all-expenses-type?page=1&pageSize=12`);
          break;
        case 'all-transactions-type':
          $location.url(`all-transactions-type?page=1&pageSize=12`);
          break;
        case 'populate-database':
          $location.url(`populate-database`);
          break;
        case 'account':
          $location.url(`account`);
          break;
        case 'login':
          $location.url(`login`);
          break;
        case 'signup':
          $location.url(`signup`);
          break;
        default:
          getAnnualData();
          break;
      }
    }

    $scope.state = state;
  }]);
