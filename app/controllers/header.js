angular.module('MyApp')
  .controller('HeaderCtrl', function($scope, $location, $window, $auth, DefaultServices) {
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
    
  });
