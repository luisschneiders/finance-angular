angular.module('MyApp', ['ngRoute', 'satellizer', 'angularMoment', 'angular-lodash'])
  .config(function($routeProvider, $locationProvider, $authProvider) {
    $locationProvider.hashPrefix(''); // angularjs version 1.6.x
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'components/home/home.html'
      })
      .when('/contact', {
        templateUrl: 'components/contact/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/login', {
        templateUrl: 'components/login/login.html',
        controller: 'LoginCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/signup', {
        templateUrl: 'components/signup/signup.html',
        controller: 'SignupCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/account', {
        templateUrl: 'components/profile/profile.html',
        controller: 'ProfileCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/forgot', {
        templateUrl: 'components/forgot/forgot.html',
        controller: 'ForgotCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/reset/:token', {
        templateUrl: 'components/reset/reset.html',
        controller: 'ResetCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/main/:year', {
        templateUrl: 'components/main/main.html',
        controller: 'MainCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/all-banks/page=:page&pageSize=:pageSize', {
        templateUrl: 'components/bank/bank.html',
        controller: 'BankCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/bank=:id', {
        templateUrl: 'components/bank/bank-update.html',
        controller: 'BankUpdateCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/all-expenses-type/page=:page&pageSize=:pageSize', {
        templateUrl: 'components/expense-type/expense-type.html',
        controller: 'ExpenseTypeCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/expense-type=:id', {
        templateUrl: 'components/expense-type/expense-type-update.html',
        controller: 'ExpenseTypeUpdateCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/all-transactions-type/page=:page&pageSize=:pageSize', {
        templateUrl: 'components/transaction-type/transaction-type.html',
        controller: 'TransactionTypeCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/transaction-type=:id', {
        templateUrl: 'components/transaction-type/transaction-type-update.html',
        controller: 'TransactionTypeUpdateCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/all-users/page=:page&pageSize=:pageSize', {
        templateUrl: 'components/people/people.html',
        controller: 'PeopleCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/user=:id', {
        templateUrl: 'components/people/people-update.html',
        controller: 'PeopleUpdateCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/transactions=:year-:month', {
        templateUrl: 'components/transaction/transaction.html',
        controller: 'TransactionCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/custom-search-transactions=:from&:to&:transactionType', {
        templateUrl: 'components/transaction/transaction-custom.html',
        controller: 'TransactionCustomCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/transaction-new', {
        templateUrl: 'components/transaction/transaction-update.html',
        controller: 'TransactionUpdateCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/purchases/from=:from&to=:to&expenses=:id', {
        templateUrl: 'components/purchase/purchase.html',
        controller: 'PurchaseCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/purchase=new', {
        templateUrl: 'components/purchase/purchase-new.html',
        controller: 'PurchaseNewCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/populate-database', {
        templateUrl: 'components/settings/populate-database.html',
        controller: 'PopulateDatabaseCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .otherwise({
        templateUrl: 'components/404/404.html'
      });

    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';
    $authProvider.google({
      url: '/auth/google',
      clientId: 'xxx.apps.googleusercontent.com' // needs to be updated
    });

    function skipIfAuthenticated($location, $auth) {
      if ($auth.isAuthenticated()) {
        $location.path('/main/:year');
      }
    }

    function loginRequired($location, $auth) {
      if (!$auth.isAuthenticated()) {
        $location.path('/login');
      }
    }
  })
  .run(function($rootScope, $window) {
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
  });
