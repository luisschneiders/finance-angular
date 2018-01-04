// TODO - not working just yet
// angular.module('MyApp')
//   .controller('PaginationCtrl', ['$scope', '$auth', '$location', '$filter', function($scope, $auth, $location, $filter) {
//     $scope.currentPage = 0;
//     $scope.pageSize = 12;

//     if (!$auth.isAuthenticated()) {
//       $location.path('/login');
//       return;
//     };

//     $scope.getData = function() {
//       return $filter('filter')($scope.data);
//     };

//     $scope.numberOfPages = function() {
//       // console.log('$scope.getData()', $scope.getData());
//       console.log('$scope.pageSize', $scope.pageSize);
//       // console.log('Math.ceil($scope.getData().length / $scope.pageSize);', Math.ceil($scope.getData().length / $scope.pageSize));
//       return Math.ceil($scope.getData().length / $scope.pageSize);
//     };
//   }]);
