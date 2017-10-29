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
        $location.path('/main/:id');
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
  .controller('BankEditCtrl', ["$scope", "$auth", "$location", "BankServices", "DefaultServices", function($scope, $auth, $location, BankServices, DefaultServices) {
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
        title: 'bank',
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
  .controller('BankNewCtrl', ["$scope", "$auth", "$location", "$timeout", "BankServices", "DefaultServices", function($scope, $auth, $location, $timeout, BankServices, DefaultServices) {
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
  .controller('BankCtrl', ["$scope", "$auth", "$location", "BankServices", "DefaultServices", function($scope, $auth, $location, BankServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
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
      },
      isLoading: false
    };
    let banks = BankServices.getAllBanks();

    data.isLoading = true;

    DefaultServices.setTop(data.top);

    banks.then(function(response) {
      let top = {};
      if(!response) {
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
    let year = new Date().getFullYear();
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path(`/main/${year}`);
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
          $location.path(`/main/${year}`);
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
  .controller('MainCtrl', ["$scope", "$auth", "$location", "MainServices", "DefaultServices", function($scope, $auth, $location, MainServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      isNull: false,
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
    let transactionsData = [];
    let transactionsLabel = [];
    let transactionChart = document.getElementById("transactionChart");
    // let myChart = new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //         labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //         datasets: [{
    //             label: '# of Votes',
    //             data: [12, 19, 3, 5, 2, 3],
    //             backgroundColor: [
    //                 'rgba(255, 99, 132, 0.2)',
    //                 'rgba(54, 162, 235, 0.2)',
    //                 'rgba(255, 206, 86, 0.2)',
    //                 'rgba(75, 192, 192, 0.2)',
    //                 'rgba(153, 102, 255, 0.2)',
    //                 'rgba(255, 159, 64, 0.2)'
    //             ],
    //             borderColor: [
    //                 'rgba(255,99,132,1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(255, 159, 64, 1)'
    //             ],
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     beginAtZero:true
    //                 }
    //             }]
    //         }
    //     }
    // });

    DefaultServices.setTop(data.top);    

    getGraphicData();
    
    $scope.changePeriod = function(value) {
      data.year = parseInt(data.year);
      if(value == 'd') {
        data.year = data.year - 1;
        $location.path(`/main/${data.year}`);
        getGraphicData();
      } else {
        data.year = data.year + 1;
        $location.path(`/main/${data.year}`);
        getGraphicData();
      }
    };

    function getGraphicData() {
      let transactions = MainServices.getTransactionsByYear(data.year);
      transactions.then(function(response) {
        data.isNull = false;
        if(response.data.length == 0) {
          data.isNull = true;
        }
        transactionsData = response.data.map(function(value) {
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
          }
          return [value.TotalAmountByLabel];
        });

        transactionsLabel = response.data.map(function(value){
          switch(value.transactionLabel){
            case 'C':
              value.transactionLabel = 'INCOMES'
              break;
            case 'D':
              value.transactionLabel = 'OUTCOMES'
              break;
            case 'T':
              value.transactionLabel = 'TRANSFERS'
              break;
          }
          return [value.transactionLabel];
        });

        pieChartColoursBackground = response.data.map(function(value){
          switch(value.transactionLabel){
            case 'INCOMES':
              value.pieChartColoursBackground = 'rgba(54, 162, 235, 0.2)';
              break;
            case 'OUTCOMES':
              value.pieChartColoursBackground = 'rgba(255, 99, 132, 0.2)';
              break;
            case 'TRANSFERS':
              value.pieChartColoursBackground = 'rgba(75, 192, 192, 0.2)';
              break;
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
      }).catch(function(err) {
        console.warn('Error getting banks: ', err);
      });  
    }

    $scope.data = data;        
  }]);

angular.module('MyApp')
  .controller('MenuCtrl', ["$scope", "$location", "$window", "$auth", function($scope, $location, $window, $auth) {
    let defaultsApp = {
      logo: null,
      title: null,
      alt: null,
      width: 170,
      year: new Date().getFullYear()
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
.factory('BankServices', ["$http", function($http) {
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
      // return $http.get('/transactions-by-year');
    },
    getTransactionsByYear: function(year) {
      return $http.get(`/transactions-by-year/${year}`);      
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