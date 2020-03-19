angular.module('MyApp')
  .controller('MenuCtrl', ['$scope', '$location', '$window', '$auth', 'moment', 
  function($scope, $location, $window, $auth, moment) {
    class State {
      constructor(app, navIsAuthenticated, navNotAuthenticated) {
        this.app = app;
        this.navIsAuthenticated = navIsAuthenticated;
        this.navNotAuthenticated = navNotAuthenticated;
      }
    };

    class Params {
      constructor() {
        this.rows = JSON.parse($window.localStorage.userSettings);
      }
    };

    class App {
      constructor() {
        this.logo = '/img/schneiders-tech.svg';
        this.title = 'Your personal finance app';
        this.alt = 'Your personal finance app';
        this.width = 170;
        this.height = 170;
      }
    }

    let navIsAuthenticated = [
      {
        id: 0,
        target: null,
        class: '',
        value: 'annual-data',
        label: 'Dashboard',
        icon: 'fa fa-dashboard fa-lg',
        hasSubMenu: false,
      },
      {
        id: 1,
        target: '#setup',
        class: 'setup',
        value: '',
        label: 'Setup',
        icon: 'fa fa-cogs fa-lg',
        hasSubMenu: true,
        subMenu: [
          {
            id: 2,
            value: 'all-banks',
            label: 'Banks',
            icon: '',
            hasSubMenu: false,
          },
          {
            id: 3,
            value: 'all-users',
            label: 'Users',
            icon: '',
            hasSubMenu: false,
          },
        ]
      },
    ];

    let navNotAuthenticated = [
      {
        id: 0,
        value: 'login',
        label: 'Log in',
        icon: '',
        hasSubMenu: false,
        isSubMenu: false,
      },
      {
        id: 1,
        value: 'signup',
        label: 'Sign up',
        icon: '',
        hasSubMenu: false,
        isSubMenu: false,
      }
    ]

    let params = new Params();
    let app = new App();
    let state = new State(app, navIsAuthenticated, navNotAuthenticated);

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

    $scope.getMonthlyTransactions = function() {
      isActive(11);
      $location.path(`/transactions/from=${moment().startOf('month').format('YYYY-MM-DD')}&to=${moment().endOf('month').format('YYYY-MM-DD')}&transactions=all`);
    };

    $scope.getMonthlyPurchases = function() {
      isActive(9);
      $location.path(`/purchases/from=${moment().startOf('month').format('YYYY-MM-DD')}&to=${moment().endOf('month').format('YYYY-MM-DD')}&expenses=all`);
    }

    $scope.getMonthlyTimesheet = function() {
      isActive(10);
      $location.url(`/timesheets?calendar=${moment().startOf('month').format('YYYY-MM')}`);
    }

    $scope.goToLocation = function(location) {
      switch(location) {
        case 'main':
          isActive(0);
          $location.url(`/main=${moment().format('YYYY')}`);
          break;
        case 'all-banks':
          isActive(2);
          $location.url(`all-banks?page=1&pageSize=${params.rows.banksPageSize}`);
          break;
        case 'all-users':
          isActive(3);
          $location.url(`all-users?page=1&pageSize=${params.rows.usersPageSize}`);
          break;
        case 'all-expenses-type':
          isActive(4);
          $location.url(`all-expenses-type?page=1&pageSize=${params.rows.expensesTypePageSize}`);
          break;
        case 'all-transactions-type':
          isActive(5);
          $location.url(`all-transactions-type?page=1&pageSize=${params.rows.transactionsTypePageSize}`);
          break;
        case 'populate-database':
          isActive(6);
          $location.url(`populate-database`);
          break;
        case 'account':
          isActive(7);
          $location.url(`account`);
          break;
        case 'login':
          isActive(0);
          $location.url(`login`);
          break;
        case 'signup':
          isActive(1);
          $location.url(`signup`);
          break;
        case 'data-maintenance':
          isActive(8);
          $location.url(`/data-maintenance?calendar=${moment().startOf('month').format('YYYY-MM')}`);
          break;
        default:
          isActive(0);
          break;
      }
    }

    $scope.state = state;

    function isActive(index) {
      let li = angular.element(document).find('li');

      if (li.length > 0) {
        _.find(li, function(item, index){
          if (angular.element(item).hasClass('active')) {
            angular.element(item).removeClass('active');
          }
        });

        li[index].className += ' active';
      }
    }

    $scope.state = state;
  }]);
