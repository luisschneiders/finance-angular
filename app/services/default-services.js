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
