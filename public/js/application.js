angular.module('MyApp', ['ngRoute', 'satellizer', 'angularMoment', 'angular-lodash'])
  .config(["$routeProvider", "$locationProvider", "$authProvider", function($routeProvider, $locationProvider, $authProvider) {
    skipIfAuthenticated.$inject = ["$location", "$auth"];
    loginRequired.$inject = ["$location", "$auth"];
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
  }])
  .run(["$rootScope", "$window", "DefaultServices", function($rootScope, $window, DefaultServices) {
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
  }]);

angular.module('MyApp')
  .controller('ContactCtrl', ['$scope', 'ContactServices', function($scope, ContactServices) {
    $scope.sendContactForm = function() {
      ContactServices.send($scope.contact)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
  }]);

angular.module('MyApp')
  .controller('ForgotCtrl', ['$scope', 'AccountServices', function($scope, AccountServices) {
    $scope.forgotPassword = function() {
      AccountServices.forgotPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
  }]);

angular.module('MyApp')
  .controller('LoginCtrl', ['$scope', '$rootScope', '$location', '$window', '$auth', 'DefaultServices', function($scope, $rootScope, $location, $window, $auth, DefaultServices) {
    let data = {
      top: {
        title: null,
        url: null,
        show: false
      },
      year: new Date().getFullYear()
    };

    DefaultServices.setTop(data.top);

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path(`/main/${data.year}`);
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path(`/main/${data.year}`);
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('ProfileCtrl', ['$scope', '$rootScope', '$location', '$window', '$auth', 'AccountServices', 'DefaultServices', function($scope, $rootScope, $location, $window, $auth, AccountServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      top: {
        title: 'Profile Information',
        url: null,
        show: false
      }
    };
    DefaultServices.setTop(data.top);

    $scope.profile = $rootScope.currentUser;

    $scope.updateProfile = function() {
      AccountServices.updateProfile($scope.profile)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.changePassword = function() {
      AccountServices.changePassword($scope.profile)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $window.scrollTo(0, 0);
          $scope.messages = {
            error: [response.data]
          };
        });
    };

    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };

    $scope.deleteAccount = function() {
      AccountServices.deleteAccount()
        .then(function() {
          $auth.logout();
          delete $window.localStorage.user;
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };
  }]);
angular.module('MyApp')
  .controller('ResetCtrl', ['$scope', 'AccountServices', function($scope, AccountServices) {
    $scope.resetPassword = function() {
      AccountServices.resetPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    }
  }]);

angular.module('MyApp')
  .controller('SignupCtrl', ['$scope', '$rootScope', '$location', '$window', '$auth', function($scope, $rootScope, $location, $window, $auth) {
    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);

angular.module('MyApp')
  .controller('BankEditCtrl', ['$scope', '$auth', '$location', 'BankServices', 'DefaultServices', function($scope, $auth, $location, BankServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      bank: null,
      isSaving: false,
      isNull: false,
      notFound: {
        url: '/all-banks',
        title: 'banks',
        message:'Record Not Found!',
      },
      top: {
        title: 'update bank',
        url: '/bank-new',
        show: true
      },
      messages: {}
    };
    let id = $location.path().substr(6); // to remove /bank/
    let banks = BankServices.getBankById(id);

    DefaultServices.setTop(data.top);

    banks.then(function(response) {
      if (!response) {
        data.isNull = true;
        return;
      }
      data.isNull = false;
      data.bank = response;
    }).catch(function(err) {
      console.warn('Error getting banks: ', err);
    });

    $scope.updateBank = function($valid) {
      let bankUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      bankUpdated = BankServices.update(data.bank);
      bankUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
      }).catch(function(response) {
        console.warn('Error updating bank: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('BankNewCtrl', ['$scope', '$auth', '$location', '$timeout', 'BankServices', 'DefaultServices', function($scope, $auth, $location, $timeout, BankServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      bank: {
        bankDescription: null,
        bankAccount: null,
        bankInitialBalance: 0.00,
        bankCurrentBalance: 0.00,
        bankIsActive: 1
      },
      isSaving: false,
      isNull: false, // it's required for the bank-edit.html
      top: {
        title: 'new bank',
        url: '/bank-new',
        show: true
      }
    };

    DefaultServices.setTop(data.top);

    $scope.updateBank = function($valid) {
      let bankUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      bankUpdated = BankServices.add(data.bank);
      bankUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
        $timeout(function() {
          $location.path(`/bank/${response.data.bank.id}`);
        }, 1000);
      }).catch(function(response) {
        console.warn('Error updating bank: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('BankCtrl', ['$scope', '$auth', '$location', 'BankServices', 'DefaultServices', function($scope, $auth, $location, BankServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      banks: [],
      class: {
        active: 'is-active',
        inactive: 'is-inactive'
      },
      isNull: false,
      notFound: {
        url: '/all-banks',
        title: 'banks',
        message:'Record Not Found!',
      },
      top: {
        title: 'banks',
        url: '/bank-new',
        show: true
      },
      isLoading: false
    };
    let banks = BankServices.getAllBanks();

    data.isLoading = true;

    DefaultServices.setTop(data.top);

    banks.then(function(response) {
      let top = {};
      if(!response || response.length == 0) {
        data.isNull = true;
        data.isLoading = false;
        return;
      }
      data.banks = response;
      top = DefaultServices.getTop();
      data.isLoading = false;
    }).catch(function(err) {
      console.warn('Error getting banks: ', err);
    });
    
    $scope.editBank = function(id) {
      $location.path(`/bank/${id}`);
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('ExpenseTypeEditCtrl', ['$scope', '$auth', '$location', 'ExpenseTypeServices', 'DefaultServices', function($scope, $auth, $location, ExpenseTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      expenseType: null,
      isSaving: false,
      isNull: false,
      notFound: {
        url: '/all-expenses-type',
        title: 'expenses type',
        message:'Record Not Found!',
      },
      top: {
        title: 'update expense type',
        url: '/expense-type-new',
        show: true
      },
      messages: {}
    };
    let id = $location.path().substr(14); // to remove /expense-type/
    let expenseType = ExpenseTypeServices.getExpenseTypeById(id);

    DefaultServices.setTop(data.top);

    expenseType.then(function(response) {
      if (!response) {
        data.isNull = true;
        return;
      }
      data.isNull = false;
      data.expenseType = response;
    }).catch(function(err) {
      console.warn('Error getting Expense Type: ', err);
    });

    $scope.updateExpenseType = function($valid) {
      let expenseTypeUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      expenseTypeUpdated = ExpenseTypeServices.update(data.expenseType);
      expenseTypeUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
      }).catch(function(response) {
        console.warn('Error updating Expense Type: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('ExpenseTypeNewCtrl', ['$scope', '$auth', '$location', '$timeout', 'ExpenseTypeServices', 'DefaultServices', function($scope, $auth, $location, $timeout, ExpenseTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      expenseType: {
        expenseTypeDescription: null,
        expenseTypeIsActive: 1
      },
      isSaving: false,
      isNull: false, // it's required for the expense-type-edit.html
      top: {
        title: 'new expense type',
        url: '/expense-type-new',
        show: true
      }
    };

    DefaultServices.setTop(data.top);

    $scope.updateExpenseType = function($valid) {
      let expenseTypeUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      expenseTypeUpdated = ExpenseTypeServices.add(data.expenseType);
      expenseTypeUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
        $timeout(function() {
          $location.path(`/expense-type/${response.data.expenseType.id}`);
        }, 1000);
      }).catch(function(response) {
        console.warn('Error updating expense: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('ExpenseTypeCtrl', ['$scope', '$auth', '$location', 'ExpenseTypeServices', 'DefaultServices', function($scope, $auth, $location, ExpenseTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      expensesType: [],
      isNull: false,
      notFound: {
        url: '/all-expenses-type',
        title: 'Expenses',
        message:'Record Not Found!',
      },
      class: {
        active: 'is-active',
        inactive: 'is-inactive'
      },
      top: {
        title: 'Expense Type',
        url: '/expense-type-new',
        show: true
      },
      isLoading: true,
      isActive: 0
    };
    let expensesType = ExpenseTypeServices.getAllExpensesType(data.isActive);

    DefaultServices.setTop(data.top);

    expensesType.then(function(response) {
      let top = {};
      if(!response || response.length == 0) {
        data.isNull = true;
        data.isLoading = false;
        return;
      }
      data.expensesType = response;
      top = DefaultServices.getTop();
      data.isLoading = false;
    }).catch(function(err) {
      console.warn('Error getting Expenses Type: ', err);
    });
    
    $scope.editExpenseType = function(id) {
      $location.path(`/expense-type/${id}`);
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('FeedCtrl', ['$scope', '$location', 'FeedServices', function($scope, $location, FeedServices) {

  }]);

angular.module('MyApp')
  .controller('MainCtrl', ['$scope', '$auth', '$location', 'moment', 'MainServices', 'DefaultServices', function($scope, $auth, $location, moment, MainServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      transactionIsNull: false,
      purchaseIsNull: false,
      notFound: {
        url: null,
        title: null,
        message:'No data found for the period!',
      },      
      top: {
        title: 'Annual Graphics',
        url: null,
        show: false
      },
      isLoading: true,
      year: $location.path().substr(6) // to remove /main/
    };
    let pieChart;
    let pieChartColoursBackground = [];
    let barChart;
    let barChartColoursBackground = [];
    let barChartLabelsMonths = [];
    let transactionsData = [];
    let purchaseData = [];
    let transactionsLabel = [];
    let transactionChart = document.getElementById("transactionChart");
    let purchaseChart = document.getElementById("purchaseChart");

    DefaultServices.setTop(data.top);

    getGraphicData();

    $scope.changePeriod = function(value) {
      data.year = parseInt(data.year);
      if(value == 'd') {
        data.year = data.year - 1;
        $location.path(`/main/${data.year}`);
      } else {
        data.year = data.year + 1;
        $location.path(`/main/${data.year}`);
      }
    };

    function getGraphicData() {
      let transactions = MainServices.getTransactionsByYear(data.year);
      transactions.then(function(response) {
        data.transactionIsNull = false;
        data.purchaseIsNull = false;

        if(response.data[0].length == 0) {//transaction
          data.transactionIsNull = true;
        } else {
          renderTransactionGraphic(response.data[0]);
        }

        if(response.data[1].length == 0) {//purchase
          data.purchaseIsNull = true;
        } else {
          renderPurchaseGraphic(response.data[1]);
        }

        data.isLoading = false;
      }).catch(function(err) {
        console.warn('Error getting data: ', err);
      });
    }

    function renderTransactionGraphic(response) {
      transactionsData = response.map(function(value) {
        switch(value.transactionLabel){
          case 'C':
            value.TotalAmountByLabel;
            break;
          case 'D':
            value.TotalAmountByLabel;
            break;
          case 'T':
            value.TotalAmountByLabel = value.TotalAmountByLabel / 2;
            break;
          default:
            value.TotalAmountByLabel;
        }
        return [value.TotalAmountByLabel];
      });

      transactionsLabel = response.map(function(value){
        switch(value.transactionLabel){
          case 'C':
            value.transactionLabel = 'Incomes';
            break;
          case 'D':
            value.transactionLabel = 'Outcomes';
            break;
          case 'T':
            value.transactionLabel = 'Transfers';
            break;
          default:
            value.transactionLabel = 'Label';
        }
        return [value.transactionLabel];
      });

      pieChartColoursBackground = response.map(function(value){
        switch(value.transactionLabel){
          case 'Incomes':
            value.pieChartColoursBackground = 'rgba(54, 162, 235, 0.2)';
            break;
          case 'Outcomes':
            value.pieChartColoursBackground = 'rgba(255, 99, 132, 0.2)';
            break;
          case 'Transfers':
            value.pieChartColoursBackground = 'rgba(75, 192, 192, 0.2)';
            break;
          default:
            value.pieChartColoursBackground = 'rgba(75, 192, 192, 0.2)';

        }
        return [value.pieChartColoursBackground];
      });

      pieChart = new Chart(transactionChart, {
        type: 'pie',
        data: {
          labels: transactionsLabel,
          datasets: [{
            data: transactionsData,
            backgroundColor: pieChartColoursBackground,
            borderColor: '#383838',
            hoverBackgroundColor: 'rgba(77, 77, 51,0.2)',
            borderWidth: 1
          }]
        }
      });
      data.isLoading = false;
    }

    function renderPurchaseGraphic(response) {
      let barChartOptions = {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
      };

      barChartLabelsMonths = response.map(function(value){
        let date = moment(value.purchaseDate);
        let month = date.format('M');
        month = month.toString();
        switch(month){
          case '1':
            value.barChartLabelsMonths = 'Jan';
            break;
          case '2':
            value.barChartLabelsMonths = 'Feb';
            break;
          case '3':
            value.barChartLabelsMonths = 'Mar';
            break;
          case '4':
            value.barChartLabelsMonths = 'Apr';
            break;
          case '5':
            value.barChartLabelsMonths = 'May';
            break;
          case '6':
            value.barChartLabelsMonths = 'Jun';
            break;
          case '7':
            value.barChartLabelsMonths = 'Jul';
            break;
          case '8':
            value.barChartLabelsMonths = 'Aug';
            break;
          case '9':
            value.barChartLabelsMonths = 'Sep';
            break;
          case '10':
            value.barChartLabelsMonths = 'Oct';
            break;
          case '11':
            value.barChartLabelsMonths = 'Nov';
            break;
          case '12':
            value.barChartLabelsMonths = 'Dec';
            break;
          default:
            value.barChartLabelsMonths = 'Month';
        }
        return [value.barChartLabelsMonths];
      });

      barChartColoursBackground = response.map(function(value){
        let date = moment(value.purchaseDate);
        let month = date.format('M');
        month = month.toString();
        switch(month){
          case '1':
            value.barChartColoursBackground = 'rgba(255, 99, 132, 0.2)';
            break;
          case '2':
            value.barChartColoursBackground = 'rgba(54, 162, 235, 0.2)';
            break;
          case '3':
            value.barChartColoursBackground = 'rgba(255, 206, 86, 0.2)';
            break;
          case '4':
            value.barChartColoursBackground = 'rgba(75, 192, 192, 0.2)';
            break;
          case '5':
            value.barChartColoursBackground = 'rgba(153, 102, 255, 0.2)';
            break;
          case '6':
            value.barChartColoursBackground = 'rgba(255, 159, 64, 0.2)';
            break;
          case '7':
            value.barChartColoursBackground = 'rgba(255, 99, 132, 0.2)';
            break;
          case '8':
            value.barChartColoursBackground = 'rgba(54, 162, 235, 0.2)';
            break;
          case '9':
            value.barChartColoursBackground = 'rgba(255, 206, 86, 0.2)';
            break;
          case '10':
            value.barChartColoursBackground = 'rgba(75, 192, 192, 0.2)';
            break;
          case '11':
            value.barChartColoursBackground = 'rgba(153, 102, 255, 0.2)';
            break;
          case '12':
            value.barChartColoursBackground = 'rgba(255, 159, 64, 0.2)';
            break;
          default:
            value.barChartColoursBackground = 'rgba(255, 159, 64, 0.2)';
        }
        return [value.barChartColoursBackground];
      });

      purchaseData = response.map(function(value) {
        return [value.TotalAmountByMonth];
      });

      barChart = new Chart(purchaseChart, {
        type: 'bar',
        data: {
            labels: barChartLabelsMonths,
            datasets: [{
                label: 'Month',
                data: purchaseData,
                backgroundColor: barChartColoursBackground,
                borderColor: '#383838',
                hoverBackgroundColor: 'rgba(77, 77, 51,0.2)',
                borderWidth: 1
            }]
        },
        options: barChartOptions
    });
    }

    $scope.data = data;
  }]);

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

angular.module('MyApp')
  .controller('TopCtrl', ['$scope', '$location', 'DefaultServices', function($scope, $location, DefaultServices) {
    let data = DefaultServices.getTop();

    $scope.default = data;
  }]);

angular.module('MyApp')
  .controller('PeopleEditCtrl', ['$scope', '$auth', '$location', 'PeopleServices', 'DefaultServices', function($scope, $auth, $location, PeopleServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      people: null,
      isSaving: false,
      isNull: false,
      notFound: {
        url: '/all-users',
        title: 'all users',
        message:'Record Not Found!',
      },
      top: {
        title: 'update user',
        url: '/user-new',
        show: true
      },
      typeAction: [],
      messages: {}
    };
    let id = $location.path().substr(6); // to remove /user/
    let people = PeopleServices.getPeopleById(id);

    DefaultServices.setTop(data.top);
    data.typeAction = PeopleServices.getPeopleType();

    people.then(function(response) {
      if (!response) {
        data.isNull = true;
        return;
      }
      data.isNull = false;
      data.people = response;
    }).catch(function(err) {
      console.warn('Error getting user: ', err);
    });

    $scope.updatePeople = function($valid) {
      let peopleUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      peopleUpdated = PeopleServices.update(data.people);
      peopleUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
      }).catch(function(response) {
        console.warn('Error updating user: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);

'use strict';

angular.module('MyApp')
  .controller('PeopleNewCtrl', ['$scope', '$auth', '$location', '$timeout', 'PeopleServices', 'DefaultServices', function($scope, $auth, $location, $timeout, PeopleServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      people: {
        peopleDescription: null,
        peopleRates: null,
        peopleType: null,
        peopleIsActive: 1
      },
      isSaving: false,
      isNull: false, // it's required for the transaction-type-edit.html
      top: {
        title: 'new user',
        url: '/user-new',
        show: true
      },
      typeAction: []
    };

    DefaultServices.setTop(data.top);
    data.typeAction = PeopleServices.getPeopleType();

    $scope.updatePeople = function($valid) {
      let peopleUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      peopleUpdated = PeopleServices.add(data.people);
      peopleUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
        $timeout(function() {
          $location.path(`/user/${response.data.people.id}`);
        }, 1000);
      }).catch(function(response) {
        console.warn('Error updating user: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('PeopleCtrl', ['$scope', '$auth', '$location', 'PeopleServices', 'DefaultServices', function($scope, $auth, $location, PeopleServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      people: [],
      isNull: false,
      notFound: {
        url: '/all-users',
        title: 'all users',
        message:'Record Not Found!',
      },
      class: {
        active: 'is-active',
        inactive: 'is-inactive'
      },
      top: {
        title: 'all users',
        url: '/user-new',
        show: true
      },
      isLoading: false
    };
    let people = PeopleServices.getAllPeople();

    data.isLoading = true;

    DefaultServices.setTop(data.top);

    people.then(function(response) {
      let top = {};
      if(!response || response.length == 0) {
        data.isNull = true;
        data.isLoading = false;
        return;
      }
      data.people = response;
      top = DefaultServices.getTop();
      data.isLoading = false;
    }).catch(function(err) {
      console.warn('Error getting users: ', err);
    });

    $scope.editPeople = function(id) {
      $location.path(`/user/${id}`);
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('PurchaseCustomCtrl', ['$scope', '$auth', '$location', '$timeout', 'moment', 'ExpenseTypeServices', 'PurchaseServices', 'DefaultServices',
  function($scope, $auth, $location, $timeout, moment, ExpenseTypeServices, PurchaseServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      modal: {
        title: null,
        purchases: null,
      },
      purchases: [],
      expensesType: [],
      template: {
        url: null,
        class: null
      },
      purchasesByGroup: {},
      isNull: false,
      isActive: 0,
      isLoading: true,
      notFound: {
        url: null,
        title: null,
        message:'No data found for the period!',
      },
      top: {
        title: 'purchase custom search',
        url: 'purchase-new',
        show: true
      },
      customSearch: {}
    };
    let customSearch = $location.path().substr(25); // to remove /custom-search-purchases/
    let expensesType = ExpenseTypeServices.getAllExpensesType(data.isActive);
    let customPurchase = null;
    let refineSearch = customSearch.split('/');
    let search = {
      from: refineSearch[0],
      to: refineSearch[1],
      expenseType: refineSearch[2]
    };
    
    data.customSearch.active = 1;
    DefaultServices.setTop(data.top);
//  check if date are valid
    if (!moment(refineSearch[0]).isValid() || !moment(refineSearch[1]).isValid()) {
      data.isLoading = false;
      data.isNull = true;
      data.notFound.message = 'Dates are not valid';
      $scope.data = data;
      return;
    }

    customPurchase = PurchaseServices.getPurchasesByCustomSearch(search);

    expensesType.then(function(response) {
      data.expensesType = response;
    }).catch(function(err) {
      console.warn('Error getting expenses type: ', err);
    });

    customPurchase.then(function(response){
      data.isNull = false;

      if (Object.keys(response.groupedBy).length === 0) {
        data.isNull = true;
      }

      data.purchases = response.data;
      data.purchasesByGroup = response.groupedBy;
      data.isLoading = false;
    }).catch(function(err) {
      console.warn('Error getting purchases: ', err);
    });

    $scope.deletePurchase = function(id) {
      console.log('Ill be in the services', id);
    };

    $scope.seeDetails = function(key, title) {
      data.template.url = 'partials/modal/purchase.tpl.html';
      data.template.class = 'modal-dialog modal-lg';
      data.modal.title = title.expenseTypeDescription;
      data.modal.purchases = _.filter(data.purchases, function(item) {
        if (item.purchaseExpenseId == key) {
          return item;
        }
      });
    }

    $scope.customSearch = function(key) {
      data.template.url = 'partials/modal/custom-search-purchase.tpl.html';
      data.template.class = 'modal-dialog';
      data.modal.title = 'Custom Search';
    };

    $scope.customSearchForm = function($valid) {
      if(!$valid) {
        return;
      }
      if(data.customSearch.checked) {
        data.customSearch.expenseType = 'all'
      }
      $(".modal").modal("hide");
      $timeout(function() {
        $location.path(`/custom-search-purchases/${data.customSearch.from}/${data.customSearch.to}/${data.customSearch.expenseType.toString()}`);
      }, 500);      
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('PurchaseCtrl', ['$scope', '$auth', '$location', '$timeout', 'moment', 'ExpenseTypeServices', 'PurchaseServices', 'DefaultServices',
  function($scope, $auth, $location, $timeout, moment, ExpenseTypeServices, PurchaseServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      modal: {
        title: null,
        transactions: null,
      },
      purchases: [],
      expensesType: [],
      template: {
        url: null,
        class: null
      },
      purchasesByGroup: {},
      typeAction: [],
      isNull: false,
      isLoading: true,
      isActive: 0,
      notFound: {
        url: null,
        title: null,
        message:'No data found for the period!',
      },
      top: {
        title: 'Purchases',
        url: 'purchase-new',
        show: true
      },
      monthAndYear: null,
      currentPeriod: $location.path().substr(11), // to remove /purchases/
      period: {
        month: null,
        year: null
      },
      customSearch: {}
    };
    let expensesType = ExpenseTypeServices.getAllExpensesType(data.isActive);
    data.customSearch.active = 1;

    expensesType.then(function(response) {
      data.expensesType = response;
    }).catch(function(err) {
      console.warn('Error getting expenses type: ', err);
    });

    DefaultServices.setTop(data.top);

    getCurrentPeriodPurchases();

    $scope.changePeriod = function(value) {
      data.monthAndYear = DefaultServices.getMonthAndYear();

      if (value == 'd') {
        data.monthAndYear = moment(data.monthAndYear).subtract(1, 'months').format();
      } else {
        data.monthAndYear = moment(data.monthAndYear).add(1, 'months').format();
      }

      data.period.year = moment(data.monthAndYear).format('YYYY');
      data.period.month = moment(data.monthAndYear).format('MM');
      $location.path(`/purchases/${data.period.year}/${data.period.month}`);
    };

    function getCurrentPeriodPurchases() {
      let purchases = null;
      DefaultServices.setMonthAndYear(data.currentPeriod);

      data.monthAndYear = DefaultServices.getMonthAndYear();
      data.period.year = moment(data.monthAndYear).format('YYYY');
      data.period.month = moment(data.monthAndYear).format('MM');

      purchases = PurchaseServices.getPurchasesByYearAndMonth(data.period);
      purchases.then(function(response) {
        data.isNull = false;

        if (Object.keys(response.groupedBy).length === 0) {
          data.isNull = true;
        }

        data.purchases = response.data;
        data.purchasesByGroup = response.groupedBy;
        data.isLoading = false;
      }).catch(function(err) {
        console.warn('Error getting data: ', err);
      });
    };

    $scope.deletePurchase = function(id) {
      console.log('Ill be in the services', id);
    };

    $scope.seeDetails = function(key, title) {
      data.template.url = 'partials/modal/purchase.tpl.html';
      data.template.class = 'modal-dialog modal-lg';
      data.modal.title = title.expenseTypeDescription;
      data.modal.purchases = _.filter(data.purchases, function(item) {
        if (item.purchaseExpenseId == key) {
          return item;
        }
      });
    }

    $scope.customSearch = function() {
      data.template.url = 'partials/modal/custom-search-purchase.tpl.html';
      data.template.class = 'modal-dialog';
      data.modal.title = 'Custom Search';
    };

    $scope.customSearchForm = function($valid) {
      if(!$valid) {
        return;
      }
      if(data.customSearch.checked) {
        data.customSearch.expenseType = 'all'
      }
      $(".modal").modal("hide");
      $timeout(function() {
        $location.path(`/custom-search-purchases/${data.customSearch.from}/${data.customSearch.to}/${data.customSearch.expenseType.toString()}`);
      }, 500);
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('TransactionCustomCtrl', ['$scope', '$auth', '$location', '$timeout', 'moment', 'TransactionServices', 'TransactionTypeServices', 'DefaultServices',
  function($scope, $auth, $location, $timeout, moment, TransactionServices, TransactionTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      modal: {
        title: null,
        transactions: null,
      },
      transactions: [],
      transactionsType: [],
      template: {
        url: null,
        class: null
      },
      transactionsByGroup: {},
      isNull: false,
      isActive: 0,
      isLoading: true,
      notFound: {
        url: null,
        title: null,
        message:'No data found for the period!',
      },
      top: {
        title: 'transactions custom search',
        url: 'transaction-new',
        show: true
      },
      customSearch: {}
    };
    let customSearch = $location.path().substr(28); // to remove /custom-search-transactions/
    let transactionsType = TransactionTypeServices.getAllTransactionsType(data.isActive);
    let customTransaction = null;
    let refineSearch = customSearch.split('/');
    let search = {
      from: refineSearch[0],
      to: refineSearch[1],
      transactionType: refineSearch[2]
    };

    data.customSearch.active = 1;
    DefaultServices.setTop(data.top);
//  check if date are valid
    if (!moment(refineSearch[0]).isValid() || !moment(refineSearch[1]).isValid()) {
      data.isLoading = false;
      data.isNull = true;
      data.notFound.message = 'Dates are not valid';
      $scope.data = data;
      return;
    }

    customTransaction = TransactionServices.getTransactionsByCustomSearch(search);

    transactionsType.then(function(response) {
      data.transactionsType = response;
    }).catch(function(err) {
      console.warn('Error getting transactions type: ', err);
    });

    customTransaction.then(function(response){
      data.isNull = false;

      if (Object.keys(response.groupedBy).length === 0) {
        data.isNull = true;
      }

      data.transactions = response.data;
      data.transactionsByGroup = response.groupedBy;
      data.isLoading = false;
    }).catch(function(err) {
      console.warn('Error getting transactions type: ', err);
    });

    $scope.deleteTransaction = function(id) {
      console.log('Ill be in the services', id);
    };

    $scope.seeDetails = function(key, title) {
      data.template.url = 'partials/modal/transaction.tpl.html';
      data.template.class = 'modal-dialog modal-lg';
      data.modal.title = title.transactionTypeDescription;
      data.modal.transactions = _.filter(data.transactions, function(item) {
        if (item.transactionType == key) {
          return item;
        }
      });
    }

    $scope.customSearch = function(key) {
      data.template.url = 'partials/modal/custom-search-transaction.tpl.html';
      data.template.class = 'modal-dialog';
      data.modal.title = 'Custom Search';
    };

    $scope.customSearchForm = function($valid) {
      if(!$valid) {
        return;
      }
      if(data.customSearch.checked) {
        data.customSearch.transactionType.push(0); // 0 = purchases        
      }
      $(".modal").modal("hide");
      $timeout(function() {
        $location.path(`/custom-search-transactions/${data.customSearch.from}/${data.customSearch.to}/${data.customSearch.transactionType.toString()}`);
      }, 500);      
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('TransactionNewCtrl', ['$scope', '$auth', '$location', '$timeout', 'TransactionTypeServices', 'DefaultServices', function($scope, $auth, $location, $timeout, TransactionTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      isSaving: false,
      isNull: false, // it's required for the transaction-type-edit.html
      isActive: 1,
      top: {
        title: 'new transaction',
        url: '/transaction-new',
        show: true
      },
      transactionType: null
    };
    let transactionType = null;

    DefaultServices.setTop(data.top);

    transactionType = TransactionTypeServices.getAllTransactionsType(data.isActive);
    transactionType.then(function(response){
      data.transactionType = response;
    }).catch(function(response) {
      console.warn('Error getting transaction type: ', response);
      data.messages = {
        error: Array.isArray(response.data) ? response.data : [response.data]
      };
    });

    $scope.updateTransactionType = function($valid) {
      let transactionTypeUpdated = transactionTypeUpdated || null;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      transactionTypeUpdated = TransactionTypeServices.add(data.transactionType);
      transactionTypeUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
        $timeout(function() {
          $location.path(`/transaction-type/${response.data.transactionType.id}`);
        }, 1000);
      }).catch(function(response) {
        console.warn('Error updating transaction type: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('TransactionCtrl', ['$scope', '$auth', '$location', '$timeout', 'moment', 'TransactionServices', 'TransactionTypeServices', 'DefaultServices',
  function($scope, $auth, $location, $timeout, moment, TransactionServices, TransactionTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      modal: {
        title: null,
        transactions: null,
      },
      transactions: [],
      transactionsType: [],
      template: {
        url: null,
        class: null
      },
      transactionsByGroup: {},
      typeAction: [],
      isNull: false,
      isActive: 0,
      isLoading: true,
      notFound: {
        url: null,
        title: null,
        message:'No data found for the period!',
      },
      top: {
        title: 'Transactions',
        url: 'transaction-new',
        show: true
      },
      monthAndYear: null,
      currentPeriod: $location.path().substr(14), // to remove /transactions/
      period: {
        month: null,
        year: null
      },
      customSearch: {}
    };
    let transactionsType = TransactionTypeServices.getAllTransactionsType(data.isActive);
    data.customSearch.active = 1;

    transactionsType.then(function(response) {
      data.transactionsType = response;
    }).catch(function(err) {
      console.warn('Error getting transactions type: ', err);
    });

    DefaultServices.setTop(data.top);

    getCurrentPeriodTransactions();

    $scope.changePeriod = function(value) {
      data.monthAndYear = DefaultServices.getMonthAndYear();

      if (value == 'd') {
        data.monthAndYear = moment(data.monthAndYear).subtract(1, 'months').format();
      } else {
        data.monthAndYear = moment(data.monthAndYear).add(1, 'months').format();
      }

      data.period.year = moment(data.monthAndYear).format('YYYY');
      data.period.month = moment(data.monthAndYear).format('MM');
      $location.path(`/transactions/${data.period.year}/${data.period.month}`);
    };

    $scope.deleteTransaction = function(id) {
      console.log('Ill be in the services', id);
    };

    $scope.seeDetails = function(key, title) {
      data.template.url = 'partials/modal/transaction.tpl.html';
      data.template.class = 'modal-dialog modal-lg';
      data.modal.title = title.transactionTypeDescription;
      data.modal.transactions = _.filter(data.transactions, function(item) {
        if (item.transactionType == key) {
          return item;
        }
      });
    }

    $scope.customSearch = function() {
      data.template.url = 'partials/modal/custom-search-transaction.tpl.html';
      data.template.class = 'modal-dialog';
      data.modal.title = 'Custom Search';
    };

    $scope.customSearchForm = function($valid) {
      if(!$valid) {
        return;
      }
      if(data.customSearch.checked) {
        data.customSearch.transactionType.push(0); // 0 = purchases        
      }
      $(".modal").modal("hide");
      $timeout(function() {
        $location.path(`/custom-search-transactions/${data.customSearch.from}/${data.customSearch.to}/${data.customSearch.transactionType.toString()}`);
      }, 500);
    };

    function getCurrentPeriodTransactions() {
      let transactions = null;
      DefaultServices.setMonthAndYear(data.currentPeriod);

      data.monthAndYear = DefaultServices.getMonthAndYear();
      data.period.year = moment(data.monthAndYear).format('YYYY');
      data.period.month = moment(data.monthAndYear).format('MM');

      transactions = TransactionServices.getTransactionsByYearAndMonth(data.period);
      transactions.then(function(response) {
        data.isNull = false;

        if (Object.keys(response.groupedBy).length === 0) {
          data.isNull = true;
        }

        data.transactions = response.data;
        data.transactionsByGroup = response.groupedBy;
        data.isLoading = false;
      }).catch(function(err) {
        console.warn('Error getting data: ', err);
      });
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('TransactionTypeEditCtrl', ['$scope', '$auth', '$location', 'TransactionTypeServices', 'DefaultServices', function($scope, $auth, $location, TransactionTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      transactionType: null,
      isSaving: false,
      isNull: false,
      notFound: {
        url: '/all-transactions-type',
        title: 'transactions type',
        message:'Record Not Found!',
      },
      top: {
        title: 'update transaction type',
        url: '/transaction-type-new',
        show: true
      },
      typeAction: [],
      messages: {}
    };
    let id = $location.path().substr(18); // to remove /transaction-type/
    let transactionType = TransactionTypeServices.getTransactionTypeById(id);

    DefaultServices.setTop(data.top);
    data.typeAction = TransactionTypeServices.getTransactionTypeAction();

    transactionType.then(function(response) {
      if (!response) {
        data.isNull = true;
        return;
      }
      data.isNull = false;
      data.transactionType = response;
    }).catch(function(err) {
      console.warn('Error getting Transaction Type: ', err);
    });

    $scope.updateTransactionType = function($valid) {
      let transactionTypeUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      transactionTypeUpdated = TransactionTypeServices.update(data.transactionType);
      transactionTypeUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
      }).catch(function(response) {
        console.warn('Error updating Transaction Type: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('TransactionTypeNewCtrl', ['$scope', '$auth', '$location', '$timeout', 'TransactionTypeServices', 'DefaultServices', function($scope, $auth, $location, $timeout, TransactionTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      transactionType: {
        transactionTypeDescription: null,
        transactionTypeAction: null,
        transactionTypeIsActive: 1
      },
      isSaving: false,
      isNull: false, // it's required for the transaction-type-edit.html
      top: {
        title: 'new transaction type',
        url: '/transaction-type-new',
        show: true
      },
      typeAction: []
    };

    DefaultServices.setTop(data.top);
    data.typeAction = TransactionTypeServices.getTransactionTypeAction();

    $scope.updateTransactionType = function($valid) {
      let transactionTypeUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      transactionTypeUpdated = TransactionTypeServices.add(data.transactionType);
      transactionTypeUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
        $timeout(function() {
          $location.path(`/transaction-type/${response.data.transactionType.id}`);
        }, 1000);
      }).catch(function(response) {
        console.warn('Error updating transaction type: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('TransactionTypeCtrl', ['$scope', '$auth', '$location', 'TransactionTypeServices', 'DefaultServices', function($scope, $auth, $location, TransactionTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      transactionsType: [],
      isNull: false,
      notFound: {
        url: '/all-transactions-type',
        title: 'transactions',
        message:'Record Not Found!',
      },
      class: {
        active: 'is-active',
        inactive: 'is-inactive'
      },
      top: {
        title: 'transaction type',
        url: '/transaction-type-new',
        show: true
      },
      isLoading: false,
      typeAction: [],
      isActive: 0
    };
    let transactionsType = TransactionTypeServices.getAllTransactionsType(data.isActive);

    data.isLoading = true;

    DefaultServices.setTop(data.top);
    data.typeAction = TransactionTypeServices.getTransactionTypeAction();

    transactionsType.then(function(response) {
      let top = {};
      if(!response || response.length == 0) {
        data.isNull = true;
        data.isLoading = false;
        return;
      }
      data.transactionsType = response;
      top = DefaultServices.getTop();
      data.isLoading = false;
    }).catch(function(err) {
      console.warn('Error getting transactions type: ', err);
    });

    $scope.editTransactionType = function(id) {
      $location.path(`/transaction-type/${id}`);
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .factory('AccountServices', ['$http', function($http) {
    return {
      updateProfile: function(data) {
        return $http.put('/account', data);
      },
      changePassword: function(data) {
        return $http.put('/account', data);
      },
      deleteAccount: function() {
        return $http.delete('/account');
      },
      forgotPassword: function(data) {
        return $http.post('/forgot', data);
      },
      resetPassword: function(data) {
        return $http.post('/reset', data);
      }
    };
  }]);

angular.module('MyApp')
.factory('BankServices', ['$http', function($http) {
  return {
    getAllBanks: function() {
      let banks = $http.get('/banks')
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return banks;
    },
    getBankById: function(id) {
      let bank = $http.get(`/banks/${id}`)
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return bank;
    },
    update: function(data) {
      return $http.put(`/banks/${data.id}`, data);
    },
    add: function(data) {
      return $http.post(`/banks/new`, data);
    }
  };
}]);

angular.module('MyApp')
  .factory('ContactServices', ['$http', function($http) {
    return {
      send: function(data) {
        return $http.post('/contact', data);
      }
    };
  }]);

angular.module('MyApp')
.factory('DefaultServices', ['$http', 'moment', function($http, moment) {
  let top = {};
  let monthAndYear = null;
  return {
    setTop: function(data) {
      top.title = data.title;
      top.url = data.url;
      top.show = data.show;
    },
    getTop: function() {
      return top;
    },
    setMonthAndYear: function(data) {
      let date = null;
      date = data.toString().split('/').join('-');
      date = date + '-01';
      monthAndYear = new Date(date);
    },
    getMonthAndYear: function() {
      return monthAndYear;
    }
  }
}]);

angular.module('MyApp')
.factory('ExpenseTypeServices', ['$http', function($http) {
  return {
    getAllExpensesType: function(isActive) {
      let expensesType = $http.get(`/all-expenses-type/${isActive}`)
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return expensesType;
    },
    getExpenseTypeById: function(id) {
      let expenseType = $http.get(`/expenses-type/${id}`)
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return expenseType;
    },
    update: function(data) {
      return $http.put(`/expenses-type/${data.id}`, data);
    },
    add: function(data) {
      return $http.post(`/expenses-type/new`, data);
    }
  };
}]);

angular.module('MyApp')
.factory('FeedServices', ['$http', function($http) {
  return {
    // code yet to come!!!
  };
}]);

angular.module('MyApp')
.factory('MainServices', ['$http', function($http) {
  return {
    getDefaultsApp: function(data) {

    },
    getTransactionsByYear: function(year) {
      return $http.get(`/main-by-year/${year}`);
    }
  };
}]);

angular.module('MyApp')
.factory('PeopleServices', ['$http', function($http) {
  return {
    getPeopleType: function() {
      return actions = [
        {
          value: null,
          description: 'Please select one...',
          selected: true
        },
        {
          value: 1,
          description: 'Employer',
          selected: false
        },
        {
          value: 2,
          description: 'Contractor',
          selected: false
        },
        {
          value: 3,
          description: 'Subcontractor',
          selected: false
        }
      ]
    },
    getAllPeople: function() {
      let actions = this.getPeopleType();
      let people = $http.get('/people')
          .then(function(response){
            _.forEach(response.data, function(data) {
              _.find(actions, function(action){
                if (data.peopleType == action.value) {
                  data.peopleTypeDescription = action.description;
                }
              });
            });
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return people;
    },
    getPeopleById: function(id) {
      let people = $http.get(`/people/${id}`)
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return people;
    },
    update: function(data) {
      return $http.put(`/people/${data.id}`, data);
    },
    add: function(data) {
      return $http.post(`/people/new`, data);
    }
  };
}]);

angular.module('MyApp')
.factory('PurchaseServices', ['$http', function($http) {
  return {
    getPurchasesByYearAndMonth: function(period) {
      let data = $http.get(`/purchases-by-year-and-month/${period.year}/${period.month}`)
          .then(function(response) {
            let groupedBy = {};

            groupedBy = _.groupBy(response.data, function(type) {
              return this.type = type.purchaseExpenseId;
            });

            groupedBy = _.forEach(groupedBy, function(group) {
              group.TotalAmountByExpenseType = _.sum(group, function(amount) {
                return amount.purchaseAmount;
              });
              group.expenseTypeDescription = group[0].expenseTypeDescription;
            });

            groupedBy = _.forEach(groupedBy, function(items){
              let removed = _.remove(items, function(arr) {
                return delete this.arr;
              })
              return removed;
            });

            return {groupedBy: groupedBy, data: response.data};
          })
          .catch(function(err) {
            return err;
          });
      return data;
    },
    getPurchasesByCustomSearch: function(customSearch) {
      let data = $http.get(`/purchases-by-custom-search/${customSearch.from}&${customSearch.to}&${customSearch.expenseType}`)
          .then(function(response) {
            let groupedBy = {};

            groupedBy = _.groupBy(response.data, function(type) {
              return this.type = type.purchaseExpenseId;
            });

            groupedBy = _.forEach(groupedBy, function(group) {
              group.TotalAmountByExpenseType = _.sum(group, function(amount) {
                return amount.purchaseAmount;
              });
              group.expenseTypeDescription = group[0].expenseTypeDescription;
            });

            groupedBy = _.forEach(groupedBy, function(items){
              let removed = _.remove(items, function(arr) {
                return delete this.arr;
              })
              return removed;
            });

            return {groupedBy: groupedBy, data: response.data};
          })
          .catch(function(err) {
            return err;
          });
      return data;
    }    
  };
}]);

angular.module('MyApp')
.factory('TransactionServices', ['$http', function($http) {
  return {
    getTransactionsByYearAndMonth: function(period) {
      let data = $http.get(`/transactions-by-year-and-month/${period.year}/${period.month}`)
          .then(function(response) {
            let groupedBy = {};

            groupedBy = _.groupBy(response.data, function(type) {
              return this.type = type.transactionType;
            });

            groupedBy = _.forEach(groupedBy, function(group) {
              group.TotalAmountByTransactionType = _.sum(group, function(amount) {
                return amount.transactionAmount;
              });
              group.transactionTypeDescription = group[0].transactionTypeDescription;
            });

            groupedBy = _.forEach(groupedBy, function(items){
              let removed = _.remove(items, function(arr) {
                return delete this.arr;
              })
              return removed;
            });

            return {groupedBy: groupedBy, data: response.data};
          })
          .catch(function(err) {
            return err;
          });
      return data;
    },
    getTransactionsByCustomSearch: function(customSearch) {
      let data = $http.get(`/transactions-by-custom-search/${customSearch.from}&${customSearch.to}&${customSearch.transactionType}`)
          .then(function(response) {
            let groupedBy = {};

            groupedBy = _.groupBy(response.data, function(type) {
              return this.type = type.transactionType;
            });

            groupedBy = _.forEach(groupedBy, function(group) {
              group.TotalAmountByTransactionType = _.sum(group, function(amount) {
                return amount.transactionAmount;
              });
              group.transactionTypeDescription = group[0].transactionTypeDescription;
            });

            groupedBy = _.forEach(groupedBy, function(items){
              let removed = _.remove(items, function(arr) {
                return delete this.arr;
              })
              return removed;
            });

            return {groupedBy: groupedBy, data: response.data};
          })
          .catch(function(err) {
            return err;
          });
      return data;
    }
  };
}]);

angular.module('MyApp')
.factory('TransactionTypeServices', ['$http', function($http) {
  return {
    getTransactionTypeAction: function() {
      return actions = [
        {
          value: null,
          description: 'Please select one...',
          selected: true
        },
        {
          value: 'C',
          description: 'Credit',
          selected: false
        },
        {
          value: 'D',
          description: 'Debit',
          selected: false
        },
        {
          value: 'T',
          description: 'Transfer',
          selected: false
        }
      ]
    },
    getAllTransactionsType: function(isActive) {
      let actions = this.getTransactionTypeAction();
      let transactionsType = $http.get(`/all-transactions-type/${isActive}`)
          .then(function(response){
            _.forEach(response.data, function(data) {
              _.find(actions, function(action){
                if (data.transactionTypeAction == action.value) {
                  data.transactionTypeActionDescription = action.description;
                }
              });
            });
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return transactionsType;
    },
    getTransactionTypeById: function(id) {
      let transactionType = $http.get(`/transactions-type/${id}`)
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return transactionType;
    },
    update: function(data) {
      return $http.put(`/transactions-type/${data.id}`, data);
    },
    add: function(data) {
      return $http.post(`/transactions-type/new`, data);
    }
  };
}]);

angular.module('MyApp')
  .directive('format', ["$filter", function ($filter) {
    return {
      require: '?ngModel',
      link: function (scope, elem, attrs, ctrl) {
        if (!ctrl) return;
        ctrl.$formatters.unshift(function (a) {
          return $filter(attrs.format)(ctrl.$modelValue)
        });
        ctrl.$parsers.unshift(function (viewValue) {

          elem.priceFormat({
            prefix: '',
            centsSeparator: '.',
            thousandsSeparator: ''
          });

          return elem[0].value;
        });
      }
    };
  }]);
  (function($){$.fn.priceFormat=function(options){var defaults={prefix:'US$ ',suffix:'',centsSeparator:'.',thousandsSeparator:',',limit:false,centsLimit:2,clearPrefix:false,clearSufix:false,allowNegative:false,insertPlusSign:false};var options=$.extend(defaults,options);return this.each(function(){var obj=$(this);var is_number=/[0-9]/;var prefix=options.prefix;var suffix=options.suffix;var centsSeparator=options.centsSeparator;var thousandsSeparator=options.thousandsSeparator;var limit=options.limit;var centsLimit=options.centsLimit;var clearPrefix=options.clearPrefix;var clearSuffix=options.clearSuffix;var allowNegative=options.allowNegative;var insertPlusSign=options.insertPlusSign;if(insertPlusSign)allowNegative=true;function to_numbers(str){var formatted='';for(var i=0;i<(str.length);i++){char_=str.charAt(i);if(formatted.length==0&&char_==0)char_=false;if(char_&&char_.match(is_number)){if(limit){if(formatted.length<limit)formatted=formatted+char_}else{formatted=formatted+char_}}}return formatted}function fill_with_zeroes(str){while(str.length<(centsLimit+1))str='0'+str;return str}function price_format(str){var formatted=fill_with_zeroes(to_numbers(str));var thousandsFormatted='';var thousandsCount=0;if(centsLimit==0){centsSeparator="";centsVal=""}var centsVal=formatted.substr(formatted.length-centsLimit,centsLimit);var integerVal=formatted.substr(0,formatted.length-centsLimit);formatted=(centsLimit==0)?integerVal:integerVal+centsSeparator+centsVal;if(thousandsSeparator||$.trim(thousandsSeparator)!=""){for(var j=integerVal.length;j>0;j--){char_=integerVal.substr(j-1,1);thousandsCount++;if(thousandsCount%3==0)char_=thousandsSeparator+char_;thousandsFormatted=char_+thousandsFormatted}if(thousandsFormatted.substr(0,1)==thousandsSeparator)thousandsFormatted=thousandsFormatted.substring(1,thousandsFormatted.length);formatted=(centsLimit==0)?thousandsFormatted:thousandsFormatted+centsSeparator+centsVal}if(allowNegative&&(integerVal!=0||centsVal!=0)){if(str.indexOf('-')!=-1&&str.indexOf('+')<str.indexOf('-')){formatted='-'+formatted}else{if(!insertPlusSign)formatted=''+formatted;else formatted='+'+formatted}}if(prefix)formatted=prefix+formatted;if(suffix)formatted=formatted+suffix;return formatted}function key_check(e){var code=(e.keyCode?e.keyCode:e.which);var typed=String.fromCharCode(code);var functional=false;var str=obj.val();var newValue=price_format(str+typed);if((code>=48&&code<=57)||(code>=96&&code<=105))functional=true;if(code==8)functional=true;if(code==9)functional=true;if(code==13)functional=true;if(code==46)functional=true;if(code==37)functional=true;if(code==39)functional=true;if(allowNegative&&(code==189||code==109))functional=true;if(insertPlusSign&&(code==187||code==107))functional=true;if(!functional){e.preventDefault();e.stopPropagation();if(str!=newValue)obj.val(newValue)}}function price_it(){var str=obj.val();var price=price_format(str);if(str!=price)obj.val(price)}function add_prefix(){var val=obj.val();obj.val(prefix+val)}function add_suffix(){var val=obj.val();obj.val(val+suffix)}function clear_prefix(){if($.trim(prefix)!=''&&clearPrefix){var array=obj.val().split(prefix);obj.val(array[1])}}function clear_suffix(){if($.trim(suffix)!=''&&clearSuffix){var array=obj.val().split(suffix);obj.val(array[0])}}$(this).bind('keydown.price_format',key_check);$(this).bind('keyup.price_format',price_it);$(this).bind('focusout.price_format',price_it);if(clearPrefix){$(this).bind('focusout.price_format',function(){clear_prefix()});$(this).bind('focusin.price_format',function(){add_prefix()})}if(clearSuffix){$(this).bind('focusout.price_format',function(){clear_suffix()});$(this).bind('focusin.price_format',function(){add_suffix()})}if($(this).val().length>0){price_it();clear_prefix();clear_suffix()}})};$.fn.unpriceFormat=function(){return $(this).unbind(".price_format")};$.fn.unmask=function(){var field=$(this).val();var result="";for(var f in field){if(!isNaN(field[f])||field[f]=="-")result+=field[f]}return result}})(jQuery);
angular.module('MyApp')
  .directive('calendar', function() {
    return {
      require: 'ngModel',
      link: function (scope, el, attr, ngModel) {
        $(el).datepicker({
          dateFormat: 'yy-mm-dd',
          changeMonth: true,
          changeYear: true,
          onSelect: function (dateText) {
            scope.$apply(function () {
              ngModel.$setViewValue(dateText);
            });
          }
        });
      }
    };
  });

angular.module('MyApp')
  .filter('sumColumns', function() {
    return function(collection) {
      let total = 0;

      _.forEach(collection, function(item) {
        return total += item.TotalAmountByExpenseType;
      });

      return total;
    };
  });
