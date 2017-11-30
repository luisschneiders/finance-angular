angular.module('MyApp', ['ngRoute', 'satellizer', 'angularMoment', 'angular-lodash'])
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
      .when('/main/:year', {
        templateUrl: 'partials/main/main.html',
        controller: 'MainCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/all-banks', {
        templateUrl: 'partials/bank/bank.html',
        controller: 'BankCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/bank/:id', {
        templateUrl: 'partials/bank/bank-edit.html',
        controller: 'BankEditCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/bank-new', {
        templateUrl: 'partials/bank/bank-edit.html',
        controller: 'BankNewCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/all-expenses-type', {
        templateUrl: 'partials/expense-type/expense-type.html',
        controller: 'ExpenseTypeCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/expense-type/:id', {
        templateUrl: 'partials/expense-type/expense-type-edit.html',
        controller: 'ExpenseTypeEditCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/expense-type-new', {
        templateUrl: 'partials/expense-type/expense-type-edit.html',
        controller: 'ExpenseTypeNewCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/all-transactions-type', {
        templateUrl: 'partials/transaction-type/transaction-type.html',
        controller: 'TransactionTypeCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/transaction-type/:id', {
        templateUrl: 'partials/transaction-type/transaction-type-edit.html',
        controller: 'TransactionTypeEditCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/transaction-type-new', {
        templateUrl: 'partials/transaction-type/transaction-type-edit.html',
        controller: 'TransactionTypeNewCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/all-users', {
        templateUrl: 'partials/people/people.html',
        controller: 'PeopleCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/user/:id', {
        templateUrl: 'partials/people/people-edit.html',
        controller: 'PeopleEditCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/user-new', {
        templateUrl: 'partials/people/people-edit.html',
        controller: 'PeopleNewCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/transactions/:year/:month', {
        templateUrl: 'partials/transaction/transaction.html',
        controller: 'TransactionCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/custom-search-transactions/:from/:to/:transactionType', {
        templateUrl: 'partials/transaction/transaction-custom.html',
        controller: 'TransactionCustomCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/transaction-new', {
        templateUrl: 'partials/transaction/transaction-edit.html',
        controller: 'TransactionNewCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/purchases/:year/:month', {
        templateUrl: 'partials/purchase/purchase.html',
        controller: 'PurchaseCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/custom-search-purchases/:from/:to/:expenseType', {
        templateUrl: 'partials/purchase/purchase-custom.html',
        controller: 'PurchaseCustomCtrl',
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
        $location.path('/main/:year');
      }
    }

    function loginRequired($location, $auth) {
      if (!$auth.isAuthenticated()) {
        $location.path('/login');
      }
    }
  })
  .run(function($rootScope, $window, DefaultServices) {
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
  });
