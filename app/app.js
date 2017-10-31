angular.module('MyApp', ['ngRoute', 'satellizer', 'angularMoment'])
  .config(function($routeProvider, $locationProvider, $authProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html'
      })
      .when('/contact', {
        templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/account', {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/forgot', {
        templateUrl: 'partials/forgot.html',
        controller: 'ForgotCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/reset/:token', {
        templateUrl: 'partials/reset.html',
        controller: 'ResetCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/main/:id', {
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/all-banks', {
        templateUrl: 'partials/bank.html',
        controller: 'BankCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/bank/:id', {
        templateUrl: 'partials/bank-edit.html',
        controller: 'BankEditCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/bank-new', {
        templateUrl: 'partials/bank-edit.html',
        controller: 'BankNewCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/all-expenses-type', {
        templateUrl: 'partials/expense-type.html',
        controller: 'ExpenseTypeCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/expense-type/:id', {
        templateUrl: 'partials/expense-type-edit.html',
        controller: 'ExpenseTypeEditCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/expense-type-new', {
        templateUrl: 'partials/expense-type-edit.html',
        controller: 'ExpenseTypeNewCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/all-transactions-type', {
        templateUrl: 'partials/transaction-type.html',
        controller: 'TransactionTypeCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/transaction-type/:id', {
        templateUrl: 'partials/transaction-type-edit.html',
        controller: 'TransactionTypeEditCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/transaction-type-new', {
        templateUrl: 'partials/transaction-type-edit.html',
        controller: 'TransactionTypeNewCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .otherwise({
        templateUrl: 'partials/404.html'
      });

    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';
    $authProvider.google({
      url: '/auth/google',
      clientId: 'xxx.apps.googleusercontent.com' // needs to be updated
    });

    function skipIfAuthenticated($location, $auth) {
      if ($auth.isAuthenticated()) {
        $location.path('/main/:id');
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
