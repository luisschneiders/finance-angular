angular.module('MyApp')
.factory('BankServices', ['$http', '$q', function($http, $q) {
  return {
    getAllBanks: function(params) {
      let banks = $http.get(`/get-all-banks/page=${params.page}&pageSize=${params.pageSize}`) // TODO: use {cache: true}
          .then(function(response){
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      return banks;
    },
    getActiveBanks: function() {
      let banks = $http.get(`/get-active-banks`)
          .then(function(response){
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      return banks;
    },
    getBankById: function(id) {
      let bank = $http.get(`/bank-id=${id}`)
          .then(function(response){
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      return bank;
    },
    save: function(newRecord, data) {
      let bank = {};
      if(newRecord) {
        bank = $http.post(`/bank-new`, data)
          .then(function(response) {
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      } else {
        bank = $http.put(`/bank-id=${data.id}`, data)
          .then(function(response) {
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      }
      return bank;
    }
  };
}]);
