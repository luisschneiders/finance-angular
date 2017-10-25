angular.module('MyApp', ['ngRoute', 'satellizer'])
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
      .when('/main', {
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
      .otherwise({
        templateUrl: 'partials/404.html'
      });

    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';
    $authProvider.google({
      url: '/auth/google',
      clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com' // needs to be updated
    });

    function skipIfAuthenticated($location, $auth) {
      if ($auth.isAuthenticated()) {
        $location.path('/main');
      }
    }

    function loginRequired($location, $auth) {
      if (!$auth.isAuthenticated()) {
        $location.path('/login');
      }
    }
  }])
  .run(["$rootScope", "$window", function($rootScope, $window) {
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
  }]);

angular.module('MyApp')
  .controller('BankEditCtrl', ["$scope", "$location", "BankServices", "DefaultServices", function($scope, $location, BankServices, DefaultServices) {
    let data = {
      bank: null,
      url: '/all-banks',
      isSaving: false,
      isNull: false,
      notFound: 'Record Not Found!',
      class: {
        active: 'is-active',
        inactive: 'is-inactive'
      },
      top: {
        title: 'bank',
        url: '/bank-new',
        show: true
      }      
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
    $scope.data = data;
  }]);
angular.module('MyApp')
  .controller('BankNewCtrl', ["$scope", "$location", "BankServices", "DefaultServices", function($scope, $location, BankServices, DefaultServices) {
    let data = {
      bank: null,
      url: '/all-banks',
      title: 'banks',
      isSaving: false,
      isNull: false,
      top: {
        title: 'new bank',
        url: '/bank-new',
        show: true
      }      
    };
    // let id = $location.path().substr(6); // to remove /bank/
    // let banks = BankServices.getBankById(id);
    DefaultServices.setTop(data.top);

    $scope.data = data;

    // banks.then(function(response) {
    //   console.table(response);
    //   if (!response) {
    //     data.isNull = true;
    //     return;
    //   }
    //   data.isNull = false;
    //   data.bank = response;
    // }).catch(function(err) {
    //   console.warn('Error getting banks: ', err);
    // });
  }]);

angular.module('MyApp')
  .controller('BankCtrl', ["$scope", "$rootScope", "$location", "BankServices", "DefaultServices", function($scope, $rootScope, $location, BankServices, DefaultServices) {
    let data = {
      banks: [],
      notFound: 'Record Not Found!',
      isNull: false,      
      class: {
        active: 'is-active',
        inactive: 'is-inactive'
      },
      top: {
        title: 'banks',
        url: '/bank-new',
        show: true
      }
    };
    let banks = BankServices.getAllBanks();

    DefaultServices.setTop(data.top);

    banks.then(function(response) {
      let top = {};
      if(!response) {
        data.isNull = true;
        return;
      }
      data.banks = response;
      top = DefaultServices.getTop();
    }).catch(function(err) {
      console.warn('Error getting banks: ', err);
    });
    
    $scope.editBank = function(id) {
      $location.path(`/bank/${id}`);
    };

    $scope.data = data;
  }]);

angular.module('MyApp')
  .controller('ContactCtrl', ["$scope", "Contact", function($scope, Contact) {
    $scope.sendContactForm = function() {
      Contact.send($scope.contact)
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
  .controller('ForgotCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.forgotPassword = function() {
      Account.forgotPassword($scope.user)
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
  .controller('LoginCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/main');
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
          $location.path('/main');
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
  .controller('MainCtrl', ["$scope", "MainServices", function($scope, MainServices) {

  }]);
angular.module('MyApp')
  .controller('MenuCtrl', ["$scope", "$location", "$window", "$auth", function($scope, $location, $window, $auth) {
    let defaultsApp = {
      logo: null,
      title: null,
      alt: null,
      width: 170,
      copyRight: new Date().getFullYear()
    };

    defaultsApp.logo = '/img/schneiders-tech-software-development-release.svg';
    defaultsApp.title = 'Your personal finance app';
    defaultsApp.alt = defaultsApp.title;
 
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
    
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    
    $scope.logout = function() {
      console.log('here')
      $auth.logout();
      delete $window.localStorage.user;
      $location.path('/');
    };

    $scope.defaultsApp = defaultsApp;
    
  }]);

angular.module('MyApp')
  .controller('ProfileCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "Account", "DefaultServices", function($scope, $rootScope, $location, $window, $auth, Account, DefaultServices) {
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
      Account.updateProfile($scope.profile)
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
      Account.changePassword($scope.profile)
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
      Account.deleteAccount()
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
  .controller('ResetCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.resetPassword = function() {
      Account.resetPassword($scope.user)
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
  .controller('SignupCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
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
  .controller('TopCtrl', ["$scope", "$location", "DefaultServices", function($scope, $location, DefaultServices) {
    let data = {
      title: null,
      url: null,
      show: false
    };
    let top = DefaultServices.getTop();

    data.title = top.title;
    data.url = top.url;
    data.show = top.show;

    $scope.default = data;
  }]);

angular.module('MyApp')
  .factory('Account', ["$http", function($http) {
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
.factory('BankServices', ["$http", "$rootScope", function($http, $rootScope) {
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
    }
  };
}]);
angular.module('MyApp')
  .factory('Contact', ["$http", function($http) {
    return {
      send: function(data) {
        return $http.post('/contact', data);
      }
    };
  }]);
angular.module('MyApp')
.factory('DefaultServices', ["$http", function($http) {
  let top = {};
  return {
    setTop: function(data) {
      top.title = data.title;
      top.url = data.url;
      top.show = data.show;
    },
    getTop: function() {
      return top;
    }
  }
}]);
angular.module('MyApp')
.factory('MainServices', ["$http", function($http) {
  return {
    getDefaultsApp: function(data) {
      return $http.post('/', data);
    }
  };
}]);