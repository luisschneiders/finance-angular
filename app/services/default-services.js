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
      data = '01-' + data.toString();
      monthAndYear = data.split("-").reverse().join("-");
      monthAndYear = new Date(monthAndYear);
    },
    getMonthAndYear: function() {
      return monthAndYear;
    }
  }
}]);
