angular.module('MyApp')
.factory('BankServices', function($http) {
  return {
    getAllBanks: function(data) {
      let banks = $http.get('/banks', data)
        .then(function(response){
          return response.data;
        })
        .catch(function (error) {
          return error;
        });        
      return banks;
    }
  };
});