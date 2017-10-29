angular.module('MyApp')
.factory('DefaultServices', ['$http', function($http) {
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
