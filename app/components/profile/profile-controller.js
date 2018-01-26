angular.module('MyApp')
  .controller('ProfileCtrl', ['$scope', '$rootScope', '$location', '$window', '$auth', 'AccountServices', 'DefaultServices', function($scope, $rootScope, $location, $window, $auth, AccountServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    class State {
      constructor(settings, status, messages) {
        this.settings = settings;
        this.status = status;
        this.messages = messages;
      }
    };
    class Settings {
      constructor(defaults, component, templateTop) {
        this.defaults = defaults;
        this.component = component;
        this.templateTop = templateTop;
      }
    };
    class Status {
      constructor(noSettings) {
        this.noSettings = noSettings;
      }
    };

    let settings = new Settings();
    let status = new Status(true);
    let state = new State(settings, status, null);

    DefaultServices.getSettings()
      .then(function(response) {
        status.noSettings = false;
        settings.defaults = response.defaults;
        settings.component = response.profile;
        settings.templateTop = response.profile.defaults.template.top;
        state.settings = settings;
      }).catch(function(error) {
        status.noSettings = true;
        state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });

    $scope.profile = $rootScope.currentUser;
    $scope.updateProfile = function() {
      AccountServices.updateProfile($scope.profile)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          state.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          state.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.changePassword = function() {
      AccountServices.changePassword($scope.profile)
        .then(function(response) {
          state.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          state.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function(response) {
          state.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $window.scrollTo(0, 0);
          state.messages = {
            error: [response.data]
          };
        });
    };

    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          state.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          state.messages = {
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
          state.messages = {
            error: [response.data]
          };
        });
    };

    $scope.state = state;
  }]);